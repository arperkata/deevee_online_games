/* Shared 3D dragon buddy for every game. Uses three.js (r128) from a CDN; falls back to an emoji buddy. */
(function(){
'use strict';
if(window.__mascotLoaded)return;window.__mascotLoaded=1;
const lerp=(a,b,t)=>a+(b-a)*t;
/* ====================== 3D DRAGON (procedural) ====================== */
let _tex=null,_geo=null;
function dragonTextures(){
  if(_tex)return _tex;
  const mk=(gray)=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
    x.fillStyle=gray?'#707070':'#aaaaaa';x.fillRect(0,0,256,256);
    const R=17;for(let row=-1;row<19;row++)for(let col=-1;col<9;col++){const cx=col*32+(row%2?16:0),cy=row*14;
      const g=x.createRadialGradient(cx,cy-3,2,cx,cy,R);
      if(gray){g.addColorStop(0,'#ffffff');g.addColorStop(.65,'#b0b0b0');g.addColorStop(1,'#202020')}
      else{g.addColorStop(0,'#ffffff');g.addColorStop(.55,'#e2e2e2');g.addColorStop(1,'#8a8a8a')}
      x.fillStyle=g;x.beginPath();x.ellipse(cx,cy,R,R*.9,0,0,7);x.fill()}
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2.4,2);t.anisotropy=4;return t};
  const mc=document.createElement('canvas');mc.width=mc.height=256;const x=mc.getContext('2d');
  const gr=x.createLinearGradient(0,0,256,256);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#d8b8a8');x.fillStyle=gr;x.fillRect(0,0,256,256);
  x.strokeStyle='rgba(90,30,20,.55)';x.lineWidth=2.2;for(let i=0;i<14;i++){const a=(i/13)*1.2-.1;x.beginPath();x.moveTo(0,40);x.quadraticCurveTo(100,40+Math.sin(a)*120,256,40+Math.tan(a)*230);x.stroke()}
  const mem=new THREE.CanvasTexture(mc);
  _tex={map:mk(false),bump:mk(true),mem};return _tex;
}
function dGeo(){if(_geo)return _geo;_geo={hi:new THREE.SphereGeometry(1,26,18),lo:new THREE.SphereGeometry(1,12,9),cone:new THREE.ConeGeometry(1,1,6),cone8:new THREE.ConeGeometry(1,1,8)};return _geo}
const DRAGON_PALETTES={
  green:{skin:'#3fae52',belly:'#eadb9e',spine:'#ff9a2a',wing:'#ff8a5a',wingEm:'#7a1a10'},
  red:{skin:'#d9503c',belly:'#f2d9a0',spine:'#ffd23a',wing:'#ffa05a',wingEm:'#7a1a10'},
  blue:{skin:'#3a7ad8',belly:'#d8ecff',spine:'#ffe14a',wing:'#8ad0ff',wingEm:'#103a7a'},
  purple:{skin:'#8a4ad8',belly:'#f0d8ff',spine:'#ff9ad5',wing:'#d89aff',wingEm:'#4a1a7a'},
  gold:{skin:'#e8b030',belly:'#fff0c0',spine:'#ff6a3a',wing:'#ffd27a',wingEm:'#7a4a10'}
};
function buildDragon(palName){
  const pal=DRAGON_PALETTES[palName||'green'],T=dragonTextures(),G=dGeo();
  const skin=new THREE.MeshStandardMaterial({color:pal.skin,map:T.map,bumpMap:T.bump,bumpScale:1.8,roughness:.5,metalness:.1});
  const belly=new THREE.MeshStandardMaterial({color:pal.belly,map:T.map,bumpMap:T.bump,bumpScale:.8,roughness:.7});
  const hornM=new THREE.MeshStandardMaterial({color:'#efe3c4',roughness:.4,metalness:.1});
  const clawM=new THREE.MeshStandardMaterial({color:'#3a2f28',roughness:.35,metalness:.25});
  const spineM=new THREE.MeshStandardMaterial({color:pal.spine,roughness:.45});
  const memM=new THREE.MeshStandardMaterial({color:pal.wing,map:T.mem,side:THREE.DoubleSide,roughness:.65,emissive:pal.wingEm,emissiveIntensity:.3});
  const eyeM=new THREE.MeshStandardMaterial({color:'#ffd23a',emissive:'#ff8a00',emissiveIntensity:.7,roughness:.15});
  const darkM=new THREE.MeshStandardMaterial({color:'#15100c',roughness:.6});
  const tongueM=new THREE.MeshStandardMaterial({color:'#e8607a',roughness:.6});
  const teethM=new THREE.MeshStandardMaterial({color:'#fffdf2',roughness:.3});
  const sph=(m,rx,ry,rz,lo)=>{const s=new THREE.Mesh(lo?G.lo:G.hi,m);s.scale.set(rx,ry,rz);s.castShadow=true;return s};
  const cone=(m,r,h,geo)=>{const c=new THREE.Mesh(geo||G.cone,m);c.scale.set(r,h,r);c.position.y=h/2;return c};
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);
  /* torso */
  body.add(sph(skin,2.1,2.3,3.7));
  const bel=sph(belly,1.5,1.4,3.3);bel.position.set(0,-1,-.2);body.add(bel);
  const chest=sph(skin,1.95,2.05,2.2);chest.position.set(0,-.1,-2.7);body.add(chest);
  const chestB=sph(belly,1.45,1.4,1.8);chestB.position.set(0,-.95,-2.8);body.add(chestB);
  const hip=sph(skin,1.85,1.95,2.3);hip.position.set(0,-.1,2.5);body.add(hip);
  for(let i=0;i<5;i++){const s=cone(spineM,.32,1.0);s.position.set(0,2.15-Math.abs(i-2)*.08,-2.2+i*1.15);s.rotation.x=.25;body.add(s)}
  /* neck */
  const NN=6,neck=[];let par=body;
  for(let i=0;i<NN;i++){const g=new THREE.Group();g.position.set(0,i===0?.9:.12,i===0?-3.9:-1.05);const r=1.32-i*.08;
    g.add(sph(skin,r,r*.98,1.12,i>3));
    const sp=cone(spineM,.26,.85);sp.position.set(0,r*.95,.1);sp.rotation.x=.3;g.add(sp);
    g.userData.base=.17;g.rotation.x=.17;par.add(g);neck.push(g);par=g}
  /* head */
  const head=new THREE.Group();head.position.set(0,.2,-.95);par.add(head);
  head.add(sph(skin,1.15,1.0,1.4));
  const snout=sph(skin,.8,.62,1.55);snout.position.set(0,-.2,-1.55);head.add(snout);
  const snoutT=sph(belly,.6,.3,1.3);snoutT.position.set(0,-.46,-1.6);head.add(snoutT);
  [-1,1].forEach(sg=>{
    const nos=sph(darkM,.11,.08,.12,true);nos.position.set(sg*.3,.0,-3.02);head.add(nos);
    const brow=new THREE.Mesh(new THREE.BoxGeometry(.8,.2,.7),skin);brow.position.set(sg*.7,.58,-.75);brow.rotation.z=-sg*.3;brow.rotation.y=sg*.25;head.add(brow);
    const eye=sph(eyeM,.28,.28,.28,true);eye.position.set(sg*.8,.3,-.85);head.add(eye);
    const pup=sph(darkM,.09,.24,.1,true);pup.position.set(sg*.99,.31,-.93);head.add(pup);
    const h1=new THREE.Group();h1.position.set(sg*.62,.8,.25);h1.rotation.x=1.1;h1.rotation.z=-sg*.22;const hc=cone(hornM,.26,2.6,G.cone8);hc.castShadow=true;h1.add(hc);head.add(h1);
    const h2=new THREE.Group();h2.position.set(sg*.98,.15,.45);h2.rotation.x=.9;h2.rotation.z=-sg*1.0;h2.add(cone(hornM,.18,1.5,G.cone8));head.add(h2);
    for(let i=0;i<3;i++){const cs=cone(spineM,.12,.55);cs.position.set(sg*(.95-i*.05),-.2-i*.12,-.2+i*.35);cs.rotation.z=-sg*1.15;head.add(cs)}
    for(let i=0;i<5;i++){const tt=cone(teethM,.07,.28,G.cone);tt.position.set(sg*.5,-.58,-1.0-i*.37);tt.rotation.x=Math.PI;tt.position.y+=.28;head.add(tt)}
  });
  const jaw=new THREE.Group();jaw.position.set(0,-.38,-.5);head.add(jaw);
  const jw=sph(skin,.72,.3,1.5);jw.position.set(0,-.05,-1.1);jaw.add(jw);
  const tg=sph(tongueM,.36,.1,.85);tg.position.set(0,.16,-1.1);jaw.add(tg);
  [-1,1].forEach(sg=>{for(let i=0;i<4;i++){const tt=cone(teethM,.07,.26);tt.position.set(sg*.45,.1,-.9-i*.38);jaw.add(tt)}});
  /* tail */
  const NT=13,tail=[];par=body;let rr=1.45;
  for(let i=0;i<NT;i++){const g=new THREE.Group();const prev=rr;rr=Math.max(.1,1.45*Math.pow(.855,i+1));
    g.position.set(0,i===0?-.2:0,i===0?4.5:(prev*.85+rr*.55));
    g.add(sph(skin,rr,rr*.95,rr*1.25,i>5));
    if(i<NT-1){const sp=cone(spineM,Math.max(.12,rr*.26),Math.max(.35,rr*.9));sp.position.set(0,rr*.9,0);sp.rotation.x=-.25;g.add(sp)}
    par.add(g);tail.push(g);par=g}
  const spade=cone(spineM,.8,1.9,G.cone8);spade.scale.set(.9,1.9,.18);spade.position.set(0,0,rr+1.1);spade.rotation.x=Math.PI/2;par.add(spade);
  /* legs */
  const legs=[];
  [[-1,-2.0,1.0],[1,-2.0,1.0],[-1,2.2,-1.2],[1,2.2,-1.2]].forEach(([sg,z,rot],k)=>{
    const lg=new THREE.Group();lg.position.set(sg*1.55,-1.4,z);
    const up=sph(skin,.75,1.0,.8,true);up.position.y=-.3;lg.add(up);
    const lo=new THREE.Group();lo.position.set(0,-1.1,0);lg.add(lo);
    const sh=new THREE.Mesh(new THREE.CylinderGeometry(.28,.2,1.5,8),skin);sh.position.y=-.65;sh.castShadow=true;lo.add(sh);
    const ft=sph(skin,.5,.3,.8,true);ft.position.set(0,-1.4,-.2);lo.add(ft);
    for(let c=-1;c<=1;c++){const cl=cone(clawM,.1,.55);cl.position.set(c*.22,-1.45,-.95);cl.rotation.x=-1.7;lo.add(cl)}
    lg.rotation.x=z<0?.5:-.4;lo.rotation.x=z<0?1.5:-1.15;lg.userData.k=k;body.add(lg);legs.push({lg,lo,front:z<0})});
  /* wings */
  function bone(parent,a,b,r1,r2){const d=new THREE.Vector3().subVectors(b,a),len=d.length();const m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,len,6),skin);m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.castShadow=true;parent.add(m);return m}
  function membrane(parent,tris){const pos=[],uv=[];tris.forEach(t=>t.forEach(p=>{pos.push(p[0],p[1],p[2]);uv.push(p[0]/12,p[2]/12+.1)}));const gm=new THREE.BufferGeometry();gm.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));gm.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));gm.computeVertexNormals();const m=new THREE.Mesh(gm,memM);m.castShadow=true;parent.add(m)}
  const V=(x,y,z)=>new THREE.Vector3(x,y,z),P=(x,y,z)=>[x,y,z];
  const wings=[];
  [-1,1].forEach(sg=>{
    const mirror=new THREE.Group();mirror.position.set(sg*1.7,1.5,-.8);mirror.scale.x=sg;body.add(mirror);
    const sh=new THREE.Group();mirror.add(sh);
    const E=V(4.2,.3,-.7);bone(sh,V(0,0,0),E,.34,.24);
    membrane(sh,[[P(0,0,0),P(4.2,.3,-.7),P(.6,-.5,7.2)],[P(4.2,.3,-.7),P(4.2,.3,6.6),P(.6,-.5,7.2)]]);
    const out=new THREE.Group();out.position.copy(E);sh.add(out);
    const W=V(4.6,.6,-1.3);bone(out,V(0,0,0),W,.24,.17);
    const tips=[V(11.2,0,.8),V(12.2,-.4,5.2),V(9.4,-.4,9.4),V(5.2,-.2,11.4)];
    tips.forEach((t,i)=>bone(out,W,t,.15,.04));
    membrane(out,[[P(W.x,W.y,W.z),P(tips[0].x,tips[0].y,tips[0].z),P(tips[1].x,tips[1].y,tips[1].z)],[P(W.x,W.y,W.z),P(tips[1].x,tips[1].y,tips[1].z),P(tips[2].x,tips[2].y,tips[2].z)],[P(W.x,W.y,W.z),P(tips[2].x,tips[2].y,tips[2].z),P(tips[3].x,tips[3].y,tips[3].z)],[P(0,0,0),P(W.x,W.y,W.z),P(tips[3].x,tips[3].y,tips[3].z)],[P(0,0,0),P(tips[3].x,tips[3].y,tips[3].z),P(0,0,6.6)]]);
    const wc=cone(clawM,.16,.7);wc.position.copy(W);wc.rotation.x=-1.9;out.add(wc);
    wings.push({sh,out,sg});
  });
  root.userData={body,neck,head,jaw,tail,legs,wings,t:Math.random()*10,ph:0,fl:.5};
  root.traverse(o=>{if(o.isMesh)o.castShadow=true});
  return root;
}
function updateDragon(d,dt,s){
  const U=d.userData,t=(U.t+=dt);
  U.fl=lerp(U.fl,s.flap,Math.min(1,dt*6));
  const f=U.fl,freq=lerp(1.5,3.6,f),amp=lerp(.42,.8,f);
  U.ph+=dt*freq*6.2832;const ph=U.ph;
  U.wings.forEach(w=>{
    w.sh.rotation.z=Math.sin(ph)*amp+.1;w.sh.rotation.y=-.12+Math.cos(ph)*.2;w.sh.rotation.x=Math.cos(ph)*.07;
    w.out.rotation.z=Math.sin(ph-1.0)*amp*.7-.05;w.out.rotation.y=Math.cos(ph-1.0)*.16;
  });
  U.body.position.y=-Math.sin(ph)*.35*f+Math.sin(t*1.4)*.1;
  U.tail.forEach((g,i)=>{g.rotation.y=Math.sin(t*1.7-i*.5)*(.05+i*.012)+s.turn*.05;g.rotation.x=Math.sin(ph-i*.45)*.035+.02});
  U.neck.forEach((g,i)=>{g.rotation.y=Math.sin(t*1.1-i*.45)*.035+s.look*.07;g.rotation.x=g.userData.base+Math.sin(ph-i*.3)*.025});
  U.head.rotation.x=-.85+Math.sin(ph-1.6)*.03;
  U.head.rotation.y=(s.shake>0?Math.sin(t*30)*.42*Math.min(1,s.shake):0)+s.look*.18;
  U.jaw.rotation.x=-(.04+s.mouth*.6);
  U.legs.forEach(l=>{l.lg.rotation.z=Math.sin(t*1.5+l.lg.userData.k)*.04});
  d.rotation.z=-s.turn*.5;d.rotation.x=s.pitch;
}

