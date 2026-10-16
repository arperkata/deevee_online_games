/* Ad loader (does nothing unless ads-config.js has enabled:true). Home-page banner only; games stay ad-free. */
(function(){
  var c=window.ADS_CONFIG;if(!c||!c.enabled||!c.client||/X{6}/.test(c.client))return;
  var box=document.getElementById('adSlot');if(!box)return;
  var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';
  s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(c.client);
  if(c.childDirected)s.setAttribute('data-tag-for-child-directed-treatment','1');
  s.onload=function(){
    try{
      window.adsbygoogle=window.adsbygoogle||[];
      if(c.nonPersonalized)window.adsbygoogle.requestNonPersonalizedAds=1;
      var ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';
      ins.setAttribute('data-ad-client',c.client);ins.setAttribute('data-ad-slot',c.slots&&c.slots.home||'');
      ins.setAttribute('data-ad-format','auto');ins.setAttribute('data-full-width-responsive','true');
      box.appendChild(ins);box.hidden=false;(window.adsbygoogle=window.adsbygoogle||[]).push({});
    }catch(e){}
  };
  document.head.appendChild(s);
})();
