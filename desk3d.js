/* ---------- the desk as a lit 3D room ----------
   Loaded on demand by site.js, only on wide screens with WebGL2. The SVG drawing stays in the page as the fallback.
   Accessibility stays in the HTML: every object is still the same <button>/<a> hotspot. This module only draws the room
   and moves each hotspot so it sits exactly over its 3D object. The canvas itself is aria-hidden and never takes clicks.
   The room follows the visitor's own time of day (?time=day|dusk|night overrides it for testing). */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const root = document.documentElement;
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches || root.dataset.mo === 'off';
const css = n => getComputedStyle(root).getPropertyValue(n).trim();
const V = (x, y, z) => new THREE.Vector3(x, y, z);

/* fixed object colours: the room is lit differently per theme and time, the things in it keep their colour */
const COL = {
  desk: '#35554A', leg: '#22392F', bezel: '#17241F', alu: '#C9C4B8', mug: '#ECE4D2', band: '#9FD8C4',
  pot: '#C08A62', soil: '#3B2E22', paper: '#EFE9DC', paper2: '#E2D9C6', phones: '#26332F', cushion: '#46625A',
  kbd: '#E4DED0', key: '#F6F2E9', front: '#2D4A40', handle: '#CFC4A8', lamp: '#9FD8C4',
  boardEdge: '#D9D1BF', frame: '#E9E1CF', note: '#EDE4D0', winFrame: '#E9E1CF', clock: '#F3EEE3', shelf: '#C9B48F',
};

function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function canvasTex(w, h, paint) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'), w, h, c);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.userData.canvas = c; t.userData.paint = paint; return t;
}
function repaint(t) { const c = t.userData.canvas; t.userData.paint(c.getContext('2d'), c.width, c.height, c); t.needsUpdate = true; }

/* ---- time of day: the visitor's own clock ---- */
const phase = () => (window.__dayPhase ? window.__dayPhase() : 'night');
const PH = {   // light per time of day: hemisphere fill, key light, sunbeam through the window, fairy lights, dust in the beam
  morning: { hemi: .7, key: '#FFD6B4', keyI: 1.05, beam: '#FFB57E', beamI: 22, shaft: .32, fairy: .35, mote: .9 },
  day: { hemi: 1.05, key: '#FFF2DC', keyI: 1.5, beam: '#FFE2AE', beamI: 26, shaft: .34, fairy: .25, mote: 1 },
  dusk: { hemi: .5, key: '#FFC8A0', keyI: .8, beam: '#FF9F5A', beamI: 18, shaft: .28, fairy: .8, mote: .7 },
  night: { hemi: .28, key: '#9DB7E8', keyI: .42, beam: '#B4CBF5', beamI: 5, shaft: .1, fairy: 1, mote: .15 },
};

/* ---- textures ---- */
const DOCK = [['#F6B65C', '#E0703E'], ['#8FB7F2', '#4F6FD6'], ['#7FD9C0', '#2A9478'], ['#F2A7B5', '#C0566F'], ['#F3D27A', '#C9932E'], ['#5E9BE0', '#24589E'], ['#5B6470', '#262B31'], ['#B9A7E6', '#6C5AA8']];
function paintOS(g, W, H) {   // a small VamsiOS: same wallpaper, menu bar, greeting and dock as the real one
  if (window.__forest) { const c = document.createElement('canvas'); c.width = W; c.height = H; window.__forest(c, 1, 23); g.drawImage(c, 0, 0); }
  else { g.fillStyle = '#0d221e'; g.fillRect(0, 0, W, H); }
  let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(8,22,19,.55)'); gr.addColorStop(.35, 'rgba(8,22,19,.1)'); gr.addColorStop(1, 'rgba(8,22,19,.35)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(10,26,22,.6)'; g.fillRect(0, 0, W, H * .05);
  g.fillStyle = '#F3EEE3'; g.font = `700 ${H * .026}px "Atkinson Hyperlegible", sans-serif`; g.textBaseline = 'middle'; g.fillText('VamsiOS', W * .045, H * .025);
  g.fillStyle = '#9FD8C4'; g.beginPath(); g.arc(W * .025, H * .025, H * .011, 0, 7); g.fill();
  const t = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); g.textAlign = 'right'; g.fillStyle = '#F3EEE3'; g.fillText(t, W * .975, H * .025);
  // greeting widget
  g.textAlign = 'left'; g.fillStyle = 'rgba(12,30,26,.55)'; roundRect(g, W * .035, H * .09, W * .36, H * .2, H * .03); g.fill();
  g.fillStyle = '#F3EEE3'; g.font = `400 ${H * .065}px "Instrument Serif", Georgia, serif`; g.fillText('Hi, this is my computer.', W * .055, H * .16);
  g.fillStyle = 'rgba(243,238,227,.7)'; g.font = `400 ${H * .028}px "Atkinson Hyperlegible", sans-serif`; g.fillText('Apps are in the dock. Files on the right.', W * .055, H * .235);
  // files
  for (let i = 0; i < 4; i++) { const x = W * .925, y = H * (.12 + i * .13); g.fillStyle = 'rgba(243,238,227,.85)'; roundRect(g, x - H * .03, y, H * .06, H * .07, H * .008); g.fill(); }
  // dock
  const s = H * .085, gap = H * .022, n = DOCK.length, dw = n * s + (n + 1) * gap, dx = (W - dw) / 2, dy = H * .86;
  g.fillStyle = 'rgba(12,30,26,.55)'; roundRect(g, dx, dy, dw, s + gap * 2, H * .035); g.fill();
  DOCK.forEach((a, i) => { const x = dx + gap + i * (s + gap), y = dy + gap; const lg = g.createLinearGradient(x, y, x + s, y + s); lg.addColorStop(0, a[0]); lg.addColorStop(1, a[1]);
    g.fillStyle = lg; roundRect(g, x, y, s, s, s * .26); g.fill(); g.fillStyle = 'rgba(255,255,255,.2)'; roundRect(g, x, y, s, s * .48, s * .26); g.fill(); });
}
function paintBlocks(dark) { return (g, W, H) => {   // block-based code, the thing Vamsi researches
  g.fillStyle = dark ? '#132824' : '#F4F0E6'; g.fillRect(0, 0, W, H);
  if (!dark) { g.strokeStyle = '#D9D1BF'; g.lineWidth = W * .012; g.strokeRect(0, 0, W, H); }
  const rows = [[.08, .5, '#E8B86B'], [.16, .5, '#9FD8C4'], [.24, .4, '#A9C7F0'], [.16, .32, '#9FD8C4'], [.08, .22, '#E8B86B']];
  rows.forEach(([x, w, c], i) => { const y = H * (.1 + i * .16), h = H * .11; g.fillStyle = c; roundRect(g, W * x, y, W * w, h, h * .3); g.fill();
    g.fillStyle = 'rgba(15,38,34,.35)'; g.fillRect(W * (x + .03), y + h * .42, W * w * .5, h * .16); });
  if (!dark) { g.setLineDash([W * .012, W * .02]); g.strokeStyle = '#4B5F58'; g.lineWidth = W * .006; g.beginPath();
    const pts = [[.8, .2], [.86, .38], [.92, .56], [.86, .74]]; pts.forEach(([x, y], i) => i ? g.lineTo(W * x, H * y) : g.moveTo(W * x, H * y)); g.stroke(); g.setLineDash([]);
    pts.forEach(([x, y]) => { g.beginPath(); g.arc(W * x, H * y, W * .016, 0, 7); g.fillStyle = '#F4F0E6'; g.fill(); g.stroke(); }); }
}; }
function paintNote(g, W, H) { g.fillStyle = COL.note; g.fillRect(0, 0, W, H); g.fillStyle = '#22302B';
  [[.2, .3, .6], [.2, .48, .48], [.2, .66, .3]].forEach(([x, y, w]) => g.fillRect(W * x, H * y, W * w, H * .05)); }
