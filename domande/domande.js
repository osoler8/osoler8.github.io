const SUPABASE_URL = 'https://wbngqwpwkbkokcjefyon.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2GArEBXYf4ompZsqebhE-g_FMQ7mq1e';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AVATARS = [
  '🦊', '🐼', '🦁', '🐸', '🦄', '🚀', '🐙', '🐯', '🦉', '🐢', '🦖', '🐝',
  '🐧', '🐨', '🦋', '🐬', '🦩', '🦔', '🐶', '🐱', '🐵', '🐺', '🐲', '🌟'
];

const SHAPE_SVGS = [
  '<svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L22 20H2L12 3Z"/></svg>',
  '<svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L22 12L12 22L2 12L12 2Z"/></svg>',
  '<svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"/></svg>',
  '<svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>'
];

let selectedAvatar = '🦊';
let currentPlayer = null;
let currentSession = null;
let sessionQuestions = [];
let sessionKind = 'quiz';
let editorKind = 'quiz';
let editingQuizId = null;
let hostTimerInterval = null;
let activeAnsChannel = null;
let studentRoomChannel = null;
let questionStartTimeMs = 0;
let studentScore = 0;
let studentStreak = 0;
let studentBestStreak = 0;
let studentCorrectCount = 0;
let studentWrongCount = 0;
let studentPuzzleOrder = [];
let currentReportData = null;
let cachedTeacherQuizzes = [];
let selectedTagFilter = 'all';
let hostPlayersList = [];

let audioCtx = null;
let musicInterval = null;
let isMusicPlaying = false;
let musicMode = 'lobby';
let musicStep = 0;

function formatRankOrdinal(rank) {
  if (rank === 1) return '1r/a';
  if (rank === 2) return '2n/a';
  if (rank === 3) return '3r/a';
  if (rank === 4) return '4t/a';
  return `${rank}è/ena`;
}

function normalizeText(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function evaluateShortAnswer(userText, question) {
  const userNorm = normalizeText(userText);
  if (!userNorm) return false;
  const opts = question.options || [];
  return opts.some(o => {
    if (!o.is_correct) return false;
    const mode = o.match_mode || 'exact';
    const rawList = (o.text || '').split(',').map(s => normalizeText(s)).filter(Boolean);
    if (mode === 'contains') {
      return rawList.some(target => userNorm.includes(target));
    }
    return rawList.includes(userNorm);
  });
}

function initAvatars() {
  const container = document.getElementById('avatar-selector');
  container.innerHTML = '';
  AVATARS.forEach((emoji, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = emoji;
    btn.className = idx === 0
      ? 'avatar-btn w-11 h-11 shrink-0 rounded-xl bg-indigo-600 text-white shadow-md flex items-center justify-center text-2xl transition'
      : 'avatar-btn w-11 h-11 shrink-0 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl transition';
    btn.onclick = () => selectAvatar(btn, emoji);
    container.appendChild(btn);
  });
}

function selectAvatar(btn, emoji) {
  selectedAvatar = emoji;
  document.getElementById('selected-avatar-preview').textContent = emoji;
  document.querySelectorAll('.avatar-btn').forEach(b => {
    b.className = 'avatar-btn w-11 h-11 shrink-0 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl transition';
  });
  btn.className = 'avatar-btn w-11 h-11 shrink-0 rounded-xl bg-indigo-600 text-white shadow-md flex items-center justify-center text-2xl transition';
}

function openQrModal() {
  const src = document.getElementById('host-qr-img').src;
  const pin = document.getElementById('host-pin-display').textContent;
  document.getElementById('modal-qr-img').src = src.replace('200x200', '400x400');
  document.getElementById('modal-qr-pin').textContent = pin;
  document.getElementById('qr-modal').classList.remove('hidden');
}

function closeQrModal() {
  document.getElementById('qr-modal').classList.add('hidden');
}

function playSynthNote(freq, duration, type = 'triangle', gainVal = 0.08) {
  if (!audioCtx || !isMusicPlaying) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function toggleGameMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  isMusicPlaying = !isMusicPlaying;
  const iconEl = document.getElementById('music-icon');
  const labelEl = document.getElementById('music-label');

  if (isMusicPlaying) {
    iconEl.textContent = '🔊';
    labelEl.textContent = 'Silenciar música';
    startMusicLoop();
  } else {
    iconEl.textContent = '🔇';
    labelEl.textContent = 'Activar música';
    clearInterval(musicInterval);
  }
}

function startMusicLoop() {
  clearInterval(musicInterval);
  if (!isMusicPlaying) return;

  const lobbyNotes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 392.00];
  const actionNotes = [220.00, 220.00, 261.63, 293.66, 329.63, 293.66, 261.63, 392.00];
  const speed = musicMode === 'action' ? 240 : 360;

  musicInterval = setInterval(() => {
    if (!isMusicPlaying) return;
    const seq = musicMode === 'action' ? actionNotes : lobbyNotes;
    const note = seq[musicStep % seq.length];
    playSynthNote(note, 0.22, musicMode === 'action' ? 'sawtooth' : 'triangle', musicMode === 'action' ? 0.045 : 0.07);
    if (musicStep % 2 === 0) {
      playSynthNote(note / 2, 0.28, 'sine', 0.09);
    }
    musicStep++;
  }, speed);
}

function setMusicMode(mode) {
  musicMode = mode;
  if (isMusicPlaying) {
    if (mode === 'podium') {
      clearInterval(musicInterval);
      const fanfare = [523.25, 659.25, 783.99, 1046.50];
      fanfare.forEach((f, idx) => {
        setTimeout(() => playSynthNote(f, 0.45, 'triangle', 0.1), idx * 140);
      });
    } else {
      startMusicLoop();
    }
  }
}

function stopMusicCompletely() {
  isMusicPlaying = false;
  clearInterval(musicInterval);
  const iconEl = document.getElementById('music-icon');
  const labelEl = document.getElementById('music-label');
  if (iconEl) iconEl.textContent = '🔇';
  if (labelEl) labelEl.textContent = 'Activar música';
}

function showView(viewId) {
  if (viewId !== 'view-teacher-host') {
    stopMusicCompletely();
  }
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  document.getElementById(viewId).classList.remove('hidden');
}

function resetToPinScreen() {
  if (studentRoomChannel) {
    sb.removeChannel(studentRoomChannel);
    studentRoomChannel = null;
  }
  currentPlayer = null;
  currentSession = null;
  sessionQuestions = [];
  studentScore = 0;
  studentStreak = 0;
  studentBestStreak = 0;
  studentCorrectCount = 0;
  studentWrongCount = 0;
  document.getElementById('input-pin').value = '';
  document.getElementById('join-error').classList.add('hidden');
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, '', window.location.pathname);
  }
  showView('view-join');
}

async function handleLogoClick() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    loadTeacherDashboard(session.user);
  } else {
    resetToPinScreen();
  }
}

