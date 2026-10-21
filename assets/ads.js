/* Ad placement configuration. No production ads run until configured and approved.
 * IMPORTANT: Turn on only after the domain is approved by AdSense.
 * Replace publisher/client and ad slot values with real values. Do not make demo ad calls.
 */
window.AD_CONFIG={enabled:false,preview:true,client:'',slots:{'below-tool':'','sidebar':'','bottom':'','home-top':'','home-mid':'','home-bottom':''}};
document.addEventListener('DOMContentLoaded',()=>{
  const cfg=window.AD_CONFIG;
  if(!cfg.enabled&&!cfg.preview)return;
  if(cfg.preview){document.querySelectorAll('[data-ad-slot]').forEach(host=>{const div=document.createElement('div');div.className='ad-frame';div.innerHTML='<strong>'+(document.documentElement.lang==='en'?'Ad placement':'광고 자리')+'</strong><small>'+ (host.dataset.adLabel||'') +(document.documentElement.lang==='en'?' · preview only':' 광고 예정 · 현재 미송출')+'</small>';host.append(div)});return}
  if(!cfg.client||!Object.values(cfg.slots).some(Boolean))return;
  const script=document.createElement('script');script.async=true;script.crossOrigin='anonymous';script.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(cfg.client);document.head.append(script);
  document.querySelectorAll('[data-ad-slot]').forEach(host=>{const slot=cfg.slots[host.dataset.adSlot];if(!slot)return;const label=document.createElement('div');label.style.cssText='text-align:center;color:#8b97a7;font-size:11px;margin-bottom:5px';label.textContent='광고';const ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';ins.dataset.adClient=cfg.client;ins.dataset.adSlot=slot;ins.dataset.adFormat='auto';ins.dataset.fullWidthResponsive='true';host.append(label,ins);try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(err){console.warn('Ad initialization deferred',err)}});
});
