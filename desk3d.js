/* ---------- the desk as a lit 3D room ----------
   Loaded on demand by site.js, only on wide screens with WebGL2. The SVG drawing stays in the page as the fallback.
   Accessibility stays in the HTML: every object is still the same <button>/<a> hotspot. This module only draws the room
   and moves each hotspot so it sits exactly over its 3D object. The canvas itself is aria-hidden and never takes clicks. */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const root = document.documentElement;
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches || root.dataset.mo === 'off';
const css = n => getComputedStyle(root).getPropertyValue(n).trim();
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const TZ = 'America/Chicago';

/* fixed object colours: the room is lit differently per theme, the things in it keep their colour */
const COL = {
  desk: '#35554A', leg: '#22392F', bezel: '#17241F', alu: '#C9C4B8', mug: '#ECE4D2', band: '#9FD8C4',
  pot: '#C49A72', leaf: '#5E9C80', leaf2: '#7DB89A', paper: '#EFE9DC', paper2: '#E2D9C6', phones: '#26332F', cushion: '#46625A',
  kbd: '#E4DED0', key: '#F6F2E9', front: '#2D4A40', handle: '#CFC4A8', lamp: '#9FD8C4', lampIn: '#FFE9B8',
  board: '#F4F0E6', boardEdge: '#D9D1BF', frame: '#E9E1CF', note: '#EDE4D0', winFrame: '#E9E1CF', clock: '#F3EEE3',
};

function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function canvasTex(w, h, paint) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'), w, h, c);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.userData.canvas = c; t.userData.paint = paint; return t;
}
function repaint(t) { const c = t.userData.canvas; t.userData.paint(c.getContext('2d'), c.width, c.height, c); t.needsUpdate = true; }