async function joinGame() {
  const pin = document.getElementById('input-pin').value.trim();
  const nickname = document.getElementById('input-nickname').value.trim();
  const errEl = document.getElementById('join-error');
  errEl.classList.add('hidden');

  if (!pin || !nickname) {
    errEl.textContent = "Introdueix el codi pin i el teu nom.";
    errEl.classList.remove('hidden');
    return;
  }

  const { data: session, error } = await sb
    .from('game_sessions')
    .select('*')
    .eq('pin', pin)
    .eq('status', 'waiting')
    .single();

  if (error || !session) {
    errEl.textContent = "Codi incorrecte o la sessió ja ha començat.";
    errEl.classList.remove('hidden');
    return;
  }

  const { data: player, error: pError } = await sb
    .from('players')
    .insert({ session_id: session.id, nickname, avatar: selectedAvatar, score: 0 })
    .select()
    .single();

  if (pError) {
    if (pError.code === '23505') {
      errEl.textContent = "Aquest nom ja el fa servir un/a altre/a company/a.";
    } else {
      errEl.textContent = `No s'ha pogut entrar a la sala: ${pError.message}`;
    }
    errEl.classList.remove('hidden');
    return;
  }

  const { data: qs } = await sb
    .from('questions')
    .select('*')
    .eq('quiz_id', session.quiz_id)
    .order('order_index', { ascending: true });

  currentSession = session;
  sessionQuestions = qs || [];
  const interactiveQs = sessionQuestions.filter(q => q.type !== 'slide');
  const isPollActivity = interactiveQs.length > 0 && interactiveQs.every(q => ['poll', 'nps_scale'].includes(q.type) || q.points_multiplier === 0);
  sessionKind = isPollActivity ? 'poll' : 'quiz';
  currentPlayer = player;
  studentScore = 0;
  studentStreak = 0;
  studentBestStreak = 0;
  studentCorrectCount = 0;
  studentWrongCount = 0;

  document.getElementById('student-badge').textContent = selectedAvatar;
  document.getElementById('student-display-name').textContent = nickname;
  showView('view-student-lobby');

  if (studentRoomChannel) {
    sb.removeChannel(studentRoomChannel);
  }

  studentRoomChannel = sb.channel('room-' + session.id + '-' + player.id)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${session.id}` }, payload => {
      handleSessionStateChange(payload.new);
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'players', filter: `id=eq.${player.id}` }, () => {
      alert("Has estat desconnectat/da de la sala pel/per la mestre/a.");
      resetToPinScreen();
    })
    .subscribe();
}

async function updateStudentLivePosition() {
  if (!currentSession || !currentPlayer || sessionKind === 'poll') return;
  const { data: allPlayers } = await sb
    .from('players')
    .select('id, score')
    .eq('session_id', currentSession.id)
    .order('score', { ascending: false });

  const list = allPlayers || [];
  const idx = list.findIndex(p => p.id === currentPlayer.id);
  const rank = idx >= 0 ? idx + 1 : list.length;
  const rankText = `${formatRankOrdinal(rank)} de ${list.length}`;

  const pill = document.getElementById('student-rank-pill');
  if (pill) pill.textContent = `Posició: ${formatRankOrdinal(rank)}`;

  const fbPos = document.getElementById('feedback-live-pos');
  if (fbPos && !fbPos.dataset.hideForOpinion) {
    fbPos.textContent = `Vas en la posició ${rankText}`;
    fbPos.classList.remove('hidden');
  }
}

async function handleSessionStateChange(session) {
  currentSession = session;
  if (session.status === 'question_active') {
    await renderStudentQuestion(session.current_question_index);
  } else if (session.status === 'question_results') {
    const q = sessionQuestions[session.current_question_index];
    if (q && q.type === 'slide') return;
    const isOpinion = sessionKind === 'poll' || (q && ['word_cloud', 'poll', 'nps_scale'].includes(q.type));
    const isFeedbackAlreadyVisible = !document.getElementById('student-feedback').classList.contains('hidden');
    if (!isFeedbackAlreadyVisible) {
      if (!isOpinion && q) {
        studentWrongCount++;
        studentStreak = 0;
      }
      hideAllStudentInputs();
      document.getElementById('student-feedback').classList.remove('hidden');
      document.getElementById('feedback-icon').textContent = '⏱️';
      document.getElementById('feedback-title').textContent = "Temps esgotat!";
      document.getElementById('feedback-points').classList.add('hidden');
      document.getElementById('feedback-streak-badge').classList.add('hidden');
      const fbPos = document.getElementById('feedback-live-pos');
      fbPos.dataset.hideForOpinion = isOpinion ? '1' : '';
      if (isOpinion) fbPos.classList.add('hidden');
    }
    if (!isOpinion) {
      await updateStudentLivePosition();
    }
    document.getElementById('feedback-sub').textContent = "Mira la pissarra per veure els resultats.";
  } else if (session.status === 'finished') {
    if (sessionKind === 'poll') {
      showStudentPollFinished();
    } else {
      await showStudentFinalRank();
    }
  }
}

function hideAllStudentInputs() {
  document.getElementById('student-options-grid').classList.add('hidden');
  document.getElementById('student-text-input-box').classList.add('hidden');
  document.getElementById('student-puzzle-box').classList.add('hidden');
  document.getElementById('student-nps-box').classList.add('hidden');
  document.getElementById('student-slide-box').classList.add('hidden');
}

function showStudentPollFinished() {
  document.getElementById('student-end-banner').textContent = 'Enquesta finalitzada';
  document.getElementById('student-end-banner').className = 'inline-block px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-extrabold';
  document.getElementById('student-final-medal').textContent = '🙌';
  document.getElementById('student-final-rank').textContent = 'Participació registrada';
  document.getElementById('student-final-name').textContent = `${currentPlayer.avatar} ${currentPlayer.nickname}`;
  document.getElementById('student-final-score').classList.add('hidden');
  document.getElementById('student-chart-and-stats').classList.add('hidden');
  document.getElementById('student-final-leaderboard-box').classList.add('hidden');
  document.getElementById('student-final-msg').textContent = "Moltes gràcies per la teva participació! Les teves respostes ajuden a millorar l'aula.";
  showView('view-student-podium');
}

async function showStudentFinalRank() {
  const { data: allPlayers } = await sb
    .from('players')
    .select('*')
    .eq('session_id', currentSession.id)
    .order('score', { ascending: false });

  const list = allPlayers || [];
  const myIndex = list.findIndex(p => p.id === currentPlayer.id);
  const rank = myIndex >= 0 ? myIndex + 1 : list.length;

  const medals = ['🥇', '🥈', '🥉'];
  document.getElementById('student-end-banner').textContent = 'Qüestionari finalitzat';
  document.getElementById('student-end-banner').className = 'inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-extrabold';
  document.getElementById('student-final-medal').textContent = medals[rank - 1] || '🏆';
  document.getElementById('student-final-rank').textContent = `Posició ${formatRankOrdinal(rank)} de ${list.length}`;
  document.getElementById('student-final-name').textContent = `${currentPlayer.avatar} ${currentPlayer.nickname}`;
  document.getElementById('student-final-score').classList.remove('hidden');
  document.getElementById('student-final-score').textContent = `${studentScore} punts`;

  document.getElementById('student-chart-and-stats').classList.remove('hidden');
  document.getElementById('student-stat-correct').textContent = studentCorrectCount;
  document.getElementById('student-stat-wrong').textContent = studentWrongCount;
  document.getElementById('student-stat-streak').textContent = studentBestStreak;

  const totalAnswered = studentCorrectCount + studentWrongCount;
  const accuracyPct = totalAnswered > 0 ? Math.round((studentCorrectCount / totalAnswered) * 100) : 0;
  document.getElementById('student-accuracy-pct').textContent = `${accuracyPct}%`;
  const donut = document.getElementById('student-donut-chart');
  if (totalAnswered === 0) {
    donut.style.background = '#e2e8f0';
  } else {
    donut.style.background = `conic-gradient(#10b981 0% ${accuracyPct}%, #f43f5e ${accuracyPct}% 100%)`;
  }

  if (rank === 1) {
    document.getElementById('student-final-msg').textContent = "Enhorabona! Has acabat el qüestionari en primera posició.";
  } else if (rank <= 3) {
    document.getElementById('student-final-msg').textContent = "Molt bona feina! Has aconseguit pujar al podi de la classe.";
  } else {
    document.getElementById('student-final-msg').textContent = "Qüestionari completat! Revisa els teus encerts i continua practicant.";
  }

  const rankBox = document.getElementById('student-final-leaderboard-box');
  const rankList = document.getElementById('student-final-ranking-list');
  rankBox.classList.remove('hidden');
  rankList.innerHTML = '';

  list.forEach((p, idx) => {
    const isMe = p.id === currentPlayer.id;
    const posBadge = idx < 3 ? medals[idx] : `${idx + 1}.`;
    rankList.innerHTML += `
      <div class="flex justify-between items-center px-3.5 py-2.5 rounded-xl border ${isMe ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-white border-slate-100'}">
        <div class="flex items-center gap-2 text-sm font-extrabold ${isMe ? 'text-indigo-900' : 'text-slate-800'}">
          <span class="w-6 text-center">${posBadge}</span>
          <span>${p.avatar}</span>
          <span>${p.nickname} ${isMe ? '(tu)' : ''}</span>
        </div>
        <span class="font-black text-indigo-600 text-sm">${p.score} pts</span>
      </div>
    `;
  });

  showView('view-student-podium');
}

async function renderStudentQuestion(qIndex) {
  const q = sessionQuestions[qIndex];
  if (!q) return;

  questionStartTimeMs = Date.now();
  showView('view-student-play');
  document.getElementById('student-feedback').classList.add('hidden');
  hideAllStudentInputs();
  document.getElementById('student-q-counter').textContent = `Pregunta ${qIndex + 1} de ${sessionQuestions.length}`;
  
  const scorePill = document.getElementById('student-score-pill');
  const rankPill = document.getElementById('student-rank-pill');
  const streakPill = document.getElementById('student-streak-pill');
  const typeBadge = document.getElementById('student-type-badge');
  const cloudHint = document.getElementById('student-cloud-hint');

  if (q.type === 'word_cloud') {
    typeBadge.classList.remove('hidden');
    cloudHint.classList.remove('hidden');
  } else {
    typeBadge.classList.add('hidden');
    cloudHint.classList.add('hidden');
  }

  if (sessionKind === 'poll') {
    scorePill.textContent = 'Enquesta';
    scorePill.className = 'px-3.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-extrabold';
    rankPill.classList.add('hidden');
    streakPill.classList.add('hidden');
  } else {
    scorePill.textContent = `${studentScore} punts`;
    scorePill.className = 'px-3.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-extrabold';
    rankPill.classList.remove('hidden');
    if (studentStreak >= 2) {
      streakPill.textContent = `🔥 Ratxa x${studentStreak}`;
      streakPill.classList.remove('hidden');
    } else {
      streakPill.classList.add('hidden');
    }
    await updateStudentLivePosition();
  }

  document.getElementById('student-q-text').textContent = q.question_text;

  if (q.type === 'slide') {
    document.getElementById('student-slide-box').classList.remove('hidden');
  } else if (q.type === 'quiz' || q.type === 'true_false' || q.type === 'poll') {
    const grid = document.getElementById('student-options-grid');
    grid.innerHTML = '';
    grid.classList.remove('hidden');
    const colors = ['btn-red', 'btn-blue', 'btn-yellow', 'btn-green'];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = `btn-opt ${colors[idx % 4]} text-white rounded-3xl p-5 sm:p-6 text-lg sm:text-xl md:text-2xl font-extrabold flex items-center gap-4 text-left transition`;
      btn.innerHTML = `<div class="w-11 h-11 rounded-2xl bg-black/15 flex items-center justify-center shrink-0">${SHAPE_SVGS[idx % 4]}</div> <span>${opt.text}</span>`;
      btn.onclick = () => submitOptionAnswer(q, idx);
      grid.appendChild(btn);
    });
  } else if (q.type === 'puzzle') {
    document.getElementById('student-puzzle-box').classList.remove('hidden');
    studentPuzzleOrder = [...q.options.map((o, idx) => ({ text: o.text, origIdx: idx }))];
    for (let i = studentPuzzleOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [studentPuzzleOrder[i], studentPuzzleOrder[j]] = [studentPuzzleOrder[j], studentPuzzleOrder[i]];
    }
    renderStudentPuzzleItems();
  } else if (q.type === 'nps_scale') {
    const npsBox = document.getElementById('student-nps-box');
    const npsGrid = document.getElementById('student-nps-grid');
    npsBox.classList.remove('hidden');
    npsGrid.innerHTML = '';
    for (let val = 0; val <= 10; val++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = val;
      btn.className = 'py-3.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white font-extrabold text-base text-slate-800 border border-slate-200 transition';
      btn.onclick = () => submitNpsAnswer(q, val);
      npsGrid.appendChild(btn);
    }
  } else {
    document.getElementById('student-text-input-box').classList.remove('hidden');
    const inp = document.getElementById('student-text-answer');
    inp.value = '';
    inp.placeholder = q.type === 'word_cloud' ? 'Escriu una paraula...' : 'Escriu aquí la teva resposta...';
  }
}

