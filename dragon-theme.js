/* Dragon theme decorations: flame-glow edge frame + floating embers behind the page. Never blocks clicks. */
(function(){
  if(window.__dragonTheme)return;window.__dragonTheme=1;
  function go(){
    var f=document.createElement('div');f.id='dragonFrame';f.setAttribute('aria-hidden','true');
    f.innerHTML='<i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i>';document.body.appendChild(f);
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var cv=document.createElement('canvas');cv.id='dragonSparks';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
    var g=cv.getContext('2d'),W=0,H=0,N=innerWidth<520?18:34,P=[],last=0;
    function size(){var d=Math.min(window.devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;g.setTransform(d,0,0,d,0,0)}
    function mk(init){return{x:Math.random()*W,y:init?Math.random()*H:H+10,r:1+Math.random()*2.6,v:14+Math.random()*34,w:Math.random()*6.28,a:.25+Math.random()*.5,h:Math.random()<.7?24:44}}
    size();for(var i=0;i<N;i++)P.push(mk(true));
    addEventListener('resize',size);
    function frame(t){
      requestAnimationFrame(frame);if(document.hidden)return;
      if(t-last<40)return;var dt=Math.min(.1,(t-last)/1000);last=t;
      g.clearRect(0,0,W,H);
      for(var i=0;i<P.length;i++){var p=P[i];p.y-=p.v*dt;p.x+=Math.sin(t/900+p.w)*9*dt;
        if(p.y<-12){P[i]=p=mk(false)}
        var fl=.65+.35*Math.sin(t/180+p.w),al=p.a*fl*(p.y<H*.25?p.y/(H*.25):1);
        var gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
        gr.addColorStop(0,'hsla('+p.h+',100%,62%,'+al+')');gr.addColorStop(1,'hsla('+p.h+',100%,50%,0)');
        g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,p.r*4,0,6.283);g.fill();
      }
    }
    requestAnimationFrame(frame);
  }
  if(document.body)go();else document.addEventListener('DOMContentLoaded',go);
})();
