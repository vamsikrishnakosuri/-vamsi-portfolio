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
  let x=innerWidth*.2,y=innerHeight*.5,tx=x,ty=y,t=0,shown=false,idle=0;
  function pick(){tx=innerWidth*(.12+Math.random()*.76);ty=innerHeight*(.18+Math.random()*.64);}
  pick(); setInterval(pick,3600);
  addEventListener('scroll',()=>{idle=0;if(!shown){shown=true;el.classList.add('on');}},{passive:true});
  (function loop(){
    t+=.016; idle+=.016;
    x+=(tx-x)*.012; y+=(ty-y)*.012;
    const bx=x+Math.sin(t*1.7)*26, by=y+Math.cos(t*2.3)*14;
    const ang=Math.sin(t*1.7)*16;
    el.style.transform='translate('+bx+'px,'+by+'px) rotate('+ang+'deg)';
    if(idle>9&&shown){shown=false;el.classList.remove('on');}
    requestAnimationFrame(loop);
  })();
  setTimeout(()=>{shown=true;el.classList.add('on');},1800);
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
