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
  gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(ur,canvas.width,canvas.height);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t0=performance.now();
  function frame(now){gl.uniform1f(ut,(now-t0)/1000);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(!reduce)requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
}
makeOrb(document.getElementById('orbCanvas'));
makeOrb(document.getElementById('orbCanvasSmall'));

/* ---------- assistant ---------- */
const panel=document.getElementById('panel'),orbBtn=document.getElementById('orbBtn'),msgs=document.getElementById('msgs'),
      form=document.getElementById('compose'),q=document.getElementById('q'),send=document.getElementById('send'),typing=document.getElementById('typing'),hint=document.getElementById('orbHint');
const history=[];
function open(){panel.dataset.open='true';orbBtn.setAttribute('aria-expanded','true');hint.classList.remove('show');setTimeout(()=>q.focus(),50);}
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
  (function loop(){const k=reduce?1:.16;rx+=(mx-rx)*k;ry+=(my-ry)*k;
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
    if(!flower)return null;
    const r=flower.getBoundingClientRect();
    if(r.top>innerHeight-60||r.bottom<0)return null;
    return {x:r.left+r.width/2-17, y:r.top-21};
  }

  addEventListener('scroll',()=>{idle=0;if(!shown){shown=true;el.classList.add('on');}},{passive:true});

  function frame(now){
    let dt=(now-last)/1000; last=now;
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
    const step=Math.hypot(dx,dy), maxStep=(f?220:105)*dt;   // px per second
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
    btn.setAttribute('aria-label',v?'Leave plain text reading mode':'Plain text reading mode');
    try{localStorage.setItem('reading',v?'1':'0');}catch(e){}}
  apply(on);
  btn.addEventListener('click',()=>apply(!on));
})();

/* ---------- display settings ---------- */
(function(){
  const root=document.documentElement,btn=document.getElementById('a11yBtn'),panel=document.getElementById('setPanel');
  if(!btn)return;
  const keys={ct:'a11y-ct',cb:'a11y-cb',ts:'a11y-ts'};
  function set(kind,val){
    if(val&&val!=='normal'&&val!=='none'&&val!=='100')root.setAttribute('data-'+kind,val);else root.removeAttribute('data-'+kind);
    try{localStorage.setItem(keys[kind],val);}catch(e){}
    panel.querySelectorAll('[data-'+kind+']').forEach(b=>b.setAttribute('aria-pressed',b.dataset[kind]===val?'true':'false'));
  }
  ['ct','cb','ts'].forEach(k=>{
    let v=null;try{v=localStorage.getItem(keys[k]);}catch(e){}
    set(k,v||(k==='ct'?'normal':k==='cb'?'none':'100'));
  });
  panel.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b)return;
    if(b.id==='setReset'){set('ct','normal');set('cb','none');set('ts','100');return;}
    if(b.classList.contains('act'))return;   // Plain text / Listen handle themselves
    ['ct','cb','ts'].forEach(k=>{ if(b.dataset[k]!==undefined) set(k,b.dataset[k]); });
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
    if(!reduce){
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
