// Versió millorada: paraula 'número', línia L, mida ajustada

const setupForm=document.getElementById('setupForm');
const dividendEl=document.getElementById('dividend');
const divisorEl=document.getElementById('divisor');
const randomBtn=document.getElementById('randomBtn');
const workArea=document.getElementById('workArea');
const opDividend=document.getElementById('opDividend');
const opDivisor=document.getElementById('opDivisor');
const stepsEl=document.getElementById('steps');
const chunksBox=document.getElementById('chunksBox');
const quotientEl=document.getElementById('quotient');
const remainderEl=document.getElementById('remainder');
const stepForm=document.getElementById('stepForm');
const chunkInput=document.getElementById('chunk');
const calcPreview=document.getElementById('calcPreview');
const helpBtn=document.getElementById('helpBtn');
const undoBtn=document.getElementById('undoBtn');
const resetBtn=document.getElementById('resetBtn');
const helpText=document.getElementById('helpText');
const printBtn=document.getElementById('printBtn');

let state={dividend:0,divisor:1,remainder:0,quotientNums:[],subtractions:[]};

function render(){
  opDividend.textContent=state.dividend;
  opDivisor.textContent=state.divisor;
  stepsEl.innerHTML='';
  state.subtractions.forEach(s=>{
    const step=document.createElement('div');step.className='step';
    step.innerHTML=`<div class="sub">−${s.take}</div><div class="hr"></div><div class="res">${s.after}</div>`;
    stepsEl.appendChild(step);
  });
  chunksBox.innerHTML='';
  state.quotientNums.forEach(n=>{const span=document.createElement('span');span.textContent=n;chunksBox.appendChild(span);chunksBox.appendChild(document.createElement('br'));});
  quotientEl.textContent=state.quotientNums.reduce((a,b)=>a+b,0);
  remainderEl.textContent=state.remainder;
}

function start(a,b){state={dividend:a,divisor:b,remainder:a,quotientNums:[],subtractions:[]};render();workArea.classList.remove('hidden');}

setupForm.addEventListener('submit',e=>{e.preventDefault();start(+dividendEl.value,+divisorEl.value);});
randomBtn.addEventListener('click',()=>{const B=Math.floor(Math.random()*8)+2;const A=Math.floor(Math.random()*900)+100;dividendEl.value=A;divisorEl.value=B;start(A,B);});
chunkInput.addEventListener('input',()=>{const n=+chunkInput.value;if(!n){calcPreview.textContent='—';return;}calcPreview.textContent=`${state.divisor} × ${n} = ${state.divisor*n}`;});
stepForm.addEventListener('submit',e=>{e.preventDefault();const n=+chunkInput.value;if(!n)return;const take=state.divisor*n;if(take>state.remainder){helpText.textContent=`⚠️ Massa gran (${take}>${state.remainder})`;return;}state.quotientNums.push(n);const after=state.remainder-take;state.subtractions.push({take,after});state.remainder=after;chunkInput.value='';calcPreview.textContent='—';render();if(state.remainder<state.divisor)helpText.textContent='🎉 Ja no es pot restar més';});
undoBtn.addEventListener('click',()=>{state.quotientNums.pop();state.subtractions.pop();state.remainder=state.subtractions.length?state.subtractions[state.subtractions.length-1].after:state.dividend;render();});
resetBtn.addEventListener('click',()=>start(state.dividend,state.divisor));
helpBtn.addEventListener('click',()=>{const s=suggestNum(state.remainder,state.divisor);if(!s){helpText.textContent='No cal més';return;}chunkInput.value=s;calcPreview.textContent=`${state.divisor} × ${s} = ${state.divisor*s}`;helpText.textContent=`Suggeriment: ${s}`;});
printBtn.addEventListener('click',()=>window.print());

function suggestNum(r,d){if(r<d)return 0;let k=0;while(d*Math.pow(10,k+1)<=r)k++;const base=d*Math.pow(10,k);let a=Math.floor(r/base);if(a>9)a=9;if(a<1)a=1;return a*Math.pow(10,k);}
