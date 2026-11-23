const SUPABASE_URL = 'https://wbngqwpwkbkokcjefyon.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2GArEBXYf4ompZsqebhE-g_FMQ7mq1e';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STUDENT_STORAGE_KEY = 'domande_active_student_v1';

const AVATARS = [
  '🦊', '🐼', '🦁', '🐸', '🦄', '🚀', '🐙', '🐯', '🦉', '🐢', '🦖', '🐝',
  '🐧', '🐨', '🦋', '🐬', '🦩', '🦔', '🐶', '🐱', '🐵', '🐺', '🐲', '🌟'
];

const EMOJI_CATALOG = [
  { e: '🐶', k: 'gos ca animal mascota' }, { e: '🐱', k: 'gat animal mascota' }, { e: '🐭', k: 'ratoli animal' },
  { e: '🐹', k: 'hamster animal' }, { e: '🐰', k: 'conill animal' }, { e: '🦊', k: 'guineu animal' },
  { e: '🐻', k: 'os animal' }, { e: '🐼', k: 'panda os animal' }, { e: '🐨', k: 'coala animal' },
  { e: '🐯', k: 'tigre animal' }, { e: '🦁', k: 'lleo animal' }, { e: '🐮', k: 'vaca animal granja' },
  { e: '🐷', k: 'porc animal granja' }, { e: '🐸', k: 'granota animal' }, { e: '🐵', k: 'mico animal' },
  { e: '🐔', k: 'gallina pollastre animal granja' }, { e: '🐧', k: 'pingui ocell animal' }, { e: '🐦', k: 'ocell animal' },
  { e: '🦉', k: 'mussol ocell animal' }, { e: '🦆', k: 'anec ocell animal' }, { e: '🦅', k: 'aliga ocell animal' },
  { e: '🐺', k: 'llop animal' }, { e: '🐴', k: 'cavall animal granja' }, { e: '🦄', k: 'unicorn fantasia' },
  { e: '🐝', k: 'abella insecte animal' }, { e: '🦋', k: 'papallona insecte animal' }, { e: '🐌', k: 'cargol animal' },
  { e: '🐞', k: 'marieta insecte animal' }, { e: '🐢', k: 'tortuga reptil animal' }, { e: '🐍', k: 'serp reptil animal' },
  { e: '🦖', k: 'dinosaure t-rex prehistoria' }, { e: '🦕', k: 'dinosaure diplodocus prehistoria' }, { e: '🐙', k: 'pop mar peix' },
  { e: '🐬', k: 'dofi mar animal' }, { e: '🐳', k: 'balena mar animal' }, { e: '🦈', k: 'tauro mar peix' },
  { e: '🐠', k: 'peix mar animal' }, { e: '🦀', k: 'cranc mar animal' }, { e: '🐘', k: 'elefant animal' },
  { e: '🦒', k: 'girafa animal' }, { e: '🦓', k: 'zebra animal' }, { e: '🐊', k: 'cocodril animal' },
  { e: '🍎', k: 'poma fruita vermella menjar' }, { e: '🍏', k: 'poma verda fruita menjar' }, { e: '🍐', k: 'pera fruita menjar' },
  { e: '🍊', k: 'taronja mandarina fruita menjar' }, { e: '🍋', k: 'llimona fruita groga menjar' }, { e: '🍌', k: 'platan banana fruita menjar' },
  { e: '🍉', k: 'sindria fruita estiu menjar' }, { e: '🍇', k: 'raim fruita menjar' }, { e: '🍓', k: 'maduixa fruita menjar' },
  { e: '🍒', k: 'cireres fruita menjar' }, { e: '🍍', k: 'pinya fruita menjar' }, { e: '🥝', k: 'kiwi fruita menjar' },
  { e: '🍅', k: 'tomaquet verdura hortalissa' }, { e: '🥕', k: 'pastanaga verdura hortalissa' }, { e: '🌽', k: 'blat de moro panotxa verdura' },
  { e: '🥦', k: 'broquil verdura' }, { e: '🍞', k: 'pa fleca menjar' }, { e: '🧀', k: 'formatge lacti menjar' },
  { e: '🥚', k: 'ou menjar' }, { e: '🍕', k: 'pizza menjar' }, { e: '🍔', k: 'hamburguesa menjar' },
  { e: '🍦', k: 'gelat postres estiu' }, { e: '🎂', k: 'pastis aniversari festa' }, { e: '🍫', k: 'xocolata dolc' },
  { e: '💧', k: 'aigua gota liquid' }, { e: '🥛', k: 'llet got beguda' }, { e: '☀️', k: 'sol temps estiu astro' },
  { e: '🌙', k: 'lluna nit cel astro' }, { e: '⭐', k: 'estrella cel nit' }, { e: '🌍', k: 'terra planeta mon geografia' },
  { e: '🌈', k: 'arc de sant marti colors pluja' }, { e: '☁️', k: 'nuvol temps cel' }, { e: '🌧️', k: 'pluja nuvol temps' },
  { e: '⛈️', k: 'tempesta llamp tro temps' }, { e: '❄️', k: 'neu fred hivern' }, { e: '🔥', k: 'foc calor flama' },
  { e: '🌲', k: 'arbre pi bosc natura' }, { e: '🌳', k: 'arbre bosc natura' }, { e: '🌻', k: 'gira-sol flor planta' },
  { e: '🌹', k: 'rosa flor sant jordi' }, { e: '🌵', k: 'cactus desert planta' }, { e: '🍄', k: 'bolet tardor bosc' },
  { e: '⚽', k: 'pilota futbol esport' }, { e: '🏀', k: 'basquet pilota esport' }, { e: '🎾', k: 'tennis pilota esport' },
  { e: '🏊', k: 'nedar piscina esport aigua' }, { e: '🚴', k: 'bicicleta ciclisme esport' }, { e: '🎨', k: 'pintura art paleta colors' },
  { e: '🎵', k: 'musica nota canco' }, { e: '🎸', k: 'guitarra instrument musica' }, { e: '🎹', k: 'piano teclat instrument musica' },
  { e: '📚', k: 'llibres lectura escola biblioteca' }, { e: '✏️', k: 'llapis escriure escola' }, { e: '✂️', k: 'tisores retallar escola' },
  { e: '📏', k: 'regle mesurar matematiques' }, { e: '🔬', k: 'microscopi ciencia laboratori' }, { e: '🔭', k: 'telescopi astronomia espai' },
  { e: '🧪', k: 'tub assaig quimica experiment' }, { e: '🧮', k: 'abac calcular matematiques numeros' }, { e: '💻', k: 'ordinador portatil informatica' },
  { e: '📱', k: 'mobil telefon tauleta' }, { e: '🚗', k: 'cotxe vehicle transport' }, { e: '🚌', k: 'autobus transport' },
  { e: '🚲', k: 'bicicleta transport' }, { e: '🚂', k: 'tren locomotora transport' }, { e: '✈️', k: 'avio volar transport' },
  { e: '🚀', k: 'coet espai astronauta' }, { e: '⛵', k: 'vaixell vela mar transport' }, { e: '🏠', k: 'casa llar edifici' },
  { e: '🏫', k: 'escola col·legi edifici' }, { e: '🏥', k: 'hospital metge salut' }, { e: '🏰', k: 'castell historia edat mitjana' },
  { e: '⏰', k: 'rellotge temps hora' }, { e: '💡', k: 'bombeta idea llum electricitat' }, { e: '🔑', k: 'clau obrir pany' },
  { e: '❤️', k: 'cor vermell amor estima' }, { e: '💙', k: 'cor blau' }, { e: '💚', k: 'cor verd' },
  { e: '💛', k: 'cor groc' }, { e: '😊', k: 'cara contenta alegre emocio' }, { e: '😢', k: 'cara trista plorar emocio' },
  { e: '😡', k: 'cara enfadada rabia emocio' }, { e: '😱', k: 'cara por ensurt emocio' }, { e: '😴', k: 'dormir son cansat' },
  { e: '👍', k: 'polze amunt be acord' }, { e: '👎', k: 'polze avall malament' }, { e: '👏', k: 'aplaudir mans' },
  { e: '🏆', k: 'trofeu copa guanyador premi' }, { e: '🥇', k: 'medalla or primer' }, { e: '🎯', k: 'diana objectiu encert' }
];

const TEAM_PRESETS = [
  { name: 'Equip Vermell', color: 'btn-red text-white', icon: '🔥' },
  { name: 'Equip Blau', color: 'btn-blue text-white', icon: '🌊' },
  { name: 'Equip Groc', color: 'btn-yellow text-white', icon: '⚡' },
  { name: 'Equip Verd', color: 'btn-green text-white', icon: '🌿' },
  { name: 'Equip Lila', color: 'bg-purple-600 text-white shadow-md', icon: '🔮' },
  { name: 'Equip Taronja', color: 'bg-orange-500 text-white shadow-md', icon: '🦊' }
];

const SHAPE_SVGS = [
  '<svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L22 20H2L12 3Z"/></svg>',
  '<svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L22 12L12 22L2 12L12 2Z"/></svg>',
  '<svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"/></svg>',
  '<svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>'
];

let selectedAvatar = '🦊';
let currentUser = null;
let currentPlayer = null;
let currentSession = null;
let sessionQuestions = [];
let sessionKind = 'quiz';
let sessionMode = 'individual';
let editorKind = 'quiz';
let editingQuizId = null;
let hostTimerInterval = null;
let activeAnsChannel = null;
let hostBroadcastChannel = null;
let studentRoomChannel = null;
let studentWatchdogInterval = null;
let questionStartTimeMs = 0;
let studentScore = 0;
let studentStreak = 0;
let studentBestStreak = 0;
let studentCorrectCount = 0;
let studentWrongCount = 0;
let studentLastRenderedIndex = -1;
let studentAnsweredCurrentIndex = -1;
let studentFinalShown = false;
let studentPuzzleOrder = [];
let studentDisplayedOptions = [];
let studentLifelinesEnabled = true;
let studentUsed5050 = false;
let studentUsedDouble = false;
let studentActive5050 = false;
let studentActiveDouble = false;
let studentBrainstormSelected = new Set();
let currentReportData = null;
let cachedTeacherQuizzes = [];
let cachedSchoolQuizzes = [];
let cachedSessionsList = [];
let selectedTagFilter = 'all';
let hostPlayersList = [];
let hostRoomLocked = false;
let latestRanksMap = {};
let latestFinalStandings = [];
let hostAnsweredPlayerIds = new Set();
let hostWordCounts = {};
let hostResultsShown = false;
let hostBrainstormIdeas = [];
let hostBrainstormPhase = 'collecting';
let hostBrainstormVotedPlayers = new Set();
let pendingJoinSession = null;
let pendingJoinNickname = '';
let pendingLaunchQuizId = null;
let pendingLaunchKind = 'quiz';
let selectedLaunchMode = 'individual';
let selectedTeamsCount = 4;
let selectedCoopDifficulty = 0.75;
let computedCoopGoal = 5000;
let activeEmojiTargetBtn = null;
let isStudyMode = false;
let studyIndex = 0;
let studyQuizMeta = null;
let studySessionRecord = null;
let studyPlayerRecord = null;

let audioCtx = null;
let musicInterval = null;
let isMusicPlaying = false;
let musicMode = 'lobby';
let musicStep = 0;