function paintSky(g, W, H) {
  const ph = phase(), gr = g.createLinearGradient(0, 0, 0, H);
  const stops = { morning: ['#3B4C80', '#E6A0A0', '#FCE0B4'], day: ['#6FAEDB', '#B9DAEA', '#EEF3E6'], dusk: ['#2F3566', '#C9767A', '#F7C68E'], night: ['#060F18', '#0D2030', '#17343F'] }[ph];
  stops.forEach((c, i) => gr.addColorStop(i / 2, c)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  if (ph === 'night') { for (let i = 0; i < 80; i++) { g.fillStyle = `rgba(255,255,240,${.3 + r() * .7})`; const z = 1 + r() * 1.4; g.fillRect(r() * W, r() * H * .75, z, z); }
    g.fillStyle = '#F4EFD8'; g.beginPath(); g.arc(W * .7, H * .25, W * .075, 0, 7); g.fill(); g.fillStyle = '#0D2030'; g.beginPath(); g.arc(W * .74, H * .23, W * .068, 0, 7); g.fill(); }
  if (ph === 'day') { g.fillStyle = 'rgba(255,250,225,.95)'; g.beginPath(); g.arc(W * .22, H * .2, W * .08, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.8)'; [[.5, .3], [.7, .16]].forEach(([x, y]) => { for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(W * (x + k * .06), H * y, W * (.06 + (k % 2) * .03), 0, 7); g.fill(); } }); }
  if (ph === 'dusk') { g.fillStyle = 'rgba(255,214,150,.95)'; g.beginPath(); g.arc(W * .4, H * .82, W * .13, 0, 7); g.fill(); }
  if (ph === 'morning') { g.fillStyle = 'rgba(255,236,190,.95)'; g.beginPath(); g.arc(W * .62, H * .78, W * .12, 0, 7); g.fill(); }
  g.fillStyle = ph === 'day' ? '#4F7F6C' : ph === 'morning' ? '#4A5E66' : ph === 'dusk' ? '#2B3A3E' : '#08171B';   // the same forest as the painting
  for (let i = 0; i < 14; i++) { const x = (i / 13) * W, h = H * (.12 + r() * .14); g.beginPath(); g.moveTo(x - W * .06, H); g.lineTo(x, H - h - H * .05); g.lineTo(x + W * .06, H); g.fill(); }
}
function paintClock(g, W, H) {   // the wall clock shows the visitor's own time
  const d = new Date(), h = d.getHours(), m = d.getMinutes(), c = W / 2; g.clearRect(0, 0, W, H);
  g.fillStyle = COL.clock; g.beginPath(); g.arc(c, c, c * .96, 0, 7); g.fill(); g.strokeStyle = '#22302B';
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.lineWidth = W * (i % 3 ? .012 : .025);
    g.beginPath(); g.moveTo(c + Math.sin(a) * c * .78, c - Math.cos(a) * c * .78); g.lineTo(c + Math.sin(a) * c * .88, c - Math.cos(a) * c * .88); g.stroke(); }
  const hand = (a, len, w) => { g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.sin(a) * len, c - Math.cos(a) * len); g.stroke(); };
  hand(((h % 12) + m / 60) / 12 * Math.PI * 2, c * .48, W * .04); g.strokeStyle = '#2A9478'; hand(m / 60 * Math.PI * 2, c * .7, W * .025);
  g.fillStyle = '#22302B'; g.beginPath(); g.arc(c, c, W * .03, 0, 7); g.fill();
}
function paintPanes(g, W, H) {   // what the sunbeam projects: four window panes
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.filter = 'blur(3px)'; g.fillStyle = '#fff';
  const m = W * .05, gap = W * .035, pw = (W - 2 * m - gap) / 2, ph = (H - 2 * m - gap) / 2;
  for (let i = 0; i < 4; i++) g.fillRect(m + (i % 2) * (pw + gap), m + Math.floor(i / 2) * (ph + gap), pw, ph); g.filter = 'none';
}