/* ---------------- Mascot: shared 3D buddy for every game ---------------- */
const PALS=['green','red','blue','purple','gold'];
let hsh=0;for(const c of location.pathname)hsh=(hsh*31+c.charCodeAt(0))|0;
const PAL=PALS[Math.abs(hsh)%PALS.length];
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const S=Math.max(88,Math.min(150,Math.round(Math.min(innerWidth,innerHeight)*.21)));
let off=false;try{off=localStorage.getItem('mascot_off')==='1'}catch(e){}
const box=document.createElement('div');box.id='mascotBox';
box.style.cssText='position:fixed;left:6px;bottom:6px;width:'+S+'px;height:'+S+'px;z-index:4000;pointer-events:none;font-family:Fredoka,Trebuchet MS,sans-serif';
const tg=document.createElement('button');tg.id='mascotTg';tg.type='button';tg.setAttribute('aria-label','Show or hide the dragon buddy');
tg.style.cssText='position:absolute;left:0;top:-4px;width:26px;height:26px;border-radius:50%;border:2px solid #fff;background:#0b3a78;color:#fff;font-size:13px;line-height:1;padding:0;cursor:pointer;pointer-events:auto;z-index:2;box-shadow:0 2px 0 #06244d';tg.textContent=off?'🐲':'✕';
const bub=document.createElement('div');bub.id='mascotBub';bub.style.cssText='position:absolute;left:50%;top:2px;transform:translate(-50%,-100%) scale(.6);background:#fff;color:#0b3a78;font-weight:700;font-size:18px;border:3px solid #ffe14a;border-radius:14px;padding:2px 10px;opacity:0;transition:.25s;white-space:nowrap;pointer-events:none;z-index:3';
const holder=document.createElement('div');holder.style.cssText='position:absolute;inset:0;'+(off?'display:none':'');
box.appendChild(holder);box.appendChild(tg);box.appendChild(bub);
function mount(){document.body.appendChild(box)}
if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount);
tg.onclick=()=>{off=!off;try{localStorage.setItem('mascot_off',off?'1':'0')}catch(e){}holder.style.display=off?'none':'';tg.textContent=off?'🐲':'✕';bub.style.opacity=0};