function saveStudentSessionSnapshot() {
  if (isStudyMode || !currentSession || !currentPlayer || currentSession.status === 'finished') return;
  try {
    const payload = {
      sessionId: currentSession.id,
      quizId: currentSession.quiz_id,
      pin: currentSession.pin,
      playerId: currentPlayer.id,
      nickname: currentPlayer.nickname,
      avatar: currentPlayer.avatar,
      teamName: currentPlayer.team_name || null,
      score: studentScore,
      streak: studentStreak,
      bestStreak: studentBestStreak,
      correctCount: studentCorrectCount,
      wrongCount: studentWrongCount,
      used5050: studentUsed5050,
      usedDouble: studentUsedDouble,
      answeredIndex: studentAnsweredCurrentIndex,
      lifelinesEnabled: studentLifelinesEnabled,
      questionsOrder: sessionQuestions
    };
    sessionStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {}
}

function clearStudentSessionSnapshot() {
  try {
    sessionStorage.removeItem(STUDENT_STORAGE_KEY);
  } catch (e) {}
}

async function tryRestoreStudentSession() {
  let saved = null;
  try {
    const raw = sessionStorage.getItem(STUDENT_STORAGE_KEY);
    if (raw) saved = JSON.parse(raw);
  } catch (e) {}
  if (!saved || !saved.sessionId || !saved.playerId) return false;

  const [sessionRes, playerRes] = await Promise.all([
    sb.from('game_sessions').select('*').eq('id', saved.sessionId).maybeSingle(),
    sb.from('players').select('*').eq('id', saved.playerId).maybeSingle()
  ]);

  const session = sessionRes.data;
  const player = playerRes.data;

  if (!session || !player || session.status === 'finished' || session.status === 'closed_by_teacher') {
    clearStudentSessionSnapshot();
    return false;
  }

  let qs = Array.isArray(saved.questionsOrder) && saved.questionsOrder.length > 0 ? saved.questionsOrder : null;
  if (!qs) {
    const { data: fetchedQs } = await sb
      .from('questions')
      .select('*')
      .eq('quiz_id', session.quiz_id)
      .order('order_index', { ascending: true });
    qs = fetchedQs || [];
  }

  isStudyMode = false;
  currentSession = session;
  sessionQuestions = qs;
  const interactiveQs = sessionQuestions.filter(q => q.type !== 'slide');
  const isPollActivity = interactiveQs.length > 0 && interactiveQs.every(q => ['poll', 'nps_scale'].includes(q.type) || q.points_multiplier === 0);
  sessionKind = isPollActivity ? 'poll' : 'quiz';
  currentPlayer = player;
  studentScore = Math.max(saved.score || 0, player.score || 0);
  studentStreak = saved.streak || 0;
  studentBestStreak = saved.bestStreak || 0;
  studentCorrectCount = saved.correctCount || 0;
  studentWrongCount = saved.wrongCount || 0;
  studentUsed5050 = Boolean(saved.used5050);
  studentUsedDouble = Boolean(saved.usedDouble);
  studentLifelinesEnabled = typeof saved.lifelinesEnabled === 'boolean' ? saved.lifelinesEnabled : true;
  studentAnsweredCurrentIndex = typeof saved.answeredIndex === 'number' ? saved.answeredIndex : -1;
  studentLastRenderedIndex = -1;
  studentFinalShown = false;

  document.getElementById('student-badge').textContent = player.avatar || selectedAvatar;
  document.getElementById('student-display-name').textContent = player.nickname;
  const teamBadge = document.getElementById('student-team-badge');
  if (player.team_name) {
    teamBadge.textContent = player.team_name;
    teamBadge.classList.remove('hidden');
  } else {
    teamBadge.classList.add('hidden');
  }

  setupStudentRealtimeChannel(session, player);
  startStudentWatchdog();

  if (session.status === 'waiting') {
    showView('view-student-lobby');
  } else if (session.status === 'question_active') {
    if (studentAnsweredCurrentIndex === session.current_question_index) {
      studentLastRenderedIndex = session.current_question_index;
      showView('view-student-play');
      document.getElementById('student-q-counter').textContent = `Pregunta ${session.current_question_index + 1} de ${sessionQuestions.length}`;
      document.getElementById('student-score-pill').textContent = sessionKind === 'poll' ? 'Enquesta' : `${studentScore} punts`;
      document.getElementById('student-q-text').textContent = sessionQuestions[session.current_question_index]?.question_text || '';
      hideAllStudentInputs();
      document.getElementById('student-feedback').classList.remove('hidden');
      document.getElementById('feedback-icon').textContent = '✅';
      document.getElementById('feedback-title').textContent = 'Connexió recuperada!';
      document.getElementById('feedback-points').classList.add('hidden');
      document.getElementById('feedback-streak-badge').classList.add('hidden');
      document.getElementById('feedback-sub').textContent = "Ja havies enviat la resposta d'aquesta pregunta.";
    } else {
      studentLastRenderedIndex = session.current_question_index;
      renderStudentQuestion(session.current_question_index);
    }
  } else if (session.status === 'question_results') {
    studentLastRenderedIndex = session.current_question_index;
    showView('view-student-play');
    document.getElementById('student-q-counter').textContent = `Pregunta ${session.current_question_index + 1} de ${sessionQuestions.length}`;
    document.getElementById('student-score-pill').textContent = sessionKind === 'poll' ? 'Enquesta' : `${studentScore} punts`;
    hideAllStudentInputs();
    document.getElementById('student-feedback').classList.remove('hidden');
    document.getElementById('feedback-icon').textContent = '🔄';
    document.getElementById('feedback-title').textContent = 'Connexió recuperada!';
    document.getElementById('feedback-points').classList.add('hidden');
    document.getElementById('feedback-streak-badge').classList.add('hidden');
    document.getElementById('feedback-sub').textContent = 'Mira la pissarra per veure els resultats.';
    updateStudentLivePosition();
  }

  return true;
}

function parseEmailsList(rawStr) {
  return [...new Set(
    (rawStr || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(s => s.includes('@'))
  )];
}

function formatAuthorLabel(emailStr) {
  if (!emailStr) return 'Docent del centre';
  const namePart = emailStr.split('@')[0] || emailStr;
  return namePart.replace(/[._-]/g, ' ');
}

function shuffleArrayCopy(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isImageUrl(val) {
  const s = (val || '').trim();
  return /^https?:\/\/.+/i.test(s);
}

function renderVisualBadgeHTML(visualStr, sizeClass = 'text-2xl') {
  const v = (visualStr || '').trim();
  if (!v) return '';
  if (isImageUrl(v)) {
    return `<img src="${v.replace(/"/g, '&quot;')}" alt="" class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-white/90 shrink-0 shadow-sm">`;
  }
  return `<span class="${sizeClass} leading-none shrink-0">${v}</span>`;
}

function formatClozeDisplayHTML(sentenceText, revealAnswer = null) {
  const safe = (sentenceText || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const replacement = revealAnswer
    ? `<span class="inline-block px-3 py-0.5 mx-1 bg-emerald-600 text-white rounded-xl font-black">${revealAnswer}</span>`
    : `<span class="inline-block min-w-[90px] px-3 py-0.5 mx-1 border-b-4 border-indigo-600 bg-white text-indigo-600 rounded-lg font-black">?</span>`;
  return safe.replace(/\[\.\.\.\]/g, replacement);
}

function openEmojiPickerForOption(btn) {
  activeEmojiTargetBtn = btn;
  const searchInp = document.getElementById('emoji-search-input');
  if (searchInp) searchInp.value = '';
  renderEmojiGrid('');
  document.getElementById('emoji-picker-modal').classList.remove('hidden');
}

function closeEmojiPickerModal() {
  document.getElementById('emoji-picker-modal').classList.add('hidden');
  activeEmojiTargetBtn = null;
}

function filterEmojiPicker() {
  const term = document.getElementById('emoji-search-input').value;
  renderEmojiGrid(term);
}

function renderEmojiGrid(filterTerm) {
  const grid = document.getElementById('emoji-picker-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const norm = normalizeText(filterTerm);
  const filtered = norm
    ? EMOJI_CATALOG.filter(item => normalizeText(item.k).includes(norm) || item.e.includes(norm))
    : EMOJI_CATALOG;

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-xs text-slate-400 text-center py-6">Cap icona trobada amb aquest nom.</p>`;
    return;
  }

  filtered.forEach(item => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = item.e;
    btn.title = item.k.split(' ')[0];
    btn.className = 'h-12 rounded-2xl bg-slate-50 hover:bg-indigo-100 border border-slate-200/70 flex items-center justify-center text-2xl sm:text-3xl transition active:scale-90';
    btn.onclick = () => {
      if (activeEmojiTargetBtn) {
        const container = activeEmojiTargetBtn.closest('.opt-card-box');
        const hiddenInput = container.querySelector('.opt-visual');
        const previewSpan = container.querySelector('.opt-visual-preview');
        if (hiddenInput) hiddenInput.value = item.e;
        if (previewSpan) previewSpan.textContent = item.e;
      }
      closeEmojiPickerModal();
    };
    grid.appendChild(btn);
  });
}

function clearPickedEmoji() {
  if (activeEmojiTargetBtn) {
    const container = activeEmojiTargetBtn.closest('.opt-card-box');
    const hiddenInput = container.querySelector('.opt-visual');
    const previewSpan = container.querySelector('.opt-visual-preview');
    if (hiddenInput) hiddenInput.value = '';
    if (previewSpan) previewSpan.textContent = '➕';
  }
  closeEmojiPickerModal();
}

function domandeAlert(message, title = 'Avís', icon = '💬') {
  return new Promise(resolve => {
    const modal = document.getElementById('custom-dialog-modal');
    document.getElementById('dialog-icon').textContent = icon;
    document.getElementById('dialog-title').textContent = title;
    document.getElementById('dialog-message').textContent = message;
    const cancelBtn = document.getElementById('dialog-cancel-btn');
    const confirmBtn = document.getElementById('dialog-confirm-btn');
    cancelBtn.classList.add('hidden');
    confirmBtn.textContent = "D'acord";
    confirmBtn.className = "flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-sm shadow-md shadow-indigo-200 transition";
    modal.classList.remove('hidden');
    confirmBtn.onclick = () => {
      modal.classList.add('hidden');
      resolve(true);
    };
  });
}

function domandeConfirm(message, title = 'Confirmació', danger = true) {
  return new Promise(resolve => {
    const modal = document.getElementById('custom-dialog-modal');
    document.getElementById('dialog-icon').textContent = danger ? '⚠️' : '❓';
    document.getElementById('dialog-title').textContent = title;
    document.getElementById('dialog-message').textContent = message;
    const cancelBtn = document.getElementById('dialog-cancel-btn');
    const confirmBtn = document.getElementById('dialog-confirm-btn');
    cancelBtn.classList.remove('hidden');
    confirmBtn.textContent = danger ? 'Sí, confirmar' : 'Acceptar';
    confirmBtn.className = danger
      ? "flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-extrabold text-sm shadow-md shadow-rose-200 transition"
      : "flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-sm shadow-md shadow-indigo-200 transition";
    modal.classList.remove('hidden');
    cancelBtn.onclick = () => {
      modal.classList.add('hidden');
      resolve(false);
    };
    confirmBtn.onclick = () => {
      modal.classList.add('hidden');
      resolve(true);
    };
  });
}

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

function setConnectionWarning(isLost) {
  const overlay = document.getElementById('connection-lost-overlay');
  if (!overlay) return;
  if (isLost) {
    overlay.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
  }
}

window.addEventListener('offline', () => {
  setConnectionWarning(true);
});

window.addEventListener('online', () => {
  setConnectionWarning(false);
});

window.addEventListener('beforeunload', () => {
  if (!isStudyMode && currentSession && currentSession.status !== 'finished' && hostBroadcastChannel) {
    broadcastRoomState('closed_by_teacher', currentSession.current_question_index || 0);
  }
});

function initAvatars() {
  const container = document.getElementById('avatar-selector');
  const studyContainer = document.getElementById('study-avatar-selector');
  const groups = [
    { el: container, preview: document.getElementById('selected-avatar-preview'), cls: 'avatar-btn' },
    { el: studyContainer, preview: document.getElementById('study-avatar-preview'), cls: 'study-avatar-btn' }
  ];
  groups.forEach(group => {
    if (!group.el) return;
    group.el.innerHTML = '';
    AVATARS.forEach((emoji, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = emoji;
      btn.className = idx === 0
        ? `${group.cls} w-11 h-11 shrink-0 rounded-xl bg-indigo-600 text-white shadow-md flex items-center justify-center text-2xl transition`
        : `${group.cls} w-11 h-11 shrink-0 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl transition`;
      btn.onclick = () => {
        selectedAvatar = emoji;
        if (group.preview) group.preview.textContent = emoji;
        document.querySelectorAll(`.${group.cls}`).forEach(b => {
          b.className = `${group.cls} w-11 h-11 shrink-0 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl transition`;
        });
        btn.className = `${group.cls} w-11 h-11 shrink-0 rounded-xl bg-indigo-600 text-white shadow-md flex items-center justify-center text-2xl transition`;
      };
      group.el.appendChild(btn);
    });
  });
}

function openQrModal() {
  const qrEl = document.getElementById('host-qr-img');
  const pinEl = document.getElementById('host-pin-display');
  const modalQr = document.getElementById('modal-qr-img');
  const modalPin = document.getElementById('modal-qr-pin');
  const modal = document.getElementById('qr-modal');
  if (!qrEl || !modal) return;
  modalQr.src = qrEl.src;
  modalPin.textContent = pinEl ? pinEl.textContent : '';
  modal.classList.remove('hidden');
}

function closeQrModal() {
  const modal = document.getElementById('qr-modal');
  if (modal) modal.classList.add('hidden');
}

function openPasswordModal() {
  document.getElementById('new-password-input').value = '';
  document.getElementById('confirm-password-input').value = '';
  document.getElementById('password-modal-error').classList.add('hidden');
  document.getElementById('password-modal').classList.remove('hidden');
}

function closePasswordModal() {
  document.getElementById('password-modal').classList.add('hidden');
}

async function updateTeacherPassword() {
  const p1 = document.getElementById('new-password-input').value;
  const p2 = document.getElementById('confirm-password-input').value;
  const errEl = document.getElementById('password-modal-error');
  const btn = document.getElementById('btn-update-password');
  errEl.classList.add('hidden');

  if (!p1 || p1.length < 6) {
    errEl.textContent = "La nova contrasenya ha de tenir com a mínim 6 caràcters.";
    errEl.classList.remove('hidden');
    return;
  }
  if (p1 !== p2) {
    errEl.textContent = "Les dues contrasenyes no coincideixen.";
    errEl.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  btn.textContent = "Actualitzant...";

  const { error } = await sb.auth.updateUser({ password: p1 });

  btn.disabled = false;
  btn.textContent = "Guardar nova contrasenya";

  if (error) {
    errEl.textContent = `No s'ha pogut actualitzar: ${error.message}`;
    errEl.classList.remove('hidden');
    return;
  }

  closePasswordModal();
  await domandeAlert("La teva contrasenya s'ha actualitzat correctament al sistema.", "Contrasenya actualitzada", "🔐");
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
  const target = document.getElementById(viewId);
  if (target) target.classList.remove('hidden');
}

function stopStudentWatchdog() {
  clearInterval(studentWatchdogInterval);
  studentWatchdogInterval = null;
}

function resetToPinScreen() {
  stopStudentWatchdog();
  clearStudentSessionSnapshot();
  setConnectionWarning(false);
  if (studentRoomChannel) {
    sb.removeChannel(studentRoomChannel);
    studentRoomChannel = null;
  }
  isStudyMode = false;
  studyIndex = 0;
  studyQuizMeta = null;
  studySessionRecord = null;
  studyPlayerRecord = null;
  currentPlayer = null;
  currentSession = null;
  sessionQuestions = [];
  studentScore = 0;
  studentStreak = 0;
  studentBestStreak = 0;
  studentCorrectCount = 0;
  studentWrongCount = 0;
  studentLastRenderedIndex = -1;
  studentAnsweredCurrentIndex = -1;
  studentFinalShown = false;
  studentUsed5050 = false;
  studentUsedDouble = false;
  studentActive5050 = false;
  studentActiveDouble = false;
  latestRanksMap = {};
  latestFinalStandings = [];
  document.getElementById('input-pin').value = '';
  document.getElementById('join-error').classList.add('hidden');
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, '', window.location.pathname);
  }
  showView('view-join');
}

function showStudentSessionClosed(reasonText) {
  clearStudentSessionSnapshot();
  if (studentFinalShown) return;
  stopStudentWatchdog();
  setConnectionWarning(false);
  if (studentRoomChannel) {
    sb.removeChannel(studentRoomChannel);
    studentRoomChannel = null;
  }
  if (currentSession) {
    currentSession.status = 'finished';
  }
  const reasonEl = document.getElementById('student-closed-reason');
  if (reasonEl && reasonText) {
    reasonEl.textContent = reasonText;
  }
  showView('view-student-closed');
}

async function handleLogoClick() {
  const { data: { session } } = await sb.auth.getSession();
  if (session && !isStudyMode) {
    if (currentSession && currentSession.status !== 'finished') {
      await closeHostRoomSilently();
    }
    loadTeacherDashboard(session.user);
  } else {
    resetToPinScreen();
  }
}

async function closeHostRoomSilently() {
  clearInterval(hostTimerInterval);
  if (activeAnsChannel) {
    sb.removeChannel(activeAnsChannel);
    activeAnsChannel = null;
  }
  if (currentSession && currentSession.status !== 'finished') {
    broadcastRoomState('closed_by_teacher', currentSession.current_question_index || 0);
    await sb.from('game_sessions').update({ status: 'finished' }).eq('id', currentSession.id);
    currentSession.status = 'finished';
  }
  if (hostBroadcastChannel) {
    sb.removeChannel(hostBroadcastChannel);
    hostBroadcastChannel = null;
  }
}

async function closeHostRoomAndExit() {
  const ok = await domandeConfirm("Segur que vols tancar aquesta sala i finalitzar la sessió per a tot l'alumnat?", "Tancar sala");
  if (!ok) return;
  await closeHostRoomSilently();
  returnToDashboard();
}

function notifyHostStudentAnswered(questionId, answerValue, isCorrect, pointsAwarded) {
  if (isStudyMode || !studentRoomChannel || !currentPlayer) return;
  studentRoomChannel.send({
    type: 'broadcast',
    event: 'student_answer',
    payload: {
      player_id: currentPlayer.id,
      question_id: questionId,
      answer_value: answerValue,
      is_correct: isCorrect,
      points_awarded: pointsAwarded
    }
  });
}

async function prepareStudyEntry(quizId) {
  const [quizRes, qsRes] = await Promise.all([
    sb.from('quizzes').select('*').eq('id', quizId).single(),
    sb.from('questions').select('*').eq('quiz_id', quizId).order('order_index', { ascending: true })
  ]);

  if (!quizRes.data || !qsRes.data || qsRes.data.length === 0) {
    await domandeAlert("Aquesta activitat no està disponible o no té preguntes.", "Activitat no disponible", "📚");
    return resetToPinScreen();
  }

  if (quizRes.data.kind === 'poll') {
    await domandeAlert("Les enquestes només es poden respondre en directe dins d'una sessió d'aula.", "Mode estudi no disponible", "📊");
    return resetToPinScreen();
  }

  isStudyMode = true;
  studyQuizMeta = quizRes.data;
  sessionQuestions = qsRes.data;
  sessionKind = 'quiz';
  studentLifelinesEnabled = false;

  document.getElementById('study-entry-title').textContent = studyQuizMeta.title;
  document.getElementById('input-study-nickname').value = '';
  document.getElementById('study-entry-error').classList.add('hidden');
  showView('view-study-entry');
}

async function beginRegisteredStudy() {
  const nickname = document.getElementById('input-study-nickname').value.trim();
  const errEl = document.getElementById('study-entry-error');
  const btn = document.getElementById('btn-begin-study');
  errEl.classList.add('hidden');

  if (!nickname) {
    errEl.textContent = "Escriu el teu nom abans de començar el repàs.";
    errEl.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  btn.textContent = "Preparant...";

  const studyPin = `R${Math.floor(10000 + Math.random() * 90000)}`;
  const { data: sessionData, error: sErr } = await sb
    .from('game_sessions')
    .insert({
      quiz_id: studyQuizMeta.id,
      teacher_id: studyQuizMeta.teacher_id,
      pin: studyPin,
      status: 'question_active',
      mode: 'study',
      is_study: true,
      is_locked: true
    })
    .select()
    .single();

  if (sErr || !sessionData) {
    btn.disabled = false;
    btn.textContent = "Començar repàs";
    errEl.textContent = `No s'ha pogut iniciar el registre: ${sErr?.message || 'error de connexió'}`;
    errEl.classList.remove('hidden');
    return;
  }

  const { data: playerData, error: pErr } = await sb
    .from('players')
    .insert({
      session_id: sessionData.id,
      nickname,
      avatar: selectedAvatar,
      score: 0
    })
    .select()
    .single();

  btn.disabled = false;
  btn.textContent = "Començar repàs";

  if (pErr || !playerData) {
    errEl.textContent = `No s'ha pogut registrar l'alumne/a: ${pErr?.message || ''}`;
    errEl.classList.remove('hidden');
    return;
  }

  studySessionRecord = sessionData;
  studyPlayerRecord = playerData;
  currentSession = sessionData;
  currentPlayer = playerData;

  studyIndex = 0;
  studentScore = 0;
  studentStreak = 0;
  studentBestStreak = 0;
  studentCorrectCount = 0;
  studentWrongCount = 0;
  studentFinalShown = false;
  currentSession.current_question_index = 0;

  renderStudentQuestion(0);
}

async function advanceStudyQuestion() {
  studyIndex++;
  if (studyIndex >= sessionQuestions.length) {
    if (studySessionRecord) {
      await sb.from('game_sessions').update({ status: 'finished' }).eq('id', studySessionRecord.id);
    }
    showStudentFinalRank();
    return;
  }
  currentSession.current_question_index = studyIndex;
  renderStudentQuestion(studyIndex);
}

function retryStudyMode() {
  if (!studyQuizMeta) return resetToPinScreen();
  prepareStudyEntry(studyQuizMeta.id);
}

function openStudyModal(quizId) {
  const studyUrl = `${window.location.origin}${window.location.pathname}?study=${quizId}`;
  document.getElementById('study-share-url').value = studyUrl;
  document.getElementById('study-qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(studyUrl)}`;
  document.getElementById('btn-copy-study').textContent = 'Copiar';
  document.getElementById('study-link-modal').classList.remove('hidden');
}

function closeStudyModal() {
  document.getElementById('study-link-modal').classList.add('hidden');
}

function copyStudyUrl() {
  const inp = document.getElementById('study-share-url');
  inp.select();
  navigator.clipboard.writeText(inp.value);
  document.getElementById('btn-copy-study').textContent = 'Copiat!';
}

function setupStudentRealtimeChannel(session, player) {
  if (studentRoomChannel) {
    sb.removeChannel(studentRoomChannel);
  }

  studentRoomChannel = sb.channel('live-session-' + session.id, {
    config: { broadcast: { self: false } }
  })
    .on('broadcast', { event: 'state' }, ({ payload }) => {
      setConnectionWarning(false);
      if (typeof payload.lifelines_enabled === 'boolean') {
        studentLifelinesEnabled = payload.lifelines_enabled;
      }
      if (payload.questions_order && Array.isArray(payload.questions_order)) {
        sessionQuestions = payload.questions_order;
      }
      if (payload.ranks) {
        latestRanksMap = payload.ranks;
      }
      if (payload.standings) {
        latestFinalStandings = payload.standings;
      }
      saveStudentSessionSnapshot();
      if (payload.status === 'brainstorm_voting') {
        renderStudentBrainstormVoting(payload.ideas || []);
        return;
      }
      handleSessionStateChange({
        ...currentSession,
        status: payload.status,
        current_question_index: payload.current_question_index
      });
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${session.id}` }, payload => {
      setConnectionWarning(false);
      handleSessionStateChange(payload.new);
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'players', filter: `id=eq.${player.id}` }, () => {
      showStudentSessionClosed("El/la mestre/a t'ha desconnectat de la sala.");
    })
    .subscribe((status) => {
      if (!currentPlayer || !currentSession || currentSession.status === 'finished' || studentFinalShown) return;
      if (status === 'SUBSCRIBED') {
        setConnectionWarning(false);
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        setConnectionWarning(true);
      }
    });
}

async function joinGame() {
  const pin = document.getElementById('input-pin').value.trim();
  const nickname = document.getElementById('input-nickname').value.trim();
  const errEl = document.getElementById('join-error');
  errEl.classList.add('hidden');

  if (!pin || !nickname) {
    errEl.textContent = "Introdueix el codi PIN i el teu nom.";
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

  if (session.is_locked) {
    errEl.textContent = "Aquesta sala està bloquejada pel/per la mestre/a.";
    errEl.classList.remove('hidden');
    return;
  }

  const modeStr = session.mode || 'individual';
  if (modeStr.startsWith('teams:')) {
    const teamCount = parseInt(modeStr.split(':')[1] || '4');
    pendingJoinSession = session;
    pendingJoinNickname = nickname;
    const grid = document.getElementById('student-teams-grid');
    grid.innerHTML = '';
    TEAM_PRESETS.slice(0, teamCount).forEach(t => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `${t.color} p-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-md transition active:scale-95`;
      btn.innerHTML = `<span>${t.icon}</span> <span>${t.name}</span>`;
      btn.onclick = () => finalizeJoinGame(session, nickname, t.name);
      grid.appendChild(btn);
    });
    showView('view-student-team-select');
    return;
  }

  await finalizeJoinGame(session, nickname, null);
}

async function finalizeJoinGame(session, nickname, teamName) {
  const errEl = document.getElementById('join-error');
  const { data: player, error: pError } = await sb
    .from('players')
    .insert({ session_id: session.id, nickname, avatar: selectedAvatar, score: 0, team_name: teamName })
    .select()
    .single();

  if (pError) {
    showView('view-join');
    if (pError.code === '23505') {
      errEl.textContent = "Aquest nom ja el fa servir un/a altre/a company/a.";
    } else if (pError.code === '42501') {
      errEl.textContent = "La sala s'ha bloquejat o ja ha començat.";
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

  isStudyMode = false;
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
  studentLastRenderedIndex = -1;
  studentAnsweredCurrentIndex = -1;
  studentFinalShown = false;
  studentUsed5050 = false;
  studentUsedDouble = false;
  studentActive5050 = false;
  studentActiveDouble = false;
  studentLifelinesEnabled = true;
  latestRanksMap = {};
  latestFinalStandings = [];

  saveStudentSessionSnapshot();

  document.getElementById('student-badge').textContent = selectedAvatar;
  document.getElementById('student-display-name').textContent = nickname;
  const teamBadge = document.getElementById('student-team-badge');
  if (teamName) {
    teamBadge.textContent = teamName;
    teamBadge.classList.remove('hidden');
  } else {
    teamBadge.classList.add('hidden');
  }
  showView('view-student-lobby');

  setupStudentRealtimeChannel(session, player);
  startStudentWatchdog();
}

function startStudentWatchdog() {
  stopStudentWatchdog();
  studentWatchdogInterval = setInterval(async () => {
    if (isStudyMode || !currentPlayer || !currentSession || currentSession.status === 'finished' || studentFinalShown) {
      stopStudentWatchdog();
      return;
    }

    if (!navigator.onLine) {
      setConnectionWarning(true);
      return;
    }

    const { data, error } = await sb
      .from('game_sessions')
      .select('status, current_question_index')
      .eq('id', currentSession.id)
      .maybeSingle();

    if (error) {
      setConnectionWarning(true);
      return;
    }

    setConnectionWarning(false);

    if (!data) {
      showStudentSessionClosed("La sala s'ha tancat abans d'acabar l'activitat.");
      return;
    }

    if (data.status === 'finished' && currentSession.status !== 'finished') {
      const totalQs = sessionQuestions.length;
      const isNaturalEnd = currentSession.current_question_index >= totalQs - 1 &&
        (currentSession.status === 'question_results' || currentSession.status === 'question_active');
      if (isNaturalEnd) {
        handleSessionStateChange({ ...currentSession, status: 'finished' });
      } else {
        showStudentSessionClosed("El/la mestre/a ha tancat la sessió abans de finalitzar totes les preguntes.");
      }
    }
  }, 4000);
}

function applyCachedStudentRank() {
  if (isStudyMode || !currentPlayer || sessionKind === 'poll') return;
  const info = latestRanksMap[currentPlayer.id];
  if (!info) return;

  const pill = document.getElementById('student-rank-pill');
  if (pill) pill.textContent = `Posició: ${formatRankOrdinal(info.rank)}`;

  const fbPos = document.getElementById('feedback-live-pos');
  if (fbPos && !fbPos.dataset.hideForOpinion) {
    fbPos.textContent = `Vas en la posició ${formatRankOrdinal(info.rank)} de ${info.total}`;
    fbPos.classList.remove('hidden');
  }
}

async function updateStudentLivePosition() {
  if (isStudyMode || !currentSession || !currentPlayer || sessionKind === 'poll') return;
  const { data: allPlayers } = await sb
    .from('players')
    .select('id, score')
    .eq('session_id', currentSession.id)
    .order('score', { ascending: false });

  const list = allPlayers || [];
  if (list.length === 0) return;
  const idx = list.findIndex(p => p.id === currentPlayer.id);
  const rank = idx >= 0 ? idx + 1 : list.length;
  latestRanksMap[currentPlayer.id] = { rank, total: list.length };
  applyCachedStudentRank();
}

function handleSessionStateChange(session) {
  currentSession = session;
  if (session.status === 'closed_by_teacher') {
    showStudentSessionClosed("El/la mestre/a ha tancat la sala a mig joc. Torna a l'inici per entrar a una nova partida.");
    return;
  }

  if (session.status === 'question_active') {
    if (studentLastRenderedIndex === session.current_question_index) return;
    studentLastRenderedIndex = session.current_question_index;
    renderStudentQuestion(session.current_question_index);
  } else if (session.status === 'question_results') {
    const q = sessionQuestions[session.current_question_index];
    if (q && q.type === 'slide') return;
    if (studentAnsweredCurrentIndex === session.current_question_index) {
      applyCachedStudentRank();
      updateStudentLivePosition();
      return;
    }
    const isOpinion = sessionKind === 'poll' || (q && ['word_cloud', 'brainstorm', 'poll', 'nps_scale'].includes(q.type));
    const isFeedbackAlreadyVisible = !document.getElementById('student-feedback').classList.contains('hidden');
    if (!isFeedbackAlreadyVisible) {
      if (!isOpinion && q) {
        studentWrongCount++;
        studentStreak = 0;
        saveStudentSessionSnapshot();
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
      applyCachedStudentRank();
      updateStudentLivePosition();
    }
    document.getElementById('feedback-sub').textContent = "Mira la pissarra per veure els resultats.";
  } else if (session.status === 'finished') {
    stopStudentWatchdog();
    clearStudentSessionSnapshot();
    setConnectionWarning(false);
    if (sessionKind === 'poll') {
      showStudentPollFinished();
    } else {
      showStudentFinalRank();
    }
  }
}

function hideAllStudentInputs() {
  document.getElementById('student-options-grid').classList.add('hidden');
  document.getElementById('student-text-input-box').classList.add('hidden');
  document.getElementById('student-brainstorm-vote-box').classList.add('hidden');
  document.getElementById('student-puzzle-box').classList.add('hidden');
  document.getElementById('student-nps-box').classList.add('hidden');
  document.getElementById('student-slide-box').classList.add('hidden');
  document.getElementById('student-lifelines-bar').classList.add('hidden');
}

function activate5050() {
  if (studentUsed5050) return;
  const wrongIndices = [];
  studentDisplayedOptions.forEach((opt, idx) => {
    if (!opt.is_correct) wrongIndices.push(idx);
  });
  if (wrongIndices.length < 2) return;

  studentUsed5050 = true;
  studentActive5050 = true;
  saveStudentSessionSnapshot();
  const toHide = shuffleArrayCopy(wrongIndices).slice(0, 2);
  const gridBtns = document.getElementById('student-options-grid').children;
  toHide.forEach(idx => {
    if (gridBtns[idx]) {
      gridBtns[idx].disabled = true;
      gridBtns[idx].classList.add('opacity-20', 'pointer-events-none');
    }
  });

  const btn = document.getElementById('btn-lifeline-5050');
  btn.disabled = true;
  btn.textContent = '✂️ 50:50 actiu';
  btn.className = 'px-3.5 py-1.5 rounded-xl bg-sky-600 text-white font-extrabold text-xs';
}

function activateDoubleOrNothing() {
  if (studentUsedDouble) return;
  studentUsedDouble = true;
  studentActiveDouble = true;
  saveStudentSessionSnapshot();
  const btn = document.getElementById('btn-lifeline-double');
  btn.disabled = true;
  btn.textContent = '⚡ Doble o res actiu!';
  btn.className = 'px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-extrabold text-xs animate-pulse';
}

function renderStudentBrainstormVoting(ideasList) {
  hideAllStudentInputs();
  document.getElementById('student-feedback').classList.add('hidden');
  studentBrainstormSelected = new Set();

  const box = document.getElementById('student-brainstorm-vote-box');
  const grid = document.getElementById('student-brainstorm-cards');
  const leftEl = document.getElementById('brainstorm-votes-left');
  leftEl.textContent = '3';
  grid.innerHTML = '';

  if (!ideasList || ideasList.length === 0) {
    document.getElementById('student-feedback').classList.remove('hidden');
    document.getElementById('feedback-icon').textContent = '💡';
    document.getElementById('feedback-title').textContent = 'Cap idea per votar';
    document.getElementById('feedback-sub').textContent = 'Mira la pissarra.';
    return;
  }

  ideasList.forEach(item => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = item.text;
    btn.className = 'p-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-violet-400 font-extrabold text-sm text-slate-800 text-left transition';
    btn.onclick = () => {
      if (studentBrainstormSelected.has(item.key)) {
        studentBrainstormSelected.delete(item.key);
        btn.className = 'p-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-violet-400 font-extrabold text-sm text-slate-800 text-left transition';
      } else {
        if (studentBrainstormSelected.size >= 3) return;
        studentBrainstormSelected.add(item.key);
        btn.className = 'p-3.5 rounded-2xl border-2 border-violet-600 bg-violet-50 font-extrabold text-sm text-violet-900 text-left shadow-sm transition';
      }
      leftEl.textContent = String(3 - studentBrainstormSelected.size);
    };
    grid.appendChild(btn);
  });

  box.classList.remove('hidden');
}

function submitBrainstormVotes() {
  const chosenKeys = [...studentBrainstormSelected];
  hideAllStudentInputs();
  const fb = document.getElementById('student-feedback');
  fb.classList.remove('hidden');
  document.getElementById('feedback-icon').textContent = '🗳️';
  document.getElementById('feedback-title').textContent = 'Vots enviats!';
  document.getElementById('feedback-points').classList.add('hidden');
  document.getElementById('feedback-streak-badge').classList.add('hidden');
  document.getElementById('feedback-live-pos').classList.add('hidden');
  document.getElementById('feedback-sub').textContent = 'Mira la pissarra per veure les idees guanyadores.';

  if (studentRoomChannel && currentPlayer) {
    studentRoomChannel.send({
      type: 'broadcast',
      event: 'brainstorm_vote',
      payload: { player_id: currentPlayer.id, keys: chosenKeys }
    });
  }
}

function showStudentPollFinished() {
  if (studentFinalShown) return;
  studentFinalShown = true;
  document.getElementById('student-end-banner').textContent = 'Enquesta finalitzada';
  document.getElementById('student-end-banner').className = 'inline-block px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-extrabold';
  document.getElementById('student-final-medal').textContent = '🙌';
  document.getElementById('student-final-rank').textContent = 'Participació registrada';
  document.getElementById('student-final-name').textContent = `${currentPlayer?.avatar || selectedAvatar} ${currentPlayer?.nickname || ''}`;
  document.getElementById('student-final-score').classList.add('hidden');
  document.getElementById('student-chart-and-stats').classList.add('hidden');
  document.getElementById('student-final-leaderboard-box').classList.add('hidden');
  document.getElementById('student-final-msg').textContent = "Moltes gràcies per la teva participació!";
  document.getElementById('btn-study-retry').classList.add('hidden');
  showView('view-student-podium');
}

function renderStudentFinalStandingsList(list) {
  const medals = ['🥇', '🥈', '🥉'];
  const myIndex = list.findIndex(p => p.id === currentPlayer?.id);
  const rank = myIndex >= 0 ? myIndex + 1 : (latestRanksMap[currentPlayer?.id]?.rank || 1);
  const totalCount = list.length || (latestRanksMap[currentPlayer?.id]?.total || 1);

  document.getElementById('student-final-medal').textContent = medals[rank - 1] || '🏆';
  document.getElementById('student-final-rank').textContent = isStudyMode
    ? 'Mode estudi autònom'
    : `Posició ${formatRankOrdinal(rank)} de ${totalCount}`;

  if (isStudyMode) {
    document.getElementById('student-final-msg').textContent = "Has completat totes les preguntes de repàs i la teva puntuació ha quedat enregistrada!";
  } else if (rank === 1) {
    document.getElementById('student-final-msg').textContent = "Enhorabona! Has acabat el qüestionari en primera posició.";
  } else if (rank <= 3) {
    document.getElementById('student-final-msg').textContent = "Molt bona feina! Has aconseguit pujar al podi de la classe.";
  } else {
    document.getElementById('student-final-msg').textContent = "Qüestionari completat! Revisa els teus encerts i continua practicant.";
  }

  const rankBox = document.getElementById('student-final-leaderboard-box');
  const rankList = document.getElementById('student-final-ranking-list');
  if (isStudyMode || list.length === 0) {
    rankBox.classList.add('hidden');
    return;
  }

  rankBox.classList.remove('hidden');
  rankList.innerHTML = '';

  list.forEach((p, idx) => {
    const isMe = p.id === currentPlayer?.id;
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
}

async function showStudentFinalRank() {
  if (studentFinalShown) return;
  studentFinalShown = true;

  document.getElementById('student-end-banner').textContent = isStudyMode ? 'Repàs finalitzat' : 'Qüestionari finalitzat';
  document.getElementById('student-end-banner').className = 'inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-extrabold';
  document.getElementById('student-final-name').textContent = `${currentPlayer?.avatar || selectedAvatar} ${currentPlayer?.nickname || ''}`;
  document.getElementById('student-final-score').classList.remove('hidden');
  document.getElementById('student-final-score').textContent = `${studentScore} punts`;

  if (isStudyMode) {
    document.getElementById('btn-study-retry').classList.remove('hidden');
  } else {
    document.getElementById('btn-study-retry').classList.add('hidden');
  }

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

  const initialStandings = latestFinalStandings.length > 0
    ? latestFinalStandings
    : [{ id: currentPlayer?.id, nickname: currentPlayer?.nickname || '', avatar: currentPlayer?.avatar || selectedAvatar, score: studentScore }];
  renderStudentFinalStandingsList(initialStandings);
  showView('view-student-podium');

  if (!isStudyMode && currentSession) {
    const { data: allPlayers } = await sb
      .from('players')
      .select('id, nickname, avatar, score')
      .eq('session_id', currentSession.id)
      .order('score', { ascending: false });

    if (allPlayers && allPlayers.length > 0) {
      renderStudentFinalStandingsList(allPlayers);
    }
  }
}

function renderStudentQuestion(qIndex) {
  const q = sessionQuestions[qIndex];
  if (!q) return;

  questionStartTimeMs = Date.now();
  studentAnsweredCurrentIndex = -1;
  studentActive5050 = false;
  studentActiveDouble = false;
  showView('view-student-play');
  document.getElementById('student-feedback').classList.add('hidden');
  hideAllStudentInputs();
  document.getElementById('student-q-counter').textContent = `Pregunta ${qIndex + 1} de ${sessionQuestions.length}`;
  
  const scorePill = document.getElementById('student-score-pill');
  const rankPill = document.getElementById('student-rank-pill');
  const streakPill = document.getElementById('student-streak-pill');
  const teamPill = document.getElementById('student-play-team-pill');
  const typeBadge = document.getElementById('student-type-badge');
  const speedBadge = document.getElementById('student-speed-badge');
  const cloudHint = document.getElementById('student-cloud-hint');
  const clozeBox = document.getElementById('student-cloze-sentence');

  if (currentPlayer?.team_name && !isStudyMode) {
    teamPill.textContent = currentPlayer.team_name;
    teamPill.classList.remove('hidden');
  } else {
    teamPill.classList.add('hidden');
  }

  if (q.type === 'word_cloud' || q.type === 'brainstorm') {
    typeBadge.innerHTML = q.type === 'brainstorm'
      ? `<span>💡</span><span>Pluja d'idees</span>`
      : `<span>☁️</span><span>Núvol de paraules</span>`;
    typeBadge.classList.remove('hidden');
    cloudHint.classList.remove('hidden');
  } else {
    typeBadge.classList.add('hidden');
    cloudHint.classList.add('hidden');
  }

  if (q.time_limit > 0 && q.time_limit <= 7 && q.type !== 'slide') {
    speedBadge.classList.remove('hidden');
  } else {
    speedBadge.classList.add('hidden');
  }

  if (sessionKind === 'poll') {
    scorePill.textContent = 'Enquesta';
    scorePill.className = 'px-3.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-extrabold';
    rankPill.classList.add('hidden');
    streakPill.classList.add('hidden');
  } else {
    scorePill.textContent = `${studentScore} punts`;
    scorePill.className = 'px-3.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-extrabold';
    if (isStudyMode) {
      rankPill.textContent = 'Mode repàs';
      rankPill.classList.remove('hidden');
    } else {
      rankPill.classList.remove('hidden');
      applyCachedStudentRank();
    }
    if (studentStreak >= 2) {
      streakPill.textContent = `🔥 Ratxa x${studentStreak}`;
      streakPill.classList.remove('hidden');
    } else {
      streakPill.classList.add('hidden');
    }
  }

  document.getElementById('student-q-text').textContent = q.question_text;
  const stImg = document.getElementById('student-q-image');
  if (q.media_url && isStudyMode) {
    stImg.src = q.media_url;
    stImg.classList.remove('hidden');
  } else {
    stImg.classList.add('hidden');
  }

  if (q.type === 'cloze') {
    const template = q.options?.[0]?.sentence || '';
    clozeBox.innerHTML = formatClozeDisplayHTML(template);
    clozeBox.classList.remove('hidden');
  } else {
    clozeBox.classList.add('hidden');
  }

  const rawValidOptions = (q.options || [])
    .map((o, origIdx) => ({ ...o, origIdx }))
    .filter(o => (o.text || '').trim() !== '' || (o.visual || '').trim() !== '');

  const shouldShuffleOpts = !isStudyMode && sessionKind === 'quiz' && Boolean(currentSession?.shuffle_options) && q.type === 'quiz';
  studentDisplayedOptions = shouldShuffleOpts ? shuffleArrayCopy(rawValidOptions) : rawValidOptions;

  const isCoopMode = (currentSession?.mode || '').startsWith('coop:');
  const isGradableChoice = sessionKind === 'quiz' && !isStudyMode && (q.points_multiplier !== 0 || isCoopMode) && ['quiz', 'true_false', 'puzzle', 'type_answer', 'cloze'].includes(q.type);
  if (isGradableChoice && studentLifelinesEnabled && (!studentUsed5050 || !studentUsedDouble)) {
    const bar = document.getElementById('student-lifelines-bar');
    const b50 = document.getElementById('btn-lifeline-5050');
    const bDbl = document.getElementById('btn-lifeline-double');
    bar.classList.remove('hidden');

    if (!studentUsed5050 && q.type === 'quiz' && rawValidOptions.length >= 3) {
      b50.classList.remove('hidden');
      b50.disabled = false;
      b50.textContent = '✂️ 50:50';
      b50.className = 'px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-extrabold text-xs transition';
    } else {
      b50.classList.add('hidden');
    }

    if (!studentUsedDouble) {
      bDbl.classList.remove('hidden');
      bDbl.disabled = false;
      bDbl.textContent = '⚡ Doble o res';
      bDbl.className = 'px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-extrabold text-xs transition';
    } else {
      bDbl.classList.add('hidden');
    }
  }

  if (q.type === 'slide') {
    document.getElementById('student-slide-box').classList.remove('hidden');
    document.getElementById('student-slide-body').textContent = q.options?.[0]?.text || 'Para atenció a la pissarra mentre el/la mestre/a explica aquest punt.';
    if (isStudyMode) {
      document.getElementById('btn-study-next-slide').classList.remove('hidden');
    } else {
      document.getElementById('btn-study-next-slide').classList.add('hidden');
    }
  } else if (q.type === 'quiz' || q.type === 'true_false' || q.type === 'poll') {
    const grid = document.getElementById('student-options-grid');
    grid.innerHTML = '';
    grid.classList.remove('hidden');
    const colors = ['btn-red', 'btn-blue', 'btn-yellow', 'btn-green'];

    studentDisplayedOptions.forEach((opt, displayIdx) => {
      const btn = document.createElement('button');
      const colorIdx = opt.origIdx % 4;
      btn.className = `btn-opt ${colors[colorIdx]} text-white rounded-3xl p-5 sm:p-6 text-lg sm:text-xl md:text-2xl font-extrabold flex items-center gap-3.5 text-left transition`;
      const visualHTML = renderVisualBadgeHTML(opt.visual, 'text-3xl sm:text-4xl');
      btn.innerHTML = `
        <div class="w-10 h-10 rounded-2xl bg-black/15 flex items-center justify-center shrink-0">${SHAPE_SVGS[colorIdx]}</div>
        ${visualHTML}
        <span class="leading-snug">${opt.text}</span>
      `;
      btn.onclick = () => submitOptionAnswer(q, displayIdx);
      grid.appendChild(btn);
    });
  } else if (q.type === 'puzzle') {
    document.getElementById('student-puzzle-box').classList.remove('hidden');
    studentPuzzleOrder = rawValidOptions.map((o, idx) => ({ text: o.text.trim(), origIdx: idx }));
    if (studentPuzzleOrder.length === 2) {
      [studentPuzzleOrder[0], studentPuzzleOrder[1]] = [studentPuzzleOrder[1], studentPuzzleOrder[0]];
    } else if (studentPuzzleOrder.length > 2) {
      studentPuzzleOrder = shuffleArrayCopy(studentPuzzleOrder);
      if (studentPuzzleOrder.every((item, idx) => item.origIdx === idx)) {
        [studentPuzzleOrder[0], studentPuzzleOrder[1]] = [studentPuzzleOrder[1], studentPuzzleOrder[0]];
      }
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
    if (q.type === 'word_cloud' || q.type === 'brainstorm') {
      inp.placeholder = 'Escriu la teva idea o paraula...';
    } else if (q.type === 'cloze') {
      inp.placeholder = 'Escriu la paraula que falta al buit...';
    } else {
      inp.placeholder = 'Escriu aquí la teva resposta...';
    }
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

function getCorrectSolutionText(q) {
  if (!q) return '';
  if (q.type === 'puzzle') return (q.options || []).filter(o => (o.text || '').trim()).map(o => o.text).join(' → ');
  return (q.options || []).filter(o => o.is_correct).map(o => o.text).join(', ');
}

function calculateGamifiedPoints(question, isCorrect) {
  if (sessionKind === 'poll') return 0;
  const isCoopMode = (currentSession?.mode || '').startsWith('coop:');
  const effectiveMultiplier = (isCoopMode && question.points_multiplier === 0) ? 1 : question.points_multiplier;
  if (effectiveMultiplier === 0) return 0;

  let ratio = 1;
  if (question.time_limit > 0) {
    const elapsedSec = Math.max(0, (Date.now() - questionStartTimeMs) / 1000);
    ratio = Math.max(0.4, 1 - (elapsedSec / (question.time_limit * 1.5)));
  }

  const streakBonus = isCorrect ? studentStreak * 100 : 0;
  let base = Math.round((1000 * ratio + streakBonus) * effectiveMultiplier);

  if (studentActive5050) {
    base = Math.round(base * 0.5);
  }
  if (studentActiveDouble) {
    return isCorrect ? base * 2 : -base;
  }
  return isCorrect ? base : 0;
}

async function persistStudentAnswerAndScore(questionId, answerVal, isCorrect, points) {
  if (!currentSession || !currentPlayer) return;
  saveStudentSessionSnapshot();
  const { error } = await sb.from('answers').insert({
    session_id: currentSession.id,
    question_id: questionId,
    player_id: currentPlayer.id,
    answer_value: answerVal,
    is_correct: isCorrect,
    points_awarded: points
  });

  if (error) {
    if (!isStudyMode) setConnectionWarning(true);
    return;
  }

  if (sessionKind !== 'poll') {
    await sb.from('players').update({ score: studentScore }).eq('id', currentPlayer.id);
    if (!isStudyMode) updateStudentLivePosition();
  }
}

async function submitPuzzleAnswer() {
  const qIndex = currentSession.current_question_index;
  if (studentAnsweredCurrentIndex === qIndex) return;
  studentAnsweredCurrentIndex = qIndex;

  const q = sessionQuestions[qIndex];
  const isCorrect = studentPuzzleOrder.every((item, idx) => item.origIdx === idx);
  const userSequenceText = studentPuzzleOrder.map(i => i.text).join(' → ');
  const answerVal = { text: userSequenceText };

  registerStudentOutcome(isCorrect);
  const points = calculateGamifiedPoints(q, isCorrect);
  studentScore = Math.max(0, studentScore + points);
  document.getElementById('student-score-pill').textContent = `${studentScore} punts`;
  showStudentWaitingFeedback(isCorrect, points, false, q);

  if (!isStudyMode) notifyHostStudentAnswered(q.id, answerVal, isCorrect, points);
  await persistStudentAnswerAndScore(q.id, answerVal, isCorrect, points);
}

async function submitNpsAnswer(question, val) {
  const qIndex = currentSession.current_question_index;
  if (studentAnsweredCurrentIndex === qIndex) return;
  studentAnsweredCurrentIndex = qIndex;

  const answerVal = { index: val, text: `${val} / 10` };
  showStudentWaitingFeedback(false, 0, true, question);
  if (!isStudyMode) notifyHostStudentAnswered(question.id, answerVal, false, 0);
  await persistStudentAnswerAndScore(question.id, answerVal, false, 0);
}

async function submitOptionAnswer(question, displayIndex) {
  const qIndex = currentSession.current_question_index;
  if (studentAnsweredCurrentIndex === qIndex) return;
  studentAnsweredCurrentIndex = qIndex;

  const chosen = studentDisplayedOptions[displayIndex];
  if (!chosen) return;

  const isPoll = sessionKind === 'poll' || question.type === 'poll';
  const isCorrect = isPoll ? false : Boolean(chosen.is_correct);
  const answerVal = { index: chosen.origIdx, text: chosen.text || chosen.visual || '' };
  
  if (!isPoll) {
    registerStudentOutcome(isCorrect);
  }

  const points = calculateGamifiedPoints(question, isCorrect);
  studentScore = Math.max(0, studentScore + points);
  if (!isPoll) {
    document.getElementById('student-score-pill').textContent = `${studentScore} punts`;
  }
  showStudentWaitingFeedback(isCorrect, points, isPoll, question);

  if (!isStudyMode) notifyHostStudentAnswered(question.id, answerVal, isCorrect, points);
  await persistStudentAnswerAndScore(question.id, answerVal, isCorrect, points);
}

async function submitTextAnswer() {
  const val = document.getElementById('student-text-answer').value.trim();
  if (!val) return;
  const qIndex = currentSession.current_question_index;
  if (studentAnsweredCurrentIndex === qIndex) return;
  studentAnsweredCurrentIndex = qIndex;

  const q = sessionQuestions[qIndex];
  const isOpinion = sessionKind === 'poll' || q.type === 'word_cloud' || q.type === 'brainstorm';
  const answerVal = { text: val };
  
  let isCorrect = false;
  if (!isOpinion && (q.type === 'type_answer' || q.type === 'cloze')) {
    isCorrect = evaluateShortAnswer(val, q);
  }

  if (!isOpinion) {
    registerStudentOutcome(isCorrect);
  }

  const points = calculateGamifiedPoints(q, isCorrect);
  studentScore = Math.max(0, studentScore + points);
  if (!isOpinion) {
    document.getElementById('student-score-pill').textContent = `${studentScore} punts`;
  }
  showStudentWaitingFeedback(isCorrect, points, isOpinion, q);

  if (!isStudyMode) notifyHostStudentAnswered(q.id, answerVal, isCorrect, points);
  await persistStudentAnswerAndScore(q.id, answerVal, isCorrect, points);
}

function showStudentWaitingFeedback(isCorrect, points, isOpinion, questionObj = null) {
  hideAllStudentInputs();
  const fb = document.getElementById('student-feedback');
  const ptsEl = document.getElementById('feedback-points');
  const streakEl = document.getElementById('feedback-streak-badge');
  const streakPill = document.getElementById('student-streak-pill');
  const fbPos = document.getElementById('feedback-live-pos');
  const fbSub = document.getElementById('feedback-sub');
  const studyNextBtn = document.getElementById('btn-study-next');
  const revealEl = document.getElementById('feedback-correct-reveal');
  fb.classList.remove('hidden');

  if (isStudyMode) {
    fbPos.classList.add('hidden');
    fbSub.classList.add('hidden');
    studyNextBtn.classList.remove('hidden');
  } else {
    fbSub.classList.remove('hidden');
    fbSub.textContent = "Esperant la resta de companys i companyes...";
    studyNextBtn.classList.add('hidden');
  }

  if (isOpinion) {
    document.getElementById('feedback-icon').textContent = '🗳️';
    document.getElementById('feedback-title').textContent = 'Resposta registrada!';
    ptsEl.classList.add('hidden');
    streakEl.classList.add('hidden');
    revealEl.classList.add('hidden');
    fbPos.dataset.hideForOpinion = '1';
    fbPos.classList.add('hidden');
  } else if (isCorrect) {
    fbPos.dataset.hideForOpinion = '';
    revealEl.classList.add('hidden');
    document.getElementById('feedback-icon').textContent = studentStreak >= 3 ? '🔥' : '🎉';
    document.getElementById('feedback-title').textContent = studentStreak >= 2 ? `Encertat! Portes ${studentStreak} seguides` : 'Molt bé, encertat!';
    ptsEl.textContent = `+${points} punts`;
    ptsEl.className = 'text-base font-extrabold text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full';
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
    document.getElementById('feedback-icon').textContent = points < 0 ? '💥' : '💡';
    document.getElementById('feedback-title').textContent = points < 0 ? 'Doble o res fallat!' : 'No passa res, seguim!';
    ptsEl.textContent = points < 0 ? `${points} punts` : '+0 punts';
    ptsEl.className = points < 0
      ? 'text-base font-extrabold text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full'
      : 'text-base font-extrabold text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full';
    ptsEl.classList.remove('hidden');
    streakEl.classList.add('hidden');
    streakPill.classList.add('hidden');
    if (isStudyMode && questionObj) {
      const sol = getCorrectSolutionText(questionObj);
      if (sol) {
        revealEl.textContent = `Resposta correcta: ${sol}`;
        revealEl.classList.remove('hidden');
      } else {
        revealEl.classList.add('hidden');
      }
    } else {
      revealEl.classList.add('hidden');
    }
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
  currentUser = null;
  await sb.auth.signOut();
  showView('view-join');
}

async function returnToDashboard() {
  if (currentSession && currentSession.status !== 'finished') {
    await closeHostRoomSilently();
  }
  const { data: { user } } = await sb.auth.getUser();
  if (user) loadTeacherDashboard(user);
}

function switchDashTab(tab) {
  const qWrap = document.getElementById('dash-quizzes-wrapper');
  const sWrap = document.getElementById('dash-school-wrapper');
  const rTab = document.getElementById('dash-tab-results');
  const qBtn = document.getElementById('tab-btn-quizzes');
  const sBtn = document.getElementById('tab-btn-school');
  const rBtn = document.getElementById('tab-btn-results');
  const qInd = document.getElementById('indicator-tab-quizzes');
  const sInd = document.getElementById('indicator-tab-school');
  const rInd = document.getElementById('indicator-tab-results');

  const inactiveClass = "relative bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md flex flex-col items-center text-center transition hover:-translate-y-0.5";
  qBtn.className = inactiveClass;
  sBtn.className = inactiveClass;
  rBtn.className = inactiveClass;
  if (qInd) qInd.className = "w-6 h-1 rounded-full bg-transparent mt-2";
  if (sInd) sInd.className = "w-6 h-1 rounded-full bg-transparent mt-2";
  if (rInd) rInd.className = "w-6 h-1 rounded-full bg-transparent mt-2";

  qWrap.classList.add('hidden');
  sWrap.classList.add('hidden');
  rTab.classList.add('hidden');

  if (tab === 'quizzes') {
    qWrap.classList.remove('hidden');
    qBtn.className = "relative bg-white p-3.5 sm:p-4 rounded-3xl border-2 border-blue-600 shadow-md shadow-blue-100/60 flex flex-col items-center text-center transition hover:-translate-y-0.5";
    if (qInd) qInd.className = "w-6 h-1 rounded-full bg-blue-600 mt-2";
  } else if (tab === 'school') {
    sWrap.classList.remove('hidden');
    sBtn.className = "relative bg-white p-3.5 sm:p-4 rounded-3xl border-2 border-teal-600 shadow-md shadow-teal-100/60 flex flex-col items-center text-center transition hover:-translate-y-0.5";
    if (sInd) sInd.className = "w-6 h-1 rounded-full bg-teal-600 mt-2";
    renderSchoolQuizzes();
  } else {
    rTab.classList.remove('hidden');
    rBtn.className = "relative bg-white p-3.5 sm:p-4 rounded-3xl border-2 border-violet-600 shadow-md shadow-violet-100/60 flex flex-col items-center text-center transition hover:-translate-y-0.5";
    if (rInd) rInd.className = "w-6 h-1 rounded-full bg-violet-600 mt-2";
    loadSessionsHistory();
  }
}

async function loadTeacherDashboard(user) {
  currentUser = user;
  document.getElementById('teacher-email-display').textContent = user.email;
  showView('view-teacher-dash');
  switchDashTab('quizzes');

  const userEmailLower = (user.email || '').trim().toLowerCase();

  let myQuizzesRes = await sb
    .from('quizzes')
    .select('id, title, kind, tag, shared_with, author_email, teacher_id, created_at')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false });

  if (myQuizzesRes.error && myQuizzesRes.error.message && myQuizzesRes.error.message.includes('shared_with')) {
    myQuizzesRes = await sb
      .from('quizzes')
      .select('id, title, kind, tag, is_shared, teacher_id, created_at')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false });
  }

  let sharedWithMeRes = await sb
    .from('quizzes')
    .select('id, title, kind, tag, shared_with, author_email, teacher_id, created_at')
    .contains('shared_with', [userEmailLower])
    .order('created_at', { ascending: false });

  if (sharedWithMeRes.error) {
    sharedWithMeRes = { data: [], error: null };
  }

  const sessionsRes = await sb
    .from('game_sessions')
    .select('id, pin, status, mode, is_study, created_at, quiz_id')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false });

  if (myQuizzesRes.error) {
    document.getElementById('dash-tab-quizzes').innerHTML = `<p class="text-rose-600 text-sm col-span-full">Error carregant activitats: ${myQuizzesRes.error.message}</p>`;
    return;
  }

  cachedTeacherQuizzes = myQuizzesRes.data || [];
  cachedSchoolQuizzes = sharedWithMeRes.data || [];
  cachedSessionsList = sessionsRes.data || [];

  const qBadge = document.getElementById('badge-count-quizzes');
  if (qBadge) qBadge.textContent = cachedTeacherQuizzes.length;

  const sBadge = document.getElementById('badge-count-school');
  if (sBadge) {
    if (cachedSchoolQuizzes.length > 0) {
      sBadge.textContent = cachedSchoolQuizzes.length;
      sBadge.classList.remove('hidden');
    } else {
      sBadge.classList.add('hidden');
    }
  }

  const rBadge = document.getElementById('badge-count-results');
  if (rBadge) {
    if (cachedSessionsList.length > 0) {
      rBadge.textContent = cachedSessionsList.length;
      rBadge.classList.remove('hidden');
    } else {
      rBadge.classList.add('hidden');
    }
  }

  selectedTagFilter = 'all';
  const sMy = document.getElementById('search-my-quizzes');
  const sSh = document.getElementById('search-shared-quizzes');
  const sRe = document.getElementById('search-results-history');
  if (sMy) sMy.value = '';
  if (sSh) sSh.value = '';
  if (sRe) sRe.value = '';

  renderTagFilters();
  renderFilteredQuizzes();
}

function renderTagFilters() {
  const filterBar = document.getElementById('dash-tags-filter');
  const tags = [...new Set(cachedTeacherQuizzes.map(q => (q.tag || '').trim()).filter(Boolean))];
  filterBar.innerHTML = '';

  if (tags.length === 0) return;

  const allBtn = document.createElement('button');
  allBtn.textContent = 'Totes';
  allBtn.className = selectedTagFilter === 'all'
    ? 'px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition'
    : 'px-3 py-1.5 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 text-xs font-bold transition';
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
      ? 'px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold transition'
      : 'px-3 py-1.5 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 text-xs font-bold transition';
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

  const searchTerm = normalizeText(document.getElementById('search-my-quizzes')?.value || '');

  const filtered = cachedTeacherQuizzes.filter(q => {
    const matchesTag = selectedTagFilter === 'all' || (q.tag || '').trim() === selectedTagFilter;
    const matchesSearch = !searchTerm ||
      normalizeText(q.title).includes(searchTerm) ||
      normalizeText(q.tag || '').includes(searchTerm);
    return matchesTag && matchesSearch;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div class="col-span-full bg-white p-10 rounded-3xl text-center border border-slate-200 text-slate-500">Cap activitat coincideix amb la cerca o filtre actual.</div>`;
    return;
  }

  filtered.forEach(q => {
    const isPoll = q.kind === 'poll';
    const sharedList = Array.isArray(q.shared_with) ? q.shared_with : [];
    const safeTitle = q.title.replace(/'/g, "\\'");
    const card = document.createElement('div');
    card.className = "bg-white p-6 rounded-3xl flex flex-col justify-between gap-4 border border-slate-200/80 shadow-sm hover:shadow-md transition";
    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="px-2.5 py-1 ${isPoll ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-600'} rounded-lg text-xs font-bold">${isPoll ? 'Enquesta' : 'Qüestionari'}</span>
          ${sharedList.length > 0 ? `<span title="Compartit amb: ${sharedList.join(', ')}" class="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold">Compartit (${sharedList.length})</span>` : ''}
          ${q.tag ? `<span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">${q.tag}</span>` : ''}
        </div>
        <h3 class="font-extrabold text-xl text-slate-900">${q.title}</h3>
        <p class="text-xs text-slate-400">Creat el ${formatDateTime(q.created_at)}</p>
      </div>

      <div class="space-y-2 pt-2 border-t border-slate-100">
        ${isPoll ? `
          <button onclick="openLaunchModal('${q.id}', 'poll', '${safeTitle}')" class="w-full bg-amber-500 hover:bg-amber-600 shadow-amber-100 text-white py-3 rounded-2xl font-bold text-sm shadow-md transition">
            Obrir enquesta
          </button>
        ` : `
          <div class="grid grid-cols-3 gap-2">
            <button onclick="openLaunchModal('${q.id}', 'quiz', '${safeTitle}')" class="col-span-2 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 text-white py-3 rounded-2xl font-bold text-sm shadow-md transition">
              Obrir sala
            </button>
            <button onclick="openStudyModal('${q.id}')" title="Enllaç de repàs autònom" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-3 rounded-2xl font-extrabold text-xs transition">
              Repàs
            </button>
          </div>
        `}
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

function renderSchoolQuizzes() {
  const list = document.getElementById('dash-tab-school');
  list.innerHTML = '';

  const searchTerm = normalizeText(document.getElementById('search-shared-quizzes')?.value || '');
  const filtered = cachedSchoolQuizzes.filter(q => {
    return !searchTerm ||
      normalizeText(q.title).includes(searchTerm) ||
      normalizeText(q.tag || '').includes(searchTerm) ||
      normalizeText(q.author_email || '').includes(searchTerm);
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div class="col-span-full bg-white p-10 rounded-3xl text-center border border-slate-200 text-slate-500">No hi ha cap element compartit amb el teu correu electrònic.</div>`;
    return;
  }

  const myIds = new Set(cachedTeacherQuizzes.map(item => item.id));

  filtered.forEach(q => {
    const isPoll = q.kind === 'poll';
    const isMine = myIds.has(q.id) || (currentUser && q.teacher_id === currentUser.id);
    const authorDisplay = isMine
      ? 'Tu (propietari/a)'
      : formatAuthorLabel(q.author_email);
    const safeTitle = q.title.replace(/'/g, "\\'");
    const card = document.createElement('div');
    card.className = "bg-white p-6 rounded-3xl flex flex-col justify-between gap-4 border border-teal-200/80 shadow-sm hover:shadow-md transition";
    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="px-2.5 py-1 ${isPoll ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-600'} rounded-lg text-xs font-bold">${isPoll ? 'Enquesta' : 'Qüestionari'}</span>
          <span class="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold">Compartit per: ${authorDisplay}</span>
          ${q.tag ? `<span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">${q.tag}</span>` : ''}
        </div>
        <h3 class="font-extrabold text-xl text-slate-900">${q.title}</h3>
        <p class="text-xs text-slate-400">Compartit el ${formatDateTime(q.created_at)}</p>
      </div>

      <div class="space-y-2 pt-2 border-t border-slate-100">
        <div class="grid grid-cols-2 gap-2">
          <button onclick="openLaunchModal('${q.id}', '${q.kind || 'quiz'}', '${safeTitle}')" class="${isPoll ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2.5 rounded-2xl font-bold text-xs transition">
            ${isPoll ? 'Obrir enquesta' : 'Obrir sala'}
          </button>
          <button onclick="duplicateQuiz('${q.id}')" class="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 py-2.5 rounded-2xl font-extrabold text-xs transition">
            Clonar al meu espai
          </button>
        </div>
        ${isMine ? `
          <div class="grid grid-cols-2 gap-2">
            <button onclick="editExistingQuiz('${q.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-xs transition">Editar original</button>
            <button onclick="deleteQuiz('${q.id}', '${safeTitle}')" class="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white py-2 rounded-xl font-bold text-xs transition">Esborrar original</button>
          </div>
        ` : `
          <p class="text-[11px] text-slate-400 text-center pt-0.5">Només lectura · clona'l per editar-lo</p>
        `}
      </div>
    `;
    list.appendChild(card);
  });
}

function selectLaunchMode(mode) {
  selectedLaunchMode = mode;
  const indCard = document.getElementById('card-mode-individual');
  const teamCard = document.getElementById('card-mode-teams');
  const coopCard = document.getElementById('card-mode-coop');
  const teamPanel = document.getElementById('launch-teams-panel');
  const coopPanel = document.getElementById('launch-coop-panel');

  indCard.className = "p-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-300 text-left space-y-1.5 transition";
  teamCard.className = "p-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-300 text-left space-y-1.5 transition";
  coopCard.className = "p-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-rose-300 text-left space-y-1.5 transition";
  teamPanel.classList.add('hidden');
  coopPanel.classList.add('hidden');

  if (mode === 'teams') {
    teamCard.className = "p-3.5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/60 text-left space-y-1.5 transition";
    teamPanel.classList.remove('hidden');
  } else if (mode === 'coop') {
    coopCard.className = "p-3.5 rounded-2xl border-2 border-rose-600 bg-rose-50/60 text-left space-y-1.5 transition";
    coopPanel.classList.remove('hidden');
  } else {
    indCard.className = "p-3.5 rounded-2xl border-2 border-indigo-600 bg-indigo-50/60 text-left space-y-1.5 transition";
  }
}

function selectTeamsCount(count) {
  selectedTeamsCount = count;
  const preview = document.getElementById('launch-teams-icons-preview');
  if (preview) {
    preview.textContent = TEAM_PRESETS.slice(0, count).map(t => t.icon).join(' ');
  }
  document.querySelectorAll('.team-count-btn').forEach(btn => {
    const val = parseInt(btn.dataset.count || '0');
    if (val === count) {
      btn.className = "team-count-btn py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-sm shadow-sm transition";
    } else {
      btn.className = "team-count-btn py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 font-extrabold text-sm text-slate-700 transition";
    }
  });
}

function selectCoopDifficulty(ratio) {
  selectedCoopDifficulty = ratio;
  document.querySelectorAll('.coop-target-btn').forEach(btn => {
    const val = parseFloat(btn.dataset.diff || '0');
    if (Math.abs(val - ratio) < 0.01) {
      btn.className = "coop-target-btn py-2.5 px-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-sm transition";
    } else {
      btn.className = "coop-target-btn py-2.5 px-2 rounded-xl bg-white border border-slate-200 hover:border-rose-300 font-extrabold text-xs text-slate-700 transition";
    }
  });
}

function calculateDynamicCoopGoal(questionsList, playersCount) {
  const gradableTypes = ['quiz', 'true_false', 'puzzle', 'type_answer', 'cloze'];
  const playableQuestions = (questionsList || []).filter(q => gradableTypes.includes(q.type));
  let basePointsPerPlayer = 0;

  playableQuestions.forEach(q => {
    const mult = (typeof q.points_multiplier === 'number' && q.points_multiplier > 0) ? q.points_multiplier : 1;
    basePointsPerPlayer += 1000 * mult;
  });

  if (basePointsPerPlayer <= 0) {
    basePointsPerPlayer = 1000;
  }

  const activePlayers = Math.max(1, playersCount || 1);
  const ratio = parseFloat((sessionMode.split(':')[1]) || '0.75');
  const rawGoal = Math.round((basePointsPerPlayer * activePlayers * ratio) / 100) * 100;
  return Math.max(500, rawGoal);
}

function openLaunchModal(quizId, kind, title) {
  if (kind === 'poll') {
    createRoom(quizId, 'poll', 'individual', false, false, false);
    return;
  }
  pendingLaunchQuizId = quizId;
  pendingLaunchKind = kind;
  document.getElementById('launch-modal-title').textContent = title;
  document.getElementById('launch-shuffle-questions').checked = false;
  document.getElementById('launch-shuffle-options').checked = false;
  document.getElementById('launch-enable-lifelines').checked = true;
  selectLaunchMode('individual');
  selectTeamsCount(4);
  selectCoopDifficulty(0.75);
  document.getElementById('launch-mode-modal').classList.remove('hidden');
}

function closeLaunchModal() {
  document.getElementById('launch-mode-modal').classList.add('hidden');
}

function confirmCreateRoom() {
  const shuffleQ = document.getElementById('launch-shuffle-questions').checked;
  const shuffleO = document.getElementById('launch-shuffle-options').checked;
  const lifelinesOn = document.getElementById('launch-enable-lifelines').checked;
  closeLaunchModal();
  if (!pendingLaunchQuizId) return;
  if (selectedLaunchMode === 'teams') {
    createRoom(pendingLaunchQuizId, pendingLaunchKind, `teams:${selectedTeamsCount}`, shuffleQ, shuffleO, lifelinesOn);
  } else if (selectedLaunchMode === 'coop') {
    createRoom(pendingLaunchQuizId, pendingLaunchKind, `coop:${selectedCoopDifficulty}`, shuffleQ, shuffleO, lifelinesOn);
  } else {
    createRoom(pendingLaunchQuizId, pendingLaunchKind, 'individual', shuffleQ, shuffleO, lifelinesOn);
  }
}

async function editExistingQuiz(quizId) {
  try {
    let activeUser = currentUser;
    if (!activeUser) {
      const { data: { user } } = await sb.auth.getUser();
      activeUser = user;
    }

    const [quizRes, qRes] = await Promise.all([
      sb.from('quizzes').select('*').eq('id', quizId).single(),
      sb.from('questions').select('*').eq('quiz_id', quizId).order('order_index', { ascending: true })
    ]);

    if (quizRes.error || !quizRes.data) {
      await domandeAlert(`No s'ha pogut carregar l'activitat: ${quizRes.error?.message || 'error desconegut'}`, "Error en obrir", "⚠️");
      return;
    }

    if (activeUser && quizRes.data.teacher_id !== activeUser.id) {
      await domandeAlert("Només l'autor/a original pot editar aquesta activitat. Pots clonar-la al teu espai per modificar-la.", "Només lectura", "🔒");
      return;
    }

    openQuizEditor(quizRes.data.kind || 'quiz', quizRes.data, qRes.data || []);
  } catch (err) {
    await domandeAlert(`S'ha produït un error obrint l'editor: ${err.message}`, "Error", "⚠️");
  }
}

async function duplicateQuiz(quizId) {
  const { data: { user } } = await sb.auth.getUser();
  const [origQuizRes, origQRes] = await Promise.all([
    sb.from('quizzes').select('*').eq('id', quizId).single(),
    sb.from('questions').select('*').eq('quiz_id', quizId).order('order_index', { ascending: true })
  ]);
  const origQuiz = origQuizRes.data;
  const origQuestions = origQRes.data;
  if (!origQuiz || !user) return;

  let { data: newQuiz, error } = await sb
    .from('quizzes')
    .insert({
      teacher_id: user.id,
      title: `${origQuiz.title} (còpia)`,
      kind: origQuiz.kind || 'quiz',
      tag: origQuiz.tag || '',
      shared_with: [],
      author_email: user.email || ''
    })
    .select()
    .single();

  if (error && error.message && error.message.includes('shared_with')) {
    const retry = await sb
      .from('quizzes')
      .insert({
        teacher_id: user.id,
        title: `${origQuiz.title} (còpia)`,
        kind: origQuiz.kind || 'quiz',
        tag: origQuiz.tag || '',
        is_shared: false
      })
      .select()
      .single();
    newQuiz = retry.data;
    error = retry.error;
  }

  if (error || !newQuiz) {
    await domandeAlert("No s'ha pogut duplicar l'activitat.", "Error", "⚠️");
    return;
  }

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
  const { data: { user } } = await sb.auth.getUser();
  const target = cachedTeacherQuizzes.find(q => q.id === quizId);
  if (!user || !target) {
    await domandeAlert("Només l'autor/a original pot eliminar aquesta activitat.", "Accés denegat", "🔒");
    return;
  }
  const ok = await domandeConfirm(`Segur que vols eliminar "${title}" i totes les seves preguntes?`, "Eliminar activitat");
  if (!ok) return;
  await sb.from('game_sessions').delete().eq('quiz_id', quizId).eq('teacher_id', user.id);
  const { error } = await sb.from('quizzes').delete().eq('id', quizId).eq('teacher_id', user.id);
  if (error) {
    await domandeAlert("No s'ha pogut esborrar: " + error.message, "Error", "⚠️");
    return;
  }
  loadTeacherDashboard(user);
}

async function exportQuizJSON(quizId) {
  const [quizRes, qRes] = await Promise.all([
    sb.from('quizzes').select('title, kind, tag').eq('id', quizId).single(),
    sb.from('questions').select('type, question_text, media_url, time_limit, points_multiplier, options').eq('quiz_id', quizId).order('order_index', { ascending: true })
  ]);
  const quiz = quizRes.data;
  if (!quiz) return;

  const payload = {
    app: 'domande',
    version: 1,
    title: quiz.title,
    kind: quiz.kind || 'quiz',
    tag: quiz.tag || '',
    questions: qRes.data || []
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
      await domandeAlert("El fitxer json no té un format vàlid de domande.", "Fitxer no vàlid", "⚠️");
      return;
    }

    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;

    let { data: newQuiz, error } = await sb
      .from('quizzes')
      .insert({
        teacher_id: user.id,
        title: parsed.title,
        kind: parsed.kind === 'poll' ? 'poll' : 'quiz',
        tag: parsed.tag || '',
        shared_with: [],
        author_email: user.email || ''
      })
      .select()
      .single();

    if (error && error.message && error.message.includes('shared_with')) {
      const retry = await sb
        .from('quizzes')
        .insert({
          teacher_id: user.id,
          title: parsed.title,
          kind: parsed.kind === 'poll' ? 'poll' : 'quiz',
          tag: parsed.tag || '',
          is_shared: false
        })
        .select()
        .single();
      newQuiz = retry.data;
      error = retry.error;
    }

    if (error || !newQuiz) {
      await domandeAlert("Error creant l'activitat importada.", "Error", "⚠️");
      return;
    }

    const qRows = parsed.questions.map((q, idx) => ({
      quiz_id: newQuiz.id,
      order_index: idx,
      type: q.type || 'quiz',
      question_text: q.question_text || `Pregunta ${idx + 1}`,
      media_url: q.media_url || null,
      time_limit: typeof q.time_limit === 'number' ? q.time_limit : 20,
      points_multiplier: typeof q.points_multiplier === 'number' ? q.points_multiplier : 1,
      options: Array.isArray(q.options) ? q.options : []
    }));

    if (qRows.length > 0) {
      await sb.from('questions').insert(qRows);
    }

    loadTeacherDashboard(user);
  } catch (e) {
    await domandeAlert("No s'ha pogut llegir el fitxer json.", "Error de lectura", "⚠️");
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

function renderSessionsList(sessions) {
  const container = document.getElementById('sessions-history-list');
  const rBadge = document.getElementById('badge-count-results');
  if (rBadge) {
    if (sessions.length > 0) {
      rBadge.textContent = sessions.length;
      rBadge.classList.remove('hidden');
    } else {
      rBadge.classList.add('hidden');
    }
  }

  if (sessions.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-500 py-6 text-center">Encara no hi ha cap sessió enregistrada al teu compte.</p>';
    return;
  }

  const quizMap = {};
  cachedTeacherQuizzes.forEach(q => { quizMap[q.id] = q; });
  cachedSchoolQuizzes.forEach(q => { quizMap[q.id] = q; });

  const searchTerm = normalizeText(document.getElementById('search-results-history')?.value || '');
  const filteredSessions = sessions.filter(s => {
    const qInfo = quizMap[s.quiz_id] || {};
    const title = qInfo.title || 'Activitat';
    const tag = qInfo.tag || '';
    return !searchTerm ||
      normalizeText(title).includes(searchTerm) ||
      normalizeText(tag).includes(searchTerm) ||
      normalizeText(s.pin || '').includes(searchTerm);
  });

  if (filteredSessions.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-500 py-6 text-center">Cap resultat coincideix amb la cerca.</p>';
    return;
  }

  container.innerHTML = '';
  filteredSessions.forEach(s => {
    const qInfo = quizMap[s.quiz_id] || {};
    const title = qInfo.title || 'Activitat';
    const isPoll = qInfo.kind === 'poll';
    const isStudy = Boolean(s.is_study) || s.mode === 'study';
    const dateStr = formatDateTime(s.created_at);
    const safeTitle = title.replace(/'/g, "\\'");
    const row = document.createElement('div');
    row.className = "py-4 flex flex-wrap justify-between items-center gap-4 hover:bg-slate-50 px-3 rounded-2xl transition";

    let typeBadge = `<span class="px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-600">Qüestionari</span>`;
    if (isStudy) {
      typeBadge = `<span class="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700">Repàs autònom</span>`;
    } else if (isPoll) {
      typeBadge = `<span class="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700">Enquesta</span>`;
    }

    row.innerHTML = `
      <div>
        <div class="flex items-center gap-2">
          <p class="text-xs font-extrabold text-indigo-600">${dateStr}</p>
          ${typeBadge}
          ${qInfo.tag ? `<span class="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600">${qInfo.tag}</span>` : ''}
        </div>
        <h4 class="text-base font-extrabold text-slate-900 mt-0.5">${title}</h4>
        <p class="text-xs text-slate-400">${isStudy ? 'Sessió individual des de casa/aula' : `PIN: ${s.pin}`}</p>
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

async function loadSessionsHistory() {
  const container = document.getElementById('sessions-history-list');
  if (cachedSessionsList.length > 0) {
    renderSessionsList(cachedSessionsList);
  } else {
    container.innerHTML = '<p class="text-sm text-slate-400 py-4">Carregant historial...</p>';
  }

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;

  const { data: sessions, error } = await sb
    .from('game_sessions')
    .select('id, pin, status, mode, is_study, created_at, quiz_id')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false });

  if (!error && sessions) {
    cachedSessionsList = sessions;
    renderSessionsList(cachedSessionsList);
  }
}

async function deleteSessionResult(sessionId, title) {
  const confirmed = await domandeConfirm(`Segur que vols esborrar els resultats de "${title}"? Aquesta acció eliminarà permanentment totes les respostes i puntuacions d'aquesta sessió.`, "Esborrar resultats");
  if (!confirmed) return;

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;

  cachedSessionsList = cachedSessionsList.filter(s => s.id !== sessionId);
  renderSessionsList(cachedSessionsList);

  await sb.from('answers').delete().eq('session_id', sessionId);
  await sb.from('players').delete().eq('session_id', sessionId);
  const { error } = await sb
    .from('game_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('teacher_id', user.id);

  if (error) {
    await domandeAlert("No s'ha pogut esborrar el registre: " + error.message, "Error", "⚠️");
    loadSessionsHistory();
  }
}

async function openSessionReport(sessionId, quizTitle, dateStr) {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return showView('view-login');

  let sessionMeta = cachedSessionsList.find(s => s.id === sessionId);
  if (!sessionMeta) {
    const { data: fetchedSession } = await sb
      .from('game_sessions')
      .select('id, quiz_id, teacher_id, is_study, mode')
      .eq('id', sessionId)
      .eq('teacher_id', user.id)
      .single();
    sessionMeta = fetchedSession;
  }

  if (!sessionMeta) {
    await domandeAlert("No tens permís per visualitzar aquest informe.", "Accés denegat", "🔒");
    return backToResults();
  }

  const cachedQuiz = cachedTeacherQuizzes.find(q => q.id === sessionMeta.quiz_id) || cachedSchoolQuizzes.find(q => q.id === sessionMeta.quiz_id);
  const resolvedTitle = cachedQuiz?.title || quizTitle;
  const isPoll = cachedQuiz?.kind === 'poll';
  const isStudy = Boolean(sessionMeta.is_study) || sessionMeta.mode === 'study';

  showView('view-session-report');
  document.getElementById('report-date-badge').textContent = dateStr;
  document.getElementById('report-quiz-title').textContent = resolvedTitle;
  document.getElementById('pdf-header-title').textContent = isPoll
    ? "Domande · resultats de l'enquesta"
    : (isStudy ? "Domande · informe de repàs autònom" : "Domande · informe d'avaluació");
  document.getElementById('pdf-subtitle-info').textContent = `${resolvedTitle} · ${dateStr}`;
  document.getElementById('pdf-type-tag').textContent = isPoll
    ? "Enquesta d'aula"
    : (isStudy ? "Repàs autònom" : "Registre d'avaluació");
  document.getElementById('report-questions-summary').innerHTML = '<p class="text-xs text-slate-400 col-span-full">Carregant dades...</p>';
  document.getElementById('report-student-cards').innerHTML = '';

  const [questionsRes, playersRes, answersRes] = await Promise.all([
    sb.from('questions').select('*').eq('quiz_id', sessionMeta.quiz_id).order('order_index', { ascending: true }),
    sb.from('players').select('*').eq('session_id', sessionId).order('score', { ascending: false }),
    sb.from('answers').select('*').eq('session_id', sessionId)
  ]);

  const allItems = questionsRes.data || [];
  const qs = allItems.filter(q => q.type !== 'slide');
  const pls = playersRes.data || [];
  const ans = answersRes.data || [];

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
      return q && !['word_cloud', 'brainstorm', 'poll', 'nps_scale'].includes(q.type);
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

      if (q.type === 'word_cloud' || q.type === 'brainstorm') {
        const words = qAnsList.map(a => `<span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">${a.answer_value?.text || ''}</span>`).join(' ');
        breakdownHTML = `<div class="flex flex-wrap gap-1.5 pt-1">${words || '<span class="text-xs text-slate-400">Sense idees enviades</span>'}</div>`;
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
        <div class="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2.5 pdf-keep-together">
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
        ? (q.options || []).filter(o => (o.text || '').trim()).map(o => o.text).join(' → ')
        : (q.options || []).filter(o => o.is_correct).map(o => o.text).join(', ');
      const qAnsList = ans.filter(a => a.question_id === q.id);
      const qCorrectCount = qAnsList.filter(a => a.is_correct).length;
      const qPct = qAnsList.length > 0 ? Math.round((qCorrectCount / qAnsList.length) * 100) : 0;
      const isGradable = !['word_cloud', 'brainstorm', 'poll', 'nps_scale'].includes(q.type);
      const needsReview = isGradable && qAnsList.length > 0 && qPct < 50;

      qSummaryContainer.innerHTML += `
        <div class="${needsReview ? 'bg-rose-50/70 border-rose-300' : 'bg-white border-slate-200/80'} p-3.5 rounded-xl border space-y-1.5 pdf-keep-together">
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

  const cardsContainer = document.getElementById('report-student-cards');
  cardsContainer.innerHTML = '';

  if (pls.length === 0) {
    cardsContainer.innerHTML = `<div class="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl">Cap participant en aquesta sessió.</div>`;
    barsList.innerHTML = `<p class="text-xs text-slate-400">Sense dades de participació.</p>`;
    return;
  }

  const badgeColors = [
    'bg-rose-50 text-rose-700 border-rose-200',
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-emerald-50 text-emerald-700 border-emerald-200'
  ];

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
          <div class="flex-1 h-4 bg-slate-200/80 rounded-full overflow-hidden flex items-center">
            <div style="width: ${Math.max(4, pct)}%" class="h-full ${pct >= 50 ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full"></div>
          </div>
          <div class="w-24 shrink-0 text-right text-xs font-extrabold text-slate-700">${pct}% (${p.score} pts)</div>
        </div>
      `;
    }

    let qItemsHTML = '';
    qs.forEach((q, qIdx) => {
      const a = pAnswers.find(item => item.question_id === q.id);
      let statusBadge = `<span class="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-semibold">Sense resposta</span>`;
      if (a) {
        const respText = a.answer_value?.text || (q.options[a.answer_value?.index]?.text) || 'Respost';
        if (isPoll || ['word_cloud', 'brainstorm', 'poll', 'nps_scale'].includes(q.type)) {
          const cIdx = typeof a.answer_value?.index === 'number' ? a.answer_value.index % 4 : 1;
          statusBadge = `<span class="inline-block px-2 py-0.5 rounded-md border ${badgeColors[cIdx]} text-xs font-bold break-words">${respText}</span>`;
        } else if (a.is_correct) {
          statusBadge = `<span class="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold break-words">✓ ${respText}</span>`;
        } else {
          statusBadge = `<span class="inline-block px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold break-words">✗ ${respText}</span>`;
        }
      }

      qItemsHTML += `
        <div class="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 space-y-1">
          <p class="text-[11px] font-bold text-slate-500 leading-snug"><span class="text-indigo-600 font-extrabold">P${qIdx + 1}:</span> ${q.question_text}</p>
          <div>${statusBadge}</div>
        </div>
      `;
    });

    cardsContainer.innerHTML += `
      <div class="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 pdf-keep-together">
        <div class="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-2.5">
          <div class="flex items-center gap-2.5">
            ${isPoll ? '' : `<span class="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-extrabold">${formatRankOrdinal(rankIdx + 1)}</span>`}
            <span class="text-xl">${p.avatar}</span>
            <span class="font-extrabold text-slate-900 text-base">${p.nickname}</span>
            ${p.team_name ? `<span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">${p.team_name}</span>` : ''}
          </div>
          ${isPoll ? '' : `
            <div class="flex items-center gap-3 text-xs font-extrabold">
              <span class="text-slate-600">${pCorrect} / ${qs.length} encerts (${pct}%)</span>
              <span class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">${p.score} punts</span>
            </div>
          `}
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          ${qItemsHTML}
        </div>
      </div>
    `;
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
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
  const sharedArr = Array.isArray(existingQuiz?.shared_with) ? existingQuiz.shared_with : [];
  const sharedEl = document.getElementById('editor-shared-emails');
  if (sharedEl) sharedEl.value = sharedArr.join(', ');
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
      <button type="button" onclick="addQuestionBlock('brainstorm')" class="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Pluja d'idees i vots</button>
      <button type="button" onclick="addQuestionBlock('slide')" class="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Diapositiva</button>
    `;
  } else {
    addBtns.innerHTML = `
      <button type="button" onclick="addQuestionBlock('quiz')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Opció múltiple</button>
      <button type="button" onclick="addQuestionBlock('true_false')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Vertader o fals</button>
      <button type="button" onclick="addQuestionBlock('puzzle')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Ordenar (puzzle)</button>
      <button type="button" onclick="addQuestionBlock('type_answer')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Resposta curta</button>
      <button type="button" onclick="addQuestionBlock('cloze')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Omplir buits</button>
      <button type="button" onclick="addQuestionBlock('word_cloud')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Núvol de paraules</button>
      <button type="button" onclick="addQuestionBlock('brainstorm')" class="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition">+ Pluja d'idees i vots</button>
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

function updateEditorBlockNumbers() {
  const container = document.getElementById('editor-questions-container');
  const isPoll = editorKind === 'poll';
  const typeNames = {
    quiz: 'opció múltiple',
    true_false: isPoll ? 'sí o no' : 'vertader o fals',
    puzzle: 'ordenar peces',
    type_answer: 'resposta curta',
    cloze: 'omplir buits',
    word_cloud: 'núvol de paraules',
    brainstorm: "pluja d'idees i votació",
    nps_scale: 'escala de 0 a 10',
    slide: 'diapositiva explicativa'
  };
  [...container.children].forEach((block, i) => {
    const t = block.dataset.type;
    const labelEl = block.querySelector('.q-block-label');
    if (labelEl) {
      labelEl.textContent = `${t === 'slide' ? `Diapositiva ${i + 1}` : `Pregunta ${i + 1}`} · ${typeNames[t]}`;
    }
  });
}

function moveEditorBlock(btn, dir) {
  const block = btn.closest('.q-block');
  const container = document.getElementById('editor-questions-container');
  if (dir === -1 && block.previousElementSibling) {
    container.insertBefore(block, block.previousElementSibling);
  } else if (dir === 1 && block.nextElementSibling) {
    container.insertBefore(block.nextElementSibling, block);
  }
  updateEditorBlockNumbers();
}

function duplicateEditorBlock(btn) {
  const block = btn.closest('.q-block');
  const data = extractBlockData(block);
  const uiType = data.type === 'poll' ? 'quiz' : data.type;
  addQuestionBlock(uiType, data);
  const container = document.getElementById('editor-questions-container');
  const newlyCreated = container.lastElementChild;
  if (newlyCreated && block.nextElementSibling) {
    container.insertBefore(newlyCreated, block.nextElementSibling);
  }
  updateEditorBlockNumbers();
}

function extractBlockData(b) {
  const isPoll = editorKind === 'poll';
  const rawType = b.dataset.type;
  const question_text = b.querySelector('.q-title').value.trim();
  const media_url = b.querySelector('.q-media').value.trim() || null;
  const timeEl = b.querySelector('.q-time');
  const time_limit = timeEl ? parseInt(timeEl.value) : 20;
  const pointsEl = b.querySelector('.q-points');
  const points_multiplier = (isPoll || rawType === 'slide') ? 0 : parseInt(pointsEl ? pointsEl.value : '1');
  let options = [];

  if (rawType === 'quiz') {
    const texts = b.querySelectorAll('.opt-text');
    const visuals = b.querySelectorAll('.opt-visual');
    const checks = b.querySelectorAll('.opt-correct');
    texts.forEach((t, idx) => {
      const txt = t.value.trim();
      const vis = visuals[idx]?.value.trim() || '';
      if (txt || vis) {
        options.push({
          text: txt,
          visual: vis,
          is_correct: isPoll ? false : (checks[idx]?.checked || false)
        });
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
      options = [{ text: 'Sí', is_correct: false }, { text: 'No', is_correct: false }];
    } else {
      const radios = b.querySelectorAll('.opt-correct');
      options = [
        { text: 'Vertader', is_correct: radios[0]?.checked || false },
        { text: 'Fals', is_correct: radios[1]?.checked || false }
      ];
    }
  } else if (rawType === 'type_answer') {
    const val = b.querySelector('.opt-text')?.value.trim() || '';
    const matchMode = b.querySelector('.opt-match-mode')?.value || 'exact';
    options = [{ text: val, is_correct: true, match_mode: matchMode }];
  } else if (rawType === 'cloze') {
    const sentenceVal = b.querySelector('.opt-cloze-sentence')?.value.trim() || '';
    const ansVal = b.querySelector('.opt-text')?.value.trim() || '';
    options = [{ sentence: sentenceVal, text: ansVal, is_correct: true, match_mode: 'exact' }];
  } else if (rawType === 'slide') {
    const val = b.querySelector('.opt-text')?.value.trim() || '';
    options = [{ text: val, is_correct: true }];
  }

  return { type: rawType, question_text, media_url, time_limit, points_multiplier, options };
}

function addQuestionBlock(type, prefill = null) {
  const container = document.getElementById('editor-questions-container');
  const idx = container.children.length + 1;
  const isPoll = editorKind === 'poll';
  const div = document.createElement('div');
  div.className = "q-block bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-200";
  div.dataset.type = type;
  if (prefill?.id) div.dataset.existingId = prefill.id;

  const typeNames = {
    quiz: 'opció múltiple',
    true_false: isPoll ? 'sí o no' : 'vertader o fals',
    puzzle: 'ordenar peces',
    type_answer: 'resposta curta',
    cloze: 'omplir buits',
    word_cloud: 'núvol de paraules',
    brainstorm: "pluja d'idees i votació",
    nps_scale: 'escala de 0 a 10',
    slide: 'diapositiva explicativa'
  };

  const optColors = ['bg-rose-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500'];
  const existingOpts = prefill?.options || [];

  let optionsHTML = '';
  if (type === 'quiz') {
    optionsHTML = [0,1,2,3].map(i => {
      const optVal = existingOpts[i]?.text || '';
      const optVis = existingOpts[i]?.visual || '';
      const optChk = existingOpts[i]?.is_correct ? 'checked' : '';
      return `
        <div class="opt-card-box flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
          ${isPoll
            ? `<span class="w-4 h-4 rounded-full ${optColors[i]} shrink-0"></span>`
            : `<input type="checkbox" ${optChk} class="opt-correct w-5 h-5 accent-emerald-600 cursor-pointer shrink-0" title="Marca si és correcta">`
          }
          <button type="button" onclick="openEmojiPickerForOption(this)" title="Tria una icona visual" class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-indigo-50 border border-slate-200 flex items-center justify-center text-xl shrink-0 transition">
            <span class="opt-visual-preview">${optVis || '➕'}</span>
          </button>
          <input type="hidden" value="${optVis.replace(/"/g, '&quot;')}" class="opt-visual">
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
          <input type="text" value="${optVal.replace(/"/g, '&quot;')}" placeholder="Posició ${i+1}${i >= 2 ? ' (opcional)' : ''}" class="opt-text flex-1 p-1 text-sm font-semibold text-slate-800 outline-none">
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
  } else if (type === 'cloze') {
    const sentenceVal = existingOpts[0]?.sentence || '';
    const ansVal = existingOpts[0]?.text || '';
    optionsHTML = `
      <div class="col-span-full bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
        <span class="text-xs font-bold text-slate-600 block">Escriu la frase posant <code class="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded">[...]</code> on va el buit:</span>
        <input type="text" value="${sentenceVal.replace(/"/g, '&quot;')}" placeholder="Ex: La capital de França és [...] i hi passa el riu Sena." class="opt-cloze-sentence w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none">
        <input type="text" value="${ansVal.replace(/"/g, '&quot;')}" placeholder="Paraula correcta del buit (separa sinònims amb comes, ex: París, Paris)" class="opt-text w-full p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-sm font-bold text-slate-900 outline-none">
      </div>
    `;
  } else if (type === 'word_cloud') {
    optionsHTML = `<p class="text-xs text-slate-500 col-span-full bg-white p-3 rounded-xl border border-slate-200">☁️ Els/les alumnes enviaran paraules lliures que aniran formant un núvol visual a la pantalla.</p>`;
  } else if (type === 'brainstorm') {
    optionsHTML = `<p class="text-xs text-slate-500 col-span-full bg-white p-3 rounded-xl border border-slate-200">💡 Fase 1: els/les alumnes proposen idees. Fase 2: s'obre una votació on cadascú vota les 3 millors propostes.</p>`;
  } else if (type === 'nps_scale') {
    optionsHTML = `<p class="text-xs text-slate-500 col-span-full bg-white p-3 rounded-xl border border-slate-200">Els/les alumnes votaran un número del 0 al 10 i es calcularà la mitjana del grup.</p>`;
  } else if (type === 'slide') {
    const slideBody = existingOpts[0]?.text || '';
    optionsHTML = `<textarea placeholder="Escriu aquí el text explicatiu de la diapositiva..." rows="3" class="opt-text col-span-full w-full p-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 outline-none">${slideBody}</textarea>`;
  }

  const timeVal = typeof prefill?.time_limit === 'number' ? prefill.time_limit : 20;
  const ptsVal = typeof prefill?.points_multiplier === 'number' ? prefill.points_multiplier : 1;
  const titleVal = (prefill?.question_text || '').replace(/"/g, '&quot;');
  const mediaVal = (prefill?.media_url || '').replace(/"/g, '&quot;');

  div.innerHTML = `
    <div class="flex flex-wrap justify-between items-center gap-2">
      <div class="flex items-center gap-1.5">
        <button type="button" onclick="moveEditorBlock(this, -1)" title="Pujar" class="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-black text-xs text-slate-600">↑</button>
        <button type="button" onclick="moveEditorBlock(this, 1)" title="Baixar" class="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-black text-xs text-slate-600">↓</button>
        <span class="q-block-label text-xs font-extrabold ${isPoll ? 'text-amber-700 bg-amber-50' : 'text-indigo-600 bg-indigo-50'} px-3 py-1 rounded-lg">${type === 'slide' ? `Diapositiva ${idx}` : `Pregunta ${idx}`} · ${typeNames[type]}</span>
      </div>
      <div class="flex flex-wrap items-center gap-1.5">
        ${type === 'slide' ? '' : `
          <select class="q-time bg-white border border-slate-200 text-slate-700 font-bold text-xs p-1.5 rounded-lg outline-none">
            <option value="0" ${timeVal === 0 ? 'selected' : ''}>∞ Sense límit de temps</option>
            <option value="5" ${timeVal === 5 ? 'selected' : ''}>⚡ 5 segons (llampec)</option>
            <option value="7" ${timeVal === 7 ? 'selected' : ''}>⚡ 7 segons (llampec)</option>
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
        <button type="button" onclick="duplicateEditorBlock(this)" class="text-xs font-bold text-indigo-600 bg-white border border-slate-200 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition">Duplicar</button>
        <button type="button" onclick="this.closest('.q-block').remove(); updateEditorBlockNumbers();" class="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition">Treure</button>
      </div>
    </div>
    <input type="text" value="${titleVal}" placeholder="${type === 'slide' ? 'Títol de la diapositiva...' : 'Escriu l\'enunciat de la pregunta...'}" class="q-title w-full p-3 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 outline-none">
    <input type="url" value="${mediaVal}" placeholder="Enllaç d'imatge principal opcional (https://...)" class="q-media w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 outline-none">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">${optionsHTML}</div>
  `;
  container.appendChild(div);
}

async function saveQuiz() {
  const title = document.getElementById('editor-title').value.trim();
  const tag = document.getElementById('editor-tag').value.trim();
  const sharedInputEl = document.getElementById('editor-shared-emails');
  const sharedEmails = sharedInputEl ? parseEmailsList(sharedInputEl.value) : [];
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

  let activeUser = currentUser;
  const { data: authData } = await sb.auth.getUser();
  if (authData?.user) {
    activeUser = authData.user;
    currentUser = activeUser;
  }

  if (!activeUser) {
    errEl.textContent = "La sessió ha caducat. Torna a iniciar sessió.";
    errEl.classList.remove('hidden');
    saveBtn.disabled = false;
    saveBtn.textContent = "Guardar";
    return;
  }

  let targetQuizId = editingQuizId;

  if (editingQuizId) {
    let { error: updErr } = await sb
      .from('quizzes')
      .update({
        title,
        tag,
        shared_with: sharedEmails,
        is_shared: sharedEmails.length > 0,
        author_email: activeUser.email || ''
      })
      .eq('id', editingQuizId)
      .eq('teacher_id', activeUser.id);

    if (updErr && updErr.message && updErr.message.includes('shared_with')) {
      const retry = await sb
        .from('quizzes')
        .update({ title, tag, is_shared: sharedEmails.length > 0 })
        .eq('id', editingQuizId)
        .eq('teacher_id', activeUser.id);
      updErr = retry.error;
    }

    if (updErr) {
      errEl.textContent = `No s'ha pogut actualitzar: ${updErr.message}`;
      errEl.classList.remove('hidden');
      saveBtn.disabled = false;
      saveBtn.textContent = "Actualitzar canvis";
      return;
    }

    const keptIds = [];
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      const extracted = extractBlockData(b);
      const dbType = (isPoll && extracted.type === 'quiz') ? 'poll' : extracted.type;
      const payload = {
        quiz_id: editingQuizId,
        order_index: i,
        type: dbType,
        question_text: extracted.question_text || `Pregunta ${i + 1}`,
        media_url: extracted.media_url,
        time_limit: extracted.time_limit,
        points_multiplier: extracted.points_multiplier,
        options: extracted.options
      };

      const existingId = b.dataset.existingId;
      if (existingId) {
        keptIds.push(existingId);
        await sb.from('questions').update(payload).eq('id', existingId);
      } else {
        const { data: inserted } = await sb.from('questions').insert(payload).select('id').single();
        if (inserted) keptIds.push(inserted.id);
      }
    }

    const { data: allExisting } = await sb.from('questions').select('id').eq('quiz_id', editingQuizId);
    const toDelete = (allExisting || []).map(r => r.id).filter(id => !keptIds.includes(id));
    if (toDelete.length > 0) {
      await sb.from('questions').delete().in('id', toDelete);
    }

    saveBtn.disabled = false;
    saveBtn.textContent = "Actualitzar canvis";
    loadTeacherDashboard(activeUser);
    return;
  }

  let { data: quiz, error: quizError } = await sb
    .from('quizzes')
    .insert({
      teacher_id: activeUser.id,
      title,
      kind: editorKind,
      tag,
      shared_with: sharedEmails,
      is_shared: sharedEmails.length > 0,
      author_email: activeUser.email || ''
    })
    .select()
    .single();

  if (quizError && quizError.message && quizError.message.includes('shared_with')) {
    const retryIns = await sb
      .from('quizzes')
      .insert({
        teacher_id: activeUser.id,
        title,
        kind: editorKind,
        tag,
        is_shared: sharedEmails.length > 0
      })
      .select()
      .single();
    quiz = retryIns.data;
    quizError = retryIns.error;
  }

  if (quizError || !quiz) {
    errEl.textContent = `No s'ha pogut guardar: ${quizError?.message || 'revisa els permisos'}`;
    errEl.classList.remove('hidden');
    saveBtn.disabled = false;
    saveBtn.textContent = isPoll ? "Guardar enquesta" : "Guardar qüestionari";
    return;
  }
  targetQuizId = quiz.id;

  const questionsToInsert = [];
  blocks.forEach((b, i) => {
    const extracted = extractBlockData(b);
    const dbType = (isPoll && extracted.type === 'quiz') ? 'poll' : extracted.type;

    questionsToInsert.push({
      quiz_id: targetQuizId,
      order_index: i,
      type: dbType,
      question_text: extracted.question_text || `Pregunta ${i + 1}`,
      media_url: extracted.media_url,
      time_limit: extracted.time_limit,
      points_multiplier: extracted.points_multiplier,
      options: extracted.options
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

  loadTeacherDashboard(activeUser);
}

function appendWordToHostCloud(rawWord) {
  const wcWords = document.getElementById('host-wordcloud-words');
  if (!wcWords || !rawWord) return;

  const clean = rawWord.trim();
  if (!clean) return;
  const key = normalizeText(clean);
  hostWordCounts[key] = (hostWordCounts[key] || 0) + 1;
  const count = hostWordCounts[key];

  if (!hostBrainstormIdeas.some(item => item.key === key)) {
    hostBrainstormIdeas.push({ key, text: clean, votes: 0 });
  }

  const existingEl = wcWords.querySelector(`[data-word-key="${key}"]`);
  const cloudColors = ['bg-indigo-600', 'bg-sky-600', 'bg-emerald-600', 'bg-amber-500', 'bg-rose-500', 'bg-violet-600'];
  const sizeClasses = [
    'text-xl sm:text-2xl px-5 py-2.5',
    'text-2xl sm:text-3xl px-6 py-3',
    'text-3xl sm:text-4xl px-7 py-3.5',
    'text-4xl sm:text-5xl px-8 py-4'
  ];
  const sizeClass = sizeClasses[Math.min(count - 1, sizeClasses.length - 1)];

  if (existingEl) {
    existingEl.className = `${existingEl.dataset.colorClass} text-white ${sizeClass} rounded-2xl font-extrabold shadow-md transition-all duration-300`;
    existingEl.textContent = count > 1 ? `${clean} (${count})` : clean;
  } else {
    const colorClass = cloudColors[Object.keys(hostWordCounts).length % cloudColors.length];
    const span = document.createElement('span');
    span.dataset.wordKey = key;
    span.dataset.colorClass = colorClass;
    span.className = `${colorClass} text-white ${sizeClass} rounded-2xl font-extrabold shadow-md transition-all duration-300`;
    span.textContent = clean;
    wcWords.appendChild(span);
  }
}

function renderHostBrainstormRankedResults() {
  const wcWords = document.getElementById('host-wordcloud-words');
  if (!wcWords) return;
  wcWords.innerHTML = '';

  const sorted = [...hostBrainstormIdeas].sort((a, b) => b.votes - a.votes);
  const medals = ['🥇', '🥈', '🥉'];

  sorted.forEach((item, idx) => {
    const pill = document.createElement('div');
    pill.className = idx === 0
      ? 'bg-amber-400 text-slate-900 px-6 py-3.5 rounded-2xl font-black text-xl sm:text-2xl shadow-lg flex items-center gap-3'
      : 'bg-white border-2 border-indigo-200 text-slate-900 px-5 py-3 rounded-2xl font-extrabold text-base sm:text-lg shadow-sm flex items-center gap-2.5';
    const prefix = idx < 3 ? medals[idx] : `${idx + 1}.`;
    pill.innerHTML = `<span>${prefix}</span> <span>${item.text}</span> <span class="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-black">${item.votes} vots</span>`;
    wcWords.appendChild(pill);
  });
}

function startBrainstormVotingPhase() {
  if (hostBrainstormPhase === 'voting') return;
  hostBrainstormPhase = 'voting';
  hostBrainstormVotedPlayers = new Set();

  const currentQ = sessionQuestions[currentSession.current_question_index];
  const isUnlimitedVote = currentQ && currentQ.time_limit === 0;

  document.getElementById('btn-start-brainstorm-vote').classList.add('hidden');
  document.getElementById('host-cloud-icon').textContent = '🗳️';
  document.getElementById('host-cloud-title').textContent = "Fase 2 · l'alumnat està votant les 3 millors idees";
  document.getElementById('host-answers-count').textContent = `Votacions: 0 / ${hostPlayersList.length}`;

  broadcastRoomState('brainstorm_voting', currentSession.current_question_index, null, null, null, hostBrainstormIdeas);

  clearInterval(hostTimerInterval);
  const timerEl = document.getElementById('host-timer');
  if (isUnlimitedVote) {
    timerEl.textContent = '∞';
  } else {
    let voteTime = 20;
    timerEl.textContent = voteTime;
    hostTimerInterval = setInterval(() => {
      voteTime--;
      timerEl.textContent = voteTime;
      if (voteTime <= 0) {
        clearInterval(hostTimerInterval);
        if (!hostResultsShown) {
          hostResultsShown = true;
          showQuestionResults();
        }
      }
    }, 1000);
  }
}

function handleHostIncomingAnswer(q, playerId, answerValue) {
  if (!currentSession || currentSession.status !== 'question_active' || hostResultsShown) return;
  if (q.type === 'brainstorm' && hostBrainstormPhase === 'voting') return;
  if (playerId && hostAnsweredPlayerIds.has(playerId)) return;
  if (playerId) hostAnsweredPlayerIds.add(playerId);

  const isPoll = sessionKind === 'poll' || q.type === 'poll';
  const totalPlayers = hostPlayersList.length;
  const answersCount = hostAnsweredPlayerIds.size;
  const counterPrefix = isPoll ? 'Vots' : 'Respostes';

  const countBadge = document.getElementById('host-answers-count');
  if (countBadge) {
    countBadge.textContent = `${counterPrefix}: ${answersCount} / ${totalPlayers}`;
  }

  const bigSaCounter = document.getElementById('host-sa-big-counter');
  if (bigSaCounter) {
    bigSaCounter.innerHTML = `${answersCount} <span class="text-2xl text-slate-400 font-bold">/ ${totalPlayers}</span>`;
  }

  if ((q.type === 'word_cloud' || q.type === 'brainstorm') && answerValue?.text) {
    appendWordToHostCloud(answerValue.text);
  }

  if (totalPlayers > 0 && answersCount >= totalPlayers) {
    if (q.type === 'brainstorm' && hostBrainstormPhase === 'collecting') {
      setTimeout(() => startBrainstormVotingPhase(), 400);
      return;
    }
    hostResultsShown = true;
    setTimeout(() => showQuestionResults(), 350);
  }
}

async function toggleRoomLock() {
  if (!currentSession) return;
  hostRoomLocked = !hostRoomLocked;
  const icon = document.getElementById('lock-icon');
  const label = document.getElementById('lock-label');
  const btn = document.getElementById('btn-lock-room');

  if (hostRoomLocked) {
    icon.textContent = '🔒';
    label.textContent = 'Sala tancada';
    btn.className = "inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-sm transition";
  } else {
    icon.textContent = '🔓';
    label.textContent = 'Sala oberta';
    btn.className = "inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-slate-800 border border-slate-200 px-4 py-2 rounded-2xl font-bold text-sm shadow-sm transition";
  }

  await sb.from('game_sessions').update({ is_locked: hostRoomLocked }).eq('id', currentSession.id);
}

async function createRoom(quizId, kind = 'quiz', mode = 'individual', shuffleQuestions = false, shuffleOptions = false, lifelinesEnabled = true) {
  const { data: { user } } = await sb.auth.getUser();
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  sessionKind = kind;
  sessionMode = mode;
  hostRoomLocked = false;
  studentLifelinesEnabled = lifelinesEnabled;
  const isPoll = kind === 'poll';
  const isTeams = mode.startsWith('teams:');
  const isCoop = mode.startsWith('coop:');
  hostPlayersList = [];

  const [sessionRes, qsRes] = await Promise.all([
    sb.from('game_sessions').insert({
      quiz_id: quizId,
      teacher_id: user.id,
      pin,
      status: 'waiting',
      mode,
      is_locked: false,
      shuffle_questions: isPoll ? false : shuffleQuestions,
      shuffle_options: isPoll ? false : shuffleOptions
    }).select().single(),
    sb.from('questions').select('*').eq('quiz_id', quizId).order('order_index', { ascending: true })
  ]);

  if (sessionRes.error || !sessionRes.data) {
    await domandeAlert("Error creant la sala: " + (sessionRes.error?.message || ''), "Error", "⚠️");
    return;
  }

  const session = sessionRes.data;
  currentSession = session;
  const rawQuestions = qsRes.data || [];
  sessionQuestions = (!isPoll && shuffleQuestions) ? shuffleArrayCopy(rawQuestions) : rawQuestions;

  const joinUrl = `${window.location.origin}${window.location.pathname}?pin=${pin}`;
  document.getElementById('host-qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(joinUrl)}`;

  const lockBtn = document.getElementById('btn-lock-room');
  lockBtn.classList.remove('hidden');
  document.getElementById('lock-icon').textContent = '🔓';
  document.getElementById('lock-label').textContent = 'Sala oberta';
  lockBtn.className = "inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-slate-800 border border-slate-200 px-4 py-2 rounded-2xl font-bold text-sm shadow-sm transition";

  const lobbyBadge = document.getElementById('host-lobby-badge');
  lobbyBadge.textContent = isPoll ? 'Enquesta oberta' : 'Sala oberta';
  lobbyBadge.className = isPoll
    ? 'px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-bold'
    : 'px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold';

  const modeBadge = document.getElementById('host-mode-badge');
  if (isTeams) {
    modeBadge.textContent = `Mode equips (${mode.split(':')[1]})`;
    modeBadge.classList.remove('hidden');
  } else if (isCoop) {
    const pctLabel = Math.round(parseFloat(mode.split(':')[1] || '0.75') * 100);
    modeBadge.textContent = `Repte cooperatiu (dificultat ${pctLabel}%)`;
    modeBadge.classList.remove('hidden');
  } else {
    modeBadge.classList.add('hidden');
  }

  const shuffleBadge = document.getElementById('host-shuffle-badge');
  if (!isPoll && (shuffleQuestions || shuffleOptions)) {
    shuffleBadge.textContent = shuffleQuestions && shuffleOptions
      ? 'Preguntes i opcions barrejades'
      : (shuffleQuestions ? 'Preguntes barrejades' : 'Opcions barrejades');
    shuffleBadge.classList.remove('hidden');
  } else {
    shuffleBadge.classList.add('hidden');
  }

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
    document.getElementById('host-lb-title').textContent = isTeams
      ? "Classificació d'equips"
      : (isCoop ? 'Aportacions al repte' : 'Classificació en directe');
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

  if (hostBroadcastChannel) {
    sb.removeChannel(hostBroadcastChannel);
  }
  hostBroadcastChannel = sb.channel('live-session-' + session.id, {
    config: { broadcast: { self: false } }
  })
    .on('broadcast', { event: 'student_answer' }, ({ payload }) => {
      const q = sessionQuestions[currentSession?.current_question_index];
      if (!q || payload.question_id !== q.id) return;
      handleHostIncomingAnswer(q, payload.player_id, payload.answer_value);
    })
    .on('broadcast', { event: 'brainstorm_vote' }, ({ payload }) => {
      if (hostBrainstormPhase !== 'voting' || hostResultsShown) return;
      if (payload.player_id && hostBrainstormVotedPlayers.has(payload.player_id)) return;
      if (payload.player_id) hostBrainstormVotedPlayers.add(payload.player_id);

      (payload.keys || []).forEach(k => {
        const found = hostBrainstormIdeas.find(item => item.key === k);
        if (found) found.votes += 1;
      });

      const vCount = hostBrainstormVotedPlayers.size;
      const totalP = hostPlayersList.length;
      document.getElementById('host-answers-count').textContent = `Votacions: ${vCount} / ${totalP}`;
      renderHostBrainstormRankedResults();

      if (totalP > 0 && vCount >= totalP) {
        hostResultsShown = true;
        setTimeout(() => showQuestionResults(), 350);
      }
    })
    .subscribe();

  sb.channel('host-players-' + session.id)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players', filter: `session_id=eq.${session.id}` }, payload => {
      const p = payload.new;
      if (!hostPlayersList.some(item => item.id === p.id)) {
        hostPlayersList.push(p);
      }
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

function broadcastRoomState(status, questionIndex, ranksMap = null, standingsList = null, questionsOrder = null, ideasList = null) {
  if (!hostBroadcastChannel) return;
  hostBroadcastChannel.send({
    type: 'broadcast',
    event: 'state',
    payload: {
      status,
      current_question_index: questionIndex,
      ranks: ranksMap,
      standings: standingsList,
      questions_order: questionsOrder,
      lifelines_enabled: studentLifelinesEnabled,
      ideas: ideasList
    }
  });
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
    badge.innerHTML = `<span class="text-2xl">${p.avatar}</span> <span>${p.nickname}</span> ${p.team_name ? `<span class="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">${p.team_name}</span>` : ''} <span class="text-xs text-rose-500 opacity-0 group-hover:opacity-100 font-black ml-1">✕</span>`;
    badge.onclick = () => kickPlayerFromLobby(p.id, p.nickname);
    grid.appendChild(badge);
  });
}

async function kickPlayerFromLobby(playerId, nickname) {
  const ok = await domandeConfirm(`Vols expulsar "${nickname}" de la sala?`, "Expulsar participant");
  if (!ok) return;
  await sb.from('players').delete().eq('id', playerId);
  hostPlayersList = hostPlayersList.filter(item => item.id !== playerId);
  renderHostPlayersLobby();
}

function computeTeamStandings(playersList) {
  const teamScores = {};
  playersList.forEach(p => {
    const tName = p.team_name || 'Sense equip';
    if (!teamScores[tName]) {
      const preset = TEAM_PRESETS.find(item => item.name === tName);
      teamScores[tName] = { id: tName, nickname: tName, avatar: preset ? preset.icon : '👥', score: 0 };
    }
    teamScores[tName].score += (p.score || 0);
  });
  return Object.values(teamScores).sort((a, b) => b.score - a.score);
}

function updateCoopBossProgress(totalClassPoints) {
  const bossBox = document.getElementById('host-coop-boss-bar');
  if (!sessionMode.startsWith('coop:')) {
    bossBox.classList.add('hidden');
    return;
  }
  bossBox.classList.remove('hidden');
  const target = computedCoopGoal;
  const remaining = Math.max(0, target - totalClassPoints);
  const hpPct = Math.max(0, Math.min(100, Math.round((remaining / target) * 100)));

  document.getElementById('boss-hp-fill').style.width = `${hpPct}%`;
  document.getElementById('boss-hp-text').textContent = `${totalClassPoints.toLocaleString('ca-ES')} / ${target.toLocaleString('ca-ES')} punts`;

  if (remaining <= 0) {
    document.getElementById('boss-avatar').textContent = '🎉';
    document.getElementById('boss-status-label').textContent = 'Repte aconseguit! Heu derrotat el monstre entre tota la classe!';
  } else {
    document.getElementById('boss-avatar').textContent = '👾';
    document.getElementById('boss-status-label').textContent = `Repte cooperatiu · energia restant del monstre: ${hpPct}%`;
  }
}

async function refreshLiveLeaderboard() {
  if (!currentSession || sessionKind === 'poll') return { ranksMap: null, list: [] };
  const { data: players } = await sb
    .from('players')
    .select('id, nickname, avatar, score, team_name')
    .eq('session_id', currentSession.id)
    .order('score', { ascending: false });

  const list = players || [];
  const isTeams = sessionMode.startsWith('teams:');
  const ranksMap = {};
  list.forEach((p, idx) => {
    ranksMap[p.id] = { rank: idx + 1, total: list.length };
  });

  const totalClassPoints = list.reduce((sum, p) => sum + (p.score || 0), 0);
  updateCoopBossProgress(totalClassPoints);

  const displayList = isTeams ? computeTeamStandings(list) : list;
  const lb = document.getElementById('host-live-leaderboard');
  if (displayList.length === 0) return { ranksMap, list: displayList };

  lb.innerHTML = '';
  displayList.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = "flex justify-between items-center bg-white px-3.5 py-2.5 rounded-xl border border-slate-100 shadow-sm";
    row.innerHTML = `
      <div class="flex items-center gap-2 font-bold text-slate-800 text-sm">
        <span class="text-xs font-black text-slate-400 w-4">${idx + 1}.</span>
        <span>${p.avatar}</span>
        <span class="truncate max-w-[120px]">${p.nickname}</span>
      </div>
      <span class="font-extrabold text-indigo-600 text-sm">${p.score}</span>
    `;
    lb.appendChild(row);
  });
  return { ranksMap, list: displayList };
}

async function startGame() {
  if (sessionQuestions.length === 0) {
    await domandeAlert("Aquesta activitat no té cap pregunta.", "Activitat buida", "📝");
    return;
  }
  document.getElementById('btn-lock-room').classList.add('hidden');
  const { data: latestPlayers } = await sb
    .from('players')
    .select('*')
    .eq('session_id', currentSession.id);
  if (latestPlayers) {
    hostPlayersList = latestPlayers;
  }
  if (sessionMode.startsWith('coop:')) {
    computedCoopGoal = calculateDynamicCoopGoal(sessionQuestions, hostPlayersList.length);
  }
  updateCoopBossProgress(0);
  await launchQuestion(0);
}

async function launchQuestion(index) {
  if (activeAnsChannel) {
    sb.removeChannel(activeAnsChannel);
    activeAnsChannel = null;
  }

  hostAnsweredPlayerIds = new Set();
  hostWordCounts = {};
  hostBrainstormIdeas = [];
  hostBrainstormPhase = 'collecting';
  hostBrainstormVotedPlayers = new Set();
  hostResultsShown = false;

  if (index >= sessionQuestions.length) {
    const { ranksMap, list } = await refreshLiveLeaderboard();
    broadcastRoomState('finished', index, ranksMap, list);
    await sb.from('game_sessions').update({ status: 'finished' }).eq('id', currentSession.id);
    currentSession.status = 'finished';
    if (sessionKind === 'poll') {
      setMusicMode('lobby');
      document.getElementById('host-question-screen').classList.add('hidden');
      document.getElementById('host-partial-podium-screen').classList.add('hidden');
      document.getElementById('host-poll-finished-screen').classList.remove('hidden');
    } else {
      await showHostPodium(list);
    }
    return;
  }

  const q = sessionQuestions[index];
  const isPoll = sessionKind === 'poll' || q.type === 'poll';
  const isSlide = q.type === 'slide';
  currentSession.current_question_index = index;
  currentSession.status = 'question_active';

  broadcastRoomState('question_active', index, null, null, index === 0 ? sessionQuestions : null);

  document.getElementById('host-lobby').classList.add('hidden');
  document.getElementById('host-partial-podium-screen').classList.add('hidden');
  document.getElementById('host-question-screen').classList.remove('hidden');
  document.getElementById('btn-next-question').classList.add('hidden');
  document.getElementById('btn-partial-podium').classList.add('hidden');
  document.getElementById('btn-start-brainstorm-vote').classList.add('hidden');
  document.getElementById('host-bars-display').classList.add('hidden');
  document.getElementById('host-slide-display').classList.add('hidden');
  document.getElementById('host-shortanswer-display').classList.add('hidden');
  document.getElementById('host-cloze-display').classList.add('hidden');

  document.getElementById('host-q-text').textContent = q.question_text;
  const imgEl = document.getElementById('host-q-image');
  if (q.media_url) {
    imgEl.src = q.media_url;
    imgEl.classList.remove('hidden');
  } else {
    imgEl.classList.add('hidden');
  }

  const speedPill = document.getElementById('host-speed-pill');
  if (q.time_limit > 0 && q.time_limit <= 7 && !isSlide) {
    speedPill.classList.remove('hidden');
  } else {
    speedPill.classList.add('hidden');
  }

  if (q.type === 'cloze') {
    const clozeEl = document.getElementById('host-cloze-display');
    clozeEl.innerHTML = formatClozeDisplayHTML(q.options?.[0]?.sentence || '');
    clozeEl.classList.remove('hidden');
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
    sb.from('game_sessions').update({
      status: 'question_active',
      current_question_index: index,
      question_started_at: new Date().toISOString()
    }).eq('id', currentSession.id);
    return;
  }

  setMusicMode('action');
  document.getElementById('host-timer-box').classList.remove('hidden');
  document.getElementById('host-answers-count').classList.remove('hidden');
  document.getElementById('btn-show-results').classList.remove('hidden');

  const totalPlayers = hostPlayersList.length;
  const validOptions = (q.options || []).filter(o => (o.text || '').trim() !== '' || (o.visual || '').trim() !== '');

  if (q.type === 'type_answer' || q.type === 'cloze') {
    optDisplay.classList.add('hidden');
    wcDisplay.classList.add('hidden');
    saDisplay.classList.remove('hidden');
    saDisplay.innerHTML = `
      <span class="px-3.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-extrabold">${q.type === 'cloze' ? 'Omplir buits' : 'Resposta curta'}</span>
      <div id="host-sa-big-counter" class="text-6xl md:text-7xl font-black text-indigo-600 leading-none">0 <span class="text-2xl text-slate-400 font-bold">/ ${totalPlayers}</span></div>
      <p class="text-sm font-bold text-slate-500">Participants que ja han enviat la seva resposta</p>
    `;
  } else if (q.type === 'word_cloud' || q.type === 'brainstorm') {
    optDisplay.classList.add('hidden');
    saDisplay.classList.add('hidden');
    wcDisplay.classList.remove('hidden');
    document.getElementById('host-cloud-icon').textContent = q.type === 'brainstorm' ? '💡' : '☁️';
    document.getElementById('host-cloud-title').textContent = q.type === 'brainstorm'
      ? "Fase 1 · recollint idees de la classe"
      : "Núvol de paraules en construcció";
    if (q.type === 'brainstorm') {
      document.getElementById('btn-start-brainstorm-vote').classList.remove('hidden');
    }
  } else if (q.type === 'nps_scale' || q.type === 'puzzle') {
    optDisplay.classList.add('hidden');
    wcDisplay.classList.add('hidden');
    saDisplay.classList.remove('hidden');
    saDisplay.innerHTML = q.type === 'nps_scale'
      ? `<span class="text-4xl">📊</span><p class="text-slate-600 font-bold">Esperant les valoracions de 0 a 10 de la classe...</p>`
      : `<span class="text-4xl">🧩</span><p class="text-slate-600 font-bold">Els/les participants estan ordenant les opcions als seus dispositius...</p>`;
  } else {
    wcDisplay.classList.add('hidden');
    saDisplay.classList.add('hidden');
    optDisplay.classList.remove('hidden');
    const colors = ['btn-red', 'btn-blue', 'btn-yellow', 'btn-green'];
    validOptions.forEach((opt, i) => {
      const visualHTML = renderVisualBadgeHTML(opt.visual, 'text-3xl');
      optDisplay.innerHTML += `
        <div id="host-opt-${i}" class="${colors[i%4]} p-5 rounded-2xl flex justify-between items-center gap-3 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-black/15 flex items-center justify-center shrink-0">${SHAPE_SVGS[i%4]}</div>
            ${visualHTML}
            <span>${opt.text}</span>
          </div>
          <span id="host-opt-count-${i}" class="bg-black/20 px-3.5 py-1 rounded-xl text-base">0</span>
        </div>
      `;
    });
  }

  const counterPrefix = isPoll ? 'Vots' : 'Respostes';
  document.getElementById('host-answers-count').textContent = `${counterPrefix}: 0 / ${totalPlayers}`;

  activeAnsChannel = sb.channel('answers-' + q.id + '-' + Date.now())
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'answers', filter: `question_id=eq.${q.id}` }, payload => {
      if (payload.new.session_id !== currentSession.id) return;
      handleHostIncomingAnswer(q, payload.new.player_id, payload.new.answer_value);
    })
    .subscribe();

  clearInterval(hostTimerInterval);
  const timerEl = document.getElementById('host-timer');
  if (q.time_limit === 0) {
    timerEl.textContent = '∞';
  } else {
    let timeLeft = q.time_limit;
    timerEl.textContent = timeLeft;
    hostTimerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(hostTimerInterval);
        if (q.type === 'brainstorm' && hostBrainstormPhase === 'collecting') {
          startBrainstormVotingPhase();
          return;
        }
        if (!hostResultsShown) {
          hostResultsShown = true;
          showQuestionResults();
        }
      }
    }, 1000);
  }

  sb.from('game_sessions').update({
    status: 'question_active',
    current_question_index: index,
    question_started_at: new Date().toISOString()
  }).eq('id', currentSession.id);
}