function renderStudentPuzzleItems() {
  const listEl = document.getElementById('student-puzzle-list');
  listEl.innerHTML = '';
  const colors = ['border-rose-300 bg-rose-50', 'border-blue-300 bg-blue-50', 'border-amber-300 bg-amber-50', 'border-emerald-300 bg-emerald-50'];
  studentPuzzleOrder.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = `flex items-center justify-between gap-2 p-3.5 rounded-2xl border-2 ${colors[item.origIdx % 4]} font-extrabold text-slate-900`;
    row.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="w-7 h-7 rounded-lg bg-white text-slate-700 text-xs flex items-center justify-center font-black shadow-sm">${idx + 1}</span>
        <span>${item.text}</span>
      </div>
      <div class="flex gap-1.5">
        <button type="button" onclick="movePuzzleItem(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="w-9 h-9 rounded-xl bg-white border border-slate-200 font-black text-slate-700 disabled:opacity-30">↑</button>
        <button type="button" onclick="movePuzzleItem(${idx}, 1)" ${idx === studentPuzzleOrder.length - 1 ? 'disabled' : ''} class="w-9 h-9 rounded-xl bg-white border border-slate-200 font-black text-slate-700 disabled:opacity-30">↓</button>
      </div>
    `;
    listEl.appendChild(row);
  });
}

function movePuzzleItem(idx, dir) {
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= studentPuzzleOrder.length) return;
  [studentPuzzleOrder[idx], studentPuzzleOrder[targetIdx]] = [studentPuzzleOrder[targetIdx], studentPuzzleOrder[idx]];
  renderStudentPuzzleItems();
}

function registerStudentOutcome(isCorrect) {
  if (isCorrect) {
    studentCorrectCount++;
    studentStreak++;
    if (studentStreak > studentBestStreak) studentBestStreak = studentStreak;
  } else {
    studentWrongCount++;
    studentStreak = 0;
  }
}

async function submitPuzzleAnswer() {
  const q = sessionQuestions[currentSession.current_question_index];
  const isCorrect = studentPuzzleOrder.every((item, idx) => item.origIdx === idx);
  const userSequenceText = studentPuzzleOrder.map(i => i.text).join(' → ');

  registerStudentOutcome(isCorrect);
  const points = calculateGamifiedPoints(q, isCorrect);
  studentScore += points;

  await sb.from('answers').insert({
    session_id: currentSession.id,
    question_id: q.id,
    player_id: currentPlayer.id,
    answer_value: { text: userSequenceText },
    is_correct: isCorrect,
    points_awarded: points
  });

  await sb.from('players').update({ score: studentScore }).eq('id', currentPlayer.id);
  document.getElementById('student-score-pill').textContent = `${studentScore} punts`;
  await updateStudentLivePosition();
  showStudentWaitingFeedback(isCorrect, points, false);
}

async function submitNpsAnswer(question, val) {
  await sb.from('answers').insert({
    session_id: currentSession.id,
    question_id: question.id,
    player_id: currentPlayer.id,
    answer_value: { index: val, text: `${val} / 10` },
    is_correct: false,
    points_awarded: 0
  });

  showStudentWaitingFeedback(false, 0, true);
}

function calculateGamifiedPoints(question, isCorrect) {
  if (sessionKind === 'poll' || !isCorrect || question.points_multiplier === 0) return 0;
  const elapsedSec = Math.max(0, (Date.now() - questionStartTimeMs) / 1000);
  const ratio = Math.max(0.4, 1 - (elapsedSec / (question.time_limit * 1.5)));
  const streakBonus = studentStreak * 100;
  return Math.round((1000 * ratio + streakBonus) * question.points_multiplier);
}

async function submitOptionAnswer(question, optionIndex) {
  const isPoll = sessionKind === 'poll' || question.type === 'poll';
  const isCorrect = isPoll ? false : (question.options[optionIndex]?.is_correct || false);
  
  if (!isPoll) {
    registerStudentOutcome(isCorrect);
  }

  const points = calculateGamifiedPoints(question, isCorrect);
  studentScore += points;

  await sb.from('answers').insert({
    session_id: currentSession.id,
    question_id: question.id,
    player_id: currentPlayer.id,
    answer_value: { index: optionIndex, text: question.options[optionIndex]?.text || '' },
    is_correct: isCorrect,
    points_awarded: points
  });

  if (!isPoll) {
    await sb.from('players').update({ score: studentScore }).eq('id', currentPlayer.id);
    document.getElementById('student-score-pill').textContent = `${studentScore} punts`;
    await updateStudentLivePosition();
  }

  showStudentWaitingFeedback(isCorrect, points, isPoll);
}

async function submitTextAnswer() {
  const val = document.getElementById('student-text-answer').value.trim();
  if (!val) return;
  const q = sessionQuestions[currentSession.current_question_index];
  const isOpinion = sessionKind === 'poll' || q.type === 'word_cloud';
  
  let isCorrect = false;
  if (!isOpinion && q.type === 'type_answer') {
    isCorrect = evaluateShortAnswer(val, q);
  }

  if (!isOpinion) {
    registerStudentOutcome(isCorrect);
  }

  const points = calculateGamifiedPoints(q, isCorrect);
  studentScore += points;

  await sb.from('answers').insert({
    session_id: currentSession.id,
    question_id: q.id,
    player_id: currentPlayer.id,
    answer_value: { text: val },
    is_correct: isCorrect,
    points_awarded: points
  });

  if (!isOpinion) {
    await sb.from('players').update({ score: studentScore }).eq('id', currentPlayer.id);
    document.getElementById('student-score-pill').textContent = `${studentScore} punts`;
    await updateStudentLivePosition();
  }

  showStudentWaitingFeedback(isCorrect, points, isOpinion);
}

function showStudentWaitingFeedback(isCorrect, points, isOpinion) {
  hideAllStudentInputs();
  const fb = document.getElementById('student-feedback');
  const ptsEl = document.getElementById('feedback-points');
  const streakEl = document.getElementById('feedback-streak-badge');
  const streakPill = document.getElementById('student-streak-pill');
  const fbPos = document.getElementById('feedback-live-pos');
  fb.classList.remove('hidden');

  if (isOpinion) {
    document.getElementById('feedback-icon').textContent = '🗳️';
    document.getElementById('feedback-title').textContent = 'Resposta registrada!';
    ptsEl.classList.add('hidden');
    streakEl.classList.add('hidden');
    fbPos.dataset.hideForOpinion = '1';
    fbPos.classList.add('hidden');
  } else if (isCorrect) {
    fbPos.dataset.hideForOpinion = '';
    document.getElementById('feedback-icon').textContent = studentStreak >= 3 ? '🔥' : '🎉';
    document.getElementById('feedback-title').textContent = studentStreak >= 2 ? `Encertat! Portes ${studentStreak} seguides` : 'Molt bé, encertat!';
    ptsEl.textContent = `+${points} punts`;
    ptsEl.classList.remove('hidden');
    if (studentStreak >= 2) {
      streakEl.textContent = `🔥 Ratxa x${studentStreak}`;
      streakEl.classList.remove('hidden');
      streakPill.textContent = `🔥 Ratxa x${studentStreak}`;
      streakPill.classList.remove('hidden');
    } else {
      streakEl.classList.add('hidden');
    }
  } else {
    fbPos.dataset.hideForOpinion = '';
    document.getElementById('feedback-icon').textContent = '💡';
    document.getElementById('feedback-title').textContent = 'No passa res, seguim!';
    ptsEl.textContent = '+0 punts';
    ptsEl.classList.remove('hidden');
    streakEl.classList.add('hidden');
    streakPill.classList.add('hidden');
  }
}

async function loginTeacher() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');

  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    errEl.textContent = "Correu o contrasenya incorrectes.";
    errEl.classList.remove('hidden');
    return;
  }
  loadTeacherDashboard(data.user);
}

async function logoutTeacher() {
  await sb.auth.signOut();
  showView('view-join');
}

async function returnToDashboard() {
  const { data: { user } } = await sb.auth.getUser();
  if (user) loadTeacherDashboard(user);
}

function switchDashTab(tab) {
  const qWrap = document.getElementById('dash-quizzes-wrapper');
  const rTab = document.getElementById('dash-tab-results');
  const qBtn = document.getElementById('tab-btn-quizzes');
  const rBtn = document.getElementById('tab-btn-results');

  if (tab === 'quizzes') {
    qWrap.classList.remove('hidden');
    rTab.classList.add('hidden');
    qBtn.className = "bg-indigo-600 text-white px-4 py-2.5 rounded-2xl font-bold text-sm transition";
    rBtn.className = "bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2.5 rounded-2xl font-bold text-sm transition";
  } else {
    qWrap.classList.add('hidden');
    rTab.classList.remove('hidden');
    rBtn.className = "bg-indigo-600 text-white px-4 py-2.5 rounded-2xl font-bold text-sm transition";
    qBtn.className = "bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2.5 rounded-2xl font-bold text-sm transition";
    loadSessionsHistory();
  }
}

async function loadTeacherDashboard(user) {
  document.getElementById('teacher-email-display').textContent = user.email;
  showView('view-teacher-dash');
  switchDashTab('quizzes');

  const { data: quizzes, error } = await sb
    .from('quizzes')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    document.getElementById('dash-tab-quizzes').innerHTML = `<p class="text-rose-600 text-sm col-span-full">Error carregant activitats: ${error.message}</p>`;
    return;
  }

  cachedTeacherQuizzes = quizzes || [];
  selectedTagFilter = 'all';
  renderTagFilters();
  renderFilteredQuizzes();
}

function renderTagFilters() {
  const filterBar = document.getElementById('dash-tags-filter');
  const tags = [...new Set(cachedTeacherQuizzes.map(q => (q.tag || '').trim()).filter(Boolean))];
  filterBar.innerHTML = '';

  if (tags.length === 0) return;

  const allBtn = document.createElement('button');
  allBtn.textContent = 'Totes les etiquetes';
  allBtn.className = selectedTagFilter === 'all'
    ? 'px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition'
    : 'px-3.5 py-1.5 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 text-xs font-bold transition';
  allBtn.onclick = () => {
    selectedTagFilter = 'all';
    renderTagFilters();
    renderFilteredQuizzes();
  };
  filterBar.appendChild(allBtn);

  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.className = selectedTagFilter === tag
      ? 'px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold transition'
      : 'px-3.5 py-1.5 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 text-xs font-bold transition';
    btn.onclick = () => {
      selectedTagFilter = tag;
      renderTagFilters();
      renderFilteredQuizzes();
    };
    filterBar.appendChild(btn);
  });
}

function renderFilteredQuizzes() {
  const list = document.getElementById('dash-tab-quizzes');
  list.innerHTML = '';

  const filtered = selectedTagFilter === 'all'
    ? cachedTeacherQuizzes
    : cachedTeacherQuizzes.filter(q => (q.tag || '').trim() === selectedTagFilter);

  if (filtered.length === 0) {
    list.innerHTML = `<div class="col-span-full bg-white p-10 rounded-3xl text-center border border-slate-200 text-slate-500">Encara no hi ha activitats en aquesta secció.</div>`;
    return;
  }

  filtered.forEach(q => {
    const isPoll = q.kind === 'poll';
    const safeTitle = q.title.replace(/'/g, "\\'");
    const card = document.createElement('div');
    card.className = "bg-white p-6 rounded-3xl flex flex-col justify-between gap-4 border border-slate-200/80 shadow-sm hover:shadow-md transition";
    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="px-2.5 py-1 ${isPoll ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-600'} rounded-lg text-xs font-bold">${isPoll ? 'Enquesta' : 'Qüestionari'}</span>
          ${q.tag ? `<span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">${q.tag}</span>` : ''}
        </div>
        <h3 class="font-extrabold text-xl text-slate-900">${q.title}</h3>
        <p class="text-xs text-slate-400">Creat el ${formatDateTime(q.created_at)}</p>
      </div>

      <div class="space-y-2 pt-2 border-t border-slate-100">
        <button onclick="createRoom('${q.id}', '${q.kind || 'quiz'}')" class="w-full ${isPoll ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'} text-white py-3 rounded-2xl font-bold text-sm shadow-md transition">
          ${isPoll ? 'Obrir enquesta' : 'Obrir sala de joc'}
        </button>
        <div class="grid grid-cols-4 gap-1.5">
          <button onclick="editExistingQuiz('${q.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-xs transition">Editar</button>
          <button onclick="duplicateQuiz('${q.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-xs transition">Duplicar</button>
          <button onclick="exportQuizJSON('${q.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-xs transition">Exportar</button>
          <button onclick="deleteQuiz('${q.id}', '${safeTitle}')" class="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white py-2 rounded-xl font-bold text-xs transition">Esborrar</button>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

async function editExistingQuiz(quizId) {
  const { data: quiz } = await sb.from('quizzes').select('*').eq('id', quizId).single();
  const { data: questions } = await sb.from('questions').select('*').eq('quiz_id', quizId).order('order_index', { ascending: true });
  if (!quiz) return;

  openQuizEditor(quiz.kind || 'quiz', quiz, questions || []);
}

async function duplicateQuiz(quizId) {
  const { data: { user } } = await sb.auth.getUser();
  const { data: origQuiz } = await sb.from('quizzes').select('*').eq('id', quizId).single();
  const { data: origQuestions } = await sb.from('questions').select('*').eq('quiz_id', quizId).order('order_index', { ascending: true });
  if (!origQuiz || !user) return;

  const { data: newQuiz, error } = await sb
    .from('quizzes')
    .insert({ teacher_id: user.id, title: `${origQuiz.title} (còpia)`, kind: origQuiz.kind || 'quiz', tag: origQuiz.tag || '' })
    .select()
    .single();

  if (error || !newQuiz) return alert("No s'ha pogut duplicar l'activitat.");

  if (origQuestions && origQuestions.length > 0) {
    const cloned = origQuestions.map((q, idx) => ({
      quiz_id: newQuiz.id,
      order_index: idx,
      type: q.type,
      question_text: q.question_text,
      media_url: q.media_url,
      time_limit: q.time_limit,
      points_multiplier: q.points_multiplier,
      options: q.options
    }));
    await sb.from('questions').insert(cloned);
  }

  loadTeacherDashboard(user);
}

async function deleteQuiz(quizId, title) {
  if (!confirm(`Segur que vols eliminar "${title}" i totes les seves preguntes?`)) return;
  const { data: { user } } = await sb.auth.getUser();
  await sb.from('game_sessions').delete().eq('quiz_id', quizId).eq('teacher_id', user.id);
  const { error } = await sb.from('quizzes').delete().eq('id', quizId).eq('teacher_id', user.id);
  if (error) {
    alert("No s'ha pogut esborrar: " + error.message);
    return;
  }
  loadTeacherDashboard(user);
}

async function exportQuizJSON(quizId) {
  const { data: quiz } = await sb.from('quizzes').select('title, kind, tag').eq('id', quizId).single();
  const { data: questions } = await sb.from('questions').select('type, question_text, media_url, time_limit, points_multiplier, options').eq('quiz_id', quizId).order('order_index', { ascending: true });
  if (!quiz) return;

  const payload = {
    app: 'domande',
    version: 1,
    title: quiz.title,
    kind: quiz.kind || 'quiz',
    tag: quiz.tag || '',
    questions: questions || []
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `domande_${quiz.title.toLowerCase().replace(/\s+/g, '_')}.json`;
  a.click();
}

async function importQuizJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = '';

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed.title || !Array.isArray(parsed.questions)) {
      return alert("El fitxer json no té un format vàlid de domande.");
    }

    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;

    const { data: newQuiz, error } = await sb
      .from('quizzes')
      .insert({
        teacher_id: user.id,
        title: parsed.title,
        kind: parsed.kind === 'poll' ? 'poll' : 'quiz',
        tag: parsed.tag || ''
      })
      .select()
      .single();

    if (error || !newQuiz) return alert("Error creant l'activitat importada.");

    const qRows = parsed.questions.map((q, idx) => ({
      quiz_id: newQuiz.id,
      order_index: idx,
      type: q.type || 'quiz',
      question_text: q.question_text || `Pregunta ${idx + 1}`,
      media_url: q.media_url || null,
      time_limit: q.time_limit || 20,
      points_multiplier: typeof q.points_multiplier === 'number' ? q.points_multiplier : 1,
      options: Array.isArray(q.options) ? q.options : []
    }));

    if (qRows.length > 0) {
      await sb.from('questions').insert(qRows);
    }

    loadTeacherDashboard(user);
  } catch (e) {
    alert("No s'ha pogut llegir el fitxer json.");
  }
}

