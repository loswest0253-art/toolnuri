(()=>{'use strict';
 const lang=document.documentElement.lang==='en'?'en':'ko';
 const locale=lang==='ko'?'ko-KR':'en-US';
 const t=lang==='ko'?{bad:'대출금액·이율·기간을 확인해 주세요. 기간은 1~50년, 이율은 0~100%로 입력할 수 있습니다.',period:'개월',sum:'합계',copy:'상환표 CSV 다운로드',method:['원리금균등','원금균등','만기일시'],success:'상환표를 저장했어요.',first:'첫 달',last:'마지막 달'}:{bad:'Check the loan amount, interest rate and term (1–50 years, 0–100% APR).',period:'Month',sum:'Total',copy:'Download schedule (CSV)',method:['Equal payments','Equal principal','Interest-only / bullet'],success:'Schedule downloaded.',first:'First month',last:'Final month'};
 const $=id=>document.getElementById(id);const money=n=>new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(Math.round(n));
 const number=id=>Number($(id).value.replace(/,/g,''));let current=[];
 function calculate(amount,annual,months,type){const r=annual/1200, rows=[];let balance=amount,principalSum=0,interestSum=0;
 let payment=0;
 if(type===0){if(r===0)payment=amount/months;else {const z=Math.pow(1+r,-months);payment=amount*r/(1-z)}}
 for(let i=1;i<=months;i++){
 const interest=balance*r;let principal;
 if(type===0)principal=i===months?balance:Math.min(balance,Math.max(0,payment-interest));
 else if(type===1)principal=i===months?balance:Math.min(balance,amount/months);
 else principal=i===months?balance:0;
 const paid=principal+interest;balance=Math.max(0,balance-principal);principalSum+=principal;interestSum+=interest;
 rows.push({month:i,principal,interest,paid,balance});
 }
 return {rows,interest:interestSum,total:principalSum+interestSum,first:rows[0].paid,last:rows[rows.length-1].paid};}
 function cell(v){return document.createElement('td').textContent=money(v)}
 function formatCompare(list,type){$('compare-body').innerHTML='';list.forEach((v,i)=>{let tr=document.createElement('tr');if(i===type)tr.className='selected';[t.method[i],money(v.first),money(v.last),money(v.interest),money(v.total)].forEach(x=>{const td=document.createElement('td');td.textContent=x;tr.appendChild(td)});$('compare-body').appendChild(tr)})}
 function render(){const amount=number('principal'),apr=number('interest-rate'),years=Number($('years').value),type=Number($('method').value),months=Math.round(years*12);
 if(!Number.isFinite(amount)||amount<=0||amount>1e13||!Number.isFinite(apr)||apr<0||apr>100||!Number.isInteger(months)||months<12||months>600||Math.abs(years*12-months)>1e-6){$('error').textContent=t.bad;$('calculations').hidden=true;current=[];return;}
 $('error').textContent='';$('calculations').hidden=false;const all=[0,1,2].map(i=>calculate(amount,apr,months,i)),v=all[type];current=v.rows;
 $('first-value').textContent=money(v.first);$('interest-value').textContent=money(v.interest);$('total-value').textContent=money(v.total);
 $('first-caption').textContent=type===2?(lang==='ko'?'월 이자 (마지막 달 원금 별도)':'Monthly interest (principal due at maturity)'):(lang==='ko'?'첫 달 납입액':'First monthly payment');
 formatCompare(all,type);$('schedule-body').innerHTML='';const frag=document.createDocumentFragment();v.rows.forEach(row=>{const tr=document.createElement('tr');[row.month,row.paid,row.principal,row.interest,row.balance].forEach((n,i)=>{const td=document.createElement('td');td.textContent=i===0?String(n):money(n);tr.appendChild(td)});frag.appendChild(tr)});$('schedule-body').appendChild(frag);
 }
 function download(){if(!current.length)return;const headings=lang==='ko'?['개월','납입액','원금','이자','남은 원금']:['Month','Payment','Principal','Interest','Balance'];const lines=[headings.join(','),...current.map(x=>[x.month,x.paid.toFixed(2),x.principal.toFixed(2),x.interest.toFixed(2),x.balance.toFixed(2)].join(','))];const blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='loan-amortization-'+lang+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
 ['principal','interest-rate','years','method'].forEach(id=>$(id).addEventListener(id==='method'?'change':'input',render));$('download').addEventListener('click',download);render();
})();