/* ---- keep clear of full-width bars (keyboards, number pads) at the bottom ---- */
function place(){
  let lift=6;
  try{document.querySelectorAll("body *").forEach(el=>{if(box.contains(el)||el===box)return;const r=el.getBoundingClientRect();
    if(r.height>=48&&r.width>=innerWidth*.55&&r.bottom>=innerHeight-6&&r.bottom<=innerHeight+6&&r.top>innerHeight*.45){const cs=getComputedStyle(el);if(cs.display!=="none"&&cs.visibility!=="hidden")lift=Math.max(lift,Math.round(innerHeight-r.top)+6)}})}catch(e){}
  box.style.bottom=Math.min(lift,innerHeight*.5)+"px";
}
let placeT=0;const placeSoon=()=>{clearTimeout(placeT);placeT=setTimeout(place,250)};
addEventListener("resize",placeSoon);addEventListener("orientationchange",placeSoon);addEventListener("load",()=>{place();setTimeout(place,1500)});
/* ---- reactions ---- */
let mode='idle',mt=0,bubT=0,lastCheer=0,fallback=null;
function say(t){if(off)return;bub.textContent=t;bub.style.opacity=1;bub.style.transform='translate(-50%,-100%) scale(1)';clearTimeout(bubT);bubT=setTimeout(()=>{bub.style.opacity=0;bub.style.transform='translate(-50%,-100%) scale(.6)'},1400)}
function sparkle(){if(off)return;for(let i=0;i<7;i++){const s=document.createElement('span');s.textContent=['✨','⭐','💫'][i%3];s.style.cssText='position:absolute;left:'+(20+Math.random()*60)+'%;top:'+(30+Math.random()*30)+'%;font-size:16px;transition:all .9s ease-out;opacity:1;pointer-events:none;z-index:3';box.appendChild(s);requestAnimationFrame(()=>{s.style.transform='translate('+((Math.random()-.5)*70)+'px,'+(-30-Math.random()*50)+'px) scale(1.3)';s.style.opacity=0});setTimeout(()=>s.remove(),1000)}}
const Mascot={
  cheer(t){const n=Date.now();if(n-lastCheer<700)return;lastCheer=n;mode='cheer';mt=0;say(t||pick(['Nice!','Yay!','Great!','Wow!']));sparkle();fb('cheer')},
  win(t){mode='win';mt=0;say(t||'🎉 You did it!');sparkle();setTimeout(sparkle,400);fb('win')},
  oops(t){mode='oops';mt=0;say(t||pick(['Oops!','Try again!','Uh-oh!']));fb('oops')},
  hide(){off=true;holder.style.display='none'},show(){off=false;holder.style.display=''}
};
function pick(a){return a[Math.floor(Math.random()*a.length)]}
window.Mascot=Mascot;
function fb(cls){if(!fallback)return;fallback.className='mb-'+cls;setTimeout(()=>{if(fallback)fallback.className=''},900)}