function formatDateTime(isoString) {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${mins}`;
}

async function loadSessionsHistory() {
  const container = document.getElementById('sessions-history-list');
  container.innerHTML = '<p class="text-sm text-slate-400 py-4">Carregant historial...</p>';

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;

  const { data: sessions, error } = await sb
    .from('game_sessions')
    .select('id, pin, status, created_at, quiz_id, quizzes(title, kind)')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !sessions || sessions.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-500 py-6 text-center">Encara no hi ha cap sessió enregistrada al teu compte.</p>';
    return;
  }

  container.innerHTML = '';
  sessions.forEach(s => {
    const title = s.quizzes?.title || 'Activitat sense títol';
    const isPoll = s.quizzes?.kind === 'poll';
    const dateStr = formatDateTime(s.created_at);
    const safeTitle = title.replace(/'/g, "\\'");
    const row = document.createElement('div');
    row.className = "py-4 flex flex-wrap justify-between items-center gap-4 hover:bg-slate-50 px-3 rounded-2xl transition";
    row.innerHTML = `
      <div>
        <div class="flex items-center gap-2">
          <p class="text-xs font-extrabold text-indigo-600">${dateStr}</p>
          <span class="px-2 py-0.5 rounded-md text-xs font-bold ${isPoll ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-600'}">${isPoll ? 'Enquesta' : 'Qüestionari'}</span>
        </div>
        <h4 class="text-base font-extrabold text-slate-900 mt-0.5">${title}</h4>
        <p class="text-xs text-slate-400">Pin: ${s.pin}</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="openSessionReport('${s.id}', '${safeTitle}', '${dateStr}')" class="bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs transition">
          ${isPoll ? 'Veure resultats' : 'Veure avaluació i detall'}
        </button>
        <button onclick="deleteSessionResult('${s.id}', '${safeTitle}')" class="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 px-3.5 py-2 rounded-xl font-bold text-xs transition">
          Esborrar
        </button>
      </div>
    `;
    container.appendChild(row);
  });
}

async function deleteSessionResult(sessionId, title) {
  const confirmed = confirm(`Segur que vols esborrar els resultats de "${title}"? Aquesta acció eliminarà permanentment totes les respostes i puntuacions d'aquesta sessió.`);
  if (!confirmed) return;

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;

  const { error } = await sb
    .from('game_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('teacher_id', user.id);

  if (error) {
    alert("No s'ha pogut esborrar el registre: " + error.message);
    return;
  }

  loadSessionsHistory();
}

async function openSessionReport(sessionId, quizTitle, dateStr) {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return showView('view-login');

  const { data: session, error: sErr } = await sb
    .from('game_sessions')
    .select('quiz_id, teacher_id, quizzes(title, kind)')
    .eq('id', sessionId)
    .eq('teacher_id', user.id)
    .single();

  if (sErr || !session) {
    alert("No tens permís per visualitzar aquest informe.");
    return backToResults();
  }

  const resolvedTitle = session.quizzes?.title || quizTitle;
  const isPoll = session.quizzes?.kind === 'poll';

  showView('view-session-report');
  document.getElementById('report-date-badge').textContent = dateStr;
  document.getElementById('report-quiz-title').textContent = resolvedTitle;
  document.getElementById('pdf-header-title').textContent = isPoll ? "Domande · resultats de l'enquesta" : "Domande · informe d'avaluació";
  document.getElementById('pdf-subtitle-info').textContent = `${resolvedTitle} · ${dateStr}`;
  document.getElementById('pdf-type-tag').textContent = isPoll ? "Enquesta d'aula" : "Registre d'avaluació";

  const { data: questions } = await sb.from('questions').select('*').eq('quiz_id', session.quiz_id).order('order_index', { ascending: true });
  const { data: players } = await sb.from('players').select('*').eq('session_id', sessionId).order('score', { ascending: false });
  const { data: answers } = await sb.from('answers').select('*').eq('session_id', sessionId);

  const allItems = questions || [];
  const qs = allItems.filter(q => q.type !== 'slide');
  const pls = players || [];
  const ans = answers || [];

  currentReportData = { quizTitle: resolvedTitle, dateStr, isPoll, questions: qs, players: pls, answers: ans };

  document.getElementById('rep-stat-players').textContent = pls.length;
  document.getElementById('rep-stat-questions').textContent = qs.length;

  if (isPoll) {
    document.getElementById('rep-card-accuracy').classList.add('hidden');
    document.getElementById('rep-card-topscore').classList.add('hidden');
    document.getElementById('report-visual-bars').classList.add('hidden');
    document.getElementById('report-summary-heading').textContent = "Desglossament de votacions per pregunta";
  } else {
    document.getElementById('rep-card-accuracy').classList.remove('hidden');
    document.getElementById('rep-card-topscore').classList.remove('hidden');
    document.getElementById('report-visual-bars').classList.remove('hidden');
    document.getElementById('report-summary-heading').textContent = "Preguntes del qüestionari i detecció de repàs";
    document.getElementById('rep-stat-topscore').textContent = pls.length > 0 ? pls[0].score : 0;

    const gradableAns = ans.filter(a => {
      const q = qs.find(item => item.id === a.question_id);
      return q && !['word_cloud', 'poll', 'nps_scale'].includes(q.type);
    });
    const correctCount = gradableAns.filter(a => a.is_correct).length;
    const accuracy = gradableAns.length > 0 ? Math.round((correctCount / gradableAns.length) * 100) : 0;
    document.getElementById('rep-stat-accuracy').textContent = `${accuracy}%`;
  }

  const qSummaryContainer = document.getElementById('report-questions-summary');
  qSummaryContainer.innerHTML = '';

  if (qs.length === 0) {
    qSummaryContainer.innerHTML = `<p class="text-xs text-slate-400 col-span-full">No s'han trobat preguntes associades.</p>`;
  } else if (isPoll) {
    const barColors = ['bg-rose-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500'];
    qs.forEach((q, idx) => {
      const qAnsList = ans.filter(a => a.question_id === q.id);
      const totalVotes = qAnsList.length;
      let breakdownHTML = '';

      if (q.type === 'word_cloud') {
        const words = qAnsList.map(a => `<span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">${a.answer_value?.text || ''}</span>`).join(' ');
        breakdownHTML = `<div class="flex flex-wrap gap-1.5 pt-1">${words || '<span class="text-xs text-slate-400">Sense paraules enviades</span>'}</div>`;
      } else if (q.type === 'nps_scale') {
        const values = qAnsList.map(a => Number(a.answer_value?.index)).filter(n => !isNaN(n));
        const avg = values.length > 0 ? (values.reduce((acc, v) => acc + v, 0) / values.length).toFixed(1) : '0';
        breakdownHTML = `<div class="bg-indigo-50 p-3 rounded-xl text-center"><span class="text-xs text-indigo-600 font-bold block">Valoració mitjana del grup</span><span class="text-2xl font-black text-indigo-800">${avg} / 10</span></div>`;
      } else {
        (q.options || []).forEach((opt, oIdx) => {
          const votes = qAnsList.filter(a => a.answer_value?.index === oIdx).length;
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          breakdownHTML += `
            <div class="space-y-1">
              <div class="flex justify-between text-xs font-bold text-slate-700">
                <span>${opt.text}</span>
                <span>${votes} vots (${pct}%)</span>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div style="width: ${pct}%" class="h-full ${barColors[oIdx % 4]} rounded-full"></div>
              </div>
            </div>
          `;
        });
      }

      qSummaryContainer.innerHTML += `
        <div class="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2.5">
          <div class="flex justify-between items-center">
            <span class="text-xs font-extrabold text-amber-600">Pregunta ${idx + 1}</span>
            <span class="text-xs font-bold text-slate-400">${totalVotes} respostes</span>
          </div>
          <p class="text-sm font-extrabold text-slate-900">${q.question_text}</p>
          <div class="space-y-2 pt-1">${breakdownHTML}</div>
        </div>
      `;
    });
  } else {
    qs.forEach((q, idx) => {
      const correctOpts = q.type === 'puzzle'
        ? (q.options || []).map(o => o.text).join(' → ')
        : (q.options || []).filter(o => o.is_correct).map(o => o.text).join(', ');
      const qAnsList = ans.filter(a => a.question_id === q.id);
      const qCorrectCount = qAnsList.filter(a => a.is_correct).length;
      const qPct = qAnsList.length > 0 ? Math.round((qCorrectCount / qAnsList.length) * 100) : 0;
      const isGradable = !['word_cloud', 'poll', 'nps_scale'].includes(q.type);
      const needsReview = isGradable && qAnsList.length > 0 && qPct < 50;

      qSummaryContainer.innerHTML += `
        <div class="${needsReview ? 'bg-rose-50/70 border-rose-300' : 'bg-white border-slate-200/80'} p-3.5 rounded-xl border space-y-1.5">
          <div class="flex justify-between items-start gap-2">
            <span class="text-xs font-extrabold ${needsReview ? 'text-rose-700' : 'text-indigo-600'}">Pregunta ${idx + 1}</span>
            ${isGradable ? `
              <div class="flex items-center gap-1.5">
                ${needsReview ? '<span class="text-xs font-extrabold px-2 py-0.5 rounded-md bg-rose-600 text-white">Cal repassar</span>' : ''}
                <span class="text-xs font-bold px-2 py-0.5 rounded-md ${qPct >= 50 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-100 text-rose-800'}">${qPct}% d'encert</span>
              </div>
            ` : ''}
          </div>
          <p class="text-sm font-extrabold text-slate-900">${q.question_text}</p>
          ${correctOpts ? `<p class="text-xs text-emerald-700 font-semibold">Resposta correcta: ${correctOpts}</p>` : ''}
        </div>
      `;
    });
  }

  const barsList = document.getElementById('report-bars-list');
  barsList.innerHTML = '';

  const thead = document.getElementById('report-table-head');
  let headHTML = isPoll
    ? `<tr><th class="p-3.5 whitespace-nowrap">Participant</th>`
    : `<tr>
        <th class="p-3.5 whitespace-nowrap">Posició</th>
        <th class="p-3.5 whitespace-nowrap">Alumne/a</th>
        <th class="p-3.5 whitespace-nowrap">Punts</th>
        <th class="p-3.5 whitespace-nowrap">Encerts</th>`;

  qs.forEach((q, idx) => {
    headHTML += `<th class="p-3.5 min-w-[200px] leading-snug"><span class="${isPoll ? 'text-amber-600' : 'text-indigo-600'} block text-xs">Pregunta ${idx + 1}</span>${q.question_text}</th>`;
  });
  headHTML += `</tr>`;
  thead.innerHTML = headHTML;

  const tbody = document.getElementById('report-table-body');
  tbody.innerHTML = '';

  if (pls.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${(isPoll ? 1 : 4) + qs.length}" class="p-6 text-center text-slate-400">Cap participant en aquesta sessió.</td></tr>`;
    barsList.innerHTML = `<p class="text-xs text-slate-400">Sense dades de participació.</p>`;
    return;
  }

  pls.forEach((p, rankIdx) => {
    const pAnswers = ans.filter(a => a.player_id === p.id);
    const pCorrect = pAnswers.filter(a => a.is_correct).length;
    const pct = qs.length > 0 ? Math.round((pCorrect / qs.length) * 100) : 0;

    if (!isPoll) {
      barsList.innerHTML += `
        <div class="flex items-center gap-3">
          <div class="w-36 shrink-0 flex items-center gap-2 font-bold text-slate-800 text-xs truncate">
            <span>${p.avatar}</span>
            <span class="truncate">${p.nickname}</span>
          </div>
          <div class="flex-1 h-5 bg-slate-200/80 rounded-full overflow-hidden flex items-center">
            <div style="width: ${Math.max(4, pct)}%" class="h-full ${pct >= 50 ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full transition-all"></div>
          </div>
          <div class="w-24 shrink-0 text-right text-xs font-extrabold text-slate-700">${pct}% (${p.score} pts)</div>
        </div>
      `;
    }

    let rowHTML = isPoll
      ? `<tr class="hover:bg-slate-50/80"><td class="p-3.5 font-extrabold text-slate-900 flex items-center gap-2 whitespace-nowrap"><span>${p.avatar}</span> <span>${p.nickname}</span></td>`
      : `<tr class="hover:bg-slate-50/80">
          <td class="p-3.5 font-extrabold text-slate-500 whitespace-nowrap">${formatRankOrdinal(rankIdx + 1)}</td>
          <td class="p-3.5 font-extrabold text-slate-900 flex items-center gap-2 whitespace-nowrap"><span>${p.avatar}</span> <span>${p.nickname}</span></td>
          <td class="p-3.5 font-black text-indigo-600 whitespace-nowrap">${p.score}</td>
          <td class="p-3.5 font-bold text-slate-700 whitespace-nowrap">${pCorrect} / ${qs.length}</td>`;

    const badgeColors = [
      'bg-rose-50 text-rose-700 border-rose-200',
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-amber-50 text-amber-700 border-amber-200',
      'bg-emerald-50 text-emerald-700 border-emerald-200'
    ];

    qs.forEach(q => {
      const a = pAnswers.find(item => item.question_id === q.id);
      if (!a) {
        rowHTML += `<td class="p-3.5 text-slate-400 text-xs">Sense resposta</td>`;
      } else {
        const respText = a.answer_value?.text || (q.options[a.answer_value?.index]?.text) || 'Respost';
        if (isPoll || ['word_cloud', 'poll', 'nps_scale'].includes(q.type)) {
          const cIdx = typeof a.answer_value?.index === 'number' ? a.answer_value.index % 4 : 1;
          rowHTML += `<td class="p-3.5"><span class="inline-block px-2.5 py-1 rounded-lg border ${badgeColors[cIdx]} text-xs font-bold">${respText}</span></td>`;
        } else if (a.is_correct) {
          rowHTML += `<td class="p-3.5"><span class="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">✓ ${respText}</span></td>`;
        } else {
          rowHTML += `<td class="p-3.5"><span class="inline-block px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">✗ ${respText}</span></td>`;
        }
      }
    });

    rowHTML += `</tr>`;
    tbody.innerHTML += rowHTML;
  });
}

function exportReportPDF() {
  if (!currentReportData) return;
  const element = document.getElementById('pdf-export-area');
  const btn = document.getElementById('btn-export-pdf');
  btn.disabled = true;
  btn.textContent = "Generant pdf...";

  const filename = `domande_${currentReportData.quizTitle.toLowerCase().replace(/\s+/g, '_')}_${currentReportData.dateStr.slice(0, 10).replace(/\//g, '-')}.pdf`;
  const opt = {
    margin: 8,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    btn.disabled = false;
    btn.textContent = "Descarregar informe pdf";
  });
}