async function showQuestionResults() {
  hostResultsShown = true;
  clearInterval(hostTimerInterval);
  if (activeAnsChannel) {
    sb.removeChannel(activeAnsChannel);
    activeAnsChannel = null;
  }

  setMusicMode('lobby');
  document.getElementById('btn-start-brainstorm-vote').classList.add('hidden');
  document.getElementById('btn-next-question').classList.remove('hidden');

  const isLast = currentSession.current_question_index >= sessionQuestions.length - 1;
  if (sessionKind !== 'poll' && !isLast) {
    document.getElementById('btn-partial-podium').classList.remove('hidden');
  }

  const q = sessionQuestions[currentSession.current_question_index];
  const isPoll = sessionKind === 'poll' || q.type === 'poll';
  const { ranksMap, list } = !isPoll ? await refreshLiveLeaderboard() : { ranksMap: null, list: [] };

  currentSession.status = 'question_results';
  broadcastRoomState('question_results', currentSession.current_question_index, ranksMap, list);
  await sb.from('game_sessions').update({ status: 'question_results' }).eq('id', currentSession.id);

  const { data: qAnswers } = await sb
    .from('answers')
    .select('*')
    .eq('session_id', currentSession.id)
    .eq('question_id', q.id);

  const ansList = qAnswers || [];
  const totalVotes = ansList.length;
  const saDisplay = document.getElementById('host-shortanswer-display');
  const validOptions = (q.options || []).filter(o => (o.text || '').trim() !== '' || (o.visual || '').trim() !== '');

  if (q.type === 'word_cloud') {
    ansList.forEach(a => {
      if (a.player_id && !hostAnsweredPlayerIds.has(a.player_id) && a.answer_value?.text) {
        hostAnsweredPlayerIds.add(a.player_id);
        appendWordToHostCloud(a.answer_value.text);
      }
    });
  } else if (q.type === 'brainstorm') {
    document.getElementById('host-cloud-icon').textContent = '🏆';
    document.getElementById('host-cloud-title').textContent = "Idees més votades per la classe";
    renderHostBrainstormRankedResults();
  } else if (q.type === 'type_answer' || q.type === 'cloze') {
    const acceptedText = validOptions.map(o => o.text).join(' · ');
    const correctNum = ansList.filter(a => a.is_correct).length;
    const givenList = ansList.map(a => a.answer_value?.text).filter(Boolean);
    if (q.type === 'cloze') {
      document.getElementById('host-cloze-display').innerHTML = formatClozeDisplayHTML(q.options?.[0]?.sentence || '', acceptedText);
    }
    saDisplay.innerHTML = `
      <span class="px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">Respostes acceptades (${correctNum} encerts)</span>
      <p class="text-2xl md:text-3xl font-black text-slate-900">${acceptedText || 'Sense resposta definida'}</p>
      ${givenList.length > 0 ? `<p class="text-xs font-bold text-slate-500">Respostes rebudes: ${givenList.join(', ')}</p>` : ''}
    `;
  } else if (q.type === 'puzzle') {
    const correctOrderText = validOptions.map(o => o.text).join(' → ');
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
    const counts = validOptions.map((_, idx) => ansList.filter(a => a.answer_value?.index === idx).length);
    const maxCount = Math.max(1, ...counts);
    const barColors = ['bg-rose-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500'];
    const barsContainer = document.getElementById('host-bars-display');
    barsContainer.innerHTML = '';
    barsContainer.classList.remove('hidden');

    validOptions.forEach((opt, i) => {
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

  const { list } = await refreshLiveLeaderboard();
  const top5 = (list || []).slice(0, 5);

  const listEl = document.getElementById('host-partial-top5-list');
  listEl.innerHTML = '';
  const medals = ['🥇', '🥈', '🥉', '4t/a', '5è/ena'];

  top5.forEach((p, idx) => {
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

async function showHostPodium(preloadedList = null) {
  setMusicMode('podium');
  document.getElementById('host-question-screen').classList.add('hidden');
  document.getElementById('host-partial-podium-screen').classList.add('hidden');
  document.getElementById('host-podium-screen').classList.remove('hidden');

  const isTeams = sessionMode.startsWith('teams:');
  const isCoop = sessionMode.startsWith('coop:');
  document.getElementById('host-podium-heading').textContent = isTeams
    ? "Podi d'equips guanyadors"
    : (isCoop ? 'Resultat del repte cooperatiu' : 'Podi de guanyadors/es');

  let list = preloadedList;
  if (!list || list.length === 0) {
    const res = await refreshLiveLeaderboard();
    list = res.list || [];
  }

  const coopBanner = document.getElementById('host-coop-outcome-banner');
  if (isCoop) {
    const target = computedCoopGoal;
    const totalPts = list.reduce((sum, p) => sum + (p.score || 0), 0);
    if (totalPts >= target) {
      coopBanner.textContent = `🎉 Repte superat! Heu aconseguit ${totalPts.toLocaleString('ca-ES')} punts de ${target.toLocaleString('ca-ES')} necessaris.`;
      coopBanner.className = 'text-base sm:text-lg font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-2xl max-w-xl mx-auto';
    } else {
      coopBanner.textContent = `👾 Heu sumat ${totalPts.toLocaleString('ca-ES')} punts de ${target.toLocaleString('ca-ES')}. A la propera ho aconseguireu!`;
      coopBanner.className = 'text-base sm:text-lg font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-5 py-3 rounded-2xl max-w-xl mx-auto';
    }
    coopBanner.classList.remove('hidden');
  } else {
    coopBanner.classList.add('hidden');
  }

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
  const studyId = params.get('study');
  if (studyId) {
    clearStudentSessionSnapshot();
    prepareStudyEntry(studyId);
    return;
  }

  const restored = await tryRestoreStudentSession();
  if (restored) return;

  const urlPin = params.get('pin');
  if (urlPin) {
    document.getElementById('input-pin').value = urlPin.slice(0, 6);
  }

  const { data: { session } } = await sb.auth.getSession();
  if (session) loadTeacherDashboard(session.user);
});
