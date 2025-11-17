// Utilitats de descomposició i renderitzat
function descomposaNombre(n) {
  // Torna una llista de components amb lloc i categoria
  const parts = [];
  const digits = String(Math.floor(Math.abs(n))).split("");
  const len = digits.length;
  for (let i = 0; i < len; i++) {
    const d = Number(digits[i]);
    if (d === 0) continue;
    const exp = len - i - 1; // 0=unitats
    const place = Math.pow(10, exp);
    const valor = d * place;
    parts.push({ valor, etiqueta: String(valor), place, exp, digit: d, categoria: categoriaPerExp(exp) });
  }
  return parts; // de més gran a més petit
}

function categoriaPerExp(exp) {
  switch (exp) {
    case 0: return 'UNITATS';
    case 1: return 'DESENES';
    case 2: return 'CENTENES';
    case 3: return 'UNITATS DE MILER';
    case 4: return 'DESENES DE MILER';
    case 5: return 'CENTENES DE MILER';
    case 6: return 'UNITATS DE MILIÓ';
    default: return `${Math.pow(10, exp)}-es`;
  }
}

function formatExpr(a, b) { return `${a} × ${b}`; }

const els = {
  multiplicandLeft: document.getElementById('pill-multiplicand-left'),
  multiplierLeft: document.getElementById('pill-multiplier-left'),
  multiplicandRight: document.getElementById('pill-multiplicand-right'),
  multiplierRight: document.getElementById('pill-multiplier-right'),
  finalResult: document.getElementById('final-result'),
  decompBox: document.getElementById('decomposition-box'),
  studentTotal: document.getElementById('student-total'),
  totalFeedback: document.getElementById('total-feedback'),
  normalSteps: document.getElementById('normal-steps'),
  // toggle com a botó
  toggleSolutionBtn: document.getElementById('toggle-solution-btn'),
  inputM: document.getElementById('multiplicand'),
  inputX: document.getElementById('multiplier'),
  btnGenerate: document.getElementById('generate'),
  decompLineLeft: document.getElementById('decomp-line-left'),
  decompLineRight: document.getElementById('decomp-line-right'),
  // contenidors per visibilitat
  stackLeft: document.querySelector('.panel-left .stack'),
  stackRight: document.querySelector('.panel-right .stack'),
  resultPill: document.querySelector('.panel-right .result-pill'),
  sumBox: document.querySelector('.panel-left .sum-box'),
  panelLeft: document.querySelector('.panel-left'),
  panelRight: document.querySelector('.panel-right'),
};

let showSolution = false;

function updateSolutionButton() {
  if (!els.toggleSolutionBtn) return;
  els.toggleSolutionBtn.textContent = showSolution ? 'Amaga solució calculada' : 'Mostra solució calculada';
}

function setVisible(hasData) {
  const targets = [
    els.stackLeft, els.decompBox, els.sumBox,
    els.stackRight, els.resultPill, els.normalSteps,
    els.decompLineLeft, els.decompLineRight,
    els.panelLeft, els.panelRight,
  ];
  targets.forEach(t => { if (t) t.classList.toggle('hidden', !hasData); });
  if (els.toggleSolutionBtn) els.toggleSolutionBtn.disabled = !hasData;
  if (!hasData) { showSolution = false; updateSolutionButton(); }
}

let estat = {
  m: 137,
  x: 6,
  parts: [],
  solucions: [],
};

function renderCapsules() {
  els.multiplicandLeft.textContent = estat.m;
  els.multiplierLeft.textContent = estat.x;
  els.multiplicandRight.textContent = estat.m;
  els.multiplierRight.textContent = estat.x;
  const line = `${estat.m} = ${estat.parts.map(p => p.etiqueta).join(' + ')}`;
  if (els.decompLineLeft) els.decompLineLeft.textContent = line;
  if (els.decompLineRight) els.decompLineRight.textContent = line;
}

function renderNormal() {
  const producte = estat.m * estat.x;
  els.finalResult.textContent = isFinite(producte) ? producte : '';

  els.normalSteps.innerHTML = '';
  if (showSolution && estat.parts.length > 0) {
    const asc = estat.parts.slice().reverse();
    let lastCat = null;
    asc.forEach(p => {
      if (p.categoria !== lastCat) {
        lastCat = p.categoria;
        const h = document.createElement('div');
        h.className = 'step-header';
        h.textContent = p.categoria;
        els.normalSteps.appendChild(h);
      }
      const linia = document.createElement('div');
      linia.className = 'line';
      const expr = document.createElement('span');
      expr.textContent = formatExpr(p.valor, estat.x);
      const eq = document.createElement('span');
      eq.textContent = ' = ';
      const val = document.createElement('span');
      val.className = 'value';
      val.textContent = p.valor * estat.x;
      linia.appendChild(expr);
      linia.appendChild(eq);
      linia.appendChild(val);
      els.normalSteps.appendChild(linia);
    });
  }
}