function backToResults() {
  showView('view-teacher-dash');
  switchDashTab('results');
}

function openLatestReport() {
  if (!currentSession) return returnToDashboard();
  const dateStr = formatDateTime(currentSession.created_at || new Date().toISOString());
  openSessionReport(currentSession.id, 'Resultats de la sessió', dateStr);
}

function openQuizEditor(kind = 'quiz', existingQuiz = null, existingQuestions = []) {
  editorKind = kind;
  editingQuizId = existingQuiz ? existingQuiz.id : null;
  const isPoll = kind === 'poll';

  document.getElementById('editor-heading').textContent = existingQuiz
    ? (isPoll ? 'Editar enquesta' : 'Editar qüestionari')
    : (isPoll ? 'Nova enquesta' : 'Nou qüestionari');

  const badge = document.getElementById('editor-mode-badge');
  badge.textContent = isPoll ? 'Sense punts ni competició' : 'Mode joc amb punts';
  badge.className = isPoll
    ? 'px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold'
    : 'px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold';

  document.getElementById('editor-title-label').textContent = isPoll ? "Títol de l'enquesta" : "Títol de l'activitat";
  document.getElementById('editor-title').placeholder = isPoll ? "Ex: on volem anar de colònies?" : "Ex: el sistema solar i els planetes";
  document.getElementById('editor-title').value = existingQuiz ? existingQuiz.title : '';
  document.getElementById('editor-tag').value = existingQuiz ? (existingQuiz.tag || '') : '';
  document.getElementById('editor-questions-container').innerHTML = '';
  document.getElementById('editor-error').classList.add('hidden');

  const saveBtn = document.getElementById('btn-save-quiz');
  saveBtn.textContent = existingQuiz ? 'Actualitzar canvis' : (isPoll ? 'Guardar enquesta' : 'Guardar qüestionari');
  saveBtn.className = isPoll
    ? 'w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-extrabold text-lg shadow-lg shadow-amber-200 transition'
    : 'w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-lg shadow-lg shadow-emerald-200 transition';

  const addBtns = document.getElementById('editor-add-buttons');
  if (isPoll) {
    addBtns.innerHTML = `
      <button type="button" onclick="addQuestionBlock('quiz')" class="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Opció múltiple</button>
      <button type="button" onclick="addQuestionBlock('true_false')" class="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Sí o no</button>
      <button type="button" onclick="addQuestionBlock('nps_scale')" class="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Escala 0 a 10</button>
      <button type="button" onclick="addQuestionBlock('word_cloud')" class="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Núvol de paraules</button>
      <button type="button" onclick="addQuestionBlock('slide')" class="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Diapositiva</button>
    `;
  } else {
    addBtns.innerHTML = `
      <button type="button" onclick="addQuestionBlock('quiz')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Opció múltiple</button>
      <button type="button" onclick="addQuestionBlock('true_false')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Vertader o fals</button>
      <button type="button" onclick="addQuestionBlock('puzzle')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Ordenar (puzzle)</button>
      <button type="button" onclick="addQuestionBlock('type_answer')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Resposta curta</button>
      <button type="button" onclick="addQuestionBlock('word_cloud')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Núvol de paraules</button>
      <button type="button" onclick="addQuestionBlock('slide')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Diapositiva</button>
    `;
  }

  if (existingQuestions && existingQuestions.length > 0) {
    existingQuestions.forEach(q => {
      const uiType = q.type === 'poll' ? 'quiz' : q.type;
      addQuestionBlock(uiType, q);
    });
  } else {
    addQuestionBlock('quiz');
  }

  showView('view-quiz-editor');
}

