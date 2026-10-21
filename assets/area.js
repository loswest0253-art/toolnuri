'use strict';
// Exact m² per unit. Korean pyeong is 400/121 m².
const AREA_FACTORS=Object.freeze({pyeong:400/121,sqm:1,sqft:0.09290304,sqyd:0.83612736,acre:4046.8564224,ha:10000});
const LABELS=Object.freeze({pyeong:'평',sqm:'㎡',sqft:'ft²',sqyd:'yd²',acre:'ac',ha:'ha'});
const EN=document.documentElement.lang==='en';
const tr=(ko,en)=>EN?en:ko;
const el=id=>document.getElementById(id);
const parse=v=>{const s=v.trim().replaceAll(',','');if(!s||!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return NaN;return Number(s)};
const fmt=(n,max=6)=>Number.isFinite(n)?n.toLocaleString(EN?'en-US':'ko-KR',{maximumFractionDigits:max}):'—';
const unitKeys=Object.keys(AREA_FACTORS);
function render(){const amount=parse(el('amount').value),unit=el('unit').value,results=el('results');results.replaceChildren();if(!Number.isFinite(amount)||amount<0||!Number.isFinite(amount*AREA_FACTORS[unit])){el('input-msg').textContent=tr('0 이상의 유효한 숫자를 입력해 주세요.','Enter a valid non-negative number.');el('copy-all').disabled=true;return}el('input-msg').textContent='';el('copy-all').disabled=false;const sqm=amount*AREA_FACTORS[unit];for(const key of unitKeys){const value=sqm/AREA_FACTORS[key];const card=document.createElement('div');card.className='result'+(key===unit?' primary':'');const top=document.createElement('div');top.className='result-top';const label=document.createElement('span');label.className='result-label';label.textContent=key===unit?LABELS[key]+tr(' · 입력 단위',' · Input unit'):LABELS[key];const btn=document.createElement('button');btn.type='button';btn.className='copy';btn.textContent=tr('복사','Copy');btn.setAttribute('aria-label',LABELS[key]+tr(' 변환 결과 복사',' copy conversion result'));btn.addEventListener('click',()=>copy(String(value)));top.append(label,btn);const strong=document.createElement('strong');strong.textContent=fmt(value);card.append(top,strong);results.append(card)}}
let toastTimeout;async function copy(str){try{await navigator.clipboard.writeText(str);toast(tr('결과를 복사했어요.','Copied to clipboard.'))}catch{toast(tr('복사할 수 없습니다. HTTPS 환경인지 확인해 주세요.','Unable to copy. Check HTTPS or browser permissions.'))}}
function toast(msg){const node=el('toast');node.textContent=msg;node.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.hidden=true,2200)}
function renderPrice(){const price=parse(el('total-price').value),area=parse(el('price-area').value),unit=el('price-unit').value,valid=Number.isFinite(price)&&price>=0&&Number.isFinite(area)&&area>0&&Number.isFinite(area*AREA_FACTORS[unit])&&area*AREA_FACTORS[unit]>0;el('price-error').textContent=valid?'':tr('총 가격은 0 이상, 면적은 0보다 큰 숫자를 입력해 주세요.','Enter a non-negative price and an area greater than zero.');el('per-pyeong').textContent=valid?fmt(price/(area*AREA_FACTORS[unit]/AREA_FACTORS.pyeong),0)+tr('원',' KRW'):'—';el('per-sqm').textContent=valid?fmt(price/(area*AREA_FACTORS[unit]),0)+tr('원',' KRW'):'—'}
for(const id of ['amount','unit'])el(id).addEventListener('input',render);
for(const id of ['total-price','price-area','price-unit'])el(id).addEventListener('input',renderPrice);
el('copy-all').addEventListener('click',()=>{const n=parse(el('amount').value),key=el('unit').value;if(!Number.isFinite(n)||n<0)return;const sqm=n*AREA_FACTORS[key];copy(unitKeys.map(k=>LABELS[k]+': '+fmt(sqm/AREA_FACTORS[k],10)).join('\n'))});
el('year').textContent=new Date().getFullYear();render();renderPrice();
