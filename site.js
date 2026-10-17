import { CLIPS } from './clips.js';
/* ---------- fluid orb (WebGL) ---------- */
function makeOrb(canvas){
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
  if(!gl){canvas.style.background='radial-gradient(circle at 35% 35%,#F3EEE3,#9FD8C4 45%,#0F2622 75%)';return;}
  const vs=`attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const fs=`precision highp float;uniform float t;uniform vec2 r;
  vec3 hash3(vec3 p){p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));return -1.+2.*fract(sin(p)*43758.5453123);}
  float noise(vec3 p){vec3 i=floor(p),f=fract(p);vec3 u=f*f*(3.-2.*f);
    return mix(mix(mix(dot(hash3(i+vec3(0,0,0)),f-vec3(0,0,0)),dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
                   mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
               mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
                   mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);}
  float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*noise(p);p*=2.02;a*=.5;}return s;}
  void main(){
    vec2 uv=(gl_FragCoord.xy-.5*r)/min(r.x,r.y)*2.;
    float d=length(uv);
    float edge=1.-smoothstep(.92,.99,d);
    if(edge<=0.){gl_FragColor=vec4(0.);return;}
    float z=sqrt(max(0.,1.-d*d));
    vec3 n=vec3(uv,z);
    float f1=fbm(n*1.6+vec3(0.,t*.25,t*.15));
    float f2=fbm(n*2.8-vec3(t*.2,0.,t*.1)+f1);
    vec3 cream=vec3(.953,.933,.890);
    vec3 mint=vec3(.624,.847,.769);
    vec3 teal=vec3(.18,.55,.52);
    vec3 pine=vec3(.06,.15,.13);
    vec3 col=mix(teal,mint,smoothstep(-.35,.35,f1));
    col=mix(col,cream,smoothstep(-.1,.45,f2));
    col=mix(col,vec3(.55,.80,.95),smoothstep(.15,.6,f1*.6-f2*.5)*.6);
    float rim=pow(1.-z,1.8);
    col=mix(col,teal*.6,rim*.7);
    float spec=pow(max(0.,dot(n,normalize(vec3(-.5,.7,.6)))),18.);
    col+=spec*.35;
    gl_FragColor=vec4(col,edge);
  }`;
  function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o;}
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const p=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
  const ut=gl.getUniformLocation(pr,'t'),ur=gl.getUniformLocation(pr,'r');
  const coarse=matchMedia('(hover:none)').matches;
  if(coarse){canvas.width=Math.round(canvas.width/2);canvas.height=Math.round(canvas.height/2);}
  gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(ur,canvas.width,canvas.height);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t0=performance.now();
  let lastDraw=0;
  function frame(now){
    if(document.documentElement.dataset.mo==='off'){requestAnimationFrame(frame);return;}
    if(!coarse||now-lastDraw>33){lastDraw=now;gl.uniform1f(ut,(now-t0)/1000);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
    if(!reduce)requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
}
makeOrb(document.getElementById('orbCanvas'));
makeOrb(document.getElementById('orbCanvasSmall'));

/* ---------- assistant ---------- */
const panel=document.getElementById('panel'),orbBtn=document.getElementById('orbBtn'),msgs=document.getElementById('msgs'),
      form=document.getElementById('compose'),q=document.getElementById('q'),send=document.getElementById('send'),typing=document.getElementById('typing'),hint=document.getElementById('orbHint');
const history=[];
function open(){panel.dataset.open='true';orbBtn.setAttribute('aria-expanded','true');hint.classList.remove('show');
  if(!matchMedia('(hover:none)').matches)setTimeout(()=>q.focus(),50);}
function close(){panel.dataset.open='false';orbBtn.setAttribute('aria-expanded','false');orbBtn.focus();}
orbBtn.addEventListener('click',()=>panel.dataset.open==='true'?close():open());
document.getElementById('closePanel').addEventListener('click',close);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.dataset.open==='true')close();});
document.querySelectorAll('[data-open-assistant]').forEach(b=>b.addEventListener('click',open));
setTimeout(()=>hint.classList.add('show'),2500);setTimeout(()=>hint.classList.remove('show'),8000);
function add(role,text){const d=document.createElement('div');d.className='msg '+role;d.textContent=text;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;}
async function ask(text){
  text=text.trim();if(!text)return;
  open();add('me',text);history.push({role:'user',content:text});
  send.disabled=true;typing.hidden=false;
  try{
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history.slice(-8)})});
    const data=await res.json();
    if(!res.ok||!data.reply)throw new Error(data.error||'no reply');
    add('ai',data.reply);history.push({role:'assistant',content:data.reply});
    if(window.__offerClip){
      const off=window.__offerClip(text);
      if(off){
        const b=document.createElement('button');
        b.type='button'; b.className='watch-chip';
        b.textContent='▶  Watch Vamsi answer this';
        b.addEventListener('click',()=>{
          const p=document.querySelector('.photo-wrap');
          if(p)p.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
          off.play();
        });
        msgs.appendChild(b); msgs.scrollTop=msgs.scrollHeight;
      }
    }
  }catch(err){
    add('ai err','The assistant is offline right now. Email kosurivamsi5@gmail.com and Vamsi will answer in person.');
  }finally{send.disabled=false;typing.hidden=true;}
}
form.addEventListener('submit',e=>{e.preventDefault();const v=q.value;q.value='';ask(v);});
document.querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.q)));

/* ---------- pointer ---------- */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const h=document.documentElement; h.classList.add('cur');
  const dot=document.createElement('div'), ring=document.createElement('div');
  dot.className='cur-dot'; ring.className='cur-ring';
  dot.setAttribute('aria-hidden','true'); ring.setAttribute('aria-hidden','true');
  document.body.append(dot,ring);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;h.classList.remove('cur-out');
    dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)';},{passive:true});
  addEventListener('mousedown',()=>h.classList.add('cur-down'));
  addEventListener('mouseup',()=>h.classList.remove('cur-down'));
  document.addEventListener('mouseleave',()=>h.classList.add('cur-out'));
  document.addEventListener('mouseover',e=>{h.classList.toggle('cur-hover',!!e.target.closest('a,button,input,.bubble'));});
  (function loop(){const k=(reduce||h.dataset.mo==='off')?1:.16;rx+=(mx-rx)*k;ry+=(my-ry)*k;
    ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';requestAnimationFrame(loop);})();
})();
/* ---------- theme + lamp ---------- */
(function(){
  const root=document.documentElement,lamp=document.getElementById('lamp');
  let saved=null;try{saved=localStorage.getItem('theme');}catch(e){}
  const initial=saved||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
  function apply(t,animate){
    if(animate)root.classList.add('theming');
    if(t==='light')root.setAttribute('data-theme','light');else root.removeAttribute('data-theme');
    lamp.setAttribute('aria-pressed',t==='light'?'true':'false');
    lamp.setAttribute('aria-label',t==='light'?'Switch to dark mode':'Switch to light mode');
    try{localStorage.setItem('theme',t);}catch(e){}
    if(animate)setTimeout(()=>root.classList.remove('theming'),500);
  }
  apply(initial,false);
  function toggle(){apply(root.getAttribute('data-theme')==='light'?'dark':'light',true);
    lamp.classList.remove('swinging');void lamp.offsetWidth;lamp.classList.add('swinging');}
  const cord=lamp.querySelector('.cord');
  let down=false,sy=0,sx=0,pulled=0,moved=false;
  lamp.addEventListener('pointerdown',e=>{down=true;moved=false;sy=e.clientY;sx=e.clientX;pulled=0;lamp.setPointerCapture(e.pointerId);cord.style.transition='none';});
  lamp.addEventListener('pointermove',e=>{if(!down)return;const dy=Math.max(0,Math.min(34,e.clientY-sy)),dx=Math.max(-14,Math.min(14,e.clientX-sx));
    if(Math.abs(e.clientY-sy)>4||Math.abs(e.clientX-sx)>4)moved=true;pulled=dy;
    cord.style.transform='translate('+dx*.6+'px,'+dy+'px) rotate('+(dx*.8)+'deg)';});
  function release(e){if(!down)return;down=false;cord.style.transition='';cord.style.transform='';
    if(pulled>=16||!moved){toggle();}
    if(e&&e.type==='pointerup'&&!moved)e.preventDefault();}
  lamp.addEventListener('pointerup',release);lamp.addEventListener('pointercancel',release);
  lamp.addEventListener('click',e=>{if(e.detail===0)toggle();}); /* keyboard activation */
})();

/* ---------- read aloud ---------- */
(function(){
  const btn=document.getElementById('listenBtn'),bar=document.getElementById('reader');
  if(!('speechSynthesis' in window)){btn.parentElement.style.display='none';return;}
  const synth=speechSynthesis;
  const secs=[...document.querySelectorAll('main > section')];
  const titles=secs.map(s=>{const h=s.querySelector('h1,h2');return h?h.textContent.replace(/\s+/g,' ').trim():'Section';});
  function textOf(sec){const c=sec.cloneNode(true);c.querySelectorAll('.bubbles,button,.links,.tag,.cta,.skills,canvas').forEach(n=>n.remove());
    return [...c.querySelectorAll('h1,h2,h3,p,li,blockquote,.title,.meta')].map(n=>n.textContent.replace(/\s+/g,' ').trim()).filter(Boolean).join('. ');}
  const rdTitle=document.getElementById('rdTitle'),rdPos=document.getElementById('rdPos'),rdPlay=document.getElementById('rdPlay'),rdPlayIcon=document.getElementById('rdPlayIcon');
  let i=0,playing=false,queue=[],voice=null,current=null;
  function pickVoice(){const v=synth.getVoices();voice=v.find(x=>/en-US|en-GB|en-IN/i.test(x.lang)&&/Google|Natural|Samantha|Daniel|Aria|Jenny|Serena/i.test(x.name))||v.find(x=>/^en/i.test(x.lang))||v[0]||null;}
  pickVoice();synth.addEventListener('voiceschanged',pickVoice);
  function setIcon(p){rdPlayIcon.innerHTML=p?'<path d="M4 2h3v12H4zM9 2h3v12H9z"/>':'<path d="M4 2l10 6-10 6z"/>';rdPlay.setAttribute('aria-label',p?'Pause':'Play');}
  function mark(){secs.forEach((s,k)=>s.classList.toggle('reading',k===i));rdTitle.textContent=titles[i];rdPos.textContent='· '+(i+1)+' of '+secs.length;}
  function speakSection(){synth.cancel();queue=textOf(secs[i]).split(/(?<=[.!?])\s+/).filter(Boolean);mark();
    secs[i].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});next();}
  function next(){if(!queue.length){if(i<secs.length-1){i++;speakSection();}else{stop();}return;}
    const u=new SpeechSynthesisUtterance(queue.shift());if(voice)u.voice=voice;u.rate=.97;u.pitch=1;
    u.onend=()=>{if(playing&&current===u)next();};current=u;synth.speak(u);}
  function start(){playing=true;bar.dataset.open='true';btn.setAttribute('aria-pressed','true');setIcon(true);speakSection();}
  function stop(){playing=false;synth.cancel();queue=[];bar.dataset.open='false';btn.setAttribute('aria-pressed','false');secs.forEach(s=>s.classList.remove('reading'));i=0;btn.focus();}
  function pauseToggle(){if(!playing)return;if(synth.paused){synth.resume();setIcon(true);}else{synth.pause();setIcon(false);}}
  function go(d){i=Math.max(0,Math.min(secs.length-1,i+d));if(synth.paused)synth.resume();setIcon(true);speakSection();}
  btn.addEventListener('click',()=>{if(playing)stop();else{const top=secs.findIndex(s=>s.getBoundingClientRect().bottom>120);i=top<0?0:top;start();}});
  rdPlay.addEventListener('click',pauseToggle);document.getElementById('rdNext').addEventListener('click',()=>go(1));
  document.getElementById('rdPrev').addEventListener('click',()=>go(-1));document.getElementById('rdStop').addEventListener('click',stop);
  document.addEventListener('keydown',e=>{if(e.altKey&&!e.ctrlKey&&!e.metaKey){const k=e.key.toLowerCase();
      if(k==='p'){e.preventDefault();playing?pauseToggle():btn.click();}else if(k==='n'&&playing){e.preventDefault();go(1);}else if(k==='b'&&playing){e.preventDefault();go(-1);}}
    if(e.key==='Escape'&&playing)stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing&&!synth.paused){synth.pause();setIcon(false);}});
  addEventListener('beforeunload',()=>synth.cancel());
})();

/* ---------- butterfly ---------- */
(function(){
  const el=document.getElementById('bfly'); if(!el)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const flower=document.querySelector('.endflora .b1');

  // smooth wander: layered sines never jump, so the path is continuous
  let t=Math.random()*100, last=performance.now(), shown=false, idle=0, land=0;
  let px=0, py=0, prevX=0, prevY=0, ang=0, started=false;

  function wander(){
    const w=innerWidth, h=innerHeight;
    const x=w*(.5+.34*Math.sin(t*.17)+.10*Math.sin(t*.41+1.3)+.05*Math.sin(t*.93+2.1));
    const y=h*(.5+.26*Math.cos(t*.21+.7)+.09*Math.cos(t*.53+2.4)+.04*Math.sin(t*1.11));
    return {x:Math.max(30,Math.min(w-60,x)), y:Math.max(80,Math.min(h-90,y))};
  }
  function flowerPos(){
    const call=window.__bflyCall;
    if(call&&Date.now()<call.until){const r=call.el.getBoundingClientRect();
      if(r.bottom>0&&r.top<innerHeight)return {x:r.left+r.width/2-17,y:r.top+r.height*.08};}
    if(!flower)return null;
    const r=flower.getBoundingClientRect();
    if(r.top>innerHeight-60||r.bottom<0)return null;
    return {x:r.left+r.width/2-17, y:r.top-21};
  }

  addEventListener('scroll',()=>{idle=0;if(!shown){shown=true;el.classList.add('on');}},{passive:true});

  function frame(now){
    let dt=(now-last)/1000; last=now;
    if(document.documentElement.dataset.mo==='off'){requestAnimationFrame(frame);return;}
    if(!(dt>0))dt=.016;                // first frame / clock skew
    if(dt>.04)dt=.04;                  // a slow frame must not cause a jump
    t+=dt; idle+=dt;

    const f=flowerPos();
    // ease the blend between wandering and landing instead of switching instantly
    land += ((f?1:0)-land)*Math.min(1,dt*1.6);
    if(land<.001)land=0;

    const w=wander();
    if(!started){started=true;px=prevX=w.x;py=prevY=w.y;}
    let tx=w.x, ty=w.y;
    if(f){ tx=w.x+(f.x-w.x)*land; ty=w.y+(f.y-w.y)*land; }

    // critically-damped follow, frame-rate independent, with a hard speed limit
    const k=1-Math.pow(.001, dt*(f?1.1:.55));
    let dx=(tx-px)*k, dy=(ty-py)*k;
    const step=Math.hypot(dx,dy), maxStep=(f?220:(innerWidth<720?80:105))*dt;   // px per second
    if(step>maxStep && step>1e-6){ const s=maxStep/step; dx*=s; dy*=s; }
    if(Number.isFinite(dx)&&Number.isFinite(dy)){ px+=dx; py+=dy; }
    if(!Number.isFinite(px)||!Number.isFinite(py)){ px=w.x; py=w.y; prevX=px; prevY=py; ang=0; }

    // bank into the direction of travel, smoothed
    const vx=px-prevX, vy=py-prevY; prevX=px; prevY=py;
    const speed=Math.hypot(vx,vy);
    const want=speed>.05?Math.max(-18,Math.min(18,Math.atan2(vy,vx)*57.3*.16)):0;
    ang+=(want-ang)*Math.min(1,dt*2.2);

    el.style.transform='translate('+px.toFixed(2)+'px,'+py.toFixed(2)+'px) rotate('+ang.toFixed(2)+'deg)';
    el.classList.toggle('landed', !!f && land>.93 && speed<.35);
    if(f){ idle=0; if(!shown){shown=true;el.classList.add('on');} }
    else if(idle>10&&shown){ shown=false; el.classList.remove('on'); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  setTimeout(()=>{shown=true;el.classList.add('on');},1600);
})();

/* ---------- plain text reading mode ---------- */
(function(){
  const btn=document.getElementById('readBtn'); if(!btn)return;
  const root=document.documentElement;
  let on=false; try{on=localStorage.getItem('reading')==='1';}catch(e){}
  function apply(v){on=v;
    if(v)root.setAttribute('data-reading','');else root.removeAttribute('data-reading');
    btn.setAttribute('aria-pressed',v?'true':'false');
    btn.textContent=v?'Exit plain text':'Plain text view';
    btn.setAttribute('aria-label',v?'Exit plain text view':'Switch to plain text view');
    try{localStorage.setItem('reading',v?'1':'0');}catch(e){}}
  apply(on);
  btn.addEventListener('click',()=>apply(!on));
  document.addEventListener('keydown',e=>{
    if(on&&e.altKey&&e.shiftKey&&e.key.toLowerCase()==='p'){e.preventDefault();apply(false);}
  });
})();

/* ---------- display settings ---------- */
(function(){
  const root=document.documentElement,btn=document.getElementById('a11yBtn'),panel=document.getElementById('setPanel');
  if(!btn)return;
  const keys={ct:'a11y-ct',cb:'a11y-cb',ts:'a11y-ts',mo:'a11y-mo',hm:'a11y-hm'};
  function set(kind,val){
    if(val&&val!=='normal'&&val!=='none'&&val!=='100'&&val!=='on'&&val!=='desk')root.setAttribute('data-'+kind,val);else root.removeAttribute('data-'+kind);
    try{localStorage.setItem(keys[kind],val);}catch(e){}
    panel.querySelectorAll('[data-'+kind+']').forEach(b=>b.setAttribute('aria-pressed',b.dataset[kind]===val?'true':'false'));
  }
  const osReduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  ['ct','cb','ts','mo','hm'].forEach(k=>{
    let v=null;try{v=localStorage.getItem(keys[k]);}catch(e){}
    set(k,v||(k==='ct'?'normal':k==='cb'?'none':k==='mo'?(osReduce?'off':'on'):k==='hm'?'desk':'100'));
  });
  panel.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b)return;
    if(b.id==='setReset'){set('ct','normal');set('cb','none');set('ts','100');set('mo',osReduce?'off':'on');set('hm','desk');return;}
    if(b.classList.contains('act'))return;   // Plain text / Listen handle themselves
    ['ct','cb','ts','mo','hm'].forEach(k=>{ if(b.dataset[k]!==undefined) set(k,b.dataset[k]); });
  });
  function open(v){panel.hidden=!v;btn.setAttribute('aria-expanded',v?'true':'false');
    if(v){const np=document.getElementById('navPanel'),mb=document.getElementById('menuBtn');
      if(np){np.hidden=true;} if(mb){mb.setAttribute('aria-expanded','false');}
      panel.querySelector('button').focus();}}
  btn.addEventListener('click',()=>open(panel.hidden));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){open(false);btn.focus();}});
  document.addEventListener('click',e=>{if(!panel.hidden&&!panel.contains(e.target)&&e.target!==btn&&!btn.contains(e.target))open(false);});
})();



/* ---------- photo: tap for a little show ---------- */
(function(){
  const btn=document.getElementById('photoBtn'), fx=document.getElementById('photoFx'), hint=document.getElementById('photoHint');
  if(!btn||!fx)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const accent=()=>getComputedStyle(document.documentElement).getPropertyValue('--mint').trim()||'#9FD8C4';
  const cream=()=>getComputedStyle(document.documentElement).getPropertyValue('--cream').trim()||'#F3EEE3';
  let taps=0, cooling=false;
  const lines=['Tap the photo','Again?','He can hear you','Curious yet?','Okay, ask him something'];

  function ring(cx,cy,delay,size){
    const r=document.createElement('span'); r.className='ring';
    r.style.cssText='left:'+cx+'px;top:'+cy+'px;width:10px;height:10px;margin:-5px 0 0 -5px;border-color:'+accent();
    fx.appendChild(r);
    r.animate([{transform:'scale(.2)',opacity:.85},{transform:'scale('+size+')',opacity:0}],
      {duration:900,delay:delay,easing:'cubic-bezier(.16,.8,.3,1)'}).onfinish=()=>r.remove();
  }
  function burst(cx,cy,n){
    const cols=[accent(),cream(),accent()];
    for(let i=0;i<n;i++){
      const p=document.createElement('i');
      const a=(Math.PI*2*i)/n + Math.random()*.5, dist=70+Math.random()*130;
      const w=3+Math.random()*4, h=6+Math.random()*9;
      p.style.cssText='left:'+cx+'px;top:'+cy+'px;width:'+w+'px;height:'+h+'px;background:'+cols[i%3]+';opacity:.95';
      fx.appendChild(p);
      p.animate([
        {transform:'translate(0,0) rotate(0deg)',opacity:1},
        {transform:'translate('+Math.cos(a)*dist+'px,'+(Math.sin(a)*dist+60)+'px) rotate('+(Math.random()*720-360)+'deg)',opacity:0}
      ],{duration:1100+Math.random()*500,easing:'cubic-bezier(.12,.7,.3,1)'}).onfinish=()=>p.remove();
    }
  }
  function nudge(){
    const msgs=document.getElementById('msgs');
    if(!msgs)return;
    const open=document.querySelector('[data-open-assistant]');
    if(open)open.click();
    const d=document.createElement('div'); d.className='msg ai';
    d.textContent="You seem curious. Want to know what Vamsi actually works on?";
    msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight;
  }
  btn.addEventListener('click',()=>{
    if(cooling)return; cooling=true; setTimeout(()=>cooling=false,180);
    taps++;
    const r=btn.getBoundingClientRect(), f=fx.getBoundingClientRect();
    const cx=r.left+r.width/2-f.left, cy=r.top+r.height/2-f.top;
    btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
    if(!reduce&&document.documentElement.dataset.mo!=='off'){
      ring(cx,cy,0,Math.min(26,16+taps*2)); ring(cx,cy,140,Math.min(20,12+taps*2));
      burst(cx,cy,Math.min(46,16+taps*6));
    }
    if(hint)hint.textContent=lines[Math.min(taps,lines.length-1)];
    if(taps===5)nudge();
    if(taps>5&&taps%5===0)nudge();
  });
  btn.setAttribute('aria-label','Photo of Vamsi Krishna Kosuri. Activate for a small animation.');
})();

/* ---------- section menu ---------- */
(function(){
  const btn=document.getElementById('menuBtn'),panel=document.getElementById('navPanel');
  if(!btn||!panel)return;
  const a11y=document.getElementById('setPanel'),a11yBtn=document.getElementById('a11yBtn');
  function open(v){
    panel.hidden=!v; btn.setAttribute('aria-expanded',v?'true':'false');
    btn.setAttribute('aria-label',v?'Close menu':'Open menu');
    if(v){ if(a11y){a11y.hidden=true;} if(a11yBtn){a11yBtn.setAttribute('aria-expanded','false');}
           panel.querySelector('a').focus(); }
  }
  btn.addEventListener('click',()=>open(panel.hidden));
  panel.addEventListener('click',e=>{ if(e.target.closest('a')) open(false); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!panel.hidden){ open(false); btn.focus(); }});
  document.addEventListener('click',e=>{ if(!panel.hidden&&!panel.contains(e.target)&&!btn.contains(e.target)) open(false); });
})();

/* ---------- sticky notes ---------- */
(function(){
  const layer=document.getElementById('notesLayer'),bar=document.getElementById('notesBar'),
        tpl=document.getElementById('noteTpl'),countEl=document.getElementById('notesCount'),
        toggle=document.getElementById('notesToggle'),addBtn=document.getElementById('notesAdd'),
        cta=document.getElementById('noteCta');
  if(!layer||!tpl)return;
  const KEY='vk-notes';
  let notes=[];            // {id,x,y,col,text,mail,sent}
  let hidden=false;

  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({notes,hidden}));}catch(e){}};
  const load=()=>{try{const d=JSON.parse(localStorage.getItem(KEY)||'{}');
    if(Array.isArray(d.notes))notes=d.notes; hidden=!!d.hidden;}catch(e){}};

  function refreshBar(){
    bar.hidden=notes.length===0;
    countEl.textContent=notes.length;
    toggle.setAttribute('aria-pressed',hidden?'true':'false');
    toggle.textContent='';
    const n=document.createElement('span'); n.id='notesCount'; n.textContent=notes.length;
    toggle.append(n,document.createTextNode(hidden?' notes (hidden)':' notes'));
    layer.dataset.hidden=hidden?'true':'false';
  }

  function build(n){
    const el=tpl.content.firstElementChild.cloneNode(true);
    el.dataset.id=n.id; el.dataset.col=n.col;
    el.style.left=n.x+'px'; el.style.top=n.y+'px';
    if(n.rot===undefined){n.rot=+(Math.random()*8-4).toFixed(1);}
    const setRot=v=>{n.rot=Math.round(v*10)/10;el.style.setProperty('--rot',n.rot+'deg');};
    setRot(+n.rot);
    el.setAttribute('aria-label','Sticky note');
    const ta=el.querySelector('.note-text'), mail=el.querySelector('.note-mail'),
          send=el.querySelector('.note-send'), status=el.querySelector('.note-status');
    ta.value=n.text||''; mail.value=n.mail||'';
    ta.addEventListener('input',()=>{n.text=ta.value;save();});
    mail.addEventListener('input',()=>{n.mail=mail.value;save();});

    el.querySelectorAll('.col').forEach(b=>b.addEventListener('click',()=>{
      n.col=b.dataset.col; el.dataset.col=n.col;
      el.querySelectorAll('.col').forEach(x=>x.setAttribute('aria-checked',x===b?'true':'false'));
      save();}));
    el.querySelector('.col[data-col="'+n.col+'"]').setAttribute('aria-checked','true');
    el.querySelectorAll('.col').forEach(x=>{if(x.dataset.col!==n.col)x.setAttribute('aria-checked','false');});

    el.querySelector('.note-x').addEventListener('click',()=>{
      notes=notes.filter(o=>o.id!==n.id); el.remove(); refreshBar(); save();
      (cta||document.body).focus&&cta&&cta.focus();});

    send.addEventListener('click',async()=>{
      const text=ta.value.trim();
      if(!text){status.textContent='Write something first.';ta.focus();return;}
      send.disabled=true; status.textContent='Sending…';
      try{
        const r=await fetch('/api/note',{method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({text,email:mail.value.trim(),page:location.pathname+location.hash})});
        const d=await r.json().catch(()=>({}));
        if(r.ok&&d.ok){status.textContent='Sent. Thank you!';n.sent=true;save();
          setTimeout(()=>{status.textContent='';},4000);}
        else if(r.status===501){
          status.innerHTML='';
          const a=document.createElement('a');
          a.href='mailto:kosurivamsi5@gmail.com?subject='+encodeURIComponent('A note from your site')+'&body='+encodeURIComponent(text);
          a.textContent='Email it instead'; status.append('Not set up yet — ',a);
        }
        else{status.textContent=(d.detail||d.error||'Could not send')+' — try email.';}
      }catch(e){status.textContent='Network problem — try again.';}
      finally{send.disabled=false;}
    });

    // drag (pointer) + keyboard nudge
    const grip=el.querySelector('.grip');
    let sx,sy,ox,oy,drag=false;
    grip.addEventListener('pointerdown',e=>{drag=true;el.classList.add('dragging');
      sx=e.clientX;sy=e.clientY;ox=n.x;oy=n.y;grip.setPointerCapture(e.pointerId);e.preventDefault();});
    grip.addEventListener('pointermove',e=>{if(!drag)return;
      n.x=Math.max(4,Math.min(document.documentElement.scrollWidth-140,ox+e.clientX-sx));
      n.y=Math.max(4,oy+e.clientY-sy);
      el.style.left=n.x+'px'; el.style.top=n.y+'px';});
    const stop=()=>{if(!drag)return;drag=false;el.classList.remove('dragging');save();};
    grip.addEventListener('pointerup',stop); grip.addEventListener('pointercancel',stop);
    grip.tabIndex=0; grip.setAttribute('role','application');
    grip.setAttribute('aria-label','Move note. Use arrow keys.');
    // free rotation: drag the handle, or arrow keys when focused
    const rot=el.querySelector('.note-rot');
    if(rot){
      let spinning=false, startA=0, startRot=0;
      const centre=()=>{const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};};
      const angleOf=(e,c)=>Math.atan2(e.clientY-c.y,e.clientX-c.x)*180/Math.PI;
      rot.addEventListener('pointerdown',e=>{spinning=true;el.classList.add('rotating');
        const c=centre();startA=angleOf(e,c);startRot=+n.rot;rot.setPointerCapture(e.pointerId);e.preventDefault();});
      rot.addEventListener('pointermove',e=>{if(!spinning)return;
        const c=centre();let v=startRot+(angleOf(e,c)-startA);
        if(e.shiftKey)v=Math.round(v/15)*15;                 // hold Shift to snap
        setRot(v);});
      const stopRot=()=>{if(!spinning)return;spinning=false;el.classList.remove('rotating');save();};
      rot.addEventListener('pointerup',stopRot); rot.addEventListener('pointercancel',stopRot);
      rot.addEventListener('keydown',e=>{
        const step=e.shiftKey?15:5; let used=true;
        if(e.key==='ArrowLeft')setRot(+n.rot-step);
        else if(e.key==='ArrowRight')setRot(+n.rot+step);
        else if(e.key==='Home')setRot(0);
        else used=false;
        if(used){e.preventDefault();save();}});
    }
    grip.addEventListener('keydown',e=>{
      const step=e.shiftKey?40:10; let used=true;
      if(e.key==='ArrowLeft')n.x-=step; else if(e.key==='ArrowRight')n.x+=step;
      else if(e.key==='ArrowUp')n.y-=step; else if(e.key==='ArrowDown')n.y+=step;
      else used=false;
      if(used){e.preventDefault();n.x=Math.max(4,n.x);n.y=Math.max(4,n.y);
        el.style.left=n.x+'px';el.style.top=n.y+'px';save();}});
    layer.appendChild(el); return el;
  }

  function add(x,y){
    const id=Date.now().toString(36)+Math.floor(Math.random()*36).toString(36);
    const n={id,x:Math.round(x),y:Math.round(y),col:'sand',text:'',mail:''};
    notes.push(n); hidden=false; const el=build(n); refreshBar(); save();
    el.querySelector('.note-text').focus(); return el;
  }

  addBtn.addEventListener('click',()=>{
    const x=Math.min(innerWidth-300,60+Math.random()*Math.max(40,innerWidth-420));
    add(x, scrollY+120+Math.random()*80);
  });
  toggle.addEventListener('click',()=>{hidden=!hidden;refreshBar();save();});
  if(cta)cta.addEventListener('click',()=>{
    const r=cta.getBoundingClientRect();
    add(Math.max(16,Math.min(innerWidth-290,r.left)), scrollY+r.bottom+14);
  });

  load(); notes.forEach(build); refreshBar();
})();

/* ---------- talking photo: the picture speaks ---------- */
(function(){
  const wrap=document.querySelector('.photo-wrap'), btn=document.getElementById('photoBtn'),
        player=document.getElementById('vplayer'), vid=document.getElementById('vvid'),
        close=document.getElementById('vclose'), script=document.getElementById('vscript'),
        vtext=document.getElementById('vtext'), hint=document.getElementById('photoHint');
  if(!wrap||!btn||!vid)return;

  const clips=(Array.isArray(CLIPS)?CLIPS:[]).filter(c=>c&&c.file);
  const have=new Map();          // id -> clip, only ones whose file really exists
  let ready=false;

  async function check(){
    await Promise.all(clips.map(async c=>{
      try{const r=await fetch(c.file,{method:'HEAD'});if(r.ok)have.set(c.id,c);}catch(e){}
    }));
    ready=true;
    if(have.size&&hint)hint.textContent='Tap to hear from me';
    window.__clipsReady=have.size;
  }
  check();

  function play(clip){
    if(!clip)return false;
    vid.pause();
    vid.querySelectorAll('track').forEach(t=>t.remove());
    vid.src=clip.file;
    if(clip.vtt){
      const t=document.createElement('track');
      t.kind='captions'; t.label='English'; t.srclang='en'; t.src=clip.vtt; t.default=true;
      vid.appendChild(t);
    }
    vtext.textContent=clip.text||'';
    script.hidden=!clip.text;
    player.hidden=false; wrap.classList.add('vplaying');
    vid.currentTime=0;
    const go=()=>{const p=vid.play(); if(p&&p.catch)p.catch(()=>{});};
    if(vid.readyState>=2)go(); else vid.addEventListener('loadeddata',go,{once:true});
    vid.load();
    setTimeout(()=>close.focus(),120);
    return true;
  }
  function stop(){
    vid.pause(); vid.removeAttribute('src'); vid.load();
    player.hidden=true; wrap.classList.remove('vplaying'); btn.focus();
  }
  close.addEventListener('click',stop);
  vid.addEventListener('ended',()=>{ /* leave the last frame up, don't yank it away */ });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!player.hidden)stop(); });

  // tapping the photo plays the intro clip (falls back to the confetti if none exist yet)
  btn.addEventListener('click',()=>{
    if(!ready||!have.size)return;                       // photo.js confetti still runs
    const intro=[...have.values()].find(c=>c.intro)||[...have.values()][0];
    play(intro);
  },true);

  // let the assistant offer a clip when a question matches one
  window.__offerClip=function(question){
    if(!have.size)return null;
    const q=(question||'').toLowerCase();
    let best=null,score=0;
    have.forEach(c=>{
      let s=0;(c.ask||[]).forEach(k=>{ if(q.includes(k)) s+=k.length; });
      if(s>score){score=s;best=c;}
    });
    if(!best||score<4)return null;
    return {title:best.title,play:()=>play(best)};
  };
})();

/* ---------- the desk ---------- */
(function(){
  const desk=document.getElementById('desk'); if(!desk)return;
  const root=document.documentElement;
  const still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||root.dataset.mo==='off';

  // draw the desk in, once
  if(!still()){
    desk.querySelectorAll('.desk-art path,.desk-art rect,.desk-art circle').forEach(el=>el.setAttribute('pathLength','1'));
    desk.classList.add('drawing');
    const scr=desk.querySelector('.desk-screen');scr.classList.add('off');
    setTimeout(()=>{scr.classList.remove('off');scr.classList.add('boot');},2100);
    setTimeout(()=>{desk.classList.remove('drawing');
      desk.querySelectorAll('[pathLength]').forEach(el=>el.removeAttribute('pathLength'));},3000);
  }

  // monitor (or phone): open VamsiOS with the hello video
  const mon=document.getElementById('hsMonitor');
  const small=matchMedia('(max-width:680px)');
  const monLabel=()=>{const ph=small.matches;
    mon.querySelector('.lbl').textContent=ph?'Open my phone':'Open my computer';
    mon.setAttribute('aria-label',ph?'Open my phone':'Open my computer');};
  monLabel(); if(small.addEventListener)small.addEventListener('change',monLabel);
  mon.addEventListener('click',()=>{if(window.__vos)window.__vos.open(null,mon);});

  // panels under the desk close with their x or Escape
  window.__closeDeskPanels=()=>closeOthers(null);
  function closeOthers(keep){['deskAudio','deskCard','deskKeys'].forEach(id=>{if(id!==keep)closePanel(id,true);});}
  function closePanel(id,silent){const p=document.getElementById(id);if(!p||p.hidden)return;p.hidden=true;
    if(id==='deskAudio'&&window.__stopDemo)window.__stopDemo();
    if(id==='deskCard'){desk.classList.remove('card-open');drawer.setAttribute('aria-expanded','false');if(!silent)drawer.focus();}
    if(id==='deskKeys'){desk.classList.remove('keys-on');keysBtn.setAttribute('aria-expanded','false');if(window.speechSynthesis)speechSynthesis.cancel();if(!silent)keysBtn.focus();}
    if(id==='deskAudio'&&!silent)document.getElementById('hsPhones').focus();}
  document.querySelectorAll('.panel-x').forEach(b=>b.addEventListener('click',()=>closePanel(b.dataset.close)));
  document.addEventListener('keydown',e=>{if(e.key!=='Escape'||!document.getElementById('vos').hidden||!document.getElementById('artDlg').hidden||!document.getElementById('sheet').hidden)return;
    closePanel('deskCard');closePanel('deskAudio');closePanel('deskKeys');});

  // drawer: pull out the business card
  const drawer=document.getElementById('hsDrawer'),card=document.getElementById('deskCard');
  drawer.addEventListener('click',()=>{const open=card.hidden;if(open)closeOthers('deskCard');card.hidden=!open;
    desk.classList.toggle('card-open',open);drawer.setAttribute('aria-expanded',open?'true':'false');
    if(open)card.scrollIntoView({behavior:still()?'auto':'smooth',block:'nearest'});});
  const copy=document.getElementById('cardCopy'),cs=document.getElementById('cardStatus');
  copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('kosurivamsi5@gmail.com');cs.textContent='Email copied.';}
    catch(e){location.href='mailto:kosurivamsi5@gmail.com';}});

  // desk lamp: lights on means the light theme
  const lampBtn=document.getElementById('hsLamp');
  const syncLamp=()=>{const on=root.getAttribute('data-theme')==='light';
    lampBtn.setAttribute('aria-pressed',on?'true':'false');
    lampBtn.setAttribute('aria-label',on?'Desk lamp: turn the lights off (dark theme)':'Desk lamp: turn the lights on (light theme)');
    lampBtn.querySelector('.lbl').textContent=on?'Lights off':'Lights on';};
  syncLamp(); new MutationObserver(syncLamp).observe(root,{attributes:true,attributeFilter:['data-theme']});
  lampBtn.addEventListener('click',()=>{const l=document.getElementById('lamp');
    if(l){l.dispatchEvent(new MouseEvent('click',{bubbles:true,detail:0}));}});

  // hide the hanging lamp while the desk is on screen
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>{es.forEach(en=>root.classList.toggle('desk-in-view',en.isIntersecting));},{threshold:.15}).observe(desk);}

  // wall frame: a painted forest; click opens it large with a quote about access
  const frameBtn=document.getElementById('hsFrame'), artSmall=document.getElementById('deskArt');
  function paintSmall(){const r=artSmall.getBoundingClientRect();if(!r.width)return;const d=Math.min(2,devicePixelRatio||1);
    artSmall.width=Math.round(r.width*d);artSmall.height=Math.round(r.height*d);if(window.__forest)window.__forest(artSmall,1,7);}
  window.__paintFrame=paintSmall; addEventListener('resize',()=>{clearTimeout(paintSmall.t);paintSmall.t=setTimeout(paintSmall,150);});
  frameBtn.addEventListener('click',()=>{if(window.__art)window.__art.open(frameBtn);});

  // plant: call the butterfly over
  const plantBtn=document.getElementById('hsPlant'), plantLbl=plantBtn.querySelector('.lbl');
  plantBtn.addEventListener('click',()=>{
    if(still()){plantLbl.textContent='Motion is paused';setTimeout(()=>plantLbl.textContent='Call the butterfly',2200);return;}
    window.__bflyCall={el:plantBtn,until:Date.now()+9000};
    plantLbl.textContent='Here it comes';setTimeout(()=>plantLbl.textContent='Call the butterfly',2600);});

  // keyboard: the keyboard-navigation demo (first paper)
  const keysBtn=document.getElementById('hsKeys'), keysBox=document.getElementById('deskKeys'),
        tree=document.getElementById('dkTree'), say=document.getElementById('dkSay'), speak=document.getElementById('dkSpeak');
  const kprog=[{t:'when run is clicked',k:[{t:'repeat 3 times',k:[{t:'if the sensor is on',k:[{t:'say "hello"'}]},{t:'wait 1 second'}]}]},{t:'play a chime'}];
  const flat=[];(function walk(list,d,parent){list.forEach((n,i)=>{const node={t:n.t,d,parent,i,sib:list.length,kids:[]};flat.push(node);
    if(parent)parent.kids.push(node);if(n.k)walk(n.k,d+1,node);});})(kprog,0,null);
  flat.forEach((n,ix)=>{const r=document.createElement('div');r.className='dk-row';r.textContent=n.t;r.style.paddingLeft=(10+n.d*24)+'px';r.id='dk'+ix;tree.appendChild(r);n.row=r;});
  let cur=0;
  function describe(n){let s=n.t+'.';s+=n.parent?' Inside '+n.parent.t+'.':' Top level.';
    s+=' Block '+(n.i+1)+' of '+n.sib+'.';if(n.kids.length)s+=' Contains '+n.kids.length+' block'+(n.kids.length>1?'s':'')+'. Press Right to go in.';return s;}
  function go(ix,announce=true){cur=ix;flat.forEach((n,i)=>n.row.classList.toggle('on',i===ix));
    tree.setAttribute('aria-activedescendant','dk'+ix);
    if(announce){const s=describe(flat[ix]);say.textContent=s;
      if(speak.checked&&window.speechSynthesis){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(s));}}}
  tree.addEventListener('keydown',e=>{const n=flat[cur];let to=null;
    if(e.key==='ArrowDown')to=Math.min(flat.length-1,cur+1);
    else if(e.key==='ArrowUp')to=Math.max(0,cur-1);
    else if(e.key==='ArrowRight'){if(n.kids.length)to=flat.indexOf(n.kids[0]);else{say.textContent=n.t+' has nothing inside.';e.preventDefault();return;}}
    else if(e.key==='ArrowLeft'){if(n.parent)to=flat.indexOf(n.parent);else{say.textContent='Already at the top level.';e.preventDefault();return;}}
    else if(e.key==='Home')to=0; else if(e.key==='End')to=flat.length-1;
    if(to!==null){e.preventDefault();go(to);}});
  tree.addEventListener('click',e=>{const r=e.target.closest('.dk-row');if(r){go([...tree.children].indexOf(r));tree.focus();}});
  keysBtn.addEventListener('click',()=>{const open=keysBox.hidden;
    if(!open){closePanel('deskKeys');return;}
    closeOthers('deskKeys');keysBox.hidden=false;desk.classList.add('keys-on');keysBtn.setAttribute('aria-expanded','true');
    go(0);keysBox.scrollIntoView({behavior:still()?'auto':'smooth',block:'nearest'});tree.focus();});

  // sticky note on the monitor: start a note
  const hsNote=document.getElementById('hsNote');
  hsNote.addEventListener('click',()=>{const a=document.getElementById('notesAdd');if(a)a.click();});

  // headphones: hear code nesting as pitch (the audio-cue research, in miniature)
  const phones=document.getElementById('hsPhones'), box=document.getElementById('deskAudio'),
        list=document.getElementById('daLines'), end=document.getElementById('daEnd');
  const prog=[['when run is clicked',0],['repeat 3 times',1],['if the sensor is on',2],['say "hello"',3],['end if',2],['end repeat',1],['done',0]];
  let ctx=null, playing=false, timers=[];
  function tone(depth,at){
    const f=262*Math.pow(2,depth*4/12);            // each level up a major third
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine';o.frequency.value=f;o.connect(g);g.connect(ctx.destination);
    g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.16,at+.02);g.gain.exponentialRampToValueAtTime(.001,at+.42);
    o.start(at);o.stop(at+.45);
  }
  window.__stopDemo=()=>stopDemo();
  function stopDemo(){timers.forEach(clearTimeout);timers=[];playing=false;desk.classList.remove('phones-on');
    list.querySelectorAll('li').forEach(li=>li.classList.remove('on'));
    phones.querySelector('.lbl').textContent='Hear my research';}
  phones.addEventListener('click',()=>{
    if(playing){stopDemo();return;}
    try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();}catch(e){ctx=null;}
    if(ctx&&ctx.state==='suspended')ctx.resume();
    closeOthers('deskAudio');list.innerHTML='';end.hidden=true;box.hidden=false;
    prog.forEach(([txt,d])=>{const li=document.createElement('li');li.textContent=txt;li.style.paddingLeft=(8+d*22)+'px';list.appendChild(li);});
    playing=true;desk.classList.add('phones-on');phones.querySelector('.lbl').textContent='Stop sound';
    const step=620, t0=ctx?ctx.currentTime+.08:0, items=list.querySelectorAll('li');
    prog.forEach(([,d],i)=>{
      if(ctx)tone(d,t0+i*step/1000);
      timers.push(setTimeout(()=>{items.forEach(x=>x.classList.remove('on'));items[i].classList.add('on');},80+i*step));
    });
    timers.push(setTimeout(()=>{stopDemo();end.hidden=false;},80+prog.length*step));
    box.scrollIntoView({behavior:still()?'auto':'smooth',block:'nearest'});
  });
})();

/* ---------- VamsiOS: the computer on the desk ---------- */
(function(){
  const vos=document.getElementById('vos'); if(!vos)return;
  const root=document.documentElement;
  const vid=document.getElementById('vosVid'), script=document.getElementById('vosScript');
  const clock=document.getElementById('vosClock');
  let opener=null, openWin=null, winOpener=null, clockT=null, vidReady=false;

  // Resume.pdf appears only once the file exists
  fetch('resume.pdf',{method:'HEAD'}).then(r=>{
    if(r.ok&&(r.headers.get('content-type')||'').includes('pdf'))vos.querySelector('.vos-resume').hidden=false;}).catch(()=>{});

  const intro=(Array.isArray(CLIPS)?CLIPS:[]).find(c=>c.intro)||{};
  if(script)script.textContent=intro.text||'';

  function tick(){try{clock.textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'short',hour:'numeric',minute:'2-digit'}).format(new Date())+' in Texas';}catch(e){}}

  function focusables(el){return [...el.querySelectorAll('button,a[href],video[controls],summary,[tabindex]:not([tabindex="-1"])')].filter(n=>!n.closest('[hidden]')&&n.offsetParent!==null);}

  function openWindow(key,from){
    if(key==='notes'){close();const a=document.getElementById('notesAdd');if(a)a.click();return;}
    const w=document.getElementById('win-'+key); if(!w)return;
    if(openWin)closeWindow(false);
    openWin=w; winOpener=from||null; w.hidden=false;
    if(key==='hello'){
      if(!vidReady){vid.src='videos/intro.mp4';
        const t=document.createElement('track');t.kind='captions';t.label='English';t.srclang='en';t.src='videos/intro.vtt';t.default=true;
        vid.appendChild(t);vidReady=true;}
      vid.currentTime=0;const p=vid.play();if(p&&p.catch)p.catch(()=>{});
    }
    if(key==='github')loadRepos();
    w.querySelector('.win-x').focus();
  }
  let reposLoaded=false;
  async function loadRepos(){
    if(reposLoaded)return;const st=document.getElementById('ghStatus'),ul=document.getElementById('ghList');
    ul.innerHTML='<li class="gh-skel"></li><li class="gh-skel"></li><li class="gh-skel"></li>';
    try{
      const r=await fetch('https://api.github.com/users/vamsikrishnakosuri/repos?sort=pushed&per_page=12',{headers:{Accept:'application/vnd.github+json'}});
      if(!r.ok)throw new Error(r.status);
      const repos=(await r.json()).filter(x=>!x.fork).slice(0,8);
      ul.innerHTML='';
      repos.forEach(x=>{const li=document.createElement('li'),a=document.createElement('a');
        a.href=x.html_url;a.target='_blank';a.rel='noopener';
        const n=document.createElement('span');n.className='gh-name';n.textContent=x.name;
        const d=document.createElement('span');d.className='gh-desc';d.textContent=x.description||'No description yet.';
        const m=document.createElement('span');m.className='gh-meta';
        const upd=new Date(x.pushed_at).toLocaleDateString('en-US',{month:'short',year:'numeric'});
        m.textContent=[x.language,x.stargazers_count?('★ '+x.stargazers_count):'','updated '+upd].filter(Boolean).join('  ·  ');
        a.append(n,d,m);a.setAttribute('aria-label',x.name+'. '+(x.description||'')+' Opens on GitHub in a new tab.');
        li.appendChild(a);ul.appendChild(li);});
      st.textContent=repos.length+' public repositories, most recently updated first.';reposLoaded=true;
    }catch(e){ul.innerHTML='';st.textContent="Couldn't reach GitHub just now. The profile link below still works.";}
  }
  function closeWindow(refocus=true){
    if(!openWin)return;
    if(openWin.id==='win-hello')vid.pause();
    if(openWin.id==='win-web')document.getElementById('webFrame').setAttribute('src','about:blank');
    openWin.hidden=true;const back=winOpener;openWin=null;winOpener=null;
    if(refocus&&back)back.focus();
  }
  function open(key,from){
    if(window.__closeDeskPanels)window.__closeDeskPanels();
    opener=from||document.activeElement;
    const hi=vos.querySelector('.vos-hi-big');if(hi)hi.textContent=matchMedia('(max-width:680px)').matches?'Hi, this is my phone.':'Hi, this is my computer.';
    vos.hidden=false;vos.classList.add('opening');setTimeout(()=>vos.classList.remove('opening'),450);
    document.body.style.overflow='hidden';
    tick();clockT=setInterval(tick,30000);
    if(key)openWindow(key,vos.querySelector('[data-open="'+key+'"]'));
    else document.getElementById('vosClose').focus();
  }
  function close(){
    closeWindow(false);vos.hidden=true;document.body.style.overflow='';clearInterval(clockT);
    if(opener&&opener.focus)opener.focus();
  }
  window.__vos={open,close};

  vos.querySelectorAll('.vos-ic[data-open]').forEach(b=>b.addEventListener('click',()=>openWindow(b.dataset.open,b)));
  const web=document.getElementById('win-web'),frame=document.getElementById('webFrame');
  vos.querySelectorAll('.vos-ic[data-embed]').forEach(b=>b.addEventListener('click',()=>{
    const u=b.dataset.embed;document.getElementById('wt-web').textContent=b.dataset.name;
    document.getElementById('webUrl').textContent=u.replace(/^https?:\/\//,'');
    document.getElementById('webOut').href=u;frame.title=b.dataset.name;
    if(frame.getAttribute('src')!==u)frame.setAttribute('src',u);
    openWindow('web',b);}));
  vos.querySelectorAll('.win-x').forEach(b=>b.addEventListener('click',()=>closeWindow()));
  document.getElementById('vosClose').addEventListener('click',close);
  vos.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();if(openWin)closeWindow();else close();return;}
    if(e.key!=='Tab')return;
    const scope=openWin||vos, f=focusables(scope); if(!f.length)return;
    const first=f[0], last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  // clicking the empty desktop closes an open window
  vos.addEventListener('click',e=>{if(openWin&&!openWin.contains(e.target)&&!e.target.closest('.vos-ic,.vos-bar'))closeWindow();});
})();



/* ---------- painted forest (wall frame + full-screen painting) ---------- */
(function(){
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);
    t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  const mix=(a,b,t)=>{const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=p(a),B=p(b);
    return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')';};
  let grain=null;
  function grainTile(){if(grain)return grain;const c=document.createElement('canvas');c.width=c.height=160;
    const x=c.getContext('2d'),d=x.createImageData(160,160),r=rng(99);
    for(let i=0;i<d.data.length;i+=4){const v=r()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=26;}
    x.putImageData(d,0,0);grain=c;return c;}
  const ease=t=>t<=0?0:t>=1?1:1-Math.pow(1-t,3);
  // progress 0..1 grows the trees, back layers first
  window.__forest=function(cv,progress,seed){
    const g=cv.getContext('2d'),W=cv.width,H=cv.height,r=rng(seed||7);
    const sky=g.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,'#0b2622');sky.addColorStop(.45,'#1f5a4c');sky.addColorStop(.78,'#7fb8a2');sky.addColorStop(1,'#ecd3a4');
    g.fillStyle=sky;g.fillRect(0,0,W,H);
    const sun=g.createRadialGradient(W*.68,H*.62,0,W*.68,H*.62,Math.max(W,H)*.45);
    sun.addColorStop(0,'rgba(255,236,196,.75)');sun.addColorStop(.18,'rgba(255,226,170,.28)');sun.addColorStop(1,'rgba(255,226,170,0)');
    g.fillStyle=sun;g.fillRect(0,0,W,H);
    const layers=5;
    for(let L=0;L<layers;L++){
      const depth=L/(layers-1);                                // 0 far, 1 near
      const base=H*(.58+depth*.3), col=mix('#7fae9c','#10291f',depth);
      const grow=ease((progress-L*.12)/.5);
      g.fillStyle=col;g.fillRect(0,base,W,H-base);
      const n=Math.round(10+depth*8), sz=H*(.12+depth*.2);
      for(let i=0;i<n;i++){
        const x=(i+r()*.9)/n*W*1.08-W*.04, h=sz*(.7+r()*.6)*grow, w=h*(.32+r()*.08);
        if(h<1)continue;
        g.beginPath();
        for(let k=0;k<3;k++){const ty=base-h*(k*.28), tw=w*(1-k*.22), th=h*(.55-k*.05);
          g.moveTo(x-tw,ty);g.lineTo(x,ty-th);g.lineTo(x+tw,ty);}
        g.fill();
        g.fillRect(x-w*.06,base-h*.06,w*.12,h*.06+2);
      }
      const mist=g.createLinearGradient(0,base-H*.12,0,base+H*.04);
      mist.addColorStop(0,'rgba(220,236,228,0)');mist.addColorStop(1,'rgba(220,236,228,'+(.16*(1-depth))+')');
      g.fillStyle=mist;g.fillRect(0,base-H*.12,W,H*.16);
    }
    g.fillStyle=g.createPattern(grainTile(),'repeat');g.globalCompositeOperation='overlay';g.fillRect(0,0,W,H);
    g.globalCompositeOperation='source-over';
  };

  if(window.__paintFrame)window.__paintFrame();
  const dlg=document.getElementById('artDlg'); if(!dlg)return;
  const cv=document.getElementById('artCanvas'), x=document.getElementById('artClose');
  let opener=null, raf=0;
  const still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.mo==='off';
  function size(){const d=Math.min(2,devicePixelRatio||1);cv.width=Math.round(innerWidth*d);cv.height=Math.round(innerHeight*d);}
  function open(from){if(window.__closeDeskPanels)window.__closeDeskPanels();opener=from||document.activeElement;dlg.hidden=false;dlg.classList.remove('shown');document.body.style.overflow='hidden';
    size();x.focus();
    if(still()){window.__forest(cv,1,7);dlg.classList.add('shown');return;}
    const t0=performance.now(),dur=2000;
    (function step(now){const p=Math.min(1,(now-t0)/dur);window.__forest(cv,p,7);
      if(p<1)raf=requestAnimationFrame(step);else dlg.classList.add('shown');})(t0);
    setTimeout(()=>dlg.classList.add('shown'),900);
  }
  function close(){cancelAnimationFrame(raf);dlg.hidden=true;document.body.style.overflow='';if(opener&&opener.focus)opener.focus();}
  x.addEventListener('click',close);
  dlg.addEventListener('click',e=>{if(e.target===cv)close();});
  dlg.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){e.preventDefault();x.focus();}});
  addEventListener('resize',()=>{if(!dlg.hidden){size();window.__forest(cv,1,7);}});
  window.__art={open,close};
})();

/* ---------- desk objects open their section in a sheet ---------- */
(function(){
  const sheet=document.getElementById('sheet'); if(!sheet)return;
  const body=document.getElementById('sheetBody'), title=document.getElementById('sheetTitle'), x=document.getElementById('sheetClose');
  const names={work:'Things I’ve built',research:'What I research',publications:'Papers',about:'About me'};
  let opener=null;
  function open(id,from){
    const src=document.getElementById(id); if(!src)return;
    if(window.__closeDeskPanels)window.__closeDeskPanels();
    const copy=src.cloneNode(true);
    // a copy must not repeat ids or carry the live photo controls
    copy.removeAttribute('id');copy.removeAttribute('data-sprig');
    copy.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
    copy.querySelectorAll('[tabindex="0"]').forEach(n=>n.removeAttribute('tabindex'));
    copy.querySelectorAll('.photo-hint,.fx,.vplayer,.scan').forEach(n=>n.remove());
    copy.querySelectorAll('.photo-btn').forEach(b=>{const d=document.createElement('div');d.className='photo-still';d.append(...b.childNodes);b.replaceWith(d);});
    copy.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=a.getAttribute('href').slice(1);
      if(names[t]){e.preventDefault();open(t,opener);} else close();}));
    body.replaceChildren(copy);body.scrollTop=0;
    title.textContent=names[id]||'';
    opener=from||document.activeElement;
    sheet.hidden=false;sheet.classList.add('opening');setTimeout(()=>sheet.classList.remove('opening'),420);
    document.body.style.overflow='hidden';x.focus();
  }
  function close(){sheet.hidden=true;body.replaceChildren();document.body.style.overflow='';if(opener&&opener.focus)opener.focus();}
  document.querySelectorAll('a[data-sheet]').forEach(a=>a.addEventListener('click',e=>{
    if(e.metaKey||e.ctrlKey||e.shiftKey)return;     // let people open a real new tab if they want
    e.preventDefault();open(a.getAttribute('href').slice(1),a);}));
  x.addEventListener('click',close);
  sheet.addEventListener('click',e=>{if(e.target===sheet)close();});
  sheet.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();close();return;}
    if(e.key!=='Tab')return;
    const f=[...sheet.querySelectorAll('button,a[href],summary,[tabindex]:not([tabindex="-1"])')].filter(n=>n.offsetParent!==null);
    const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}});
  window.__sheet={open,close};
})();