function addQuestionBlock(type, prefill = null) {
  const container = document.getElementById('editor-questions-container');
  const idx = container.children.length + 1;
  const isPoll = editorKind === 'poll';
  const div = document.createElement('div');
  div.className = "q-block bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-200";
  div.dataset.type = type;

  const typeNames = {
    quiz: 'opció múltiple',
    true_false: isPoll ? 'sí o no' : 'vertader o fals',
    puzzle: 'ordenar peces',
    type_answer: 'resposta curta',
    word_cloud: 'núvol de paraules',
    nps_scale: 'escala de 0 a 10',
    slide: 'diapositiva explicativa'
  };

  const optColors = ['bg-rose-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500'];
  const existingOpts = prefill?.options || [];

  let optionsHTML = '';
  if (type === 'quiz') {
    optionsHTML = [0,1,2,3].map(i => {
      const optVal = existingOpts[i]?.text || '';
      const optChk = existingOpts[i]?.is_correct ? 'checked' : '';
      return `
        <div class="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
          ${isPoll
            ? `<span class="w-4 h-4 rounded-full ${optColors[i]} shrink-0"></span>`
            : `<input type="checkbox" ${optChk} class="opt-correct w-5 h-5 accent-emerald-600 cursor-pointer" title="Marca si és correcta">`
          }
          <input type="text" value="${optVal.replace(/"/g, '&quot;')}" placeholder="Opció ${i+1}" class="opt-text flex-1 p-1 text-sm font-semibold text-slate-800 outline-none">
        </div>
      `;
    }).join('');
  } else if (type === 'puzzle') {
    optionsHTML = [0,1,2,3].map(i => {
      const optVal = existingOpts[i]?.text || '';
      return `
        <div class="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
          <span class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center shrink-0">${i + 1}</span>
          <input type="text" value="${optVal.replace(/"/g, '&quot;')}" placeholder="Posició correcta ${i+1}" class="opt-text flex-1 p-1 text-sm font-semibold text-slate-800 outline-none">
        </div>
      `;
    }).join('');
  } else if (type === 'true_false') {
    const isFirstTrue = existingOpts.length > 0 ? existingOpts[0]?.is_correct : true;
    optionsHTML = isPoll
      ? `<div class="col-span-full bg-white p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Opcions de votació automàtiques: Sí / No</div>`
      : `<div class="flex gap-4 col-span-full bg-white p-3 rounded-xl border border-slate-200">
          <label class="flex items-center gap-2 font-bold text-sm text-slate-700 cursor-pointer"><input type="radio" name="tf-${idx}-${Date.now()}" value="0" ${isFirstTrue ? 'checked' : ''} class="opt-correct accent-indigo-600"> Vertader</label>
          <label class="flex items-center gap-2 font-bold text-sm text-slate-700 cursor-pointer"><input type="radio" name="tf-${idx}-${Date.now()}" value="1" ${!isFirstTrue ? 'checked' : ''} class="opt-correct accent-indigo-600"> Fals</label>
        </div>`;
  } else if (type === 'type_answer') {
    const ansVal = existingOpts[0]?.text || '';
    const matchMode = existingOpts[0]?.match_mode || 'exact';
    optionsHTML = `
      <div class="col-span-full bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
        <div class="flex flex-wrap justify-between items-center gap-2">
          <span class="text-xs font-bold text-slate-600">Respostes acceptades (separa diferents opcions amb comes):</span>
          <select class="opt-match-mode bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs p-1.5 rounded-lg outline-none">
            <option value="exact" ${matchMode === 'exact' ? 'selected' : ''}>Coincidència exacta (sense majúscules ni accents)</option>
            <option value="contains" ${matchMode === 'contains' ? 'selected' : ''}>Conté alguna de les paraules clau</option>
          </select>
        </div>
        <input type="text" value="${ansVal.replace(/"/g, '&quot;')}" placeholder="Ex: Barcelona, barna, BCN" class="opt-text w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none">
      </div>
    `;
  } else if (type === 'word_cloud') {
    optionsHTML = `<p class="text-xs text-slate-500 col-span-full bg-white p-3 rounded-xl border border-slate-200">☁️ Els/les alumnes enviaran paraules lliures que aniran formant un núvol visual a la pantalla.</p>`;
  } else if (type === 'nps_scale') {
    optionsHTML = `<p class="text-xs text-slate-500 col-span-full bg-white p-3 rounded-xl border border-slate-200">Els/les alumnes votaran un número del 0 al 10 i es calcularà la mitjana del grup.</p>`;
  } else if (type === 'slide') {
    const slideBody = existingOpts[0]?.text || '';
    optionsHTML = `<textarea placeholder="Escriu aquí el text explicatiu de la diapositiva..." rows="3" class="opt-text col-span-full w-full p-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 outline-none">${slideBody}</textarea>`;
  }

  const timeVal = prefill?.time_limit || 20;
  const ptsVal = typeof prefill?.points_multiplier === 'number' ? prefill.points_multiplier : 1;
  const titleVal = (prefill?.question_text || '').replace(/"/g, '&quot;');
  const mediaVal = (prefill?.media_url || '').replace(/"/g, '&quot;');

  div.innerHTML = `
    <div class="flex flex-wrap justify-between items-center gap-2">
      <span class="text-xs font-extrabold ${isPoll ? 'text-amber-700 bg-amber-50' : 'text-indigo-600 bg-indigo-50'} px-3 py-1 rounded-lg">${type === 'slide' ? `Diapositiva ${idx}` : `Pregunta ${idx}`} · ${typeNames[type]}</span>
      <div class="flex items-center gap-2">
        ${type === 'slide' ? '' : `
          <select class="q-time bg-white border border-slate-200 text-slate-700 font-bold text-xs p-1.5 rounded-lg outline-none">
            <option value="10" ${timeVal === 10 ? 'selected' : ''}>10 segons</option>
            <option value="20" ${timeVal === 20 ? 'selected' : ''}>20 segons</option>
            <option value="30" ${timeVal === 30 ? 'selected' : ''}>30 segons</option>
            <option value="60" ${timeVal === 60 ? 'selected' : ''}>60 segons</option>
          </select>
        `}
        ${(isPoll || type === 'slide') ? '' : `
          <select class="q-points bg-white border border-slate-200 text-slate-700 font-bold text-xs p-1.5 rounded-lg outline-none">
            <option value="1" ${ptsVal === 1 ? 'selected' : ''}>Punts normals</option>
            <option value="2" ${ptsVal === 2 ? 'selected' : ''}>Doble puntuació</option>
            <option value="0" ${ptsVal === 0 ? 'selected' : ''}>Sense punts</option>
          </select>
        `}
        <button type="button" onclick="this.closest('.q-block').remove()" class="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition">Treure</button>
      </div>
    </div>
    <input type="text" value="${titleVal}" placeholder="${type === 'slide' ? 'Títol de la diapositiva...' : 'Escriu l\'enunciat de la pregunta...'}" class="q-title w-full p-3 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 outline-none">
    <input type="url" value="${mediaVal}" placeholder="Enllaç d'imatge opcional (https://...)" class="q-media w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 outline-none">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">${optionsHTML}</div>
  `;
  container.appendChild(div);
}

async function saveQuiz() {
  const title = document.getElementById('editor-title').value.trim();
  const tag = document.getElementById('editor-tag').value.trim();
  const errEl = document.getElementById('editor-error');
  const saveBtn = document.getElementById('btn-save-quiz');
  const isPoll = editorKind === 'poll';
  errEl.classList.add('hidden');

  if (!title) {
    errEl.textContent = isPoll ? "Escriu un títol per a l'enquesta abans de guardar." : "Escriu un títol per al qüestionari abans de guardar.";
    errEl.classList.remove('hidden');
    return;
  }

  const blocks = document.querySelectorAll('.q-block');
  if (blocks.length === 0) {
    errEl.textContent = "Afegeix com a mínim una pregunta.";
    errEl.classList.remove('hidden');
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "Guardant...";

  const { data: authData, error: authError } = await sb.auth.getUser();
  if (authError || !authData?.user) {
    errEl.textContent = "La sessió ha caducat. Torna a iniciar sessió.";
    errEl.classList.remove('hidden');
    saveBtn.disabled = false;
    saveBtn.textContent = "Guardar";
    return;
  }

  let targetQuizId = editingQuizId;

  if (editingQuizId) {
    const { error: updErr } = await sb
      .from('quizzes')
      .update({ title, tag })
      .eq('id', editingQuizId)
      .eq('teacher_id', authData.user.id);

    if (updErr) {
      errEl.textContent = `No s'ha pogut actualitzar: ${updErr.message}`;
      errEl.classList.remove('hidden');
      saveBtn.disabled = false;
      saveBtn.textContent = "Actualitzar canvis";
      return;
    }
    await sb.from('questions').delete().eq('quiz_id', editingQuizId);
  } else {
    const { data: quiz, error: quizError } = await sb
      .from('quizzes')
      .insert({ teacher_id: authData.user.id, title, kind: editorKind, tag })
      .select()
      .single();

    if (quizError || !quiz) {
      errEl.textContent = `No s'ha pogut guardar: ${quizError?.message || 'revisa els permisos'}`;
      errEl.classList.remove('hidden');
      saveBtn.disabled = false;
      saveBtn.textContent = isPoll ? "Guardar enquesta" : "Guardar qüestionari";
      return;
    }
    targetQuizId = quiz.id;
  }

  const questionsToInsert = [];

  blocks.forEach((b, i) => {
    const rawType = b.dataset.type;
    const dbType = (isPoll && rawType === 'quiz') ? 'poll' : rawType;
    const question_text = b.querySelector('.q-title').value.trim() || `Pregunta ${i + 1}`;
    const media_url = b.querySelector('.q-media').value.trim() || null;
    const timeEl = b.querySelector('.q-time');
    const time_limit = timeEl ? parseInt(timeEl.value) : 20;
    const pointsEl = b.querySelector('.q-points');
    const points_multiplier = (isPoll || rawType === 'slide') ? 0 : parseInt(pointsEl ? pointsEl.value : '1');
    let options = [];

    if (rawType === 'quiz') {
      const texts = b.querySelectorAll('.opt-text');
      const checks = b.querySelectorAll('.opt-correct');
      texts.forEach((t, idx) => {
        if (t.value.trim()) {
          options.push({ text: t.value.trim(), is_correct: isPoll ? false : (checks[idx]?.checked || false) });
        }
      });
    } else if (rawType === 'puzzle') {
      const texts = b.querySelectorAll('.opt-text');
      texts.forEach(t => {
        if (t.value.trim()) {
          options.push({ text: t.value.trim(), is_correct: true });
        }
      });
    } else if (rawType === 'true_false') {
      if (isPoll) {
        options = [
          { text: 'Sí', is_correct: false },
          { text: 'No', is_correct: false }
        ];
      } else {
        const radios = b.querySelectorAll('.opt-correct');
        options = [
          { text: 'Vertader', is_correct: radios[0].checked },
          { text: 'Fals', is_correct: radios[1].checked }
        ];
      }
    } else if (rawType === 'type_answer') {
      const val = b.querySelector('.opt-text')?.value.trim() || '';
      const matchMode = b.querySelector('.opt-match-mode')?.value || 'exact';
      options = [{ text: val, is_correct: true, match_mode: matchMode }];
    } else if (rawType === 'slide') {
      const val = b.querySelector('.opt-text')?.value.trim() || '';
      options = [{ text: val, is_correct: true }];
    }

    questionsToInsert.push({
      quiz_id: targetQuizId,
      order_index: i,
      type: dbType,
      question_text,
      media_url,
      time_limit,
      points_multiplier,
      options
    });
  });

  const { error: qError } = await sb.from('questions').insert(questionsToInsert);

  saveBtn.disabled = false;
  saveBtn.textContent = isPoll ? "Guardar enquesta" : "Guardar qüestionari";

  if (qError) {
    errEl.textContent = `Error guardant les preguntes: ${qError.message}`;
    errEl.classList.remove('hidden');
    return;
  }

  loadTeacherDashboard(authData.user);
}

async function createRoom(quizId, kind = 'quiz') {
  const { data: { user } } = await sb.auth.getUser();
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  sessionKind = kind;
  const isPoll = kind === 'poll';
  hostPlayersList = [];

  const { data: session, error } = await sb
    .from('game_sessions')
    .insert({ quiz_id: quizId, teacher_id: user.id, pin, status: 'waiting' })
    .select()
    .single();

  if (error) {
    alert("Error creant la sala: " + error.message);
    return;
  }

  const { data: qs } = await sb
    .from('questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true });

  currentSession = session;
  sessionQuestions = qs || [];

  const joinUrl = `${window.location.origin}${window.location.pathname}?pin=${pin}`;
  document.getElementById('host-qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`;

  const lobbyBadge = document.getElementById('host-lobby-badge');
  lobbyBadge.textContent = isPoll ? 'Enquesta oberta' : 'Sala oberta';
  lobbyBadge.className = isPoll
    ? 'px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-bold'
    : 'px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold';

  const startBtn = document.getElementById('btn-host-start');
  startBtn.textContent = isPoll ? 'Començar enquesta' : 'Començar partida';
  startBtn.className = isPoll
    ? 'px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-extrabold text-2xl shadow-xl shadow-amber-200 transition'
    : 'px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-2xl shadow-xl shadow-emerald-200 transition';

  const lbCol = document.getElementById('host-leaderboard-col');
  const visCol = document.getElementById('host-visual-col');
  if (isPoll) {
    lbCol.classList.add('hidden');
    visCol.className = 'lg:col-span-3 space-y-6';
  } else {
    lbCol.classList.remove('hidden');
    visCol.className = 'lg:col-span-2 space-y-6';
  }

  document.getElementById('host-pin-display').textContent = pin;
  document.getElementById('host-players-grid').innerHTML = '';
  document.getElementById('host-player-count').textContent = '0';
  document.getElementById('host-live-leaderboard').innerHTML = '<p class="text-xs text-slate-400 text-center py-4">Esperant punts...</p>';
  showView('view-teacher-host');
  setMusicMode('lobby');
  document.getElementById('host-lobby').classList.remove('hidden');
  document.getElementById('host-question-screen').classList.add('hidden');
  document.getElementById('host-partial-podium-screen').classList.add('hidden');
  document.getElementById('host-podium-screen').classList.add('hidden');
  document.getElementById('host-poll-finished-screen').classList.add('hidden');

  sb.channel('host-players-' + session.id)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players', filter: `session_id=eq.${session.id}` }, payload => {
      const p = payload.new;
      hostPlayersList.push(p);
      renderHostPlayersLobby();
      if (!isPoll) refreshLiveLeaderboard();
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'players', filter: `session_id=eq.${session.id}` }, payload => {
      hostPlayersList = hostPlayersList.filter(item => item.id !== payload.old.id);
      renderHostPlayersLobby();
      if (!isPoll) refreshLiveLeaderboard();
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players', filter: `session_id=eq.${session.id}` }, () => {
      if (!isPoll) refreshLiveLeaderboard();
    })
    .subscribe();
}

function renderHostPlayersLobby() {
  const grid = document.getElementById('host-players-grid');
  grid.innerHTML = '';
  document.getElementById('host-player-count').textContent = hostPlayersList.length;

  hostPlayersList.forEach(p => {
    const badge = document.createElement('button');
    badge.type = 'button';
    badge.title = 'Clica per expulsar de la sala';
    badge.className = "bg-white hover:bg-rose-50 hover:border-rose-300 border border-slate-200 shadow-sm px-4 py-2.5 rounded-2xl font-extrabold text-slate-800 text-lg flex items-center gap-2 transition group";
    badge.innerHTML = `<span class="text-2xl">${p.avatar}</span> <span>${p.nickname}</span> <span class="text-xs text-rose-500 opacity-0 group-hover:opacity-100 font-black ml-1">✕</span>`;
    badge.onclick = () => kickPlayerFromLobby(p.id, p.nickname);
    grid.appendChild(badge);
  });
}

async function kickPlayerFromLobby(playerId, nickname) {
  if (!confirm(`Vols expulsar "${nickname}" de la sala?`)) return;
  await sb.from('players').delete().eq('id', playerId);
  hostPlayersList = hostPlayersList.filter(item => item.id !== playerId);
  renderHostPlayersLobby();
}

async function refreshLiveLeaderboard() {
  if (!currentSession || sessionKind === 'poll') return;
  const { data: players } = await sb
    .from('players')
    .select('*')
    .eq('session_id', currentSession.id)
    .order('score', { ascending: false });

  const lb = document.getElementById('host-live-leaderboard');
  if (!players || players.length === 0) return;

  lb.innerHTML = '';
  players.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = "flex justify-between items-center bg-white px-3.5 py-2.5 rounded-xl border border-slate-100 shadow-sm";
    row.innerHTML = `
      <div class="flex items-center gap-2 font-bold text-slate-800 text-sm">
        <span class="text-xs font-black text-slate-400 w-4">${idx + 1}.</span>
        <span>${p.avatar}</span>
        <span class="truncate max-w-[110px]">${p.nickname}</span>
      </div>
      <span class="font-extrabold text-indigo-600 text-sm">${p.score}</span>
    `;
    lb.appendChild(row);
  });
}

async function startGame() {
  if (sessionQuestions.length === 0) return alert("Aquesta activitat no té cap pregunta.");
  await launchQuestion(0);
}

async function launchQuestion(index) {
  if (activeAnsChannel) {
    sb.removeChannel(activeAnsChannel);
    activeAnsChannel = null;
  }

  if (index >= sessionQuestions.length) {
    await sb.from('game_sessions').update({ status: 'finished' }).eq('id', currentSession.id);
    if (sessionKind === 'poll') {
      setMusicMode('lobby');
      document.getElementById('host-question-screen').classList.add('hidden');
      document.getElementById('host-partial-podium-screen').classList.add('hidden');
      document.getElementById('host-poll-finished-screen').classList.remove('hidden');
    } else {
      await showHostPodium();
    }
    return;
  }

  const q = sessionQuestions[index];
  const isPoll = sessionKind === 'poll' || q.type === 'poll';
  const isSlide = q.type === 'slide';
  currentSession.current_question_index = index;

  await sb.from('game_sessions').update({
    status: 'question_active',
    current_question_index: index,
    question_started_at: new Date().toISOString()
  }).eq('id', currentSession.id);

  document.getElementById('host-lobby').classList.add('hidden');
  document.getElementById('host-partial-podium-screen').classList.add('hidden');
  document.getElementById('host-question-screen').classList.remove('hidden');
  document.getElementById('btn-next-question').classList.add('hidden');
  document.getElementById('btn-partial-podium').classList.add('hidden');
  document.getElementById('host-bars-display').classList.add('hidden');
  document.getElementById('host-slide-display').classList.add('hidden');
  document.getElementById('host-shortanswer-display').classList.add('hidden');

  document.getElementById('host-q-text').textContent = q.question_text;
  const imgEl = document.getElementById('host-q-image');
  if (q.media_url) {
    imgEl.src = q.media_url;
    imgEl.classList.remove('hidden');
  } else {
    imgEl.classList.add('hidden');
  }

  const optDisplay = document.getElementById('host-options-display');
  const wcDisplay = document.getElementById('host-wordcloud-display');
  const wcWords = document.getElementById('host-wordcloud-words');
  const saDisplay = document.getElementById('host-shortanswer-display');
  const slideDisplay = document.getElementById('host-slide-display');
  optDisplay.innerHTML = '';
  wcWords.innerHTML = '';
  saDisplay.innerHTML = '';

  if (isSlide) {
    clearInterval(hostTimerInterval);
    document.getElementById('host-timer-box').classList.add('hidden');
    document.getElementById('host-answers-count').classList.add('hidden');
    document.getElementById('btn-show-results').classList.add('hidden');
    optDisplay.classList.add('hidden');
    wcDisplay.classList.add('hidden');
    slideDisplay.textContent = q.options?.[0]?.text || '';
    slideDisplay.classList.remove('hidden');
    document.getElementById('btn-next-question').classList.remove('hidden');
    setMusicMode('lobby');
    return;
  }

  setMusicMode('action');
  document.getElementById('host-timer-box').classList.remove('hidden');
  document.getElementById('host-answers-count').classList.remove('hidden');
  document.getElementById('btn-show-results').classList.remove('hidden');

  const totalPlayers = hostPlayersList.length;

  if (q.type === 'type_answer') {
    optDisplay.classList.add('hidden');
    wcDisplay.classList.add('hidden');
    saDisplay.classList.remove('hidden');
    saDisplay.innerHTML = `
      <span class="px-3.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-extrabold">Resposta curta</span>
      <div id="host-sa-big-counter" class="text-6xl md:text-7xl font-black text-indigo-600 leading-none">0 <span class="text-2xl text-slate-400 font-bold">/ ${totalPlayers}</span></div>
      <p class="text-sm font-bold text-slate-500">Alumnes que ja han enviat la seva resposta</p>
    `;
  } else if (q.type === 'word_cloud') {
    optDisplay.classList.add('hidden');
    saDisplay.classList.add('hidden');
    wcDisplay.classList.remove('hidden');
  } else if (q.type === 'nps_scale' || q.type === 'puzzle') {
    optDisplay.classList.add('hidden');
    wcDisplay.classList.add('hidden');
    saDisplay.classList.remove('hidden');
    saDisplay.innerHTML = q.type === 'nps_scale'
      ? `<span class="text-4xl">📊</span><p class="text-slate-600 font-bold">Esperant les valoracions de 0 a 10 de la classe...</p>`
      : `<span class="text-4xl">🧩</span><p class="text-slate-600 font-bold">Els/les alumnes estan ordenant les opcions als seus dispositius...</p>`;
  } else {
    wcDisplay.classList.add('hidden');
    saDisplay.classList.add('hidden');
    optDisplay.classList.remove('hidden');
    const colors = ['btn-red', 'btn-blue', 'btn-yellow', 'btn-green'];
    q.options.forEach((opt, i) => {
      optDisplay.innerHTML += `
        <div id="host-opt-${i}" class="${colors[i%4]} p-5 rounded-2xl flex justify-between items-center gap-3 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-black/15 flex items-center justify-center shrink-0">${SHAPE_SVGS[i%4]}</div>
            <span>${opt.text}</span>
          </div>
          <span id="host-opt-count-${i}" class="bg-black/20 px-3.5 py-1 rounded-xl text-base">0</span>
        </div>
      `;
    });
  }

  let answersCount = 0;
  const counterPrefix = isPoll ? 'Vots' : 'Respostes';
  document.getElementById('host-answers-count').textContent = `${counterPrefix}: 0 / ${totalPlayers}`;

  activeAnsChannel = sb.channel('answers-' + q.id + '-' + Date.now())
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'answers', filter: `question_id=eq.${q.id}` }, payload => {
      if (payload.new.session_id !== currentSession.id) return;
      answersCount++;
      document.getElementById('host-answers-count').textContent = `${counterPrefix}: ${answersCount} / ${totalPlayers}`;

      const bigSaCounter = document.getElementById('host-sa-big-counter');
      if (bigSaCounter) {
        bigSaCounter.innerHTML = `${answersCount} <span class="text-2xl text-slate-400 font-bold">/ ${totalPlayers}</span>`;
      }

      if (q.type === 'word_cloud') {
        const word = document.createElement('span');
        const cloudColors = ['bg-indigo-600', 'bg-sky-600', 'bg-emerald-600', 'bg-amber-500', 'bg-rose-500'];
        word.className = `${cloudColors[answersCount % cloudColors.length]} text-white px-5 py-2.5 rounded-2xl font-extrabold text-xl sm:text-2xl shadow-md`;
        word.textContent = payload.new.answer_value.text;
        wcWords.appendChild(word);
      }

      if (totalPlayers > 0 && answersCount >= totalPlayers) {
        setTimeout(() => showQuestionResults(), 600);
      }
    })
    .subscribe();

  let timeLeft = q.time_limit;
  document.getElementById('host-timer').textContent = timeLeft;
  clearInterval(hostTimerInterval);
  hostTimerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('host-timer').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(hostTimerInterval);
      showQuestionResults();
    }
  }, 1000);
}

