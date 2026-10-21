(()=>{
'use strict';
const type=document.body.dataset.tool, isKo=document.documentElement.lang==='ko';
const defs=type==='speed'?{
 kmh:{factor:1,ko:'km/h (킬로미터/시)',en:'km/h (kilometers/hour)'},
 mph:{factor:1.609344,ko:'mph (마일/시)',en:'mph (miles/hour)'},
 ms:{factor:3.6,ko:'m/s (미터/초)',en:'m/s (meters/second)'},
 knot:{factor:1.852,ko:'kn (노트)',en:'kn (knots)'},
 fps:{factor:1.09728,ko:'ft/s (피트/초)',en:'ft/s (feet/second)'}
}:{
 c:{ko:'°C (섭씨)',en:'°C (Celsius)',toK:v=>v+273.15,fromK:k=>k-273.15},
 f:{ko:'°F (화씨)',en:'°F (Fahrenheit)',toK:v=>(v+459.67)*5/9,fromK:k=>k*9/5-459.67},
 k:{ko:'K (켈빈)',en:'K (Kelvin)',toK:v=>v,fromK:k=>k}
};
const $=id=>document.getElementById(id), amt=$('amount'), unit=$('unit'), results=$('results'), err=$('input-msg');
for(const [key,data] of Object.entries(defs)){const o=document.createElement('option');o.value=key;o.textContent=data[isKo?'ko':'en'];unit.append(o)}
unit.value=type==='speed'?'kmh':'c';
const fmt=v=>Number.isFinite(v)?new Intl.NumberFormat(isKo?'ko-KR':'en-US',{maximumFractionDigits:6}).format(Math.abs(v)<1e-10?0:v):'—';
let values=[];
function show(){const raw=amt.value.trim().replace(/,/g,'');err.textContent='';results.replaceChildren();values=[];
 if(!raw|| !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)||!Number.isFinite(Number(raw))){err.textContent=isKo?'올바른 숫자를 입력해 주세요.':'Enter a valid number.';return}
 const value=Number(raw), src=defs[unit.value];const base=type==='speed'?value*src.factor:src.toK(value);
 if(type==='temperature' && base< -1e-9){err.textContent=isKo?'절대영도(-273.15°C)보다 낮은 온도는 입력할 수 없습니다.':'Temperature cannot be below absolute zero (-273.15°C).';return}
 for(const [key,data] of Object.entries(defs)){
  const val=type==='speed'?base/data.factor:data.fromK(base);const output=fmt(val);values.push([key,output]);
  const card=document.createElement('div');card.className='result'+(key===unit.value?' primary':'');
  const top=document.createElement('div');top.className='result-top';
  const label=document.createElement('span');label.className='result-label';label.textContent=data[isKo?'ko':'en'];
  const btn=document.createElement('button');btn.className='copy';btn.type='button';btn.textContent=isKo?'복사':'Copy';btn.setAttribute('aria-label',label.textContent+' '+(isKo?'결과 복사':'copy result'));btn.addEventListener('click',()=>copy(output));
  const strong=document.createElement('strong');strong.textContent=output;top.append(label,btn);card.append(top,strong);results.append(card)
 }
}
let timer;async function copy(txt){try{await navigator.clipboard.writeText(txt)}catch{const tmp=document.createElement('textarea');tmp.value=txt;document.body.append(tmp);tmp.select();document.execCommand('copy');tmp.remove()}
 const toast=$('toast');toast.textContent=isKo?'복사했어요.':'Copied.';toast.hidden=false;clearTimeout(timer);timer=setTimeout(()=>toast.hidden=true,1600)}
$('copy-all').addEventListener('click',()=>{if(values.length)copy(values.map(([key,val])=>`${defs[key][isKo?'ko':'en']}: ${val}`).join('\n'))});
[amt,unit].forEach(el=>el.addEventListener('input',show));$('year').textContent=new Date().getFullYear();show();
})();