/* ---- automatic detection of score changes and result screens ---- */
const SCORE=/score|point|pts|coin|star|combo|streak|solved|found|caught/i,LIFE=/life|lives|heart|feather|strike/i,BADID=/best|high|record|timer|clock|\btime\b|fps|total|level|round|lv/i;
const winRe=/\b(win|wins|won|great|congrat\w*|super|amazing|nice job|perfect|complete|completed|solved|new record|new best|you did it|well done|brilliant|victory|champion)\b|🏆|🎉|⭐/i;
const loseRe=/game over|time.?s up|out of (moves|coins|time)|you lost|try again|bust|crashed|failed|too slow|needs a rest|computer wins|oops/i;
const OVTOK=new Set(["ov","overlay","over","modal","result","results","popup","dialog","end","gameover","game-over","msg","summary","finish","finished","win","lose","duoov","duocard"]);
const num=s=>{const m=(s||"").replace(/,/g,"").match(/-?\d+(\.\d+)?/);return m?+m[0]:null};
const idOf=el=>((el.id||"")+" "+(typeof el.className==="string"?el.className:"")).toLowerCase();
const lastVal=new WeakMap(),seenVis=new WeakMap();let pending=new Set(),timer=0;
function visible(el){if(!el.isConnected)return false;const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;const cs=getComputedStyle(el);return cs.display!=="none"&&cs.visibility!=="hidden"&&+cs.opacity>.05}
function overlayOf(el){for(let o=el,i=0;o&&o!==document.body&&i<6;o=o.parentElement,i++){if(idOf(o).split(/\s+/).some(t=>OVTOK.has(t)))return o}return null}
function checkScore(el){
  const id=idOf(el);if(BADID.test(id))return;if(!SCORE.test(id)&&!LIFE.test(id))return;
  if(el.children.length>3)return;const v=num(el.textContent);if(v==null)return;
  const p=lastVal.get(el);lastVal.set(el,v);if(p==null||v===p)return;
  if(LIFE.test(id)&&!SCORE.test(id)){if(v<p)Mascot.oops()}else if(v>p)Mascot.cheer();
}
function checkOverlay(el){
  if(box.contains(el))return;const o=overlayOf(el);if(!o)return;
  const vis=visible(o),was=seenVis.get(o);seenVis.set(o,vis);if(!vis||was===true)return;
  const t=(o.innerText||"").slice(0,400);if(t.length<3)return;
  if(loseRe.test(t))Mascot.oops("😵");else if(winRe.test(t))Mascot.win();
}
function scanInitial(){document.querySelectorAll("[id],[class]").forEach(el=>{if(box.contains(el))return;if(idOf(el).split(/\s+/).some(t=>OVTOK.has(t)))seenVis.set(el,visible(el));if(SCORE.test(idOf(el))&&!BADID.test(idOf(el))&&el.children.length<=3){const v=num(el.textContent);if(v!=null)lastVal.set(el,v)}})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(scanInitial,50));else setTimeout(scanInitial,50);
function flush(){timer=0;const list=[...pending];pending=new Set();list.forEach(el=>{try{checkScore(el);checkOverlay(el)}catch(e){}})}
new MutationObserver(ms=>{if(off)return;for(const m of ms){const el=m.target.nodeType===3?m.target.parentElement:m.target;if(el&&!box.contains(el))pending.add(el);m.addedNodes&&m.addedNodes.forEach(n=>{if(n.nodeType===1&&!box.contains(n))pending.add(n)})}if(!timer)timer=setTimeout(flush,160)}).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["class","style","hidden"]});