async function showQuestionResults() {
  clearInterval(hostTimerInterval);
  if (activeAnsChannel) {
    sb.removeChannel(activeAnsChannel);
    activeAnsChannel = null;
  }

  setMusicMode('lobby');
  await sb.from('game_sessions').update({ status: 'question_results' }).eq('id', currentSession.id);
  document.getElementById('btn-next-question').classList.remove('hidden');

  const isLast = currentSession.current_question_index >= sessionQuestions.length - 1;
  if (sessionKind !== 'poll' && !isLast) {
    document.getElementById('btn-partial-podium').classList.remove('hidden');
  }

  const q = sessionQuestions[currentSession.current_question_index];
  const isPoll = sessionKind === 'poll' || q.type === 'poll';
  const { data: qAnswers } = await sb
    .from('answers')
    .select('*')
    .eq('session_id', currentSession.id)
    .eq('question_id', q.id);

  const ansList = qAnswers || [];
  const totalVotes = ansList.length;
  if (!isPoll) await refreshLiveLeaderboard();

  const saDisplay = document.getElementById('host-shortanswer-display');

  if (q.type === 'type_answer') {
    const acceptedText = (q.options || []).map(o => o.text).filter(Boolean).join(' · ');
    const correctNum = ansList.filter(a => a.is_correct).length;
    saDisplay.innerHTML = `
      <span class="px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">Respostes acceptades (${correctNum} encerts)</span>
      <p class="text-2xl md:text-3xl font-black text-slate-900">${acceptedText}</p>
    `;
  } else if (q.type === 'puzzle') {
    const correctOrderText = (q.options || []).map(o => o.text).join(' → ');
    const correctNum = ansList.filter(a => a.is_correct).length;
    saDisplay.innerHTML = `
      <span class="px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">Ordre correcte (${correctNum} encerts)</span>
      <p class="text-xl md:text-2xl font-extrabold text-slate-900">${correctOrderText}</p>
    `;
  } else if (q.type === 'nps_scale') {
    const values = ansList.map(a => Number(a.answer_value?.index)).filter(n => !isNaN(n));
    const avg = values.length > 0 ? (values.reduce((acc, v) => acc + v, 0) / values.length).toFixed(1) : '0.0';
    saDisplay.innerHTML = `
      <span class="text-xs font-bold text-slate-500">Mitjana de valoració de l'aula</span>
      <p class="text-5xl md:text-6xl font-black text-indigo-600">${avg} <span class="text-2xl text-slate-400">/ 10</span></p>
      <p class="text-xs font-bold text-slate-500">${values.length} vots registrats</p>
    `;
  } else if (q.type === 'quiz' || q.type === 'true_false' || q.type === 'poll') {
    const counts = q.options.map((_, idx) => ansList.filter(a => a.answer_value?.index === idx).length);
    const maxCount = Math.max(1, ...counts);
    const barColors = ['bg-rose-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500'];
    const barsContainer = document.getElementById('host-bars-display');
    barsContainer.innerHTML = '';
    barsContainer.classList.remove('hidden');

    q.options.forEach((opt, i) => {
      const pct = totalVotes > 0 ? Math.round((counts[i] / totalVotes) * 100) : 0;
      const countEl = document.getElementById(`host-opt-count-${i}`);
      if (countEl) {
        countEl.textContent = isPoll ? `${counts[i]} (${pct}%)` : counts[i];
      }

      const el = document.getElementById(`host-opt-${i}`);
      if (el && !opt.is_correct && !isPoll) {
        el.classList.add('opacity-35');
      }

      const heightPct = Math.round((counts[i] / maxCount) * 100);
      const showCheck = opt.is_correct && !isPoll;
      const labelTop = isPoll ? `${counts[i]} (${pct}%)` : `${counts[i]}`;
      barsContainer.innerHTML += `
        <div class="flex flex-col items-center justify-end h-full w-24 gap-2">
          <span class="font-extrabold text-slate-800 text-xs md:text-sm flex items-center gap-1 whitespace-nowrap">${labelTop}${showCheck ? '<span class="text-emerald-600 font-black">✓</span>' : ''}</span>
          <div style="height: ${heightPct}%" class="w-full min-h-[44px] ${barColors[i%4]} rounded-t-2xl flex items-center justify-center text-white shadow-md transition-all duration-500">
            ${SHAPE_SVGS[i%4]}
          </div>
        </div>
      `;
    });
  }
}