/* ---- textures ---- */
const APPS = [['#F6B65C', '#E0703E'], ['#8FB7F2', '#4F6FD6'], ['#7FD9C0', '#2A9478'], ['#5E9BE0', '#24589E'], ['#5B6470', '#262B31'], ['#B9A7E6', '#6C5AA8']];
function paintOS(g, W, H) {   // a small VamsiOS, so flying into the screen lands on the real thing
  let gr = g.createRadialGradient(W * .2, H * .1, 0, W * .2, H * .1, W * 1.1);
  gr.addColorStop(0, '#1d4a40'); gr.addColorStop(.6, '#0f2a24'); gr.addColorStop(1, '#0d221e'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(243,238,227,.14)'; g.fillRect(0, H * .085, W, 2);
  g.fillStyle = '#F3EEE3'; g.font = `400 ${H * .052}px "Instrument Serif", Georgia, serif`; g.textBaseline = 'middle'; g.fillText('VamsiOS', W * .03, H * .045);
  const s = H * .1, gap = H * .07;
  APPS.forEach((a, i) => { const x = W * .035 + (i % 2) * (s + gap), y = H * .14 + Math.floor(i / 2) * (s + gap * 1.15);
    const lg = g.createLinearGradient(x, y, x + s, y + s); lg.addColorStop(0, a[0]); lg.addColorStop(1, a[1]);
    g.fillStyle = lg; roundRect(g, x, y, s, s, s * .26); g.fill();
    g.fillStyle = 'rgba(255,255,255,.22)'; roundRect(g, x, y, s, s * .48, s * .26); g.fill();
    g.fillStyle = 'rgba(243,238,227,.7)'; g.fillRect(x + s * .15, y + s + gap * .25, s * .7, H * .008); });
  g.textAlign = 'center'; g.fillStyle = 'rgba(243,238,227,.6)'; g.font = `400 ${H * .1}px "Instrument Serif", Georgia, serif`;
  g.fillText('Hi, this is my computer.', W * .62, H * .48); g.fillStyle = 'rgba(143,166,155,.9)'; g.font = `400 ${H * .04}px "Atkinson Hyperlegible", sans-serif`;
  g.fillText('The apps open things I’ve built.', W * .62, H * .58); g.textAlign = 'left';
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
function texasNow() {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const v = k => +(p.find(x => x.type === k) || { value: 0 }).value; return { h: v('hour'), m: v('minute') };
}
/* window sky follows the time of day in Texas, where the desk is */
function skyPhase() { const { h, m } = texasNow(), t = h + m / 60;
  if (t >= 7.5 && t < 17.5) return 'day'; if ((t >= 5.5 && t < 7.5) || (t >= 17.5 && t < 20)) return 'dusk'; return 'night'; }
function paintSky(g, W, H) {
  const ph = skyPhase(), gr = g.createLinearGradient(0, 0, 0, H);
  const stops = { day: ['#7FB6D9', '#BFDCE6', '#EAF1E8'], dusk: ['#3A3F6B', '#C9767A', '#F2C38E'], night: ['#08131C', '#0F2433', '#1B3A44'] }[ph];
  stops.forEach((c, i) => gr.addColorStop(i / 2, c)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  if (ph === 'night') { for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(255,255,240,${.3 + r() * .6})`; g.fillRect(r() * W, r() * H * .75, 1.6, 1.6); }
    g.fillStyle = '#F4EFD8'; g.beginPath(); g.arc(W * .7, H * .25, W * .07, 0, 7); g.fill(); g.fillStyle = '#0F2433'; g.beginPath(); g.arc(W * .735, H * .23, W * .065, 0, 7); g.fill(); }
  if (ph === 'day') { g.fillStyle = 'rgba(255,255,255,.75)'; [[.3, .25], [.62, .4], [.45, .18]].forEach(([x, y]) => { for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(W * (x + k * .06), H * y, W * (.06 + (k % 2) * .03), 0, 7); g.fill(); } }); }
  if (ph === 'dusk') { g.fillStyle = 'rgba(255,214,150,.9)'; g.beginPath(); g.arc(W * .4, H * .82, W * .12, 0, 7); g.fill(); }
  // distant treeline, the same forest as the painting
  g.fillStyle = ph === 'day' ? '#4F7F6C' : ph === 'dusk' ? '#2B3A3E' : '#0A1A1E';
  for (let i = 0; i < 14; i++) { const x = (i / 13) * W, h = H * (.12 + r() * .14); g.beginPath(); g.moveTo(x - W * .06, H); g.lineTo(x, H - h - H * .05); g.lineTo(x + W * .06, H); g.fill(); }
}
function paintClock(g, W, H) {
  const { h, m } = texasNow(), c = W / 2; g.clearRect(0, 0, W, H);
  g.fillStyle = COL.clock; g.beginPath(); g.arc(c, c, c * .96, 0, 7); g.fill(); g.strokeStyle = '#22302B';
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.lineWidth = W * (i % 3 ? .012 : .025);
    g.beginPath(); g.moveTo(c + Math.sin(a) * c * .78, c - Math.cos(a) * c * .78); g.lineTo(c + Math.sin(a) * c * .88, c - Math.cos(a) * c * .88); g.stroke(); }
  const hand = (a, len, w) => { g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.sin(a) * len, c - Math.cos(a) * len); g.stroke(); };
  hand(((h % 12) + m / 60) / 12 * Math.PI * 2, c * .48, W * .04); g.strokeStyle = '#2A9478'; hand(m / 60 * Math.PI * 2, c * .7, W * .025);
  g.fillStyle = '#22302B'; g.beginPath(); g.arc(c, c, W * .03, 0, 7); g.fill();
}

/* ---- outlines: a back-face shell pushed out along normals keeps the hand-drawn line of the old desk ---- */
function outlineMat() {
  return new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color('#F3EEE3') }, opacity: { value: .5 }, thickness: { value: .0032 } },
    vertexShader: 'uniform float thickness;void main(){vec3 p=position+normal*thickness;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}',
    fragmentShader: 'uniform vec3 color;uniform float opacity;void main(){gl_FragColor=vec4(color,opacity);\n#include <colorspace_fragment>\n}',
    side: THREE.BackSide, transparent: true, depthWrite: false,
  });
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
  const LOOK = new THREE.Vector3(0, .3, -.22), HOME = new THREE.Vector3(0, .66, 3.25);
  camera.position.copy(HOME); camera.lookAt(LOOK);

  const mats = {}; const mat = (k, o = {}) => mats[k] || (mats[k] = new THREE.MeshStandardMaterial({ color: COL[k] || k, roughness: .72, metalness: 0, ...o }));
  const groups = {}, outlines = [];
  function mesh(geo, m, parent, x = 0, y = 0, z = 0, opts = {}) {
    const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.castShadow = opts.cast !== false; me.receiveShadow = true; parent.add(me);
    if (opts.outline !== false && parent.userData.outline) { const o = new THREE.Mesh(geo, parent.userData.outline); me.add(o); outlines.push(o); }
    return me;
  }
  function group(key, x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.position.set(x, y, z); g.userData.outline = outlineMat(); g.userData.hi = 0; g.userData.base = g.position.clone(); scene.add(g); if (key) groups[key] = g; return g; }
  const rbox = (w, h, d, r = .006) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.01, h / 2.01, d / 2.01));
  const plane = (w, h, tex, emissive) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), emissive
    ? new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }) : new THREE.MeshStandardMaterial({ map: tex, roughness: .9 }));

  /* ---- room ---- */
  const room = group(null); room.userData.outline = null;
  const wallMat = new THREE.MeshStandardMaterial({ color: '#163029', roughness: .95 }), floorMat = new THREE.MeshStandardMaterial({ color: '#0E221E', roughness: .9 });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), wallMat); wall.position.set(0, .9, -.56); wall.receiveShadow = true; room.add(wall);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.set(0, -.78, 1.4); floor.receiveShadow = true; room.add(floor);
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(8, .05, .015), mat('#20392F')); skirt.position.set(0, -.755, -.55); room.add(skirt);

  /* window (decorative): Texas sky right now */
  const win = group(null, -1.32, .66, -.555);
  const skyTex = canvasTex(256, 320, paintSky); const sky = plane(.38, .48, skyTex, true); sky.position.z = .004; win.add(sky);
  [[0, .25, .44, .025], [0, -.25, .44, .025], [-.21, 0, .025, .52], [.21, 0, .025, .52], [0, 0, .015, .48], [0, .02, .4, .015]].forEach(([x, y, w, h]) =>
    mesh(rbox(w, h, .03, .004), mat('winFrame'), win, x, y, .012));
  mesh(rbox(.5, .025, .07, .006), mat('winFrame'), win, 0, -.27, .03);

  /* wall clock (decorative): Texas time */
  const clockG = group(null, 1.3, .78, -.55);
  const clockTex = canvasTex(256, 256, paintClock);
  mesh(new THREE.CylinderGeometry(.095, .095, .02, 48).rotateX(Math.PI / 2), mat('#22392F'), clockG, 0, 0, .01);
  const face = new THREE.Mesh(new THREE.CircleGeometry(.085, 48), new THREE.MeshStandardMaterial({ map: clockTex, roughness: .8 })); face.position.z = .021; clockG.add(face);

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

  /* laptop: opened, a block program on screen */
  const lap = group('laptop', -.64, 0, .02);
  mesh(rbox(.38, .016, .25, .008), mat('alu', { roughness: .35, metalness: .4 }), lap, 0, .008, 0);
  const lid = new THREE.Group(); lid.userData.outline = lap.userData.outline; lid.position.set(0, .016, -.12); lid.rotation.x = -.22; lap.add(lid);
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

  /* plant */
  const plant = group('plant', -.98, 0, -.06);
  mesh(new THREE.CylinderGeometry(.07, .052, .12, 28), mat('pot'), plant, 0, .06, 0);
  mesh(new THREE.CylinderGeometry(.064, .064, .01, 28), mat('#3B2E22'), plant, 0, .116, 0, { outline: false });
  const leafGeo = new THREE.SphereGeometry(1, 16, 10);
  [[0, .3, 0, 0, .02], [-.05, .25, .02, .5, -.4], [.055, .24, -.01, -.55, .3], [-.02, .2, .05, .25, .9], [.03, .22, -.05, -.25, -1.2], [.07, .18, .03, -.9, .6], [-.07, .17, -.02, .9, -.8]]
    .forEach(([x, h, z, rz, ry], i) => { const l = mesh(leafGeo, mat(i % 2 ? 'leaf' : 'leaf2', { roughness: .6, side: THREE.DoubleSide }), plant, x * .6, .12 + h / 2, z, { outline: false });
      l.scale.set(.026, h / 2, .007); l.rotation.set(0, ry, rz); });

  /* papers */
  const papers = group('papers', .52, 0, .12);
  for (let i = 0; i < 5; i++) { const p = mesh(rbox(.24, .006, .17, .002), mat(i % 2 ? 'paper' : 'paper2'), papers, (i % 2 ? .006 : -.004), .003 + i * .0065, 0, { outline: i === 4 || i === 0 });
    p.rotation.y = (i - 2) * .035; }

  /* headphones */
  const phones = group('phones', .86, 0, .05);
  mesh(new THREE.TorusGeometry(.085, .009, 12, 40, Math.PI), mat('phones', { roughness: .5 }), phones, 0, .05, 0);
  [-1, 1].forEach(sd => { const cup = mesh(new THREE.CylinderGeometry(.034, .034, .03, 28).rotateZ(Math.PI / 2), mat('phones', { roughness: .5 }), phones, sd * .085, .045, 0);
    mesh(new THREE.CylinderGeometry(.03, .03, .012, 28).rotateZ(Math.PI / 2), mat('cushion', { roughness: .9 }), phones, sd * .066, .045, 0, { outline: false }); cup.userData.cup = true; });

  /* keyboard */
  const kbd = group('keys', .25, 0, .17);
  mesh(rbox(.37, .016, .12, .006), mat('kbd', { roughness: .5 }), kbd, 0, .008, 0);
  const keyGeo = rbox(.022, .008, .02, .003), keys = new THREE.InstancedMesh(keyGeo, mat('key', { roughness: .45 }), 60); keys.castShadow = true;
  const dm = new THREE.Object3D(); let ki = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) { if (ki >= 60) break; dm.position.set(-.16 + c * .0245 + (r % 2) * .006, .019, -.042 + r * .028); dm.updateMatrix(); keys.setMatrixAt(ki++, dm.matrix); }
  dm.position.set(0, .019, .07); dm.scale.set(7, 1, 1); dm.updateMatrix(); keys.setMatrixAt(ki++, dm.matrix); keys.count = ki;
  keys.position.z = -.012; kbd.add(keys);

  /* desk lamp: its light is the light theme */
  const lamp = group('lamp', 1.0, 0, -.12);
  mesh(new THREE.CylinderGeometry(.065, .075, .02, 32), mat('lamp', { roughness: .35, metalness: .3 }), lamp, 0, .01, 0);
  const arm1 = mesh(new THREE.CylinderGeometry(.008, .008, .3, 12), mat('lamp', { roughness: .35, metalness: .3 }), lamp, .03, .155, 0); arm1.rotation.z = -.22;
  mesh(new THREE.SphereGeometry(.016, 16, 12), mat('lamp', { roughness: .35, metalness: .3 }), lamp, .064, .3, 0);
  const arm2 = mesh(new THREE.CylinderGeometry(.007, .007, .24, 12), mat('lamp', { roughness: .35, metalness: .3 }), lamp, -.03, .36, 0); arm2.rotation.z = 1.05;
  const head = new THREE.Group(); head.userData.outline = lamp.userData.outline; head.position.set(-.13, .41, 0); head.rotation.z = .55; lamp.add(head);
  mesh(new THREE.CylinderGeometry(.03, .075, .1, 32, 1, true), mat('lamp', { roughness: .35, metalness: .3, side: THREE.DoubleSide }), head, 0, 0, 0);
  const bulb = mesh(new THREE.SphereGeometry(.026, 16, 12), new THREE.MeshStandardMaterial({ color: COL.lampIn, emissive: COL.lampIn, emissiveIntensity: 0 }), head, 0, -.03, 0, { outline: false, cast: false });

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
  const sun = new THREE.DirectionalLight('#BFD3FF', 1); sun.position.set(-2.6, 2.4, 2.2); sun.target.position.set(0, 0, -.2); scene.add(sun, sun.target);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -1.8, right: 1.8, top: 1.4, bottom: -1.1, near: .5, far: 9 });
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .01;
  const spot = new THREE.SpotLight('#FFD9A0', 0, 2.4, .75, .65, 1.4); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -.0006;
  head.add(spot); spot.position.set(0, -.02, 0); const spotT = new THREE.Object3D(); scene.add(spotT); spotT.position.set(.62, 0, .02); spot.target = spotT;
  const glow = new THREE.PointLight('#7FD9C0', 0, 1.6, 1.6); glow.position.set(0, .43, .12); mon.add(glow);

  /* ---- theme: walls, outlines and light change; objects keep their colour ---- */
  const T = { light: 0, lamp: 0, screen: 0, intro: 0 };
  let target = { light: 0 };
  function readTheme() {
    const light = root.dataset.theme === 'light', hc = root.dataset.ct === 'high';
    target.light = light ? 1 : 0;
    const ink = new THREE.Color(css('--cream') || '#F3EEE3'), accent = new THREE.Color(css('--mint') || '#9FD8C4');
    Object.values(groups).concat([win, clockG]).forEach(g => { const o = g.userData.outline; if (!o) return;
      o.uniforms.color.value.copy(ink); o.userData.ink = ink.clone(); o.userData.accent = accent.clone();
      o.uniforms.opacity.value = hc ? 1 : light ? .5 : .42; o.userData.baseOpacity = o.uniforms.opacity.value; o.userData.baseThick = hc ? .005 : .0032; });
  }
  function applyLight() {   // blend between the night room (dark theme) and the lamp-lit room (light theme)
    const l = T.light, ph = skyPhase(), day = ph === 'day' ? 1 : ph === 'dusk' ? .5 : 0, k = T.intro;
    wallMat.color.set('#163029').lerp(new THREE.Color('#EFE8D8'), l); floorMat.color.set('#0E221E').lerp(new THREE.Color('#D9CFB8'), l);
    wallMat.emissive.set('#F4EFE4'); wallMat.emissiveIntensity = .22 * l * k; floorMat.emissive.set('#F4EFE4'); floorMat.emissiveIntensity = .12 * l * k;
    hemi.intensity = (.35 + 1.3 * l + .25 * day) * k; hemi.color.set('#9FC4BA').lerp(new THREE.Color('#FFF1DA'), l);
    sun.color.set(day > .7 ? '#FFE6C2' : day > .2 ? '#FFB98A' : '#9DB7E8'); sun.intensity = (.55 + day * 1.6) * (1 - .2 * l) * k;
    spot.intensity = T.lamp * 2.2 * k; bulb.material.emissiveIntensity = T.lamp * 3;
    glow.intensity = T.screen * (.35 - .2 * l) * k; screen.material.color.setScalar(T.screen);
  }

  /* ---- hotspots follow their objects ---- */
  const PINS = [['#hsFrame', 'frame'], ['#hsPlant', 'plant'], ['#hsMonitor', 'monitor'], ['#hsKeys', 'keys'], ['.hs-laptop', 'laptop'], ['.hs-board', 'board'],
    ['#hsPhones', 'phones'], ['.hs-papers', 'papers'], ['.hs-mug', 'mug'], ['#hsNote', 'note'], ['#hsDrawer', 'drawer'], ['#hsLamp', 'lamp']]
    .map(([sel, key]) => ({ el: desk.querySelector(sel), g: groups[key] })).filter(p => p.el && p.g);
  const box = new THREE.Box3(), v = new THREE.Vector3();
  function pin() {
    const W = canvas.clientWidth, H = canvas.clientHeight; if (!W) return;
    camera.updateMatrixWorld();
    for (const p of PINS) {
      box.setFromObject(p.g); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (let i = 0; i < 8; i++) { v.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera);
        const sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * H; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
      const pad = 4, minS = 28, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = Math.max(minS, x1 - x0 + pad * 2), h = Math.max(minS, y1 - y0 + pad * 2);
      const s = p.el.style; s.left = ((cx - w / 2) / W * 100).toFixed(3) + '%'; s.top = ((cy - h / 2) / H * 100).toFixed(3) + '%';
      s.width = (w / W * 100).toFixed(3) + '%'; s.height = (h / H * 100).toFixed(3) + '%';
    }
  }
  function unpin() { PINS.forEach(p => { const s = p.el.style; s.left = s.top = s.width = s.height = ''; }); }

  /* hover and keyboard focus light the object up, exactly like the drawing did */
  const hot = new Set();
  PINS.forEach(p => { const on = () => { hot.add(p.g); kick(); }, off = () => { hot.delete(p.g); kick(); };
    p.el.addEventListener('pointerenter', on); p.el.addEventListener('pointerleave', off);
    p.el.addEventListener('focus', () => { if (p.el.matches(':focus-visible')) on(); }); p.el.addEventListener('blur', off); });
  const active = () => new Set([desk.classList.contains('phones-on') && groups.phones, desk.classList.contains('keys-on') && groups.keys, desk.classList.contains('card-open') && groups.drawer].filter(Boolean));

  /* ---- camera: gentle parallax, an intro, and the flight into the monitor ---- */
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  desk.addEventListener('pointermove', e => { const r = desk.getBoundingClientRect(); par.tx = (e.clientX - r.left) / r.width - .5; par.ty = (e.clientY - r.top) / r.height - .5; kick(); });
  desk.addEventListener('pointerleave', () => { par.tx = par.ty = 0; kick(); });
  let fly = null;   // {from,to,lookFrom,lookTo,t0,dur,done}
  const camLook = LOOK.clone();
  function flyTo(pos, look, dur, done) { fly = { from: camera.position.clone(), to: pos, lookFrom: camLook.clone(), lookTo: look, t0: performance.now(), dur, done }; kick(); }
  const SCREEN = new THREE.Vector3(0, .43, -.22), INTO = new THREE.Vector3(0, .43, .24);
  let passThrough = false, inside = false;
  hsLayer.addEventListener('click', e => {
    const mon = e.target.closest('#hsMonitor'); if (!mon || passThrough || !running || still()) return;
    e.stopPropagation(); e.preventDefault();
    flyTo(INTO, SCREEN, 850, () => { inside = true; passThrough = true; mon.click(); passThrough = false; });
  }, true);
  const vos = document.getElementById('vos');
  if (vos) new MutationObserver(() => { if (vos.hidden && inside) { inside = false; camera.position.copy(INTO); camLook.copy(SCREEN); flyTo(HOME.clone(), LOOK.clone(), 1100); } }).observe(vos, { attributes: true, attributeFilter: ['hidden'] });

  /* ---- loop: renders only while something moves, and never while hidden ---- */
  let running = false, raf = 0, last = performance.now(), introT0 = 0, booted = false, idle = 0;
  function kick() { idle = 0; if (running && !raf) raf = requestAnimationFrame(frame); }
  const lerp = (a, b, t) => a + (b - a) * t;
  function frame(now) {
    raf = 0; if (!visible || document.hidden) return; const dt = Math.min(.05, (now - last) / 1000); last = now; const calm = still(); let moving = false;
    // intro: lights fade up and the camera settles; the screen boots at the end
    if (T.intro < 1) { T.intro = calm ? 1 : Math.min(1, (now - introT0) / 1800); moving = true; }
    if (!booted && T.intro >= .85) { booted = true; bootT = now; }
    if (booted && T.screen < 1) { const b = calm ? 1 : Math.min(1, (now - bootT) / 700); T.screen = b < .3 ? b * 3 * (Math.sin(b * 60) * .3 + .7) : .9 + b * .1; if (b >= 1) T.screen = 1; moving = true; }
    // theme
    const k = calm ? 1 : 1 - Math.pow(.002, dt);
    const dl = target.light - T.light; if (Math.abs(dl) > .002) { T.light += dl * k; moving = true; } else T.light = target.light;
    const dlamp = target.light - T.lamp; if (Math.abs(dlamp) > .002) { T.lamp += dlamp * (calm ? 1 : 1 - Math.pow(.0005, dt)); moving = true; } else T.lamp = target.light;
    applyLight();
    // camera
    if (fly) { const t = calm ? 1 : Math.min(1, (now - fly.t0) / fly.dur), e = ease(t);
      camera.position.lerpVectors(fly.from, fly.to, e); camLook.lerpVectors(fly.lookFrom, fly.lookTo, e); moving = true;
      if (t >= 1) { const d = fly.done; fly = null; if (d) d(); } }
    else if (!inside) {
      if (!calm) { par.x = lerp(par.x, par.tx, 1 - Math.pow(.004, dt)); par.y = lerp(par.y, par.ty, 1 - Math.pow(.004, dt)); } else { par.x = par.y = 0; }
      if (Math.abs(par.x - par.tx) > .001 || Math.abs(par.y - par.ty) > .001) moving = true;
      const intro = 1 - ease(T.intro);
      camera.position.set(HOME.x + par.x * .16, HOME.y - par.y * .07 + intro * .22, HOME.z + intro * .9); camLook.copy(LOOK);
    }
    camera.lookAt(camLook);
    // objects: hover lift + outline, drawer, steam, headphones pulse while the audio demo plays
    const act = active();
    for (const g of Object.values(groups)) { const want = hot.has(g) || act.has(g) ? 1 : 0, d = want - g.userData.hi;
      if (Math.abs(d) > .002) { g.userData.hi += d * (calm ? 1 : 1 - Math.pow(.0005, dt)); moving = true; } else g.userData.hi = want;
      const h = g.userData.hi, o = g.userData.outline;
      if (o && o.userData.ink) { o.uniforms.color.value.copy(o.userData.ink).lerp(o.userData.accent, h); o.uniforms.opacity.value = lerp(o.userData.baseOpacity, 1, h); o.uniforms.thickness.value = lerp(o.userData.baseThick, .0055, h); }
      g.position.y = g.userData.base.y + (g === groups.drawer || g === groups.desk ? 0 : h * .012); }
    const dz = (desk.classList.contains('card-open') ? .2 : 0) + drawer.userData.base.z - drawer.position.z;
    if (Math.abs(dz) > .0005) { drawer.position.z += dz * (calm ? 1 : 1 - Math.pow(.001, dt)); moving = true; }
    if (!calm) { steam.forEach(s => { s.userData.t = (s.userData.t + dt * .22) % 1; const t = s.userData.t;
      s.position.set(mug.position.x + Math.sin(t * 6 + s.id) * .012, mug.position.y + .11 + t * .16, mug.position.z); s.scale.setScalar(.03 + t * .05); s.material.opacity = Math.sin(t * Math.PI) * .22; });
      if (desk.classList.contains('phones-on')) groups.phones.scale.setScalar(1 + Math.sin(now / 160) * .015); else groups.phones.scale.setScalar(1);
      moving = true; } else steam.forEach(s => { s.material.opacity = 0; });
    renderer.render(scene, camera); pin();
    if (moving) idle = 0; else idle++;
    if (running && (moving || idle < 3)) raf = requestAnimationFrame(frame);
  }
  let bootT = 0;

  function size() { const W = desk.clientWidth, H = desk.clientHeight; if (!W || !H) return; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); kick(); }
  const ro = new ResizeObserver(size); ro.observe(desk);
  const mo = new MutationObserver(() => { readTheme(); kick(); });
  mo.observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-ct', 'data-cb', 'data-mo'] });
  const dmo = new MutationObserver(kick); dmo.observe(desk, { attributes: true, attributeFilter: ['class'] });
  let visible = true;
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }); io.observe(desk);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  const tick = setInterval(() => { repaint(clockTex); const was = skyTex.userData.phase, ph = skyPhase(); if (ph !== was) { skyTex.userData.phase = ph; repaint(skyTex); } kick(); }, 30000);
  skyTex.userData.phase = skyPhase();
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); api.suspend(); desk.classList.remove('is-3d'); });

  readTheme(); T.light = target.light; T.lamp = target.light;
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  fonts.then(() => { repaint(osTex); kick(); });

  let pending = false;
  const api = {
    resume() {   // show the room once the line drawing has finished drawing itself in
      if (running || pending) return; pending = true;
      const go = () => { if (!pending) return; if (desk.classList.contains('drawing')) { setTimeout(go, 200); return; }
        pending = false; running = true; introT0 = performance.now(); size(); desk.classList.add('is-3d'); kick(); };
      go();
    },
    suspend() { pending = false; running = false; cancelAnimationFrame(raf); raf = 0; desk.classList.remove('is-3d'); unpin(); hot.clear(); },
  };
  api.resume();
  return api;
}
