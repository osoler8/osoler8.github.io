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

let state={dividend:0,divisor:1,remainder:0,nums:[],subs:[]};

function render(){
  opDividend.textContent=state.dividend;
  opDivisor.textContent=state.divisor;
  stepsEl.innerHTML='';
  state.subs.forEach(s=>{
    const div=document.createElement('div');
    div.className='step';
    div.innerHTML=`<div class="sub">−${s.take}</div><div class="hr"></div><div class="res">${s.after}</div>`;
    stepsEl.appendChild(div);
  });
  chunksBox.innerHTML=state.nums.map(n=>`<div>${n}</div>`).join('');
  quotientEl.textContent=state.nums.reduce((a,b)=>a+b,0);
  remainderEl.textContent=state.remainder;
}

function start(a,b){state={dividend:a,divisor:b,remainder:a,nums:[],subs:[]};render();workArea.classList.remove('hidden');}

setupForm.addEventListener('submit',e=>{e.preventDefault();start(+dividendEl.value,+divisorEl.value)});
randomBtn.addEventListener('click',()=>{const b=Math.floor(Math.random()*8)+2;const a=Math.floor(Math.random()*900)+100;dividendEl.value=a;divisorEl.value=b;start(a,b)});
chunkInput.addEventListener('input',()=>{const n=+chunkInput.value;if(!n){calcPreview.textContent='—';return;}calcPreview.textContent=`${state.divisor} × ${n} = ${state.divisor*n}`});
stepForm.addEventListener('submit',e=>{
  e.preventDefault();
  const n=+chunkInput.value;
  if(!n)return;
  const take=state.divisor*n;
  if(take>state.remainder){helpText.textContent=`⚠️ Massa gran (${take}>${state.remainder})`;helpText.classList.add('visible');return;}
  state.nums.push(n);
  const after=state.remainder-take;
  state.subs.push({take,after});
  state.remainder=after;
  chunkInput.value='';calcPreview.textContent='—';
  render();
  chunksBox.classList.add('highlight');
  setTimeout(()=>chunksBox.classList.remove('highlight'),500);
  if(state.remainder<state.divisor){
    helpText.textContent='🎉 Divisió completada!';
    helpText.classList.add('visible');
  }else helpText.classList.remove('visible');
});
undoBtn.addEventListener('click',()=>{state.nums.pop();state.subs.pop();state.remainder=state.subs.length?state.subs[state.subs.length-1].after:state.dividend;render()});
resetBtn.addEventListener('click',()=>start(state.dividend,state.divisor));
helpBtn.addEventListener('click',()=>{const s=suggest(state.remainder,state.divisor);if(!s){helpText.textContent='No cal més.';helpText.classList.add('visible');return;}chunkInput.value=s;calcPreview.textContent=`${state.divisor} × ${s} = ${state.divisor*s}`;helpText.textContent=`Suggeriment: ${s}`;helpText.classList.add('visible');});
printBtn.addEventListener('click',()=>window.print());
function suggest(r,d){if(r<d)return 0;let k=0;while(d*Math.pow(10,k+1)<=r)k++;const base=d*Math.pow(10,k);let a=Math.floor(r/base);if(a>9)a=9;if(a<1)a=1;return a*Math.pow(10,k);}