async function showPartialPodium() {
  document.getElementById('host-question-screen').classList.add('hidden');
  document.getElementById('host-partial-podium-screen').classList.remove('hidden');

  const { data: players } = await sb
    .from('players')
    .select('*')
    .eq('session_id', currentSession.id)
    .order('score', { ascending: false })
    .limit(5);

  const listEl = document.getElementById('host-partial-top5-list');
  listEl.innerHTML = '';
  const medals = ['🥇', '🥈', '🥉', '4t/a', '5è/ena'];

  (players || []).forEach((p, idx) => {
    listEl.innerHTML += `
      <div class="flex justify-between items-center bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-200/70">
        <div class="flex items-center gap-3 font-extrabold text-slate-900">
          <span class="text-lg w-10 text-center">${medals[idx]}</span>
          <span class="text-2xl">${p.avatar}</span>
          <span>${p.nickname}</span>
        </div>
        <span class="font-black text-indigo-600 text-lg">${p.score} pts</span>
      </div>
    `;
  });
}

async function showHostPodium() {
  setMusicMode('podium');
  document.getElementById('host-question-screen').classList.add('hidden');
  document.getElementById('host-partial-podium-screen').classList.add('hidden');
  document.getElementById('host-podium-screen').classList.remove('hidden');

  const { data: players } = await sb
    .from('players')
    .select('*')
    .eq('session_id', currentSession.id)
    .order('score', { ascending: false });

  const list = players || [];
  const pillars = document.getElementById('host-podium-pillars');
  pillars.innerHTML = '';

  const order = [1, 0, 2];
  const heights = ['h-40', 'h-56', 'h-32'];
  const bgColors = ['bg-slate-200 text-slate-800', 'bg-amber-400 text-slate-900', 'bg-amber-700/20 text-slate-800'];
  const labels = ['2n/a', '1r/a', '3r/a'];

  order.forEach((playerIdx, colIdx) => {
    const p = list[playerIdx];
    if (!p) return;
    pillars.innerHTML += `
      <div class="flex flex-col items-center w-24 sm:w-36">
        <div class="text-4xl sm:text-5xl mb-2">${p.avatar}</div>
        <p class="font-extrabold text-slate-900 text-sm sm:text-lg truncate w-full">${p.nickname}</p>
        <p class="text-xs font-extrabold text-indigo-600 mb-3">${p.score} pts</p>
        <div class="w-full ${heights[colIdx]} ${bgColors[colIdx]} rounded-t-3xl flex flex-col items-center justify-start pt-4 shadow-inner">
          <span class="text-lg sm:text-2xl font-black">${labels[colIdx]}</span>
        </div>
      </div>
    `;
  });

  const fullRank = document.getElementById('host-full-ranking');
  fullRank.innerHTML = '';
  list.forEach((p, i) => {
    fullRank.innerHTML += `
      <div class="flex justify-between items-center bg-white px-4 py-2.5 rounded-xl border border-slate-100">
        <span class="font-bold text-slate-800 text-sm">${i + 1}. ${p.avatar} ${p.nickname}</span>
        <span class="font-extrabold text-indigo-600 text-sm">${p.score} punts</span>
      </div>
    `;
  });
}

function nextQuestion() {
  launchQuestion(currentSession.current_question_index + 1);
}

window.addEventListener('DOMContentLoaded', async () => {
  initAvatars();
  const params = new URLSearchParams(window.location.search);
  const urlPin = params.get('pin');
  if (urlPin) {
    document.getElementById('input-pin').value = urlPin.slice(0, 6);
  }

  const { data: { session } } = await sb.auth.getSession();
  if (session) loadTeacherDashboard(session.user);
});
