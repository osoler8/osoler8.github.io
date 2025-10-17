// --- Elements ---
const els = {
  dividend: document.getElementById('dividend'),
  divisor: document.getElementById('divisor'),
  start: document.getElementById('start'),
  random: document.getElementById('random'),
  dA: document.getElementById('dA'),
  dB: document.getElementById('dB'),
  work: document.getElementById('work'),
  quo: document.getElementById('quo'),
  rem: document.getElementById('rem'),
  step: document.getElementById('step'),
  add: document.getElementById('add'),
  hint: document.getElementById('hint'),
  undo: document.getElementById('undo'),
  reset: document.getElementById('reset'),
  decompBox: document.getElementById('decompBox'),
  preview: document.getElementById('preview'),
};

let state = {
  a: null,
  b: null,
  steps: [], // each: {k, prod}
};

function active(){ return Number.isFinite(state.a) && Number.isFinite(state.b); }

function fmt(n){ return Number(n).toString(); }

function renderAll() {
  // Header numbers
  els.dA.textContent = active() ? fmt(state.a) : '';
  els.dB.textContent = active() ? fmt(state.b) : '';

  // Work area
  els.work.innerHTML = '';
  if (!active()) {
    els.work.classList.add('placeholder');
    els.work.innerHTML = '<div class="muted">Escriu una divisió i prem <strong>Començar</strong>.</div>';
    els.quo.textContent = '0';
    els.rem.textContent = '0';
    els.decompBox.textContent = '';
    els.preview.textContent = '—';
    return;
  }
  els.work.classList.remove('placeholder');

  let rem = state.a;
  state.steps.forEach(s => {
    const line = document.createElement('div');
    line.className = 'line';
    line.innerHTML = `<span class="minus">- ${s.prod}</span>`;
    els.work.appendChild(line);
    rem -= s.prod;
    const rule = document.createElement('div');
    rule.className = 'rule'; els.work.appendChild(rule);
    const rLine = document.createElement('div');
    rLine.className = 'line'; rLine.textContent = fmt(rem);
    els.work.appendChild(rLine);
  });

  const quotient = state.steps.reduce((acc, s) => acc + s.k, 0);
  const remainder = state.a - state.steps.reduce((acc, s) => acc + s.prod, 0);
  els.quo.textContent = fmt(quotient);
  els.rem.textContent = fmt(remainder);

  els.decompBox.textContent = state.steps.length ? state.steps.map(s => s.k).join(' + ') : '';
  updatePreview();
}

function start() {
  const a = parseInt(els.dividend.value, 10);
  const b = parseInt(els.divisor.value, 10);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= 0) {
    alert('Introdueix un dividend i divisor vàlids (el divisor ha de ser > 0).');
    return;
  }
  state = { a, b, steps: [] };
  renderAll();
  els.step.focus();
}

function randomDiv() {
  const a = Math.floor(Math.random()*900)+100; // 100..999
  const b = Math.floor(Math.random()*11)+2; // 2..12
  els.dividend.value = a;
  els.divisor.value = b;
  // No iniciem automàticament; l'usuari ha de prémer Començar
  els.start.focus();
}

function addStep() {
  if (!active()) return alert('Primer configura la divisió i prem Començar.');
  const k = parseInt(els.step.value, 10);
  if (!Number.isFinite(k) || k <= 0) return;
  const prod = k * state.b;
  const used = state.steps.reduce((acc, s) => acc + s.prod, 0);
  const rem = state.a - used;
  if (prod > rem) {
    alert('Aquest pas és massa gran. Prova amb un nombre més petit.');
    return;
  }
  state.steps.push({ k, prod });
  els.step.value = '';
  renderAll();
}

function undo() {
  if (!active()) return;
  state.steps.pop();
  renderAll();
}

function reset() {
  state.steps = [];
  renderAll();
}

function suggestStep(rem, b) {
  if (rem <= 0) return 0;
  const q = Math.floor(rem / b);
  if (q <= 0) return 0;
  // arrodonim a un 'nombre agradable' (1,2,3,... * potència de 10)
  const pow = Math.pow(10, String(q).length - 1);
  const lead = Math.max(1, Math.floor(q / pow));
  return lead * pow;
}

function hint() {
  if (!active()) return;
  const used = state.steps.reduce((acc, s) => acc + s.prod, 0);
  const rem = state.a - used;
  const k = suggestStep(rem, state.b);
  if (k <= 0) {
    alert('Ja no cal cap pas (o el pas següent és 0).');
    return;
  }
  els.step.value = k;
  updatePreview();
}

function updatePreview() {
  if (!active()) { els.preview.textContent = '—'; return; }
  const k = parseInt(els.step.value, 10);
  if (!Number.isFinite(k) || k <= 0) { els.preview.textContent = '—'; return; }
  const prod = k * state.b;
  els.preview.textContent = `${state.b} × ${k} = ${prod}`;
  const used = state.steps.reduce((acc, s) => acc + s.prod, 0);
  const rem = state.a - used;
  if (prod > rem) els.preview.textContent += '  (massa gran)';
}

// --- Events ---
els.start.addEventListener('click', start);
els.random.addEventListener('click', randomDiv);
els.add.addEventListener('click', addStep);
els.undo.addEventListener('click', undo);
els.reset.addEventListener('click', reset);
els.hint.addEventListener('click', hint);
els.step.addEventListener('input', updatePreview);

// Inicialment, cap divisió carregada
renderAll();