/* ---- materials ---- */
function outlineMat() {   // a back-face shell pushed out along normals keeps the hand-drawn line of the old desk
  return new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color('#F3EEE3') }, opacity: { value: .5 }, thickness: { value: .0032 } },
    vertexShader: 'uniform float thickness;void main(){vec3 p=position+normal*thickness;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}',
    fragmentShader: 'uniform vec3 color;uniform float opacity;void main(){gl_FragColor=vec4(color,opacity);\n#include <colorspace_fragment>\n}',
    side: THREE.BackSide, transparent: true, depthWrite: false,
  });
}
function volumeMat(color) {   // soft additive light volume: lamp cone, sunbeam shaft. Bright near the source, soft at the edges
  return new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(color) }, strength: { value: 0 } },
    vertexShader: 'varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'uniform vec3 color;uniform float strength;varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){float f=pow(abs(dot(vN,vV)),2.0);float a=strength*f*pow(vUv.y,1.6);gl_FragColor=vec4(color*a,a);}',
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false,
  });
}
/* a leaf: pointed oval, folded along the midrib and curving down toward the tip, darker at the base */
function leafGeometry(len, wid, curl, fold) {
  const SL = 12, SW = 6, pos = [], col = [], idx = [], base = new THREE.Color('#2E5E46'), tip = new THREE.Color('#79B58C'), rib = new THREE.Color('#A9D6B4'), c = new THREE.Color();
  for (let i = 0; i <= SL; i++) { const t = i / SL, w = wid * Math.pow(Math.sin(Math.PI * Math.min(t * 1.05, 1)), .85) * (1 - .25 * t);
    for (let j = 0; j <= SW; j++) { const s = j / SW * 2 - 1;
      pos.push(s * w, t * len - curl * len * t * t * .6, curl * len * t * t + fold * Math.abs(s) * w);
      c.copy(base).lerp(tip, t * .9); if (Math.abs(s) < .12) c.lerp(rib, .35 * (1 - t)); col.push(c.r, c.g, c.b); } }
  for (let i = 0; i < SL; i++) for (let j = 0; j < SW; j++) { const a = i * (SW + 1) + j, b = a + SW + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}

export function startDesk3D(desk) {
  const hsLayer = desk.querySelector('.desk-hs');
  const canvas = document.createElement('canvas'); canvas.className = 'desk-3d'; canvas.setAttribute('aria-hidden', 'true');
  desk.insertBefore(canvas, hsLayer);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, 2, .05, 20);
  const LOOK = V(0, .3, -.22), HOME = V(0, .66, 3.25);
  camera.position.copy(HOME); camera.lookAt(LOOK);

  const mats = {}; const mat = (k, o = {}) => { const id = k + JSON.stringify(o); return mats[id] || (mats[id] = new THREE.MeshStandardMaterial({ color: COL[k] || k, roughness: .72, metalness: 0, ...o })); };
  const groups = {};
  function mesh(geo, m, parent, x = 0, y = 0, z = 0, opts = {}) {
    const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.castShadow = opts.cast !== false; me.receiveShadow = true; parent.add(me);
    if (opts.outline !== false && parent.userData.outline) { const o = new THREE.Mesh(geo, parent.userData.outline); o.userData.skip = true; me.add(o); }
    return me;
  }
  function group(key, x = 0, y = 0, z = 0, parent = scene) { const g = new THREE.Group(); g.position.set(x, y, z); g.userData.outline = outlineMat(); g.userData.hi = 0; g.userData.base = g.position.clone(); parent.add(g); if (key) groups[key] = g; return g; }
  function sub(parent, x, y, z) { const g = new THREE.Group(); g.position.set(x, y, z); g.userData.outline = parent.userData.outline; parent.add(g); return g; }
  const rbox = (w, h, d, r = .006) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.01, h / 2.01, d / 2.01));
  const plane = (w, h, tex, emissive) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), emissive
    ? new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }) : new THREE.MeshStandardMaterial({ map: tex, roughness: .9 }));

  /* ---- room ---- */
  const room = new THREE.Group(); scene.add(room);
  const ink = '#1A2622';
  const wallMat = new THREE.MeshStandardMaterial({ color: '#163029', roughness: .95 }), floorMat = new THREE.MeshStandardMaterial({ color: '#0E221E', roughness: .9 });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), wallMat); wall.position.set(0, .9, -.56); wall.receiveShadow = true; room.add(wall);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.set(0, -.78, 1.4); floor.receiveShadow = true; room.add(floor);
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(8, .05, .015), mat('#20392F')); skirt.position.set(0, -.755, -.55); room.add(skirt);

  /* window (decorative): the visitor's sky right now */
  const win = group('window', -1.32, .66, -.555);
  const skyTex = canvasTex(256, 320, paintSky); const sky = plane(.38, .48, skyTex, true); sky.position.z = .004; win.add(sky);
  [[0, .25, .44, .025], [0, -.25, .44, .025], [-.21, 0, .025, .52], [.21, 0, .025, .52], [0, 0, .015, .48], [0, .02, .4, .015]].forEach(([x, y, w, h]) =>
    mesh(rbox(w, h, .03, .004), mat('winFrame'), win, x, y, .012));
  mesh(rbox(.5, .025, .07, .006), mat('winFrame'), win, 0, -.27, .03);

  /* wall clock: the visitor's own time (its hotspot says it out loud) */
  const clockG = group('clock', 1.3, .8, -.55);
  const clockTex = canvasTex(256, 256, paintClock);
  mesh(new THREE.CylinderGeometry(.095, .095, .02, 48).rotateX(Math.PI / 2), mat('#22392F'), clockG, 0, 0, .01);
  const face = new THREE.Mesh(new THREE.CircleGeometry(.085, 48), new THREE.MeshStandardMaterial({ map: clockTex, roughness: .8 })); face.position.z = .021; clockG.add(face);

  /* wall shelf (decorative): books and a succulent */
  const shelf = group('books', 1.3, .47, -.5);
  mesh(rbox(.42, .022, .11, .004), mat('shelf'), shelf, 0, 0, 0);
  [-.15, .15].forEach(x => mesh(rbox(.016, .05, .08, .003), mat('leg'), shelf, x, -.036, -.005));
  [['#C0566F', .022, .12], ['#E8B86B', .028, .135], ['#4F6FD6', .02, .11], ['#2A9478', .026, .128], ['#EDE4D0', .018, .1], ['#6C5AA8', .024, .118]].reduce((x, [c, w, h], i) => {
    const b = mesh(rbox(w, h, .075, .003), mat(c, { roughness: .8 }), shelf, x + w / 2, .011 + h / 2, 0); if (i === 5) { b.rotation.z = -.32; b.position.x += .02; b.position.y -= .008; }
    return x + w + .003; }, -.19);
  const succ = sub(shelf, .13, .011, 0);
  mesh(new THREE.CylinderGeometry(.03, .024, .045, 24), mat('#E9E1CF', { roughness: .5 }), succ, 0, .0225, 0);
  for (let i = 0; i < 9; i++) { const a = i * 2.4, l = mesh(new THREE.SphereGeometry(1, 10, 8), mat('#6FAE85', { roughness: .5 }), succ, Math.sin(a) * .012, .055 + (i % 3) * .006, Math.cos(a) * .012, { outline: false });
    l.scale.set(.008, .022, .008); l.rotation.set(Math.cos(a) * .6, 0, -Math.sin(a) * .6); }

  /* fairy lights along the top of the wall: they glow at dusk and at night */
  const fairyPts = []; for (let i = 0; i <= 60; i++) { const t = i / 60; fairyPts.push(V(-1.02 + t * 2.6, .955 - .06 * Math.abs(Math.sin(t * Math.PI * 3)), -.548)); }
  const fairyCurve = new THREE.CatmullRomCurve3(fairyPts);
  const lightsG = group('lights', 0, 0, 0); lightsG.userData.outline = null;
  lightsG.add(new THREE.Mesh(new THREE.TubeGeometry(fairyCurve, 120, .0016, 5), mat(ink)));
  const fairy = []; const bulbGeo = new THREE.SphereGeometry(.0085, 10, 8), FAIRY = ['#FFE3A3', '#FFD27F', '#FFF1D0'];
  for (let i = 0; i < 28; i++) { const b = new THREE.Mesh(bulbGeo, new THREE.MeshBasicMaterial({ color: FAIRY[i % 3], toneMapped: false }));
    b.position.copy(fairyCurve.getPoint((i + .5) / 28)); b.position.y -= .01; b.userData.c = new THREE.Color(FAIRY[i % 3]); b.userData.ph = i * 1.7; lightsG.add(b); fairy.push(b); }
  let lightsOn = true; const lightsBtn = desk.querySelector('#hsLights');
  const syncLights = () => { if (!lightsBtn) return; lightsBtn.setAttribute('aria-pressed', lightsOn ? 'true' : 'false');
    lightsBtn.querySelector('.lbl').textContent = lightsOn ? 'Fairy lights off' : 'Fairy lights on'; };
  if (lightsBtn) { syncLights(); lightsBtn.addEventListener('click', () => { lightsOn = !lightsOn; syncLights(); kick(); }); }

  /* ---- desk ---- */
  const deskG = group('desk', 0, 0, 0);
  mesh(rbox(2.32, .05, .8, .012), mat('desk'), deskG, 0, -.025, -.06);
  [[-1.08, -.38], [1.08, -.38], [-1.08, .28], [1.08, .28]].forEach(([x, z]) => mesh(rbox(.05, .73, .05, .008), mat('leg'), deskG, x, -.415, z));
  mesh(rbox(2.16, .14, .02, .004), mat('leg'), deskG, 0, -.12, -.42);

  /* drawer: slides out when the business card is open */
  const drawer = group('drawer', .72, -.105, .31);
  mesh(rbox(.42, .1, .3, .006), mat('front'), drawer, 0, 0, -.14);
  mesh(rbox(.1, .014, .016, .006), mat('handle'), drawer, 0, 0, .02);

  /* monitor + sticky note */
  const mon = group('monitor', 0, 0, -.24);
  mesh(rbox(.76, .47, .035, .018), mat('bezel', { roughness: .45, metalness: .2 }), mon, 0, .43, 0);
  const osTex = canvasTex(1600, 956, paintOS); const screen = plane(.72, .43, osTex, true); screen.position.set(0, .43, .0181); mon.add(screen);
  screen.material.color.setScalar(0);
  mesh(rbox(.06, .2, .03, .008), mat('bezel'), mon, 0, .12, -.03);
  mesh(rbox(.26, .016, .17, .008), mat('bezel'), mon, 0, .008, .01);
  const noteG = group('note', .32, .6, -.205);
  const noteM = plane(.075, .075, canvasTex(128, 128, paintNote)); noteM.rotation.z = -.12; noteM.castShadow = true; noteG.add(noteM);
  const noteBack = mesh(rbox(.075, .075, .003, .001), mat('note'), noteG, 0, 0, -.002); noteBack.rotation.z = -.12;

  /* keyboard: centred in front of the monitor */
  const kbd = group('keys', 0, 0, .17);
  mesh(rbox(.37, .016, .12, .006), mat('kbd', { roughness: .5 }), kbd, 0, .008, 0);
  const keyGeo = rbox(.022, .008, .02, .003), keys = new THREE.InstancedMesh(keyGeo, mat('key', { roughness: .45 }), 60); keys.castShadow = true;
  const dm = new THREE.Object3D(); let ki = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) { if (ki >= 59) break; dm.position.set(-.16 + c * .0245 + (r % 2) * .006, .019, -.042 + r * .028); dm.updateMatrix(); keys.setMatrixAt(ki++, dm.matrix); }
  dm.position.set(0, .019, .07); dm.scale.set(7, 1, 1); dm.updateMatrix(); keys.setMatrixAt(ki++, dm.matrix); keys.count = ki;
  keys.position.z = -.012; keys.userData.skip = true; kbd.add(keys);

  /* laptop: opened, a block program on screen */
  const lap = group('laptop', -.64, 0, .02);
  mesh(rbox(.38, .016, .25, .008), mat('alu', { roughness: .35, metalness: .4 }), lap, 0, .008, 0);
  const lid = sub(lap, 0, .016, -.12); lid.rotation.x = -.22;
  mesh(rbox(.38, .25, .012, .008), mat('alu', { roughness: .35, metalness: .4 }), lid, 0, .125, 0);
  const lapScr = plane(.35, .215, canvasTex(512, 316, paintBlocks(true)), true); lapScr.position.set(0, .127, .0065); lid.add(lapScr);

  /* mug + steam */
  const mug = group('mug', -.33, 0, .12);
  mesh(new THREE.CylinderGeometry(.045, .042, .1, 32), mat('mug', { roughness: .4 }), mug, 0, .05, 0);
  mesh(new THREE.CylinderGeometry(.0455, .0455, .018, 32, 1, true), mat('band'), mug, 0, .07, 0, { outline: false });
  mesh(new THREE.TorusGeometry(.024, .007, 10, 24, Math.PI).rotateZ(-Math.PI / 2), mat('mug', { roughness: .4 }), mug, .045, .05, 0);
  const puff = new THREE.CanvasTexture((() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return c; })());
  const steam = []; for (let i = 0; i < 7; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff, color: '#F3EEE3', transparent: true, opacity: 0, depthWrite: false }));
    s.userData.t = i / 7; scene.add(s); steam.push(s); }

  /* robot: a little helper that opens the same assistant as the orb. It looks at your pointer, blinks, waves on hover */
  const bot = group('bot', -.18, 0, .05);
  const botM = mat('#ECE6D8', { roughness: .35 }), botD = mat('#22312C', { roughness: .45 });
  mesh(rbox(.074, .012, .052, .006), botD, bot, 0, .006, 0);
  mesh(rbox(.062, .05, .046, .016), botM, bot, 0, .04, 0);
  const botHead = sub(bot, 0, .103, 0);
  mesh(rbox(.094, .068, .062, .022), botM, botHead, 0, 0, 0);
  mesh(rbox(.076, .046, .004, .012), new THREE.MeshStandardMaterial({ color: '#0E1C19', roughness: .3 }), botHead, 0, 0, .03, { outline: false });
  const eyeMat = new THREE.MeshBasicMaterial({ color: '#9FD8C4', toneMapped: false }), eyes = [];
  [-.017, .017].forEach(x => { const e = mesh(new THREE.CapsuleGeometry(.0055, .007, 4, 8), eyeMat, botHead, x, .002, .0335, { outline: false, cast: false }); eyes.push(e); });
  mesh(new THREE.CylinderGeometry(.0022, .0022, .028, 8), botD, botHead, 0, .046, 0, { outline: false });
  const antMat = new THREE.MeshBasicMaterial({ color: '#9FD8C4', toneMapped: false });
  mesh(new THREE.SphereGeometry(.0075, 12, 10), antMat, botHead, 0, .064, 0, { outline: false, cast: false });
  const armL = sub(bot, -.036, .058, 0), armR = sub(bot, .036, .058, 0);
  [[armL, -1], [armR, 1]].forEach(([a, sd]) => { const m = mesh(new THREE.CapsuleGeometry(.0065, .028, 4, 8), botM, a, sd * .004, -.018, 0); a.rotation.z = sd * .28; });
  const panel = document.getElementById('panel'); let blinkAt = 0;

  /* plant: a leafy pothos-style plant in a ceramic pot, leaves on stems spiralling out */
  const plant = group('plant', -.98, 0, -.08);
  const potGeo = new THREE.LatheGeometry([[0, 0], [.05, 0], [.054, .004], [.066, .11], [.073, .116], [.073, .132], [.066, .132], [.064, .12]].map(([x, y]) => new THREE.Vector2(x, y)), 40);
  mesh(potGeo, mat('pot', { roughness: .6 }), plant, 0, 0, 0);
  mesh(new THREE.CylinderGeometry(.064, .064, .006, 32), mat('soil', { roughness: 1 }), plant, 0, .118, 0, { outline: false });
  const leafMat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: .5 }), stemMat = mat('#4E7F5E', { roughness: .6 });
  const leaves = [];
  for (let i = 0; i < 15; i++) {
    const yaw = i * 2.399, tilt = .12 + (i % 5) * .13 + (i > 9 ? .25 : 0), L = .07 + (i % 4) * .035 + (i < 4 ? .06 : 0);
    const tipP = V(Math.sin(yaw) * Math.sin(tilt) * L, .12 + Math.cos(tilt) * L, Math.cos(yaw) * Math.sin(tilt) * L * .7);
    const stem = new THREE.QuadraticBezierCurve3(V(0, .118, 0), V(tipP.x * .3, tipP.y * .85 + .02, tipP.z * .3), tipP);
    mesh(new THREE.TubeGeometry(stem, 8, .0025, 5), stemMat, plant, 0, 0, 0, { outline: false });
    const lg = sub(plant, tipP.x, tipP.y, tipP.z); lg.rotation.set(0, yaw, 0, 'YXZ'); lg.rotation.x = tilt + .45 + (i % 3) * .12;
    const leaf = mesh(leafGeometry(.1 + (i % 4) * .018, .036 + (i % 3) * .008, .55, .22), leafMat, lg, 0, 0, 0, { outline: false });
    leaf.userData.sway = i * .9; leaves.push(lg);
  }

  /* papers: given room to the right of the keyboard */
  const papers = group('papers', .44, 0, .13);
  for (let i = 0; i < 5; i++) { const p = mesh(rbox(.22, .006, .16, .002), mat(i % 2 ? 'paper' : 'paper2'), papers, (i % 2 ? .006 : -.004), .003 + i * .0065, 0, { outline: i === 4 || i === 0 });
    p.rotation.y = (i - 2) * .035; }

  /* headphones: clear of the lamp */
  const phones = group('phones', .72, 0, .06);
  mesh(new THREE.TorusGeometry(.085, .009, 12, 40, Math.PI), mat('phones', { roughness: .5 }), phones, 0, .05, 0);
  [-1, 1].forEach(sd => { mesh(new THREE.CylinderGeometry(.034, .034, .03, 28).rotateZ(Math.PI / 2), mat('phones', { roughness: .5 }), phones, sd * .085, .045, 0);
    mesh(new THREE.CylinderGeometry(.03, .03, .012, 28).rotateZ(Math.PI / 2), mat('cushion', { roughness: .9 }), phones, sd * .066, .045, 0, { outline: false }); });

  /* desk lamp: switching it on is the light theme. Glowing bulb, a soft cone of light and a warm pool on the desk */
  const lampM = mat('lamp', { roughness: .35, metalness: .3 });
  const lamp = group('lamp', 1.05, 0, -.17);
  mesh(new THREE.CylinderGeometry(.065, .075, .02, 32), lampM, lamp, 0, .01, 0);
  const arm1 = mesh(new THREE.CylinderGeometry(.008, .008, .3, 12), lampM, lamp, .03, .155, 0); arm1.rotation.z = -.22;
  mesh(new THREE.SphereGeometry(.016, 16, 12), lampM, lamp, .064, .3, 0);
  const arm2 = mesh(new THREE.CylinderGeometry(.007, .007, .22, 12), lampM, lamp, -.025, .355, 0); arm2.rotation.z = 1.05;
  const head = sub(lamp, -.115, .405, 0); head.rotation.z = .6;
  mesh(new THREE.CylinderGeometry(.03, .075, .1, 32, 1, true), mat('lamp', { roughness: .35, metalness: .3, side: THREE.DoubleSide }), head, 0, 0, 0);
  const bulbMat = new THREE.MeshBasicMaterial({ color: '#5C5A52', toneMapped: false });
  const bulb = mesh(new THREE.SphereGeometry(.024, 16, 12), bulbMat, head, 0, -.03, 0, { outline: false, cast: false });
  const coneMat = volumeMat('#FFD79A'); const cone = new THREE.Mesh(new THREE.CylinderGeometry(.068, .3, .44, 40, 1, true), coneMat);
  cone.position.y = -.27; cone.userData.skip = true; head.add(cone);
  const spot = new THREE.SpotLight('#FFD7A0', 0, 2.6, .72, .7, 1.3); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -.0006;
  spot.position.set(0, -.03, 0); head.add(spot); const spotT = new THREE.Object3D(); scene.add(spotT); spot.target = spotT;
  const lampFill = new THREE.PointLight('#FFC98A', 0, 1.8, 1.6); lampFill.position.set(0, -.06, 0); head.add(lampFill);

  /* wall frame: the painted forest */
  const pic = group('frame', -.72, .66, -.545);
  mesh(rbox(.26, .32, .025, .006), mat('frame'), pic, 0, 0, 0);
  const artC = document.createElement('canvas'); artC.width = 220; artC.height = 280; if (window.__forest) window.__forest(artC, 1, 7);
  const artTex = new THREE.CanvasTexture(artC); artTex.colorSpace = THREE.SRGBColorSpace;
  const art = new THREE.Mesh(new THREE.PlaneGeometry(.21, .27), new THREE.MeshStandardMaterial({ map: artTex, emissive: '#ffffff', emissiveMap: artTex, emissiveIntensity: .5, roughness: .9 })); art.position.z = .0131; pic.add(art);

  /* whiteboard: a block diagram */
  const board = group('board', .74, .63, -.545);
  mesh(rbox(.5, .36, .02, .008), mat('boardEdge'), board, 0, 0, 0);
  const boardS = plane(.47, .33, canvasTex(640, 450, paintBlocks(false))); boardS.position.z = .0105; board.add(boardS);
  mesh(rbox(.42, .012, .035, .004), mat('boardEdge'), board, 0, -.19, .015);

  /* ---- light ---- */
  const hemi = new THREE.HemisphereLight('#CFE3DA', '#20322C', .6); scene.add(hemi);
  const key = new THREE.DirectionalLight('#BFD3FF', 1); key.position.set(-2.6, 2.4, 2.2); key.target.position.set(0, 0, -.2); scene.add(key, key.target);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -1.8, right: 1.8, top: 1.4, bottom: -1.1, near: .5, far: 9 });
  key.shadow.bias = -.0004; key.shadow.normalBias = .01;
  // the sunbeam (moonbeam at night) comes in through the window and lands on the left of the desk, shaped like the panes
  const WIN = V(-1.32, .66, -.555), LAND = V(-.72, 0, .2), dir = LAND.clone().sub(WIN).normalize();
  const beam = new THREE.SpotLight('#FFE2AE', 0, 4, .3, .35, 1); beam.position.copy(WIN.clone().addScaledVector(dir, -1.1));
  beam.target.position.copy(LAND); beam.castShadow = true; beam.shadow.mapSize.set(1024, 1024); beam.shadow.bias = -.0005;
  beam.map = canvasTex(256, 256, paintPanes); scene.add(beam, beam.target);
  const shaftLen = LAND.distanceTo(WIN), shaftMat = volumeMat('#FFE2AE');
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.27, .4, shaftLen, 4, 1, true).rotateY(Math.PI / 4), shaftMat);
  shaft.position.copy(WIN).add(LAND).multiplyScalar(.5); shaft.quaternion.setFromUnitVectors(V(0, 1, 0), dir.clone().negate()); scene.add(shaft);
  const motes = []; const moteMat = new THREE.SpriteMaterial({ map: puff, color: '#FFF1D6', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  for (let i = 0; i < 46; i++) { const m = new THREE.Sprite(moteMat.clone()); m.userData = { t: Math.random(), a: Math.random() * 6.28, r: Math.random(), s: .004 + Math.random() * .006 }; scene.add(m); motes.push(m); }
  const glow = new THREE.PointLight('#7FD9C0', 0, 1.6, 1.6); glow.position.set(0, .43, .12); mon.add(glow);
  scene.updateMatrixWorld(true); head.localToWorld(spotT.position.set(0, -.7, 0));

  /* ---- theme: walls, outlines and light change; objects keep their colour ---- */
  const T = { light: 0, lamp: 0, screen: 0, intro: 0, fairy: 1 };
  const target = { light: 0 };
  let ph = phase();
  function readTheme() {
    const light = root.dataset.theme === 'light', hc = root.dataset.ct === 'high';
    target.light = light ? 1 : 0;
    const ink = new THREE.Color(css('--cream') || '#F3EEE3'), accent = new THREE.Color(css('--mint') || '#9FD8C4');
    Object.values(groups).concat([win, shelf]).forEach(g => { const o = g.userData.outline; if (!o) return;
      o.uniforms.color.value.copy(ink); o.userData.ink = ink.clone(); o.userData.accent = accent.clone();
      o.uniforms.opacity.value = hc ? 1 : light ? .5 : .42; o.userData.baseOpacity = o.uniforms.opacity.value; o.userData.baseThick = hc ? .005 : .0032; });
  }
  const cOff = new THREE.Color('#5C5A52'), cOn = new THREE.Color('#FFF6DE'), tmpC = new THREE.Color();
  function applyLight(now) {   // the room by time of day, then the lamp (light theme) on top
    const l = T.light, P = PH[ph], k = T.intro, lampOn = T.lamp;
    wallMat.color.set(ph === 'day' ? '#2F4F44' : ph === 'morning' ? '#2A463D' : ph === 'dusk' ? '#26392F' : '#163029').lerp(tmpC.set('#EFE8D8'), l); floorMat.color.set('#0E221E').lerp(tmpC.set('#D9CFB8'), l);
    wallMat.emissive.set('#F4EFE4'); wallMat.emissiveIntensity = .2 * l * k; floorMat.emissive.set('#F4EFE4'); floorMat.emissiveIntensity = .1 * l * k;
    hemi.intensity = (P.hemi + .55 * l) * k; hemi.color.set('#9FC4BA').lerp(tmpC.set('#FFF1DA'), l);
    key.color.set(P.key); key.intensity = P.keyI * (1 - .25 * l) * k;
    beam.color.set(P.beam); beam.intensity = P.beamI * k; shaftMat.uniforms.color.value.set(P.beam); shaftMat.uniforms.strength.value = P.shaft * (1 - .45 * l) * k;
    spot.intensity = lampOn * 5.5 * k; lampFill.intensity = lampOn * .55 * k; coneMat.uniforms.strength.value = lampOn * .5 * k;
    bulbMat.color.copy(cOff).lerp(cOn, lampOn).multiplyScalar(1 + lampOn * 1.6);
    T.fairy += ((lightsOn ? 1 : 0) - T.fairy) * .12; const fz = (P.fairy * (1 - .55 * l) + .12) * k * T.fairy;
    fairy.forEach(b => { const tw = still() ? 1 : .8 + .2 * Math.sin(now / 700 + b.userData.ph); b.material.color.copy(b.userData.c).multiplyScalar(fz * tw * 1.6); });
    glow.intensity = T.screen * (.35 - .2 * l) * k; screen.material.color.setScalar(T.screen);
  }

  /* ---- hotspots follow their objects; where two overlap, the smaller one sits on top ---- */
  const PINS = [['#hsFrame', 'frame'], ['#hsPlant', 'plant'], ['#hsMonitor', 'monitor'], ['#hsKeys', 'keys'], ['.hs-laptop', 'laptop'], ['.hs-board', 'board'],
    ['#hsPhones', 'phones'], ['.hs-papers', 'papers'], ['.hs-mug', 'mug'], ['#hsNote', 'note'], ['#hsDrawer', 'drawer'], ['#hsLamp', 'lamp'], ['#hsClock', 'clock'],
    ['#hsWindow', 'window'], ['#hsLights', 'lights'], ['.hs-books', 'books'], ['#hsBot', 'bot']]
    .map(([sel, k]) => ({ el: desk.querySelector(sel), g: groups[k] })).filter(p => p.el && p.g);
  const box = new THREE.Box3(), tmpBox = new THREE.Box3(), v = new THREE.Vector3();
  function boundsOf(g) { box.makeEmpty();
    g.traverse(o => { if (!o.isMesh || o.userData.skip) return; if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); tmpBox.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); box.union(tmpBox); });
    return box; }
  function project(b, W, H) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < 8; i++) { v.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(camera);
      const sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * H; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
    return { x0, y0, x1, y1 }; }
  function pin() {
    const W = canvas.clientWidth, H = canvas.clientHeight; if (!W) return;
    camera.updateMatrixWorld(); const placed = [];
    for (const p of PINS) {
      const r = project(boundsOf(p.g), W, H), pad = 4, minS = 28, cx = (r.x0 + r.x1) / 2, cy = (r.y0 + r.y1) / 2,
        w = Math.max(minS, r.x1 - r.x0 + pad * 2), h = Math.max(minS, r.y1 - r.y0 + pad * 2);
      const s = p.el.style; s.left = ((cx - w / 2) / W * 100).toFixed(3) + '%'; s.top = ((cy - h / 2) / H * 100).toFixed(3) + '%';
      s.width = (w / W * 100).toFixed(3) + '%'; s.height = (h / H * 100).toFixed(3) + '%'; placed.push([w * h, s]);
    }
    placed.sort((a, b) => b[0] - a[0]).forEach(([, s], i) => { s.zIndex = 3 + i; });
  }
  function unpin() { PINS.forEach(p => { const s = p.el.style; s.left = s.top = s.width = s.height = s.zIndex = ''; }); }
  /* VamsiOS grows out of the monitor screen: site.js asks where that screen is on the page */
  function winRect() { const W = canvas.clientWidth, H = canvas.clientHeight, c = canvas.getBoundingClientRect();
    camera.updateMatrixWorld(); sky.geometry.computeBoundingBox(); tmpBox.copy(sky.geometry.boundingBox).applyMatrix4(sky.matrixWorld);
    const r = project(tmpBox, W, H); return { left: c.left + r.x0, top: c.top + r.y0, width: r.x1 - r.x0, height: r.y1 - r.y0 }; }
  function screenRect() { const W = canvas.clientWidth, H = canvas.clientHeight, c = canvas.getBoundingClientRect();
    camera.updateMatrixWorld(); screen.geometry.computeBoundingBox(); tmpBox.copy(screen.geometry.boundingBox).applyMatrix4(screen.matrixWorld);
    const r = project(tmpBox, W, H); return { left: c.left + r.x0, top: c.top + r.y0, width: r.x1 - r.x0, height: r.y1 - r.y0 }; }

  /* hover and keyboard focus light the object up, exactly like the drawing did */
  const hot = new Set();
  PINS.forEach(p => { const on = () => { hot.add(p.g); kick(); }, off = () => { hot.delete(p.g); kick(); };
    p.el.addEventListener('pointerenter', on); p.el.addEventListener('pointerleave', off);
    p.el.addEventListener('focus', () => { if (p.el.matches(':focus-visible')) on(); }); p.el.addEventListener('blur', off); });
  const active = () => new Set([desk.classList.contains('phones-on') && groups.phones, desk.classList.contains('keys-on') && groups.keys, desk.classList.contains('card-open') && groups.drawer].filter(Boolean));

  /* ---- camera: gentle parallax and an intro ---- */
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  desk.addEventListener('pointermove', e => { const r = desk.getBoundingClientRect(); par.tx = (e.clientX - r.left) / r.width - .5; par.ty = (e.clientY - r.top) / r.height - .5; kick(); });
  desk.addEventListener('pointerleave', () => { par.tx = par.ty = 0; kick(); });

  /* ---- loop: never draws while hidden; stops when nothing moves (always the case with motion paused) ---- */
  let running = false, raf = 0, last = performance.now(), introT0 = 0, booted = false, bootT = 0, idle = 0, visible = true;
  function kick() { idle = 0; if (running && !raf) raf = requestAnimationFrame(frame); }
  const lerp = (a, b, t) => a + (b - a) * t, eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function frame(now) {
    raf = 0; if (!visible || document.hidden) return; const dt = Math.min(.05, (now - last) / 1000); last = now; const calm = still(); let moving = false;
    if (T.intro < 1) { T.intro = calm ? 1 : Math.min(1, (now - introT0) / 1200); moving = true; }
    if (!booted && T.intro >= .85) { booted = true; bootT = now; }
    if (booted && T.screen < 1) { const b = calm ? 1 : Math.min(1, (now - bootT) / 700); T.screen = b < .3 ? b * 3 * (Math.sin(b * 60) * .3 + .7) : .9 + b * .1; if (b >= 1) T.screen = 1; moving = true; }
    const dl = target.light - T.light; if (Math.abs(dl) > .002) { T.light += dl * (calm ? 1 : 1 - Math.pow(.002, dt)); moving = true; } else T.light = target.light;
    const dlamp = target.light - T.lamp; if (Math.abs(dlamp) > .002) { T.lamp += dlamp * (calm ? 1 : 1 - Math.pow(.0004, dt)); moving = true; } else T.lamp = target.light;
    applyLight(now);
    if (!calm) { par.x = lerp(par.x, par.tx, 1 - Math.pow(.004, dt)); par.y = lerp(par.y, par.ty, 1 - Math.pow(.004, dt)); } else { par.x = par.y = 0; }
    if (Math.abs(par.x - par.tx) > .001 || Math.abs(par.y - par.ty) > .001) moving = true;
    const intro = 1 - eio(T.intro);
    camera.position.set(HOME.x + par.x * .16, HOME.y - par.y * .07 + intro * .22, HOME.z + intro * .9); camera.lookAt(LOOK);
    // objects: hover lift + outline, drawer, headphones pulse while the audio demo plays
    const act = active();
    for (const g of Object.values(groups)) { const want = hot.has(g) || act.has(g) ? 1 : 0, d = want - g.userData.hi;
      if (Math.abs(d) > .002) { g.userData.hi += d * (calm ? 1 : 1 - Math.pow(.0005, dt)); moving = true; } else g.userData.hi = want;
      const h = g.userData.hi, o = g.userData.outline;
      if (o && o.userData.ink) { o.uniforms.color.value.copy(o.userData.ink).lerp(o.userData.accent, h); o.uniforms.opacity.value = lerp(o.userData.baseOpacity, 1, h); o.uniforms.thickness.value = lerp(o.userData.baseThick, .0055, h); }
      g.position.y = g.userData.base.y + (g === groups.drawer || g === groups.desk || g === groups.clock || g === groups.window || g === groups.lights || g === groups.books ? 0 : h * .012); }
    const dz = (desk.classList.contains('card-open') ? .2 : 0) + drawer.userData.base.z - drawer.position.z;
    if (Math.abs(dz) > .0005) { drawer.position.z += dz * (calm ? 1 : 1 - Math.pow(.001, dt)); moving = true; }
    // living things: steam, swaying leaves, dust in the sunbeam, twinkling lights. All still when motion is paused
    const P = PH[ph];
    if (!calm) {
      steam.forEach(s => { s.userData.t = (s.userData.t + dt * .22) % 1; const t = s.userData.t;
        s.position.set(mug.position.x + Math.sin(t * 6 + s.id) * .012, mug.position.y + .11 + t * .16, mug.position.z); s.scale.setScalar(.03 + t * .05); s.material.opacity = Math.sin(t * Math.PI) * .22; });
      leaves.forEach((lg, i) => { lg.rotation.z = Math.sin(now / 1400 + i * .9) * .025; });
      motes.forEach(m => { const u = m.userData; u.t = (u.t + dt * .012) % 1; u.a += dt * .3;
        m.position.copy(WIN).lerp(LAND, u.t); m.position.x += Math.cos(u.a) * u.r * .14; m.position.y += Math.sin(u.a * .7) * u.r * .1; m.position.z += Math.sin(u.a) * u.r * .1;
        m.scale.setScalar(u.s); m.material.opacity = P.mote * .9 * Math.sin(u.t * Math.PI) * (1 - .5 * T.light) * T.intro; });
      groups.phones.scale.setScalar(desk.classList.contains('phones-on') ? 1 + Math.sin(now / 160) * .015 : 1);
      // robot: follows the pointer with its head, blinks, waves while hovered, its antenna pulses while the assistant is open
      botHead.rotation.y = lerp(botHead.rotation.y, par.x * .9, .08); botHead.rotation.x = lerp(botHead.rotation.x, par.y * .45, .08);
      if (now > blinkAt) blinkAt = now + 2600 + Math.random() * 3000; const bl = blinkAt - now < 130 ? .15 : 1, chat = panel && panel.dataset.open === 'true';
      eyes.forEach(e => { e.scale.y = chat ? .55 : bl; });
      antMat.color.set('#9FD8C4').multiplyScalar(chat ? 1.4 + Math.sin(now / 180) * .6 : 1);
      armR.rotation.z = .28 + groups.bot.userData.hi * (1.6 + Math.sin(now / 110) * .5);
      moving = true;
    } else { steam.forEach(s => { s.material.opacity = 0; }); motes.forEach(m => { m.material.opacity = 0; }); }
    renderer.render(scene, camera); pin();
    if (moving) idle = 0; else idle++;
    if (running && (moving || idle < 3)) raf = requestAnimationFrame(frame);
  }

  function size() { const W = desk.clientWidth, H = desk.clientHeight; if (!W || !H) return; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); kick(); }
  new ResizeObserver(size).observe(desk);
  new MutationObserver(() => { readTheme(); kick(); }).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-ct', 'data-cb', 'data-mo'] });
  new MutationObserver(kick).observe(desk, { attributes: true, attributeFilter: ['class'] });
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }).observe(desk);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  window.addEventListener('dayphase', () => { ph = phase(); repaint(skyTex); kick(); });
  setInterval(() => { repaint(clockTex); repaint(osTex); const now = phase(); if (now !== ph) { ph = now; repaint(skyTex); } kick(); }, 30000);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); api.suspend(); });

  readTheme(); T.light = target.light; T.lamp = target.light;
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { repaint(osTex); kick(); });

  let pending = false;
  const api = {
    resume() {   // show the room once the line drawing has finished drawing itself in
      if (running || pending) return; pending = true;
      const go = () => { if (!pending) return; if (desk.classList.contains('drawing')) { setTimeout(go, 200); return; }
        pending = false; running = true; introT0 = performance.now(); size(); desk.classList.add('is-3d'); window.__screenRect = screenRect; window.__winRect = winRect; kick(); };
      go();
    },
    suspend() { pending = false; running = false; cancelAnimationFrame(raf); raf = 0; desk.classList.remove('is-3d'); unpin(); hot.clear();
      if (window.__screenRect === screenRect) delete window.__screenRect; if (window.__winRect === winRect) delete window.__winRect; },
  };
  api.resume();
  return api;
}
