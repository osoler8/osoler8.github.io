// Divisions descomposades — guia interactiva (sense backend)

const setupForm = document.getElementById('setupForm');
const dividendEl = document.getElementById('dividend');
const divisorEl = document.getElementById('divisor');
const randomBtn = document.getElementById('randomBtn');

const workArea = document.getElementById('workArea');
const opDividend = document.getElementById('opDividend');
const opDivisor = document.getElementById('opDivisor');

const stepsEl = document.getElementById('steps');
const chunksBox = document.getElementById('chunksBox');
const quotientEl = document.getElementById('quotient');
const remainderEl = document.getElementById('remainder');

const stepForm = document.getElementById('stepForm');
const chunkInput = document.getElementById('chunk');
const calcPreview = document.getElementById('calcPreview');
const helpBtn = document.getElementById('helpBtn');
const undoBtn = document.getElementById('undoBtn');
const resetBtn = document.getElementById('resetBtn');
const helpText = document.getElementById('helpText');
const printBtn = document.getElementById('printBtn');

let state = {
  dividend: 0,
  divisor: 1,
  remainder: 0,
  quotientChunks: [], // ex: [100, 40, 2]
  subtractions: []   // ex: [{take: 300, after: 127}, ...]
};

function resetWorkspace() {
  stepsEl.innerHTML = '';
  chunksBox.innerHTML = '';
  quotientEl.textContent = '0';
  remainderEl.textContent = '0';
  calcPreview.textContent = '—';
  helpText.textContent = '';
  chunkInput.value = '';
}

function render() {
  opDividend.textContent = state.dividend;
  opDivisor.textContent = state.divisor;
  // Steps
  stepsEl.innerHTML = '';
  state.subtractions.forEach(s => {
    const step = document.createElement('div');
    step.className = 'step';
    const sub = document.createElement('div');
    sub.className = 'sub';
    sub.textContent = `${s.take}`;
    const hr = document.createElement('div');
    hr.className = 'hr';
    const res = document.createElement('div');
    res.className = 'res';
    res.textContent = `${s.after}`;
    step.appendChild(sub);
    step.appendChild(hr);
    step.appendChild(res);
    stepsEl.appendChild(step);
  });

  // Chunks box
  chunksBox.innerHTML = '';
  state.quotientChunks.forEach(c => {
    const span = document.createElement('span');
    span.className = 'chunk';
    span.textContent = c;
    chunksBox.appendChild(span);
  });

  // Totals
  const q = state.quotientChunks.reduce((a,b)=>a+b,0);
  quotientEl.textContent = q;
  remainderEl.textContent = state.remainder;
}

function start(dividend, divisor) {
  state.dividend = dividend;
  state.divisor = divisor;
  state.remainder = dividend;
  state.quotientChunks = [];
  state.subtractions = [];
  resetWorkspace();
  render();
  workArea.classList.remove('hidden');
  chunkInput.focus();
}

setupForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const A = parseInt(dividendEl.value, 10);
  const B = parseInt(divisorEl.value, 10);
  if(!Number.isFinite(A) || !Number.isFinite(B) || B <= 0) return;
  start(Math.abs(A), Math.abs(B));
});

randomBtn.addEventListener('click', ()=>{
  const B = Math.floor(Math.random()*8)+2; // 2..9
  const A = Math.floor(Math.random()*900)+100; // 100..999
  dividendEl.value = A;
  divisorEl.value = B;
  start(A,B);
});

// When chunk changes, update preview
chunkInput.addEventListener('input', ()=>{
  helpText.textContent = '';
  const c = parseInt(chunkInput.value, 10);
  if(!Number.isFinite(c) || c<=0){
    calcPreview.textContent = '—';
    return;
  }
  const take = state.divisor * c;
  calcPreview.textContent = `${state.divisor} × ${c} = ${take}`;
});

stepForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const c = parseInt(chunkInput.value, 10);
  if(!Number.isFinite(c) || c<=0) return;
  const take = state.divisor * c;
  if(take > state.remainder){
    helpText.textContent = `⚠️ Això passa de mida ( ${take} > ${state.remainder} ). Prova amb un chunk més petit.`;
    return;
  }
  state.quotientChunks.push(c);
  const after = state.remainder - take;
  state.subtractions.push({take, after});
  state.remainder = after;
  chunkInput.value='';
  calcPreview.textContent='—';
  helpText.textContent='';
  render();
  // Stop when cannot subtract more
  if(state.remainder < state.divisor){
    helpText.textContent = '🎉 Ja no es pot restar més: residu menor que el divisor.';
  } else {
    chunkInput.focus();
  }
});

undoBtn.addEventListener('click', ()=>{
  if(state.quotientChunks.length===0) return;
  state.quotientChunks.pop();
  const last = state.subtractions.pop();
  state.remainder = state.subtractions.length ? state.subtractions[state.subtractions.length-1].after : state.dividend;
  render();
  helpText.textContent = '↩️ Desfet l’últim pas.';
});

resetBtn.addEventListener('click', ()=>{
  start(state.dividend, state.divisor);
});

helpBtn.addEventListener('click', ()=>{
  const s = suggestChunk(state.remainder, state.divisor);
  if(s <= 0){
    helpText.textContent = 'No cal més: el residu és menor que el divisor.';
    return;
  }
  chunkInput.value = s;
  chunkInput.dispatchEvent(new Event('input'));
  helpText.textContent = `Suggeriment: prova amb ${s} ( ${state.divisor} × ${s} = ${state.divisor*s} ≤ ${state.remainder} ).`;
});

printBtn.addEventListener('click', ()=>{
  window.print();
});

// Algorisme d’ajuda: tria el chunk més gran de la forma a·10^k (a=1..9) tal que divisor·chunk ≤ residu
function suggestChunk(remainder, divisor){
  if(remainder < divisor) return 0;
  // Troba el k més gran perquè divisor*10^k ≤ remainder
  let k = 0;
  while(divisor * Math.pow(10, k+1) <= remainder) k++;
  const base = divisor * Math.pow(10, k);
  let a = Math.floor(remainder / base);
  if(a > 9) a = 9;
  if(a < 1) a = 1;
  return a * Math.pow(10, k);
}

// Permet carregar un exemple via hash: #427/3
(function readHash(){
  if(location.hash && location.hash.includes('/')){
    const [A,B] = location.hash.replace('#','').split('/').map(x=>parseInt(x,10));
    if(Number.isFinite(A) && Number.isFinite(B) && B>0){
      dividendEl.value = A; divisorEl.value = B; start(A,B);
    }
  }
})();