/* ---- pointer look ---- */
let look=0;addEventListener('pointermove',e=>{const r=box.getBoundingClientRect(),cx=r.left+r.width/2;look=Math.max(-1,Math.min(1,(e.clientX-cx)/Math.max(200,innerWidth*.5)))},{passive:true});

/* ---- 3D scene ---- */
function init3D(){
  const cv=document.createElement('canvas');cv.style.cssText='width:100%;height:100%;display:block';holder.appendChild(cv);
  const renderer=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(S,S,false);renderer.setClearColor(0,0);
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(42,1,1,400);cam.position.set(15,9,-32);cam.lookAt(-.5,3,-3);
  scene.add(new THREE.HemisphereLight(0xffffff,0x6a7a5a,1.0));const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(20,40,-30);scene.add(dl);
  const d=buildDragon(PAL);scene.add(d);d.position.set(0,0,0);
  let last=performance.now(),acc=0,frames=0,slow=0;
  function loop(now){
    requestAnimationFrame(loop);if(off||document.hidden){last=now;return}
    const dt=Math.min(.1,(now-last)/1000);if(dt<.03)return;last=now;mt+=dt;
    let flap=.4,shake=0,mouth=0,pitch=0,y=Math.sin(now/600)*1.2,yaw=0;
    if(mode==='cheer'){const k=Math.min(1,mt/.9);flap=1;mouth=.7;y+=Math.sin(k*Math.PI)*5;if(mt>.9)mode='idle'}
    else if(mode==='win'){const k=Math.min(1,mt/1.5);flap=1;mouth=.5;y+=Math.sin(k*Math.PI)*6;yaw=k*Math.PI*2;if(mt>1.5)mode='idle'}
    else if(mode==='oops'){flap=.12;shake=1;pitch=.2;y-=1.5;if(mt>1)mode='idle'}
    if(reduce){flap=.2}
    d.position.y=y;d.rotation.y=yaw+look*.35;
    updateDragon(d,dt,{flap,turn:0,pitch,look:look,mouth,shake});
    renderer.render(scene,cam);
    frames++;if(frames>40&&frames<=100){slow+=dt>.07?1:0;if(frames===100&&slow>25){holder.removeChild(cv);renderer.dispose();useFallback()}}
  }
  requestAnimationFrame(loop);
}
function useFallback(){
  const st=document.createElement('style');st.textContent='@keyframes mbIdle{50%{transform:translateY(-6px)}}@keyframes mbCheer{50%{transform:translateY(-18px) scale(1.2)}}@keyframes mbOops{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}.mb-cheer,.mb-win{animation:mbCheer .6s 2!important}.mb-oops{animation:mbOops .3s 3!important}';document.head.appendChild(st);
  fallback=document.createElement('div');fallback.textContent='🐲';fallback.style.cssText='font-size:'+Math.round(S*.7)+'px;line-height:'+S+'px;text-align:center;animation:mbIdle 2.4s infinite';holder.appendChild(fallback);
}
function start(){
  if(window.THREE){try{init3D()}catch(e){useFallback()}return}
  const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload=()=>{try{init3D()}catch(e){useFallback()}};s.onerror=useFallback;document.head.appendChild(s);
}
const go=()=>{if(window.requestIdleCallback)requestIdleCallback(start,{timeout:600});else setTimeout(start,300)};
if(document.readyState==='complete')go();else addEventListener('load',go);

})();