function creaFilaPas(component) {
  const fila = document.createElement('div');
  fila.className = 'step-row';

  const expr = document.createElement('div');
  expr.className = 'expr';
  expr.textContent = formatExpr(component.valor, estat.x);

  const input = document.createElement('input');
  input.type = 'number';
  input.placeholder = 'Escriu el resultat';
  input.inputMode = 'numeric';

  const feedback = document.createElement('span');
  feedback.className = 'feedback';

  const valida = () => {
    const esperat = component.valor * estat.x;
    const valor = Number(input.value);
    if (String(valor).length === 0) {
      input.classList.remove('correct', 'incorrect');
      feedback.textContent = '';
      return false;
    }
    const ok = valor === esperat;
    input.classList.toggle('correct', ok);
    input.classList.toggle('incorrect', !ok);
    feedback.textContent = ok ? '✔' : '✖';
    feedback.classList.toggle('ok', ok);
    feedback.classList.toggle('err', !ok);
    return ok;
  };

  input.addEventListener('input', () => {
    valida();
    comprovaTotalAuto();
  });

  fila.appendChild(expr);
  fila.appendChild(input);
  fila.appendChild(feedback);
  return { fila, valida, input };
}

function renderDescomposicio() {
  els.decompBox.innerHTML = '';
  estat.solucions = [];
  // Mostra primer unitats, després desenes, finalment centenes (ordre invers)
  estat.parts.slice().reverse().forEach(p => {
    const item = creaFilaPas(p);
    els.decompBox.appendChild(item.fila);
    estat.solucions.push(item);
  });
}

function comprovaTotalAuto() {
  // Si tots els passos són correctes i el total és buit, emplena suggeriment
  const totsOk = estat.solucions.length > 0 && estat.solucions.every(s => s.valida());
  if (totsOk && !els.studentTotal.value) {
    els.studentTotal.value = estat.parts.reduce((acc, p) => acc + p.valor * estat.x, 0);
    validaTotal();
  }
}

function validaTotal() {
  const esperat = estat.m * estat.x;
  const valor = Number(els.studentTotal.value);
  const ok = valor === esperat;
  els.studentTotal.classList.toggle('correct', ok);
  els.studentTotal.classList.toggle('incorrect', !ok);
  els.totalFeedback.textContent = ok ? '🎉 Correcte!' : (els.studentTotal.value ? 'Revisa la suma' : '');
  els.totalFeedback.classList.toggle('ok', ok);
  els.totalFeedback.classList.toggle('err', !ok);
}

// Inicialització
function genera() {
  const mStr = els.inputM.value;
  const xStr = els.inputX.value;
  // Si falten números, amaga la UI i surt
  if (!mStr || !xStr) {
    setVisible(false);
    els.multiplicandLeft.textContent = '';
    els.multiplierLeft.textContent = '';
    els.multiplicandRight.textContent = '';
    els.multiplierRight.textContent = '';
    els.finalResult.textContent = '';
    els.normalSteps.innerHTML = '';
    els.decompBox.innerHTML = '';
    if (els.decompLineLeft) els.decompLineLeft.textContent = '';
    if (els.decompLineRight) els.decompLineRight.textContent = '';
    return;
  }

  const m = Number(mStr);
  const x = Number(xStr);
  // Validació reforçada: primer número ≤ 9.999.999 i segon número 1–9
  if (!isFinite(m) || !isFinite(x) || m < 0 || m > 9999999 || x < 1 || x > 9) {
    setVisible(false);
    return;
  }

  estat.m = m; estat.x = x;
  estat.parts = descomposaNombre(m);
  setVisible(true);
  showSolution = false; // per defecte, no mostrar fins que es cliqui el botó
  updateSolutionButton();
  renderCapsules();
  renderDescomposicio();
  renderNormal();
  els.studentTotal.value = '';
  validaTotal();
}

// esdeveniment del botó toggle
if (els.toggleSolutionBtn) {
  els.toggleSolutionBtn.addEventListener('click', () => {
    if (els.toggleSolutionBtn.disabled) return;
    showSolution = !showSolution;
    updateSolutionButton();
    renderNormal();
  });
}

els.btnGenerate.addEventListener('click', genera);
// Eliminat l’antic escoltador del checkbox per evitar errors
// els.toggleSolution.addEventListener('change', renderNormal);
els.studentTotal.addEventListener('input', validaTotal);

// Primera càrrega
window.addEventListener('DOMContentLoaded', () => {
  // Inici en blanc: no mostrar cap número fins que es cliqui "Genera"
  els.inputM.value = '';
  els.inputX.value = '';
  els.multiplicandLeft.textContent = '';
  els.multiplierLeft.textContent = '';
  els.multiplicandRight.textContent = '';
  els.multiplierRight.textContent = '';
  els.finalResult.textContent = '';
  els.normalSteps.innerHTML = '';
  els.decompBox.innerHTML = '';
  if (els.decompLineLeft) els.decompLineLeft.textContent = '';
  if (els.decompLineRight) els.decompLineRight.textContent = '';
  setVisible(false);
  updateSolutionButton();
});

// Clamp d’entrada per al primer número a 0–9.999.999
if (els.inputM) {
  els.inputM.addEventListener('input', () => {
    const v = els.inputM.value;
    if (v === '') return;
    const n = parseInt(v, 10);
    if (!Number.isFinite(n)) { els.inputM.value = ''; return; }
    if (n > 9999999) els.inputM.value = '9999999';
    if (n < 0) els.inputM.value = '0';
  });
}
// Clamp d’entrada per al segon número a 1–9
if (els.inputX) {
  els.inputX.addEventListener('input', () => {
    const v = els.inputX.value;
    if (v === '') return;
    const n = parseInt(v, 10);
    if (!Number.isFinite(n)) { els.inputX.value = ''; return; }
    if (n > 9) els.inputX.value = '9';
    if (n < 1) els.inputX.value = '';
  });
}