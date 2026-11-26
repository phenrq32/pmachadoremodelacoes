/* Paulo Machado Remodelações — Showroom 3D
   Motor: three.js r170 · texturas, modelos e HDRI CC0 de Poly Haven (polyhaven.com) */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const WHATSAPP = "351935624419";
THREE.Cache.enabled = true;
const SERV = window.PM_SERVICOS, FIN = window.PM_FIN;
const $ = s => document.querySelector(s);
const MOBILE = matchMedia("(max-width:900px)").matches || (navigator.hardwareConcurrency || 8) <= 4;

/* ================= Paletas ================= */
const MICRO = [
  ["Brancos", [["Branco Gelo", "#f2ede6"], ["Pérola", "#ece2dc"], ["Marfim", "#efe1cb"], ["Linho", "#e6dbd2"], ["Cal", "#ddd0c6"], ["Névoa", "#d6cfcc"]]],
  ["Cinzas", [["Greige", "#c0b5ae"], ["Cimento", "#a8a4a2"], ["Pedra", "#9b9590"], ["Fumo", "#8a8581"], ["Grafite", "#74716f"], ["Antracite", "#55524e"]]],
  ["Areias", [["Areia", "#e9d3b8"], ["Trigo", "#e2bc8c"], ["Duna", "#cba274"], ["Camelo", "#c09670"], ["Taupe", "#968779"], ["Visom", "#7f6a58"]]],
  ["Terras", [["Ocre Claro", "#e8b062"], ["Ocre", "#c68b43"], ["Âmbar", "#b86f22"], ["Nogueira", "#7b5b3d"], ["Café", "#5f4a38"], ["Terracota", "#7d3d22"]]]
];
const TINTA = [
  ["Neutros", [["Branco Puro", "#f6f5f1"], ["Branco Quebrado", "#efeadf"], ["Linho", "#e6ddcf"], ["Greige", "#cfc5b6"], ["Pedra", "#b3aa9c"], ["Carvão", "#4b4a47"]]],
  ["Cor", [["Sálvia", "#b5bea4"], ["Verde Oliva", "#878863"], ["Azul Névoa", "#b7c3c9"], ["Azul Petróleo", "#3e5962"], ["Terracota", "#b9755b"], ["Rosa Antigo", "#d4b2a6"]]]
];
const FACH = [["Branco Cal", "#f3f1ea"], ["Creme", "#efe2c6"], ["Amarelo Ocre", "#e3b968"], ["Rosa Velho", "#d9a89a"], ["Azul Atlântico", "#9fb5c4"], ["Verde Água", "#a9c3b2"], ["Cinza Pérola", "#cac8c2"], ["Terra", "#c58b63"]];
const BARRA = [["Cinza Granito", "#7f7d78"], ["Ocre Escuro", "#a5763f"], ["Azul Fado", "#3f5a7a"], ["Branco", "#efede6"]];
const PAV = {
  flutuante: { n: "Flutuante carvalho", tex: "laminate_floor_02", size: 2.2, hex: "#b99470" },
  espinha: { n: "Parquet espinha", tex: "herringbone_parquet", size: 1.6, hex: "#a87c55" },
  marmore: { n: "Porcelânico mármore", tex: "marble_01", size: 2.6, hex: "#e6e2dc", brilho: 1 },
  ceramico: { n: "Cerâmico grande formato", tex: "large_grey_tiles", size: 2.4, hex: "#a9a7a3" },
  vinilico: { n: "Vinílico cinza", tex: "laminate_floor_02", size: 2.2, hex: "#a8a29a", tint: "#c4beb6" },
  micro: { n: "Microcimento", micro: 1, hex: "#a8a4a2" }
};
const TORN = { latao: ["Latão escovado", 0xb89a6a, .9, .32], preto: ["Preto mate", 0x1e1e1e, .3, .62], cromado: ["Cromado", 0xe9e9e9, 1, .07] };
const COR = {}; [...MICRO, ...TINTA].forEach(([, l]) => l.forEach(([n, h]) => COR[n] = h)); [...FACH, ...BARRA].forEach(([n, h]) => COR[n] = h);

/* ================= Luz ================= */
const LUZ_INT = {
  dia: { nome: "Luz natural", sub: "Dia · 5500 K", k: 5500, sol: 4.2, solK: 5600, solPos: [-8, 5.2, 1.4], amb: .35, env: .55, bg: 1, exp: 1.0, fix: 0 },
  tarde: { nome: "Fim de tarde", sub: "Sol baixo · 2300 K", k: 2300, sol: 3.4, solK: 2300, solPos: [-8, 2.1, 2.6], amb: .18, env: .28, bg: .45, bgTint: "#ffb27a", exp: 1.05, fix: 0 },
  quente: { nome: "LED quente", sub: "Acolhedor · 2700 K", k: 2700, sol: 0, amb: .05, env: .05, bg: .03, exp: 1.08, fix: 1, fixK: 2700 },
  neutra: { nome: "LED neutro", sub: "Equilibrado · 4000 K", k: 4000, sol: 0, amb: .05, env: .05, bg: .03, exp: 1.04, fix: 1, fixK: 4000 },
  fria: { nome: "LED frio", sub: "Trabalho · 6500 K", k: 6500, sol: 0, amb: .06, env: .06, bg: .03, exp: 1.0, fix: 1, fixK: 6500 },
  noite: { nome: "Ambiente noite", sub: "Indireta · 2200 K", k: 2200, sol: 0, amb: .02, env: .02, bg: .01, exp: 1.12, fix: .35, fixK: 2200, ind: 1.6 }
};
const LUZ_EXT = {
  manha: { nome: "Manhã", sub: "Sol suave · 4500 K", k: 4500, sol: 3.2, solK: 4600, solPos: [14, 9, 16], amb: .45, env: .9, bg: 1, exp: .95 },
  meiodia: { nome: "Meio-dia", sub: "Luz forte · 5800 K", k: 5800, sol: 4.4, solK: 5800, solPos: [6, 22, 12], amb: .5, env: 1, bg: 1, exp: .88 },
  tarde: { nome: "Pôr do sol", sub: "Luz dourada · 2500 K", k: 2500, sol: 3.2, solK: 2400, solPos: [-16, 4.5, 10], amb: .25, env: .45, bg: .55, bgTint: "#ffae73", exp: 1.0 },
  noite: { nome: "Noite", sub: "Iluminação de fachada · 3000 K", k: 3000, sol: 0, amb: .04, env: .04, bg: .025, exp: 1.15, up: 1 }
};

/* ================= Estado ================= */
const S = {
  svc: "microcimento", step: -1,
  micro: { surf: "piso", cor: { piso: "Cimento", parede: "Linho", bancada: "Cimento" }, tex: "F", ver: "matte" },
  tinta: { alvo: "paredes", cor: "Branco Quebrado", destaque: "Sálvia", usaDestaque: true, acab: "mate" },
  pav: "flutuante", fach: { cor: "Creme", barra: "Cinza Granito" }, torn: "latao",
  pladur: { sanca: true, nicho: true }, ilum: { spots: true, fita: true, pendente: true },
  luzI: "dia", luzE: "manha", inten: 1, xray: false, auto: false
};
try { const g = JSON.parse(localStorage.getItem("pm-sr2") || "null"); if (g) for (const k in g) if (k in S && typeof S[k] === typeof g[k]) S[k] = typeof g[k] === "object" ? Object.assign(S[k], g[k]) : g[k]; } catch (e) {}
S.step = -1;
const hashSvc = location.hash.replace("#", "");
if (SERV.some(s => s.id === hashSvc)) S.svc = hashSvc;
const guardar = () => { try { localStorage.setItem("pm-sr2", JSON.stringify(S)); } catch (e) {} };
const svc = () => SERV.find(s => s.id === S.svc);
const cena = () => svc().cena;
const estado = () => S.step < 0 ? FIN : Object.assign({}, FIN, svc().passos[S.step].s);

/* ================= Utilidades de cor ================= */
function kelvin(K) {
  const t = K / 100; let r, g, b;
  if (t <= 66) { r = 255; g = 99.47 * Math.log(t) - 161.12; b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04; }
  else { r = 329.7 * Math.pow(t - 60, -.1332); g = 288.12 * Math.pow(t - 60, -.0755); b = 255; }
  const c = v => Math.max(0, Math.min(255, v)) / 255;
  return new THREE.Color().setRGB(c(r), c(g), c(b), THREE.SRGBColorSpace);
}
const lin = v => v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4);
const gam = v => v <= .0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - .055;
const hexRGB = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
const lrv = h => { const [r, g, b] = hexRGB(h).map(lin); return Math.round((.2126 * r + .7152 * g + .0722 * b) * 100); };
function hsl(hex) {
  const [r, g, b] = hexRGB(hex), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = (mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60; }
  return { h, s, l };
}
function sobLuz(hex, K) {
  const c = hexRGB(hex).map(lin), ref = kelvin(5000), l = kelvin(K), w = [l.r / ref.r, l.g / ref.g, l.b / ref.b], m = Math.max(...w);
  return "#" + c.map((v, i) => Math.round(Math.max(0, Math.min(1, gam(v * ((w[i] / m) * .55 + .45)))) * 255).toString(16).padStart(2, "0")).join("");
}
const clareia = (hex, f) => "#" + hexRGB(hex).map(v => Math.round(Math.min(1, v + (1 - v) * f) * 255).toString(16).padStart(2, "0")).join("");
function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

/* ================= Renderizador ================= */
const stage = $("#stage");
const renderer = new THREE.WebGLRenderer({ antialias: !MOBILE ? false : true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio, MOBILE ? 1.5 : 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
stage.appendChild(renderer.domElement);
RectAreaLightUniformsLib.init();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, .05, 200);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .08; controls.autoRotateSpeed = .6;

let composer = null, aoPass = null;
async function montarComposer() {
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: MOBILE ? 0 : 4 });
  composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new OutputPass());
  resize();
}
async function ativarAO() {
  if (MOBILE || aoPass) return;
  {
    try {
      const { GTAOPass } = await import("three/addons/postprocessing/GTAOPass.js");
      aoPass = new GTAOPass(scene, camera, 1, 1);
      aoPass.updateGtaoMaterial({ radius: .35, distanceExponent: 1.4, thickness: 1, scale: 1, samples: 16 });
      aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
      aoPass.blendIntensity = .9;
      composer.insertPass(aoPass, 1); resize(); atualizarComposer(estado());
    } catch (e) { aoPass = null; }
  }
}

/* ================= Carregamento ================= */
const manager = new THREE.LoadingManager();   // texturas necessárias para a vista atual
manager.onProgress = (u, a, t) => { $("#loadBar").style.width = Math.round(a / t * 100) + "%"; };
const fundo = new THREE.LoadingManager();     // modelos e céu: carregam em segundo plano
let pendentes = 0;
const TL = new THREE.TextureLoader(manager);
const GL = new GLTFLoader(fundo);
const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

const PBR = {};
function pbr(id) {
  if (PBR[id]) return PBR[id];
  const ld = (n, srgb) => { pendentes++; const t = TL.load(`assets/tex/${id}_${n}.jpg`, () => { pendentes--; verificarPronto(); }, undefined, () => { pendentes--; verificarPronto(); }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = aniso; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };
  return PBR[id] = { map: ld("diff", 1), normalMap: ld("nor"), roughnessMap: ld("rough") };
}
function pbrRep(id, size) {
  const k = id + size; if (PBR[k]) return PBR[k];
  const b = pbr(id), o = {};
  for (const n of ["map", "normalMap", "roughnessMap"]) { const t = b[n].clone(); t.repeat.set(1 / size, 1 / size); t.needsUpdate = true; o[n] = t; }
  return PBR[k] = o;
}
function canvasTex(N, draw, srgb = true, rep = 1) {
  const c = document.createElement("canvas"); c.width = c.height = N; draw(c.getContext("2d"), N);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = aniso;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.repeat.set(rep, rep); return t;
}
function ruido(x, N, amp, r) { const im = x.getImageData(0, 0, N, N), d = im.data; for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * amp; d[i] += n; d[i + 1] += n; d[i + 2] += n; } x.putImageData(im, 0, 0); }

/* ---- microcimento procedimental ---- */
const offs = (v, r, N) => [0, ...(v - r < 0 ? [N] : []), ...(v + r > N ? [-N] : [])];
function texMicro(rustico, seed) {
  const r = rng(seed);
  const draw = (x, N) => {
    x.fillStyle = "rgb(236,236,236)"; x.fillRect(0, 0, N, N);
    for (let i = 0; i < (rustico ? 95 : 75); i++) {
      const px = r() * N, py = r() * N, rad = 60 + r() * 220, v = r() > .5 ? 255 : 196, a = (rustico ? .3 : .22) * (.4 + r() * .6);
      for (const ox of offs(px, rad, N)) for (const oy of offs(py, rad, N)) { const g = x.createRadialGradient(px + ox, py + oy, 0, px + ox, py + oy, rad); g.addColorStop(0, `rgba(${v},${v},${v},${a})`); g.addColorStop(1, `rgba(${v},${v},${v},0)`); x.fillStyle = g; x.fillRect(px + ox - rad, py + oy - rad, rad * 2, rad * 2); }
    }
    x.lineCap = "round";
    for (let i = 0; i < (rustico ? 260 : 160); i++) {
      const cx = r() * N, cy = r() * N, rad = 60 + r() * 220, a0 = r() * 6.28, len = .35 + r() * .9, v = r() > .45 ? 255 : 188;
      x.strokeStyle = `rgba(${v},${v},${v},${(rustico ? .09 : .05) * (.5 + r())})`; x.lineWidth = 8 + r() * (rustico ? 46 : 30);
      for (const ox of offs(cx, rad + 30, N)) for (const oy of offs(cy, rad + 30, N)) { x.beginPath(); x.arc(cx + ox, cy + oy, rad, a0, a0 + len); x.stroke(); }
    }
    ruido(x, N, rustico ? 22 : 9, r);
    if (rustico) { const im = x.getImageData(0, 0, N, N), d = im.data; for (let k = 0; k < 9000; k++) { const p = (Math.floor(r() * N) * N + Math.floor(r() * N)) * 4, v = 150 + r() * 50; d[p] = d[p + 1] = d[p + 2] = v; } x.putImageData(im, 0, 0); }
  };
  const map = canvasTex(1024, draw, true, 1 / 1.8); const bump = map.clone(); bump.colorSpace = THREE.NoColorSpace; bump.needsUpdate = true;
  return { map, bump };
}
/* ---- outros procedimentais ---- */
function texPladur(juntas) {
  const r = rng(77);
  return canvasTex(1024, (x, N) => {
    x.fillStyle = juntas ? "#d9dcd6" : "#cfd4cd"; x.fillRect(0, 0, N, N); ruido(x, N, 10, r);
    const px = N / 2.4; // px por metro
    const costuras = [0, 1.2 * px];
    if (juntas) {
      x.fillStyle = "rgba(246,245,240,.95)";
      costuras.forEach(c => { x.fillRect(c - 22, 0, 44, N); }); x.fillRect(0, -22, N, 44); x.fillRect(0, N - 22, N, 44);
      x.fillStyle = "rgba(246,245,240,.6)"; costuras.forEach(c => { x.fillRect(c - 40, 0, 80, N); });
    } else {
      x.strokeStyle = "rgba(90,95,90,.6)"; x.lineWidth = 3; costuras.forEach(c => { x.beginPath(); x.moveTo(c, 0); x.lineTo(c, N); x.stroke(); }); x.beginPath(); x.moveTo(0, 1); x.lineTo(N, 1); x.stroke();
    }
    for (let sx = 0; sx < 2.4; sx += .4) for (let sy = .1; sy < 2.4; sy += .3) {
      x.fillStyle = juntas ? "#f6f5f0" : "#5a5e58"; x.beginPath(); x.arc(sx * px + 2, sy * px, juntas ? 7 : 3, 0, 6.3); x.fill();
    }
  }, true, 1 / 2.4);
}
function texParedeVelha(rep) {
  const r = rng(4242);
  return canvasTex(1024, (x, N) => {
    x.fillStyle = "#e2d6bf"; x.fillRect(0, 0, N, N); ruido(x, N, 12, r);
    for (let i = 0; i < 40; i++) { const g = x.createRadialGradient(r() * N, r() * N, 0, r() * N, r() * N, 40 + r() * 160); g.addColorStop(0, "rgba(120,100,70,.10)"); g.addColorStop(1, "rgba(120,100,70,0)"); x.fillStyle = g; x.fillRect(0, 0, N, N); }
    x.strokeStyle = "rgba(70,60,50,.55)"; x.lineWidth = 1.6; const r2 = rng(99);
    const fissuras = [];
    for (let i = 0; i < 7; i++) { let px = r2() * N, py = r2() * N; const pts = [[px, py]]; for (let k = 0; k < 14; k++) { px += (r2() - .5) * 40; py += 10 + r2() * 22; pts.push([px, py]); } fissuras.push(pts); }
    const buracos = []; for (let i = 0; i < 26; i++) buracos.push([r2() * N, r2() * N, 2 + r2() * 5]);
    if (rep) { x.fillStyle = "rgba(250,249,245,.95)"; fissuras.forEach(p => { x.lineWidth = 26; x.strokeStyle = "rgba(250,249,245,.9)"; x.beginPath(); p.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); }); buracos.forEach(([a, b, s]) => { x.beginPath(); x.arc(a, b, s * 5, 0, 6.3); x.fill(); }); }
    else { fissuras.forEach(p => { x.beginPath(); p.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); }); x.fillStyle = "rgba(60,50,40,.7)"; buracos.forEach(([a, b, s]) => { x.beginPath(); x.arc(a, b, s, 0, 6.3); x.fill(); }); }
  }, true, 1 / 2);
}
const TXF = {
  mF: () => texMicro(false, 1234),
  mR: () => texMicro(true, 98765),
  placas: () => texPladur(false),
  juntas: () => texPladur(true),
  velha: () => texParedeVelha(false),
  reparada: () => texParedeVelha(true),
  rolo: () => canvasTex(512, (x, N) => { x.fillStyle = "#808080"; x.fillRect(0, 0, N, N); ruido(x, N, 40, rng(5)); }, false, 1 / .6),
  demao: () => canvasTex(1024, (x, N) => { const r = rng(11); x.fillStyle = "#fff"; x.fillRect(0, 0, N, N); for (let i = 0; i < 120; i++) { const w = 60 + r() * 80, xx = r() * N; x.fillStyle = `rgba(${r() > .5 ? "255,255,255" : "205,205,205"},${.25 + r() * .35})`; x.fillRect(xx, r() * N * .2, w, N * (.6 + r() * .6)); } }, true, 1 / 2),
  kraft: () => canvasTex(512, (x, N) => { x.fillStyle = "#c4a479"; x.fillRect(0, 0, N, N); ruido(x, N, 26, rng(8)); x.strokeStyle = "rgba(90,70,40,.25)"; for (let i = 0; i < 30; i++) { x.beginPath(); x.moveTo(Math.random() * N, 0); x.lineTo(Math.random() * N, N); x.stroke(); } }, true, 1 / 1.2),
  malha: () => canvasTex(256, (x, N) => { x.fillStyle = "#000"; x.fillRect(0, 0, N, N); x.fillStyle = "#9a9a9a"; for (let i = 0; i < N; i += 32) { x.fillRect(i, 0, 2, N); x.fillRect(0, i, N, 2); } }, false, 1 / .3),
  cola: () => canvasTex(512, (x, N) => { x.fillStyle = "#a9a6a0"; x.fillRect(0, 0, N, N); for (let i = 0; i < N; i += 14) { x.fillStyle = "rgba(60,58,55,.35)"; x.fillRect(0, i, N, 5); } ruido(x, N, 16, rng(3)); }, true, 1 / .5),
  manta: () => canvasTex(256, (x, N) => { x.fillStyle = "#9fb4c2"; x.fillRect(0, 0, N, N); ruido(x, N, 30, rng(9)); }, true, 1 / .5),
  la: () => canvasTex(256, (x, N) => { x.fillStyle = "#d6bf7e"; x.fillRect(0, 0, N, N); ruido(x, N, 60, rng(21)); }, true, 1 / .4),
  arte: () => canvasTex(512, (x, N) => { const g = x.createLinearGradient(0, 0, N, N); g.addColorStop(0, "#c9b28c"); g.addColorStop(1, "#6f5b45"); x.fillStyle = g; x.fillRect(0, 0, N, N); x.fillStyle = "rgba(240,232,220,.85)"; x.beginPath(); x.arc(N * .62, N * .42, N * .2, 0, 6.3); x.fill(); x.fillStyle = "rgba(30,28,26,.8)"; x.fillRect(N * .18, N * .6, N * .5, N * .06); }, true, 1)
};
const TXC = {};
const TX = new Proxy({}, { get: (_, k) => TXC[k] || (TXC[k] = TXF[k]()) });

/* ================= Materiais ================= */
const CACHE = {};
const mat = (k, f) => CACHE[k] || (CACHE[k] = f());
const std = (o) => new THREE.MeshStandardMaterial(o);
const M = {
  branco: new THREE.MeshPhysicalMaterial({ color: 0xf7f6f3, roughness: .16, clearcoat: .8, clearcoatRoughness: .08 }),
  metal: std({ color: 0xb89a6a, metalness: .9, roughness: .32 }),
  espelho: std({ color: 0xffffff, metalness: 1, roughness: .02 }),
  vidro: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .03, transparent: true, opacity: .12, envMapIntensity: 2 }),
  vidroJ: new THREE.MeshPhysicalMaterial({ color: 0x1d2a33, roughness: .04, metalness: .2, transparent: true, opacity: .35 }),
  caixilho: std({ color: 0x2a2a2a, roughness: .45, metalness: .5 }),
  caixBranco: std({ color: 0xf2f0ea, roughness: .5 }),
  galv: std({ color: 0xb9bdc0, metalness: .85, roughness: .38 }),
  toalha: std({ color: 0xe8e1d6, roughness: 1 }),
  tapete: std({ color: 0xcdbfa9, roughness: 1 }),
  laje: null, preto: std({ color: 0x151515, roughness: .9 }),
  emis: std({ color: 0x000000, emissive: 0xffffff, emissiveIntensity: 0 }),
  emisFita: std({ color: 0x000000, emissive: 0xffffff, emissiveIntensity: 0 }),
  emisNicho: std({ color: 0x000000, emissive: 0xffffff, emissiveIntensity: 0 }),
  azul: std({ color: 0x2f6fd1, roughness: .45, emissive: 0x2f6fd1, emissiveIntensity: 0 }),
  vermelho: std({ color: 0xc8352b, roughness: .45, emissive: 0xc8352b, emissiveIntensity: 0 }),
  branco2: std({ color: 0xe9e9e6, roughness: .45, emissive: 0xe9e9e6, emissiveIntensity: 0 }),
  pvc: std({ color: 0x8e9195, roughness: .5, emissive: 0x8e9195, emissiveIntensity: 0 }),
  conduta: std({ color: 0xc4c7cb, roughness: .6, emissive: 0xff9b3d, emissiveIntensity: 0 }),
  caixa: std({ color: 0x2c2c2c, roughness: .8 }),
  placa: std({ color: 0xf4f4f2, roughness: .35 }),
  roco: std({ color: 0x3b3835, roughness: 1 }),
  fita: std({ color: 0x3f6fd8, roughness: .6 }),
  rodape: std({ color: 0xf3f1ec, roughness: .5 }),
  madeira: std({ color: 0x6b4c34, roughness: .6 }),
  xray: std({ color: 0xdfe8ee, roughness: .3, transparent: true, opacity: .14, depthWrite: false }),
  relva: std({ color: 0x5f7140, roughness: 1 }),
  rede: std({ color: 0x2e6b3a, roughness: 1, transparent: true, opacity: .62, side: THREE.DoubleSide }),
  pedra: std({ color: 0xd8d3ca, roughness: .7 }),
  porta: std({ color: 0x4a3526, roughness: .55 }),
  tmp: std({ color: 0xd8d4cc, roughness: .9 })
};
const pbrMat = (id, size, extra = {}) => mat("pbr" + id + size + JSON.stringify(extra), () => {
  const t = pbrRep(id, size), Cls = extra.clearcoat ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  const m = new Cls(Object.assign({ map: t.map, normalMap: t.normalMap, roughnessMap: t.roughnessMap }, extra));
  if (extra.color) m.color.set(extra.color); return m;
});
function matMicro(hex, fase, ver) {
  return mat(`mi${hex}${fase}${ver}${S.micro.tex}`, () => {
    const rust = fase === 2 || (fase === 9 && S.micro.tex === "R"), t = rust ? TX.mR : TX.mF;
    const m = new THREE.MeshPhysicalMaterial({ map: t.map, bumpMap: t.bump, bumpScale: rust ? 2.4 : .9 });
    const seco = fase === 2 ? .1 : fase === 3 ? .06 : 0;
    m.color.set(clareia(hex, seco));
    if (fase !== 9) { m.roughness = .95; }
    else if (ver === "matte") { m.roughness = .82; }
    else { m.roughness = .45; m.clearcoat = .6; m.clearcoatRoughness = .28; }
    return m;
  });
}
function matTinta(hex, acab, fase) {
  return mat(`ti${hex}${acab}${fase || ""}`, () => {
    const m = std({ color: fase === "demao" ? clareia(hex, .35) : hex, roughness: acab === "acet" ? .55 : .92, bumpMap: TX.rolo, bumpScale: .25 });
    if (fase === "demao") m.map = TX.demao; return m;
  });
}
function matPav(tipo, metade) {
  const p = PAV[tipo];
  if (p.micro) return matMicro(COR[S.micro.cor.piso], 9, S.micro.ver);
  return pbrMat(p.tex, p.size, Object.assign({ roughness: p.brilho ? .35 : 1 }, p.tint ? { color: p.tint } : {}, p.brilho ? { clearcoat: .7, clearcoatRoughness: .12 } : {}));
}

/* ================= Geometria base ================= */
function uvMetros(geo) {
  const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i)); let u, v;
    if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); } else if (ax >= az) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true; return geo;
}
function caixa(w, h, d, m, x, y, z, grp, sombra = true) {
  const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); uvMetros(g);
  const me = new THREE.Mesh(g, m || M.tmp); me.castShadow = sombra; me.receiveShadow = true; if (grp) grp.add(me); return me;
}
function cil(r, h, m, x, y, z, grp, seg = 24) { const me = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), m); me.position.set(x, y, z); me.castShadow = me.receiveShadow = true; grp && grp.add(me); return me; }
function tubo(pts, r, m, grp) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = new THREE.Vector3(...pts[i]), b = new THREE.Vector3(...pts[i + 1]), len = a.distanceTo(b);
    const me = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), m);
    me.position.copy(a).add(b).multiplyScalar(.5); me.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    me.castShadow = true; grp.add(me);
    if (i > 0) { const s = new THREE.Mesh(new THREE.SphereGeometry(r * 1.15, 12, 8), m); s.position.copy(a); grp.add(s); }
  }
}

/* dimensões */
const W = 4.6, D = 4.0, H = 2.7, hw = W / 2, hd = D / 2, FC = 2.55;
const JZ0 = -.5, JZ1 = 1.0, JY0 = .9, JY1 = 2.3;

const G = {}; // grupos
const mk = (n, parent = scene) => { const g = new THREE.Group(); g.name = n; parent.add(g); return (G[n] = g); };
mk("interior"); mk("exterior");
["casco", "wc", "sala", "comum", "canal", "eletr", "roco", "obra", "prot", "entulho", "velho", "teto", "perfis", "isol", "feature", "malha", "rodape", "placas"].forEach(n => mk(n, G.interior));

const SUP = { piso: [], paredes: [], parFundo: [], bancada: [], tetoFalso: [], laje: [] };
function construirCasco() {
  const c = G.casco;
  const fL = caixa(hw + .12, .1, D + .12, null, -hw / 2 - .06, -.05, .06, c, false); fL.userData.sup = "piso"; fL.userData.metade = "L";
  const fR = caixa(hw + .12, .1, D + .12, null, hw / 2 + .06, -.05, .06, c, false); fR.userData.sup = "piso"; fR.userData.metade = "R";
  SUP.piso.push(fL, fR);
  const fundo = caixa(W + .24, H, .12, null, 0, H / 2, -hd - .06, c); SUP.paredes.push(fundo); SUP.parFundo.push(fundo);
  const lx = -hw - .06;
  [[.12, H, JZ0 + hd + .12, lx, H / 2, (-hd - .12 + JZ0) / 2], [.12, H, hd - JZ1, lx, H / 2, (JZ1 + hd) / 2], [.12, JY0, JZ1 - JZ0, lx, JY0 / 2, (JZ0 + JZ1) / 2], [.12, H - JY1, JZ1 - JZ0, lx, (H + JY1) / 2, (JZ0 + JZ1) / 2]]
    .forEach(a => SUP.paredes.push(caixa(...a.slice(0, 3), null, ...a.slice(3), c)));
  SUP.paredes.push(caixa(.12, H, D + .12, null, hw + .06, H / 2, -.06, c));
  // laje (teto estrutural)
  M.laje = std({ color: 0xcfccc6, roughness: .95 });
  SUP.laje.push(caixa(W + .3, .14, D + .3, M.laje, 0, H + .07, 0, c));
  // janela
  const jcz = (JZ0 + JZ1) / 2, jcy = (JY0 + JY1) / 2;
  [[.07, .05, JZ1 - JZ0, lx + .02, JY0 + .025, jcz], [.07, .05, JZ1 - JZ0, lx + .02, JY1 - .025, jcz], [.07, JY1 - JY0, .05, lx + .02, jcy, JZ0 + .025], [.07, JY1 - JY0, .05, lx + .02, jcy, JZ1 - .025], [.06, JY1 - JY0, .04, lx + .02, jcy, jcz]]
    .forEach(a => caixa(...a.slice(0, 3), M.caixilho, ...a.slice(3), c, false));
  caixa(.14, .03, JZ1 - JZ0 + .1, M.pedra, lx + .09, JY0 - .015, jcz, c);
  const vj = new THREE.Mesh(new THREE.PlaneGeometry(JZ1 - JZ0, JY1 - JY0), M.vidro); vj.rotation.y = Math.PI / 2; vj.position.set(lx + .01, jcy, jcz); c.add(vj);
}

/* teto falso, sanca e focos */
const SPOTS = [[-1.1, -1.0], [1.1, -1.0], [-1.1, .9], [1.1, .9]];
let tetoFalso, sancaLip, aros = [];
function construirTeto() {
  const t = G.teto;
  tetoFalso = new THREE.Mesh(new THREE.BoxGeometry(1, .025, 1), M.tmp); tetoFalso.receiveShadow = true; tetoFalso.castShadow = true; t.add(tetoFalso);
  sancaLip = caixa(W, .12, .02, null, 0, FC - .05, -hd + .16, t);
  SPOTS.forEach(([x, z]) => { const a = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .01, 24), M.emis); a.position.set(x, FC - .014, z); t.add(a); aros.push(a); });
  // perfis
  const p = G.perfis;
  for (let z = -hd + .25; z < hd; z += .5) caixa(W - .05, .027, .047, M.galv, 0, FC + .03, z, p, false);
  for (let x = -hw + .3; x < hw; x += 1.0) caixa(.04, .02, D - .1, M.galv, x, FC + .058, 0, p, false);
  for (let x = -hw + .3; x < hw; x += 1.0) for (let z = -hd + .25; z < hd; z += 1.0) caixa(.006, H - FC - .06, .006, M.galv, x, (H + FC) / 2 + .03, z, p, false);
  caixa(W, .03, .03, M.galv, 0, FC + .015, -hd + .015, p, false);
  // isolamento
  const la = std({ map: TX.la, roughness: 1 });
  caixa(W - .1, .05, D - .1, la, 0, FC + .095, 0, G.isol, false).material = la;
}
function atualizarTeto(st) {
  const sanca = S.pladur.sanca && cena() !== "fachada";
  const z0 = sanca ? -hd + .16 : -hd;
  tetoFalso.geometry.dispose(); tetoFalso.geometry = uvMetros(new THREE.BoxGeometry(W, .025, hd - z0).translate(0, FC, (hd + z0) / 2));
  sancaLip.visible = sanca;
  const tf = st.teto;
  G.teto.visible = tf !== "laje";
  G.perfis.visible = tf === "perfis";
  G.isol.visible = tf === "perfis" && !!st.isol;
  tetoFalso.visible = sancaLip.visible = tf !== "perfis" && tf !== "laje";
  if (!sanca) sancaLip.visible = false;
  const m = tf === "placas" ? mat("placas", () => std({ map: TX.placas, roughness: .9 })) : tf === "juntas" ? mat("juntas", () => std({ map: TX.juntas, roughness: .9 })) : mat("tetoBranco", () => std({ color: 0xf6f5f1, roughness: .95, bumpMap: TX.rolo, bumpScale: .15 }));
  tetoFalso.material = sancaLip.material = m;
  aros.forEach(a => a.visible = tf === "fin" && S.ilum.spots);
}

/* parede de pladur com nicho (sala, parede direita) */
const FEAT = { z0: -1.75, z1: .75, esp: .18, ny0: 1.0, ny1: 1.45, nz0: -1.2, nz1: .2 };
let featMeshes = [], featPerfis, featNichoLuz;
function construirFeature() {
  const f = G.feature, F = FEAT, x = hw - F.esp / 2, top = FC;
  featMeshes = [];
  const add = (w, h, d, x_, y, z) => { const m = caixa(w, h, d, null, x_, y, z, f); featMeshes.push(m); return m; };
  add(F.esp, F.ny0, F.z1 - F.z0, x, F.ny0 / 2, (F.z0 + F.z1) / 2);
  add(F.esp, top - F.ny1, F.z1 - F.z0, x, (top + F.ny1) / 2, (F.z0 + F.z1) / 2);
  add(F.esp, F.ny1 - F.ny0, F.nz0 - F.z0, x, (F.ny0 + F.ny1) / 2, (F.z0 + F.nz0) / 2);
  add(F.esp, F.ny1 - F.ny0, F.z1 - F.nz1, x, (F.ny0 + F.ny1) / 2, (F.nz1 + F.z1) / 2);
  G.featTampa = caixa(F.esp, F.ny1 - F.ny0, F.nz1 - F.nz0, null, x, (F.ny0 + F.ny1) / 2, (F.nz0 + F.nz1) / 2, f); featMeshes.push(G.featTampa);
  const fl = new THREE.Mesh(new THREE.BoxGeometry(.012, .01, F.nz1 - F.nz0 - .04), M.emisNicho); fl.position.set(hw - F.esp + .03, F.ny1 - .012, (F.nz0 + F.nz1) / 2); f.add(fl); G.featFita = fl;
  // perfis verticais
  featPerfis = new THREE.Group(); f.add(featPerfis);
  for (let z = F.z0 + .02; z <= F.z1; z += .4) caixa(.05, top, .035, M.galv, hw - .1, top / 2, z, featPerfis, false);
  caixa(.05, .03, F.z1 - F.z0, M.galv, hw - .1, .015, (F.z0 + F.z1) / 2, featPerfis, false);
  caixa(.05, .03, F.z1 - F.z0, M.galv, hw - .1, top - .015, (F.z0 + F.z1) / 2, featPerfis, false);
  [F.ny0, F.ny1].forEach(y => caixa(.05, .03, F.nz1 - F.nz0, M.galv, hw - .1, y, (F.nz0 + F.nz1) / 2, featPerfis, false));
  // objetos no nicho
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(.06, .045, .24, 28), std({ color: 0x2b2a28, roughness: .4 })); vaso.position.set(hw - F.esp - .02 + .1, F.ny0 + .12, -.75); vaso.castShadow = true; f.add(vaso);
  const livro = caixa(.2, .05, .28, std({ color: 0xb8a68a, roughness: .9 }), hw - .12, F.ny0 + .025, -.3, f); livro.userData.deco = 1; vaso.userData.deco = 1;
  G.featDeco = [vaso, livro];
}
function atualizarFeature(st) {
  const on = cena() === "sala"; G.feature.visible = on && st.feature !== "off";
  if (!on) return;
  const f = st.feature, est = f === "perfis";
  featPerfis.visible = est;
  featMeshes.forEach(m => m.visible = !est);
  G.featTampa.visible = !est && !S.pladur.nicho;
  G.featFita.visible = !est && S.pladur.nicho && f === "fin";
  G.featDeco.forEach(m => m.visible = f === "fin" && S.pladur.nicho && st.moveis);
  const m = f === "placas" ? CACHE.placas || mat("placas", () => std({ map: TX.placas, roughness: .9 })) : f === "juntas" ? mat("juntas", () => std({ map: TX.juntas, roughness: .9 })) : matTinta(COR[S.tinta.cor], S.tinta.acab);
  featMeshes.forEach(x => x.material = st.xray ? M.xray : m);
}

/* casa de banho */
let bancadas = [];
function construirWC() {
  const g = G.wc;
  bancadas = [caixa(1.7, .12, .52, null, -.7, .86, -hd + .26, g), caixa(1.6, .3, .48, null, -.7, .65, -hd + .25, g)];
  const pts = []; for (let i = 0; i <= 14; i++) { const a = i / 14; pts.push(new THREE.Vector2(.02 + Math.sin(a * Math.PI / 2) * .2, a * .14)); }
  pts.push(new THREE.Vector2(.205, .14), new THREE.Vector2(.19, .14)); for (let i = 14; i >= 0; i--) { const a = i / 14; pts.push(new THREE.Vector2(.01 + Math.sin(a * Math.PI / 2) * .185, .015 + a * .125)); }
  const lav = new THREE.Mesh(new THREE.LatheGeometry(pts, 56), M.branco); lav.position.set(-.7, .92, -hd + .28); lav.castShadow = lav.receiveShadow = true; g.add(lav);
  const tor = cil(.012, .2, M.metal, -.7, 1.2, -hd + .1, g, 16); tor.rotation.x = Math.PI / 2; const tr = cil(.03, .02, M.metal, -.7, 1.2, -hd + .01, g); tr.rotation.x = Math.PI / 2;
  const esp = new THREE.Mesh(new THREE.CircleGeometry(.38, 64), M.espelho); esp.position.set(-.7, 1.72, -hd + .03); g.add(esp);
  const mol = new THREE.Mesh(new THREE.TorusGeometry(.385, .012, 12, 80), M.metal); mol.position.copy(esp.position); g.add(mol);
  const halo = new THREE.Mesh(new THREE.RingGeometry(.38, .43, 64), M.emisFita); halo.position.set(-.7, 1.72, -hd + .005); g.add(halo);
  caixa(1.35, .03, 1.15, null, 1.62, .015, -hd + .575, g, false).userData.sup = "pisoDuche";
  const vid = new THREE.Mesh(new THREE.BoxGeometry(.012, 2.0, 1.0), M.vidro); vid.position.set(.95, 1.03, -hd + .55); g.add(vid);
  caixa(.02, 2.0, .02, M.metal, .95, 1.03, -hd + 1.05, g); caixa(.02, .02, 1.05, M.metal, .95, 2.03, -hd + .53, g);
  const ch = cil(.15, .012, M.metal, 1.62, 2.25, -hd + .5, g, 40); const br = cil(.01, .5, M.metal, 1.62, 2.25, -hd + .25, g, 12); br.rotation.x = Math.PI / 2;
  const mix = cil(.035, .03, M.metal, 1.62, 1.1, -hd + .015, g); mix.rotation.x = Math.PI / 2;
  caixa(.6, .3, .06, std({ color: 0x3a3734, roughness: .8 }), 1.62, 1.3, -hd + .005, g, false);
  cil(.04, .18, M.branco, 1.48, 1.24, -hd + .05, g); cil(.035, .14, std({ color: 0x232323, roughness: .5 }), 1.6, 1.22, -hd + .05, g);
  const san = new THREE.Mesh(new RoundedBoxGeometry(.38, .3, .55, 6, .12), M.branco); san.position.set(.45, .42, -hd + .3); san.castShadow = true; g.add(san);
  const pl = caixa(.18, .12, .01, M.metal, .45, 1.05, -hd + .005, g);
  const banco = caixa(.9, .42, .38, null, -1.75, .21, 1.35, g); bancadas.push(banco);
  const t1 = new THREE.Mesh(new RoundedBoxGeometry(.36, .1, .3, 4, .04), M.toalha); t1.position.set(-1.9, .47, 1.35); t1.castShadow = true; g.add(t1);
  const t2 = t1.clone(); t2.position.y = .56; t2.scale.set(.92, 1, .92); g.add(t2);
  // velho
  const v = G.velho, louca = std({ color: 0xf1efe8, roughness: .3 });
  const banh = new THREE.Mesh(new RoundedBoxGeometry(1.4, .55, .75, 4, .05), louca); banh.position.set(1.6, .275, -hd + .38); banh.castShadow = true; v.add(banh);
  cil(.09, .7, louca, -.7, .35, -hd + .25, v); const lv = new THREE.Mesh(new RoundedBoxGeometry(.55, .16, .42, 4, .06), louca); lv.position.set(-.7, .78, -hd + .24); v.add(lv);
  const s1 = new THREE.Mesh(new RoundedBoxGeometry(.38, .4, .5, 4, .1), louca); s1.position.set(.45, .2, -hd + .35); v.add(s1); caixa(.4, .35, .18, louca, .45, .62, -hd + .1, v);
}

/* sala: modelos */
const MOD = {};
function carregarModelo(id, cb) {
  GL.load(`assets/models/${id}/${id}_1k.gltf`, g => {
    g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    MOD[id] = g.scene; cb && cb(g.scene);
  }, undefined, () => {});
}
function pousar(obj, x, z, rotY = 0, y0 = 0) {
  obj.rotation.y = rotY; obj.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(obj), c = b.getCenter(new THREE.Vector3());
  obj.position.x += x - c.x; obj.position.z += z - c.z; obj.position.y += y0 - b.min.y;
  return new THREE.Box3().setFromObject(obj);
}
let pendenteLuz;
function construirSala() {
  const g = G.sala;
  const tap = new THREE.Mesh(new THREE.BoxGeometry(2.6, .012, 1.9), M.tapete); tap.position.set(.1, .006, -.55); tap.receiveShadow = true; g.add(tap);
  const q = caixa(1.1, .78, .03, std({ map: TX.arte, roughness: .8 }), .1, 1.72, -hd + .02, g, false);
  caixa(1.14, .82, .025, M.preto, .1, 1.72, -hd + .006, g, false);
  carregarModelo("sofa_02", o => { g.add(o); pousar(o, .1, -1.5, 0); });
  carregarModelo("modern_coffee_table_01", o => { g.add(o); const b = pousar(o, .1, -.45, 0); carregarModelo("ceramic_vase_01", v => { g.add(v); pousar(v, .3, -.4, 0, b.max.y); }); });
  carregarModelo("modern_arm_chair_01", o => { g.add(o); pousar(o, -1.55, .2, Math.PI / 2); });
  carregarModelo("side_table_01", o => { g.add(o); pousar(o, 1.55, -1.6, 0); });
  carregarModelo("modern_ceiling_lamp_01", o => { g.add(o); o.userData.pend = 1; const b = pousar(o, .1, -.45, 0, 0); o.position.y += FC - b.max.y; G.pendente = o; });
  pendenteLuz = new THREE.PointLight(0xffc887, 0, 5, 2); pendenteLuz.position.set(.1, FC - .55, -.45); g.add(pendenteLuz);
}
function construirComum() {
  carregarModelo("potted_plant_04", o => { G.comum.add(o); o.scale.setScalar(2.3); pousar(o, -1.9, -1.45, .6); });
}

/* obra, proteções, entulho */
function construirObra() {
  const o = G.obra;
  carregarModelo("ladder_sectioned_01", m => { o.add(m); pousar(m, 1.35, 1.25, -.5); });
  carregarModelo("cement_bag", m => { o.add(m); const b = pousar(m, -1.3, 1.45, .3); carregarModelo("trowel_01", t => { o.add(t); pousar(t, -1.25, 1.45, 1, b.max.y); }); });
  const balde = std({ color: 0xefefec, roughness: .5 });
  [[.55, 1.55], [.85, 1.6]].forEach(([x, z]) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(.15, .13, .32, 28, 1, true), balde); b.position.set(x, .16, z); b.castShadow = true; o.add(b); cil(.13, .01, std({ color: 0x9a9690, roughness: .9 }), x, .01, z, o); });
  // rolo e tabuleiro
  caixa(.35, .04, .28, std({ color: 0x3b6fb5, roughness: .6 }), -.2, .02, 1.6, o);
  const rolo = cil(.035, .22, std({ color: 0xf2f2f0, roughness: 1 }), -.2, .08, 1.55, o); rolo.rotation.z = Math.PI / 2;
  // pilha de placas
  for (let i = 0; i < 6; i++) caixa(1.2, .0125, .6, std({ color: 0xcfd4cd, roughness: .9 }), 1.5, .007 + i * .013, .25, o);
  // proteção
  const kr = std({ map: TX.kraft, roughness: 1 });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(W - .05, D), kr); p.rotation.x = -Math.PI / 2; p.position.set(0, .004, 0); p.receiveShadow = true; G.prot.add(p);
  [[W, .03, .005, 0, .1, -hd + .004], [.005, .03, D, -hw + .004, .1, 0], [.005, .03, D, hw - .004, .1, 0], [W, .03, .005, 0, FC - .02, -hd + .004]].forEach(a => caixa(...a.slice(0, 3), M.fita, ...a.slice(3), G.prot, false));
  // entulho
  const r = rng(31), cores = [0xa9552f, 0x9d9a94, 0xb8b2a6, 0x8d4a2b, 0xd9d3c4];
  for (let i = 0; i < 70; i++) { const s = .05 + r() * .16, m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), std({ color: cores[i % 5], roughness: 1 })); const a = r() * 6.28, rr = r() * .7; m.position.set(-1.4 + Math.cos(a) * rr, s * .6 * (1 - rr), 1.2 + Math.sin(a) * rr * .8); m.rotation.set(r() * 3, r() * 3, r() * 3); m.castShadow = true; G.entulho.add(m); }
}

/* instalações */
const ROUTES = { wc: [], sala: [] };
function construirInstalacoes() {
  const Z = -hd - .035;  // dentro da parede de fundo
  const canal = new THREE.Group(), canalPiso = new THREE.Group(); canal.userData.n = new THREE.Vector3(0, 0, 1); canalPiso.userData.n = new THREE.Vector3(0, 1, 0);
  G.canal.add(canal, canalPiso);
  const q = [-2.2, .3], fria = (x) => x + .04, quente = (x) => x - .04;
  tubo([[-2.2, .32, Z], [1.66, .32, Z]], .011, M.azul, canal); tubo([[-2.2, .24, Z], [1.58, .24, Z]], .011, M.vermelho, canal);
  [[-.7, 1.17], [1.62, 1.08]].forEach(([x, y]) => { tubo([[fria(x), .32, Z], [fria(x), y, Z]], .011, M.azul, canal); tubo([[quente(x), .24, Z], [quente(x), y, Z]], .011, M.vermelho, canal); });
  tubo([[.45, .32, Z], [.45, .95, Z]], .011, M.azul, canal);
  tubo([[1.62, 1.12, Z], [1.62, 2.22, Z]], .011, M.branco2, canal);
  // esgotos
  const Y = -.05;
  tubo([[1.62, Y, -1.4], [1.62, Y, -1.82], [-1.9, Y, -1.82]], .028, M.pvc, canalPiso);
  tubo([[-.62, .56, Z], [-.62, Y, Z], [-.62, Y, -1.82]], .022, M.pvc, canal);
  tubo([[.45, .22, Z], [.45, Y, Z], [.45, Y, -1.82]], .05, M.pvc, canal);
  ROUTES.wc.push(...[[-2.2, .28, 1.66, .28, "h"], [-.7, .28, -.7, 1.17, "v"], [1.62, .28, 1.62, 2.22, "v"], [.45, .28, .45, .95, "v"], [-.62, 0, -.62, .56, "v"], [.45, 0, .45, .22, "v"]]);
  // eletricidade
  const el = new THREE.Group(), elT = new THREE.Group(), elL = new THREE.Group(), elR = new THREE.Group();
  el.userData.n = new THREE.Vector3(0, 0, 1); elT.userData.n = new THREE.Vector3(0, 0, 0); elL.userData.n = new THREE.Vector3(1, 0, 0); elR.userData.n = new THREE.Vector3(-1, 0, 0);
  G.eletr.add(el, elT, elL, elR);
  const YT = H - .05, ZT = -hd + .3;
  G.eletrWC = new THREE.Group(); G.eletrSala = new THREE.Group(); G.eletr.add(G.eletrWC, G.eletrSala);
  // tubos de teto (comuns)
  tubo([[-2.0, YT, ZT], [1.9, YT, ZT]], .01, M.conduta, elT);
  SPOTS.forEach(([x, z]) => tubo([[x, YT, ZT], [x, YT, z]], .01, M.conduta, elT));
  // wc
  const wcBack = new THREE.Group(); wcBack.userData.n = new THREE.Vector3(0, 0, 1); G.eletrWC.add(wcBack);
  tubo([[-.7, H, Z], [-.7, 2.15, Z]], .01, M.conduta, wcBack); tubo([[-1.45, H, Z], [-1.45, 1.1, Z]], .01, M.conduta, wcBack);
  const wcR = new THREE.Group(); wcR.userData.n = new THREE.Vector3(-1, 0, 0); G.eletrWC.add(wcR);
  tubo([[hw + .035, H, 1.2], [hw + .035, 1.1, 1.2]], .01, M.conduta, wcR);
  // sala
  const sBack = new THREE.Group(); sBack.userData.n = new THREE.Vector3(0, 0, 1); G.eletrSala.add(sBack);
  tubo([[-1.3, H, Z], [-1.3, .3, Z]], .01, M.conduta, sBack); tubo([[1.75, H, Z], [1.75, .3, Z]], .01, M.conduta, sBack);
  const sL = new THREE.Group(); sL.userData.n = new THREE.Vector3(1, 0, 0); G.eletrSala.add(sL);
  tubo([[-hw - .035, H, 1.6], [-hw - .035, 1.85, 1.6]], .014, M.conduta, sL); tubo([[-hw - .035, H, 1.75], [-hw - .035, 1.85, 1.75]], .014, M.conduta, sL);
  const sR = new THREE.Group(); sR.userData.n = new THREE.Vector3(-1, 0, 0); G.eletrSala.add(sR);
  tubo([[hw + .035, H, 1.3], [hw + .035, 1.1, 1.3]], .01, M.conduta, sR); tubo([[hw + .035, H, 1.0], [hw + .035, .3, 1.0]], .01, M.conduta, sR);
  tubo([[.1, YT, ZT], [.1, YT, -.45]], .01, M.conduta, elT);
  // quadro elétrico (sala, parede esquerda)
  const qd = new THREE.Group(); G.quadro = qd; G.eletrSala.add(qd);
  caixa(.06, .55, .42, std({ color: 0xeeeeea, roughness: .4 }), -hw + .03, 1.6, 1.55, qd);
  for (let i = 0; i < 2; i++) for (let k = 0; k < 7; k++) caixa(.03, .07, .035, std({ color: k === 0 ? 0x2c64c8 : 0x2a2a2a, roughness: .5 }), -hw + .07, 1.72 - i * .2, 1.4 + k * .05, qd, false);
  // caixas e espelhos (tomadas/interruptores)
  G.pontos = { wc: [[-1.45, 1.1, "b"], [hw, 1.1, "r", 1.2]], sala: [[-1.3, .3, "b"], [1.75, .3, "b"], [hw, 1.1, "r", 1.3], [hw, .3, "r", 1.0], [-hw, 1.1, "l", 1.9]] };
  G.caixas = new THREE.Group(); G.espelhos = new THREE.Group(); G.interior.add(G.caixas, G.espelhos);
  ROUTES.sala.push(...[[-1.3, .3, -1.3, H, "v"], [1.75, .3, 1.75, H, "v"]]);
  ROUTES.wcE = [[-.7, 2.15, -.7, H, "v"], [-1.45, 1.1, -1.45, H, "v"]];
}
function construirPontos() {
  G.caixas.clear(); G.espelhos.clear();
  (G.pontos[cena()] || []).forEach(([a, y, w, z]) => {
    let pos, rot = 0;
    if (w === "b") { pos = [a, y, -hd]; } else if (w === "r") { pos = [hw, y, z]; rot = -Math.PI / 2; } else { pos = [-hw, y, z]; rot = Math.PI / 2; }
    const cx = cil(.035, .02, M.caixa, pos[0], pos[1], pos[2], G.caixas, 20); cx.rotation.x = Math.PI / 2; if (rot) { cx.rotation.set(0, 0, Math.PI / 2); }
    const pl = new THREE.Mesh(new RoundedBoxGeometry(.086, .086, .012, 3, .006), M.placa); pl.position.set(...pos); pl.rotation.y = rot;
    const n = new THREE.Vector3(0, 0, .006).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot); pl.position.add(n); pl.castShadow = true; G.espelhos.add(pl);
  });
}
function construirRocos() {
  G.roco.clear();
  const lista = cena() === "wc" ? [...ROUTES.wc, ...ROUTES.wcE] : ROUTES.sala;
  lista.forEach(([x0, y0, x1, y1, o]) => { if (o === "h") caixa(Math.abs(x1 - x0) + .08, .2, .01, M.roco, (x0 + x1) / 2, y0, -hd + .005, G.roco, false); else caixa(.1, Math.abs(y1 - y0) + .04, .01, M.roco, x0, (y0 + y1) / 2, -hd + .005, G.roco, false); });
}

/* ================= Exterior ================= */
const FX = { w: 9.4, h: 6.4, z: 2.5, rec: .16 };
const JAN = [[-3, .95, 1.3, 1.4], [3, .95, 1.3, 1.4], [-3, 3.95, 1.3, 1.4], [0, 3.95, 1.3, 1.4], [3, 3.95, 1.3, 1.4]];
const PORTA = [0, 0, 1.25, 2.4];
let fachadaMeshes = [], barraMeshes = [];
function construirExterior() {
  const e = G.exterior;
  const solo = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), M.relva); solo.rotation.x = -Math.PI / 2; solo.receiveShadow = true; e.add(solo);
  const calc = new THREE.Mesh(new THREE.PlaneGeometry(14, 5.5), pbrMat("cobblestone_floor_03", 2)); calc.rotation.x = -Math.PI / 2; calc.position.set(0, .01, FX.z + 2.75); calc.receiveShadow = true;
  calc.geometry.attributes.uv.array.forEach((v, i, a) => a[i] = v * (i % 2 ? 5.5 : 14)); e.add(calc);
  // corpo da casa
  const hx = FX.w / 2;
  const corpo = caixa(FX.w, FX.h, 7, null, 0, FX.h / 2, FX.z - FX.rec - 3.5, e); fachadaMeshes.push(corpo);
  // pele frontal com vãos
  const sh = new THREE.Shape(); sh.moveTo(-hx, 0); sh.lineTo(hx, 0); sh.lineTo(hx, FX.h); sh.lineTo(-hx, FX.h); sh.lineTo(-hx, 0);
  [...JAN, PORTA].forEach(([x, y, w, h]) => { const p = new THREE.Path(); p.moveTo(x - w / 2, y); p.lineTo(x - w / 2, y + h); p.lineTo(x + w / 2, y + h); p.lineTo(x + w / 2, y); p.lineTo(x - w / 2, y); sh.holes.push(p); });
  const eg = new THREE.ExtrudeGeometry(sh, { depth: FX.rec, bevelEnabled: false }); eg.translate(0, 0, FX.z - FX.rec);
  const pele = new THREE.Mesh(eg, M.tmp); pele.castShadow = pele.receiveShadow = true; e.add(pele); fachadaMeshes.push(pele);
  // barra
  [[-hx, PORTA[0] - PORTA[2] / 2], [PORTA[0] + PORTA[2] / 2, hx]].forEach(([a, b]) => barraMeshes.push(caixa(b - a, .8, .04, null, (a + b) / 2, .4, FX.z + .02, e)));
  barraMeshes.push(caixa(.04, .8, 7, null, -hx - .02, .4, FX.z - FX.rec - 3.5 + .1, e), caixa(.04, .8, 7, null, hx + .02, .4, FX.z - FX.rec - 3.5 + .1, e));
  // cornija
  caixa(FX.w + .3, .28, .3, M.caixBranco, 0, FX.h + .1, FX.z - .05, e); caixa(.3, .28, 7.3, M.caixBranco, -hx - .1, FX.h + .1, FX.z - 3.6, e); caixa(.3, .28, 7.3, M.caixBranco, hx + .1, FX.h + .1, FX.z - 3.6, e);
  // janelas
  JAN.forEach(([x, y, w, h]) => {
    const zf = FX.z - FX.rec + .02;
    caixa(w + .12, .06, .3, M.pedra, x, y - .03, FX.z - .02, e);
    [[w, .07, .07, x, y + .035], [w, .07, .07, x, y + h - .035], [.07, h, .07, x - w / 2 + .035, y + h / 2], [.07, h, .07, x + w / 2 - .035, y + h / 2], [.05, h, .06, x, y + h / 2]].forEach(a => caixa(a[0], a[1], a[2], M.caixBranco, a[3], a[4], zf, e, false));
    const v = new THREE.Mesh(new THREE.PlaneGeometry(w - .1, h - .1), M.vidroJ); v.position.set(x, y + h / 2, zf - .01); e.add(v);
    caixa(w, .22, .1, M.caixBranco, x, y + h - .11, zf + .02, e, false);
  });
  caixa(PORTA[2] - .04, PORTA[3] - .02, .06, M.porta, PORTA[0], PORTA[3] / 2, FX.z - FX.rec + .03, e);
  cil(.012, .25, M.metal, PORTA[0] + .45, 1.05, FX.z - FX.rec + .08, e, 12);
  caixa(PORTA[2] + .3, .06, .5, M.pedra, 0, .03, FX.z + .2, e);
  // telhado de 4 águas
  const y0 = FX.h + .24, oz0 = FX.z + .45, oz1 = FX.z - 7.6, ox = hx + .45, ry = y0 + 2.1, rz = (oz0 + oz1) / 2, rx = 2.4;
  const v = [[-ox, y0, oz0], [ox, y0, oz0], [rx, ry, rz], [-rx, ry, rz], [-ox, y0, oz1], [ox, y0, oz1]];
  const faces = [[0, 1, 2], [0, 2, 3], [5, 4, 3], [5, 3, 2], [4, 0, 3], [1, 5, 2]];
  const pos = [], uv = [];
  faces.forEach(f => {
    const [a, b, c] = f.map(i => new THREE.Vector3(...v[i])); const nrm = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
    const up = new THREE.Vector3(0, 1, 0), t = up.clone().cross(nrm).normalize(), bt = nrm.clone().cross(t);
    [a, b, c].forEach(p => { pos.push(p.x, p.y, p.z); uv.push(p.dot(t), p.dot(bt)); });
  });
  const rg = new THREE.BufferGeometry(); rg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); rg.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); rg.computeVertexNormals();
  const tel = new THREE.Mesh(rg, pbrMat("clay_roof_tiles_02", 2, { side: THREE.DoubleSide })); tel.castShadow = tel.receiveShadow = true; e.add(tel);
  carregarModelo("potted_plant_04", o => { const p1 = o.clone(); e.add(o, p1); o.scale.setScalar(1.4); p1.scale.setScalar(1.4); pousar(o, -1.15, FX.z + .45, 0); pousar(p1, 1.15, FX.z + .45, 1); });
  // andaime
  const a = new THREE.Group(); G.andaime = a; e.add(a);
  const z1 = FX.z + .35, z2 = FX.z + 1.15;
  for (let x = -4.6; x <= 4.61; x += 2.3) [z1, z2].forEach(z => tubo([[x, 0, z], [x, 7.1, z]], .024, M.galv, a));
  [.15, 2.0, 4.0, 6.0, 7.0].forEach(y => [z1, z2].forEach(z => tubo([[-4.6, y, z], [4.6, y, z]], .022, M.galv, a)));
  for (let x = -4.6; x <= 4.61; x += 2.3) [2.0, 4.0, 6.0].forEach(y => tubo([[x, y, z1], [x, y, z2]], .022, M.galv, a));
  for (let x = -4.6; x < 4.6; x += 4.6) tubo([[x, .15, z2], [x + 2.3, 2.0, z2], [x + 4.6, 4.0, z2]], .02, M.galv, a);
  [2.0, 4.0, 6.0].forEach(y => { for (let x = -4.6; x < 4.6; x += 2.3) caixa(2.25, .04, .7, M.madeira, x + 1.15, y + .04, (z1 + z2) / 2, a); });
  const rede = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 7.2), M.rede); rede.position.set(0, 3.6, z2 + .05); G.rede = rede; a.add(rede);
  // iluminação de fachada (noite)
  G.up = [];
  [-4, -1.5, 1.5, 4].forEach(x => { const s = new THREE.SpotLight(0xffd29a, 0, 9, .55, .6, 1.6); s.position.set(x, .15, FX.z + .5); s.target.position.set(x, 5, FX.z); e.add(s, s.target); G.up.push(s); cil(.06, .08, M.preto, x, .04, FX.z + .5, e); });
}
function texFachada(fase) {
  return mat("fach" + fase, () => {
    const r = rng(555), px = 110, Wp = Math.round(FX.w * px), Hp = Math.round(FX.h * px);
    const c = document.createElement("canvas"); c.width = Wp; c.height = Hp; const x = c.getContext("2d");
    x.fillStyle = fase === "primario" ? "#fff" : "#f0f0f0"; x.fillRect(0, 0, Wp, Hp); ruido(x, Math.max(Wp, Hp), 0, r);
    const im = x.getImageData(0, 0, Wp, Hp), d = im.data; for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 18; d[i] += n; d[i + 1] += n; d[i + 2] += n; } x.putImageData(im, 0, 0);
    const toY = y => Hp - y * px, toX = xx => (xx + FX.w / 2) * px;
    const r2 = rng(77), fiss = [];
    for (let i = 0; i < 9; i++) { let a = r2() * Wp, b = r2() * Hp * .8 + Hp * .1; const pts = [[a, b]]; for (let k = 0; k < 18; k++) { a += (r2() - .5) * 30; b += (r2() - .3) * 22; pts.push([a, b]); } fiss.push(pts); }
    if (fase === "antigo" || fase === "lavagem") {
      const k = fase === "lavagem" ? .55 : 1;
      JAN.forEach(([jx, jy, w]) => { for (let s = 0; s < 6; s++) { const sx = toX(jx - w / 2 + r2() * w), g = x.createLinearGradient(0, toY(jy), 0, toY(jy) + 220 + r2() * 200); g.addColorStop(0, `rgba(60,55,45,${.35 * k})`); g.addColorStop(1, "rgba(60,55,45,0)"); x.fillStyle = g; x.fillRect(sx, toY(jy), 6 + r2() * 14, 420); } });
      const gm = x.createLinearGradient(0, Hp, 0, Hp - 130); gm.addColorStop(0, `rgba(55,70,40,${.55 * k})`); gm.addColorStop(1, "rgba(55,70,40,0)"); x.fillStyle = gm; x.fillRect(0, Hp - 130, Wp, 130);
      for (let i = 0; i < 400; i++) { x.fillStyle = `rgba(50,60,35,${.12 * k * r2()})`; x.beginPath(); x.arc(r2() * Wp, Hp - r2() * r2() * 200, 3 + r2() * 14, 0, 6.3); x.fill(); }
      const gt = x.createLinearGradient(0, 0, 0, 160); gt.addColorStop(0, `rgba(40,38,34,${.35 * k})`); gt.addColorStop(1, "rgba(40,38,34,0)"); x.fillStyle = gt; x.fillRect(0, 0, Wp, 160);
      if (fase === "antigo") for (let i = 0; i < 26; i++) { x.fillStyle = "rgba(255,255,255,.35)"; const w = 20 + r2() * 70; x.fillRect(r2() * Wp, r2() * Hp, w, w * (.4 + r2())); }
      x.strokeStyle = `rgba(45,40,35,${.75 * k})`; x.lineWidth = 2; fiss.forEach(p => { x.beginPath(); p.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); });
    }
    if (fase === "reparacao") { x.strokeStyle = "rgba(175,172,165,.95)"; x.lineWidth = 26; x.lineJoin = "round"; fiss.forEach(p => { x.beginPath(); p.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); }); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1 / FX.w, 1 / FX.h); t.offset.set(.5, 0);
    return t;
  });
}
function atualizarFachada(st) {
  const f = st.fach, base = { antigo: "#d8cbb0", lavagem: "#b9ae97", reparacao: "#d8cbb0", primario: "#f3f2ee" }[f] || COR[S.fach.cor];
  const tex = f === "fin" ? texFachada("fin") : texFachada(f);
  const m = mat("fm" + f + base, () => std({ map: tex, color: base, roughness: f === "lavagem" ? .38 : .95, bumpMap: TX.rolo, bumpScale: .5 }));
  fachadaMeshes.forEach(x => x.material = m);
  const mb = mat("fb" + S.fach.barra + f, () => std({ color: f === "primario" ? "#f3f2ee" : f === "fin" ? COR[S.fach.barra] : clareia(COR[S.fach.barra], .25), roughness: .8, bumpMap: TX.rolo, bumpScale: .4 }));
  barraMeshes.forEach(x => x.material = mb);
  G.andaime.visible = !!st.andaime; G.rede.visible = !!st.rede;
}

/* ================= Luzes ================= */
const hemi = new THREE.HemisphereLight(0xffffff, 0x8a8275, 1); scene.add(hemi);
const sol = new THREE.DirectionalLight(0xffffff, 3); sol.castShadow = true;
sol.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048); sol.shadow.bias = -.0003; sol.shadow.normalBias = .03;
scene.add(sol, sol.target);
const spots = SPOTS.map(([x, z], i) => { const s = new THREE.SpotLight(0xffffff, 0, 10, .72, .6, 2); s.position.set(x, FC - .03, z); s.target.position.set(x * .85, 0, z * .85 - .15); if (i < 2 && !MOBILE) { s.castShadow = true; s.shadow.mapSize.set(1024, 1024); s.shadow.bias = -.0005; } G.interior.add(s, s.target); return s; });
const sancaLuz = new THREE.RectAreaLight(0xffb070, 0, W - .3, .1); sancaLuz.position.set(0, FC - .02, -hd + .08); sancaLuz.lookAt(0, 0, -hd + .02); G.interior.add(sancaLuz);
const nichoLuz = new THREE.RectAreaLight(0xffb070, 0, 1.3, .06); nichoLuz.position.set(hw - FEAT.esp + .04, FEAT.ny1 - .02, (FEAT.nz0 + FEAT.nz1) / 2); nichoLuz.lookAt(hw - FEAT.esp + .04, 0, (FEAT.nz0 + FEAT.nz1) / 2); G.interior.add(nichoLuz);
const espelhoLuz = new THREE.PointLight(0xffd2a0, 0, 2.2, 2); espelhoLuz.position.set(-.7, 1.72, -hd + .2); G.interior.add(espelhoLuz);

let hdr = null;
function aplicarLuz(st) {
  const ext = cena() === "fachada", L = ext ? LUZ_EXT[S.luzE] : LUZ_INT[(st.luzes || S.step < 0) ? S.luzI : "dia"], f = S.inten;
  sol.visible = L.sol > 0; sol.intensity = L.sol * f; if (L.sol) { sol.color.copy(kelvin(L.solK)); sol.position.set(...L.solPos); }
  if (ext) { sol.target.position.set(0, 2, 0); Object.assign(sol.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 70 }); }
  else { sol.target.position.set(.6, 0, .2); Object.assign(sol.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 25 }); }
  sol.shadow.camera.updateProjectionMatrix();
  hemi.intensity = (ext ? L.amb : L.amb + (L.sol ? .55 : 0)) * f; hemi.color.copy(kelvin(L.k + 600)); hemi.groundColor.copy(kelvin(L.solK || L.k)).multiplyScalar(ext ? .4 : .95);
  scene.environmentIntensity = L.env * f;
  if (hdr && L.bg > .1) { scene.background = hdr; scene.backgroundIntensity = L.bg * f; } else scene.background = new THREE.Color(ext ? 0x0b0f18 : 0x0a0c12);
  if (hdr) scene.backgroundBlurriness = ext ? 0 : .02;
  renderer.toneMappingExposure = L.exp;
  // artificiais (interior)
  const fixK = kelvin(L.fixK || 3000), lig = !ext && (st.luzes || S.step < 0);
  const fix = lig ? (L.fix || .25) : 0, ind = lig ? (L.ind || 1) : 0;
  const tetoOk = st.teto === "fin";
  spots.forEach(s => { s.intensity = tetoOk && S.ilum.spots ? fix * 16 * f : 0; s.color.copy(fixK); });
  M.emis.emissive.copy(fixK); M.emis.emissiveIntensity = tetoOk && S.ilum.spots && fix ? 2.2 : 0;
  sancaLuz.intensity = tetoOk && S.pladur.sanca && S.ilum.fita && lig ? (L.fix ? 9 : 2) * ind * f : 0; sancaLuz.color.copy(kelvin(2700));
  const nichoOn = cena() === "sala" && st.feature === "fin" && S.pladur.nicho && lig;
  nichoLuz.intensity = nichoOn ? (L.fix ? 8 : 2) * ind * f : 0; nichoLuz.color.copy(kelvin(2700));
  M.emisNicho.emissive.copy(kelvin(2700)); M.emisNicho.emissiveIntensity = nichoOn ? 3 : 0;
  const esp = cena() === "wc" && st.moveis && lig;
  espelhoLuz.intensity = esp ? (L.fix ? 1.8 : .4) * ind * f : 0; M.emisFita.emissive.copy(kelvin(3000)); M.emisFita.emissiveIntensity = esp ? 1.6 : 0;
  if (pendenteLuz) pendenteLuz.intensity = cena() === "sala" && st.moveis && lig && S.ilum.pendente && L.fix ? 5 * f : 0;
  if (G.pendente) G.pendente.visible = cena() === "sala" && st.moveis && S.ilum.pendente && tetoOk;
  if (G.up) G.up.forEach(s => s.intensity = ext && L.up ? 60 * f : 0);
}

/* ================= Aplicar estado ================= */
let pronto = false, arrancou = false;
const feito = {};
function aplicarEstado() {
  const st = estado(), c = cena(), ext = c === "fachada";
  if (ext && !feito.ext) { feito.ext = 1; construirExterior(); }
  if (c === "sala" && !feito.sala) { feito.sala = 1; construirSala(); }
  if ((st.obra || st.prot || st.entulho) && !feito.obra) { feito.obra = 1; construirObra(); }
  if (!ext) SUP.laje[0].material = st.teto === "laje" ? pbrMat("concrete_floor_02", 3, { color: "#d9d6d0" }) : M.laje;
  G.interior.visible = !ext; G.exterior.visible = ext;
  if (ext) { atualizarFachada(st); aplicarLuz(st); atualizarComposer(st); return; }
  const wc = c === "wc", xr = st.xray || (S.xray && S.step < 0 && svc().cfg.includes("xray"));
  G.wc.visible = wc && !!st.moveis; G.sala.visible = !wc && !!st.moveis;
  G.velho.visible = wc && !!st.velho; G.comum.visible = !!st.moveis;
  G.obra.visible = !!st.obra; G.prot.visible = !!st.prot; G.entulho.visible = !!st.entulho;
  G.eletrWC.visible = wc; G.eletrSala.visible = !wc;
  // superfícies
  const pisoMat = (est, metade) => {
    if (xr) return M.xray;
    switch (est) {
      case "antigo": return pbrMat("interior_tiles", 1.2);
      case "betao": return pbrMat("concrete_floor_02", 2.5);
      case "autonivel": return pbrMat("concrete_floor_02", 3, { color: "#d6d3cd", normalScale: new THREE.Vector2(.25, .25) });
      case "micro0": return pbrMat("concrete_floor_02", 2.5, { color: "#8f8a83", roughness: .7 });
      case "micro1": return pbrMat("concrete_floor_02", 2.5, { color: "#8f8a83", roughness: .7 });
      case "micro2": return matMicro(COR[S.micro.cor.piso], 2);
      case "micro3": return matMicro(COR[S.micro.cor.piso], 3);
      case "base": return PAV[S.pav].tex === "laminate_floor_02" || PAV[S.pav].tex === "herringbone_parquet" ? mat("manta", () => std({ map: TX.manta, roughness: .9 })) : mat("cola", () => std({ map: TX.cola, roughness: .85 }));
      case "parcial": return metade === "L" ? pisoMat("fin") : pisoMat("base");
      default: return wc ? matMicro(COR[S.micro.cor.piso], 9, S.micro.ver) : matPav(S.pav);
    }
  };
  SUP.piso.forEach(m => m.material = pisoMat(st.piso, m.userData.metade));
  G.wc.traverse(o => { if (o.userData.sup === "pisoDuche") o.material = matMicro(COR[S.micro.cor.piso], 9, S.micro.ver); });
  const parMat = (est, fundo) => {
    if (xr) return M.xray;
    switch (est) {
      case "antigo": return wc ? pbrMat("interior_tiles", 1.2) : mat("velha", () => std({ map: TX.velha, roughness: .9 }));
      case "tijolo": return pbrMat("brick_wall_02", 2);
      case "reboco": return pbrMat("beige_wall_001", 2, { color: "#d4cfc7" });
      case "primario": return mat("primario", () => std({ color: 0xf4f3ef, roughness: .95, bumpMap: TX.rolo, bumpScale: .2 }));
      case "reparada": return mat("reparada", () => std({ map: TX.reparada, roughness: .9 }));
      case "demao1": return matTinta(fundo && S.tinta.usaDestaque ? COR[S.tinta.destaque] : COR[S.tinta.cor], S.tinta.acab, "demao");
      case "micro0": return pbrMat("beige_wall_001", 2, { color: "#a29c92", roughness: .7 });
      case "micro1": return pbrMat("beige_wall_001", 2, { color: "#a29c92", roughness: .7 });
      case "micro2": return matMicro(COR[S.micro.cor.parede], 2);
      case "micro3": return matMicro(COR[S.micro.cor.parede], 3);
      default: return wc ? matMicro(COR[S.micro.cor.parede], 9, S.micro.ver) : matTinta(fundo && S.tinta.usaDestaque ? COR[S.tinta.destaque] : COR[S.tinta.cor], S.tinta.acab);
    }
  };
  SUP.paredes.forEach(m => m.material = parMat(st.paredes, SUP.parFundo.includes(m)));
  const bancEst = st.piso.startsWith("micro") ? st.piso : "fin";
  bancadas.forEach(m => m.material = bancEst === "fin" ? matMicro(COR[S.micro.cor.bancada], 9, S.micro.ver) : bancEst === "micro2" || bancEst === "micro3" ? matMicro(COR[S.micro.cor.bancada], +bancEst.slice(-1)) : pisoMat(bancEst));
  // malha de fibra
  G.malha.clear();
  if (st.piso === "micro1") [...SUP.piso, ...(st.paredes === "micro1" ? SUP.paredes : [])].forEach(m => { const o = new THREE.Mesh(m.geometry, mat("malhaM", () => std({ color: 0xf3efe0, alphaMap: TX.malha, transparent: true, roughness: .8, polygonOffset: true, polygonOffsetFactor: -2 }))); G.malha.add(o); });
  // teto e pladur
  atualizarTeto(st);
  if (xr) tetoFalso.material = M.xray;
  atualizarFeature(Object.assign({}, st, { xray: xr }));
  // instalações
  const aberto = !!st.roco;
  G.canal.visible = !!st.canal; G.eletr.visible = !!st.eletr;
  [G.canal, G.eletr, G.eletrWC, G.eletrSala].forEach(gr => gr.children.forEach(s => { if (s.userData.n) s.position.copy(s.userData.n).multiplyScalar(aberto ? .06 : 0); }));
  G.canal.visible = wc && !!st.canal;
  G.roco.visible = aberto && (st.paredes === "tijolo");
  construirRocos();
  construirPontos();
  G.caixas.visible = !!st.eletr && (aberto || xr); G.espelhos.visible = st.paredes === "fin" && !xr;
  if (G.quadro) G.quadro.visible = !wc;
  // rodapés
  G.rodape.visible = !wc && st.piso === "fin" && !xr && st.paredes !== "tijolo";
  // torneiras
  const t = TORN[S.torn]; M.metal.color.setHex(t[1]); M.metal.metalness = t[2]; M.metal.roughness = t[3];
  aplicarLuz(st); atualizarComposer(st);
}
function construirRodape() { const r = G.rodape; caixa(W, .08, .015, M.rodape, 0, .04, -hd + .008, r, false); caixa(.015, .08, D, M.rodape, -hw + .008, .04, 0, r, false); caixa(.015, .08, D, M.rodape, hw - .008, .04, 0, r, false); }
function atualizarComposer(st) { if (aoPass) aoPass.enabled = !(st.xray || (S.xray && S.step < 0 && svc().cfg.includes("xray"))); }

/* ================= Câmaras ================= */
const VISTAS = {
  wc: { geral: [[1.95, 1.6, 3.7], [-.2, 1.0, -.8], "Geral"], bancada: [[-.15, 1.35, -.2], [-.7, .95, -hd + .3], "Bancada"], duche: [[.3, 1.5, .4], [1.6, 1.0, -1.5], "Duche"], teto: [[.9, 1.15, 2.7], [0, 2.45, -.6], "Teto"], rasante: [[2.0, .38, 1.8], [-.6, .05, -.7], "Rasante"], piso: [[.9, 1.4, 1.5], [-.2, 0, -.9]], parede: [[.3, 1.25, .9], [.3, .9, -hd]] },
  sala: { geral: [[1.95, 1.55, 3.8], [-.2, .95, -.8], "Geral"], parede: [[.25, 1.45, 2.1], [.25, 1.2, -hd], "Parede"], nicho: [[-.7, 1.4, .5], [hw, 1.2, -.5], "Nicho"], teto: [[.9, 1.05, 2.6], [0, 2.5, -.6], "Teto"], rasante: [[2.1, .36, 1.9], [-.6, .05, -.6], "Rasante"], piso: [[1.2, 1.45, 1.7], [-.3, 0, -.6]], quadro: [[.4, 1.5, 1.2], [-hw, 1.5, 1.5]] },
  fachada: { geral: [[7.5, 3.4, 16], [0, 3.3, 0], "Geral"], detalhe: [[2.6, 1.7, 6.6], [2.4, 1.6, 2.5], "Detalhe"], andaime: [[-7, 5.5, 10.5], [-1, 3.6, 2.5], "Lateral"] }
};
let anim = null;
function irPara(k, inst) {
  const v = VISTAS[cena()][k] || VISTAS[cena()].geral; const p1 = new THREE.Vector3(...v[0]), t1 = new THREE.Vector3(...v[1]);
  if (inst) { camera.position.copy(p1); controls.target.copy(t1); controls.update(); }
  else { const p0 = camera.position.clone(), t0 = controls.target.clone(), ini = performance.now(); anim = now => { const k2 = Math.min(1, (now - ini) / 1100), e = k2 < .5 ? 4 * k2 ** 3 : 1 - (-2 * k2 + 2) ** 3 / 2; camera.position.lerpVectors(p0, p1, e); controls.target.lerpVectors(t0, t1, e); if (k2 >= 1) anim = null; }; }
  document.querySelectorAll("#views button").forEach(b => b.classList.toggle("on", b.dataset.v === k));
}
function limitesCamara() {
  const ext = cena() === "fachada";
  controls.minDistance = ext ? 4 : .5; controls.maxDistance = ext ? 32 : 6.8;
  controls.maxPolarAngle = Math.PI * (ext ? .48 : .55); controls.minPolarAngle = ext ? .2 : .1;
  controls.minAzimuthAngle = ext ? -1.2 : -1.15; controls.maxAzimuthAngle = ext ? 1.2 : 1.15;
}

/* ================= Assistente ================= */
function corPrincipal() {
  const id = S.svc;
  if (id === "microcimento" || id === "remodelacao") return [S.micro.cor[S.micro.surf], { piso: "o pavimento", parede: "as paredes", bancada: "a bancada" }[S.micro.surf]];
  if (id === "canalizacao") return [S.micro.cor.parede, "as paredes"];
  if (id === "pintura-exterior") return [S.fach.cor, "a fachada"];
  if (id === "pavimentos") return [PAV[S.pav].n, "o pavimento", PAV[S.pav].micro ? COR[S.micro.cor.piso] : PAV[S.pav].hex];
  return [S.tinta.alvo === "destaque" ? S.tinta.destaque : S.tinta.cor, "as paredes"];
}
function leitura() {
  const [nome, sup, hx] = corPrincipal(), hex = hx || COR[nome], ext = cena() === "fachada", L = ext ? LUZ_EXT[S.luzE] : LUZ_INT[S.luzI], K = L.k;
  const { s, l, h } = hsl(hex), v = lrv(hex), quente = s > .12 && (h < 55 || h > 340), neutro = s <= .12, out = [];
  if (v >= 65) out.push(`${nome} tem refletância alta (LRV ≈ ${v}). Reflete muita luz e amplia visualmente ${sup}.${ext ? " Em fachada, mantém a casa mais fresca no verão." : ""}`);
  else if (v >= 35) out.push(`${nome} tem refletância média (LRV ≈ ${v}). Equilibra luminosidade e profundidade, e é uma escolha segura para ${sup}.`);
  else out.push(`${nome} é um tom profundo (LRV ≈ ${v}). Cria um ambiente sofisticado e pede boa iluminação${ext ? ". Em fachada aquece mais ao sol." : ""}.`);
  if (K <= 3000) out.push(quente ? `Com luz quente (${K} K), os tons dourados intensificam-se: fica acolhedor, mas mais amarelado do que na amostra.` : neutro ? `Com luz quente (${K} K), este tom neutro puxa para bege e greige.` : `Com luz quente (${K} K), os subtons frios ficam abafados e a cor parece mais acinzentada.`);
  else if (K >= 5500) out.push(neutro ? `Com ${K} K, os cinzas ganham um subtom azulado e um ar mais arquitetónico.` : `Com ${K} K, a cor fica próxima da amostra, com um leve arrefecimento.`);
  else out.push(`Com ${K} K, a cor aparece mais fiel à amostra. É a melhor referência para decidir.`);
  if (S.svc === "microcimento" || S.svc === "remodelacao") out.push(S.micro.ver === "acet" ? "O verniz acetinado dá brilhos suaves e realça a profundidade da cor. É fácil de limpar." : "O Ultra Matte dá um aspeto mineral, sem reflexos. A luz espalha-se de forma suave.");
  if (S.svc === "pintura-interior" || S.svc === "pladur" || S.svc === "eletricidade") out.push(S.tinta.acab === "acet" ? "O acetinado é mais lavável e resistente, ideal para cozinhas, corredores e quartos de criança. Revela mais as imperfeições da parede." : "O mate disfarça imperfeições e dá um aspeto aveludado e elegante. É ideal para salas e quartos.");
  if (S.svc === "pavimentos") out.push(PAV[S.pav].brilho ? "O polido reflete a luz e amplia o espaço, mas mostra mais pó e marcas." : "Acabamentos mate escondem melhor riscos e pó no dia a dia.");
  if (ext) out.push(S.luzE === "tarde" ? "Ao fim da tarde, a fachada fica muito mais quente e dourada. Veja também com luz do meio-dia." : "Em exterior, a luz direta do sol clareia as cores. Escolha um tom ligeiramente mais escuro do que o que gosta na amostra.");
  else out.push(quente ? "Recomendação: LED 3000 K com IRC ≥ 90 para manter o calor sem amarelar." : neutro && l < .5 ? "Recomendação: 3000 a 3500 K com focos orientáveis. A luz rasante valoriza os tons escuros." : neutro ? "Recomendação: 3500 a 4000 K e IRC ≥ 90 para manter o tom fiel." : "Recomendação: 3000 a 4000 K com IRC ≥ 90.");
  $("#aiList").innerHTML = out.map(t => `<li>${t}</li>`).join("");
  $("#chipA").style.background = hex; $("#chipB").style.background = sobLuz(hex, K);
}

/* ================= Interface ================= */
const ICONES = {
  microcimento: '<path d="M4 15h13l3-3H7z"/><path d="M12 12V6a2 2 0 0 1 2-2h3"/><path d="M3 20h18"/>',
  remodelacao: '<path d="M3 11 12 4l9 7v9H3z"/><path d="M9 20v-6h6v6"/>',
  "pintura-interior": '<rect x="3" y="3" width="15" height="6" rx="1.5"/><path d="M18 6h2v5h-8v3"/><rect x="10" y="14" width="4" height="7" rx="1"/>',
  "pintura-exterior": '<path d="M3 21V9l9-6 9 6v12"/><path d="M8 21v-6h8v6M8 11h2M14 11h2"/>',
  pladur: '<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M9 3v18M15 3v18M3 12h6M15 9h6"/>',
  canalizacao: '<path d="M3 7h7a4 4 0 0 1 4 4v2"/><path d="M3 4v6M14 13h-2v3h6v-3h-2"/><path d="M15 19.5c0 1 .7 1.5 1.5 1.5s1.5-.5 1.5-1.5-1.5-2.5-1.5-2.5-1.5 1.5-1.5 2.5"/>',
  pavimentos: '<path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>',
  eletricidade: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'
};
const CURTO = { microcimento: "Microcimento", remodelacao: "Remodelação", "pintura-interior": "Pintura int.", "pintura-exterior": "Fachadas", pladur: "Pladur", canalizacao: "Canalização", pavimentos: "Pavimentos", eletricidade: "Eletricidade" };
function montarServicos() {
  $("#svcs").innerHTML = SERV.map(s => `<button data-s="${s.id}" title="${s.nome}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${ICONES[s.id]}</svg>${CURTO[s.id]}</button>`).join("");
}
function montarInfo() {
  const s = svc();
  $("#info").innerHTML = `<h2>${s.nome}</h2><p class="curto">${s.curto}</p><p>${s.desc}</p>
  <div class="tempo"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>
  <b>Tempo médio: ${s.tempo}</b><small>${s.ref}</small><em>O prazo pode variar consoante a dimensão da obra, o estado do espaço e os materiais escolhidos. Confirmamos sempre o prazo no orçamento.</em></div>
  <ul class="inclui">${s.inclui.map(i => `<li>${i}</li>`).join("")}</ul>`;
}
const swHTML = (lista, on, attr = "c") => lista.map(([fam, l]) => `${fam ? `<p class="fam">${fam}</p>` : ""}<div class="sw">${l.map(([n, h]) => `<button title="${n}" aria-label="${n}" data-${attr}="${n}" style="background:${h}" class="${n === on ? "on" : ""}"></button>`).join("")}</div>`).join("");
const seg = (id, opts, on) => `<div class="seg" data-g="${id}">${opts.map(([v, t]) => `<button data-v="${v}" class="${v === on ? "on" : ""}">${t}</button>`).join("")}</div>`;
const tg = (id, t, sub, on) => `<button class="tg ${on ? "on" : ""}" data-t="${id}"><span>${t}${sub ? `<small>${sub}</small>` : ""}</span><i class="sw-t"></i></button>`;
function montarCfg() {
  const c = svc().cfg, h = [];
  if (c.includes("micro")) {
    const surfs = [["piso", "Pavimento"], ["parede", "Paredes"], ["bancada", "Bancada"]];
    h.push(`<div class="grp"><h2>Microcimento Richimi <span>${S.micro.cor[S.micro.surf]}</span></h2>
      <div class="surf" id="surf">${surfs.map(([k, n]) => `<button data-k="${k}" class="${k === S.micro.surf ? "on" : ""}"><i style="background:${COR[S.micro.cor[k]]}"></i>${n}</button>`).join("")}</div>
      <button class="link" id="applyAll">Aplicar esta cor a todas as superfícies</button>
      <div id="palMicro">${swHTML(MICRO, S.micro.cor[S.micro.surf])}</div>
      <p class="note">Tons aproximados da carta Richimi Koncreto (132 cores). Confirme sempre no mostruário físico, que levamos a sua casa.</p>
      <p class="sub">Textura</p>${seg("tex", [["F", "Fina (F)"], ["R", "Rústica (R)"]], S.micro.tex)}
      <p class="sub">Verniz</p>${seg("ver", [["matte", "Ultra Matte"], ["acet", "Acetinado"]], S.micro.ver)}</div>`);
  }
  if (c.includes("tinta")) {
    h.push(`<div class="grp"><h2>Pintura <span>${S.tinta.alvo === "destaque" ? S.tinta.destaque : S.tinta.cor}</span></h2>
      ${seg("alvo", [["paredes", "Paredes"], ["destaque", "Parede de destaque"]], S.tinta.alvo)}
      <div id="palTinta" style="margin-top:6px">${swHTML(TINTA, S.tinta.alvo === "destaque" ? S.tinta.destaque : S.tinta.cor, "p")}</div>
      ${tg("usaDestaque", "Parede de fundo com cor de destaque", "", S.tinta.usaDestaque)}
      <p class="sub">Acabamento</p>${seg("acab", [["mate", "Mate"], ["acet", "Acetinado"]], S.tinta.acab)}
      <p class="note">Cores ilustrativas. Afinamos o tom com amostras na sua parede.</p></div>`);
  }
  if (c.includes("pav")) {
    h.push(`<div class="grp"><h2>Pavimento <span>${PAV[S.pav].n}</span></h2><div class="cards" id="pavs">${Object.entries(PAV).map(([k, p]) => `<button data-pv="${k}" class="${k === S.pav ? "on" : ""}"><i style="${p.micro ? `background:${COR[S.micro.cor.piso]}` : `background-image:url(assets/tex/${p.tex}_diff.jpg)${p.tint ? ";filter:grayscale(.7) brightness(1.05)" : ""}`}"></i>${p.n}</button>`).join("")}</div></div>`);
  }
  if (c.includes("fachada")) {
    h.push(`<div class="grp"><h2>Cor da fachada <span>${S.fach.cor}</span></h2>${swHTML([["", FACH]], S.fach.cor, "f")}
      <p class="sub">Barra (socalco)</p>${swHTML([["", BARRA]], S.fach.barra, "b")}
      <p class="note">Tintas elastoméricas ou de siloxano, em qualquer cor da carta.</p></div>`);
  }
  if (c.includes("pladur")) h.push(`<div class="grp"><h2>Soluções em pladur</h2>${tg("sanca", "Sanca com fita LED", "Luz indireta a lavar a parede", S.pladur.sanca)}${tg("nicho", "Nicho iluminado", "Parede em pladur com nicho e LED", S.pladur.nicho)}</div>`);
  if (c.includes("ilum")) h.push(`<div class="grp"><h2>Iluminação</h2>${tg("spots", "Focos encastrados", "4 focos LED no teto falso", S.ilum.spots)}${tg("fita", "Fita LED na sanca", "Luz indireta", S.ilum.fita)}${tg("pendente", "Candeeiro suspenso", "Ponto de luz sobre a mesa", S.ilum.pendente)}</div>`);
  if (c.includes("torneira")) h.push(`<div class="grp"><h2>Torneiras e acessórios</h2>${seg("torn", Object.entries(TORN).map(([k, v]) => [k, v[0]]), S.torn)}</div>`);
  if (c.includes("xray")) h.push(`<div class="grp"><h2>Instalações</h2>${tg("xray", "Ver por dentro das paredes", "Raio-X das tubagens e cabos já fechados", S.xray)}</div>`);
  $("#cfg").innerHTML = h.join("");
}
function montarLuzes() {
  const ext = cena() === "fachada", L = ext ? LUZ_EXT : LUZ_INT, on = ext ? S.luzE : S.luzI;
  $("#lights").innerHTML = Object.entries(L).map(([k, l]) => `<button data-l="${k}" class="${k === on ? "on" : ""}"><i style="color:#${kelvin(l.k).getHexString(THREE.SRGBColorSpace)}"></i><b>${l.nome}</b><small>${l.sub}</small></button>`).join("");
  $("#kTop").textContent = L[on].k + " K";
  $("#intenV").textContent = Math.round(S.inten * 100) + "%"; $("#inten").value = Math.round(S.inten * 100);
}
function montarVistas() {
  $("#views").innerHTML = Object.entries(VISTAS[cena()]).filter(([, v]) => v[2]).map(([k, v]) => `<button data-v="${k}">${v[2]}</button>`).join("");
  $("#bX").hidden = !svc().cfg.includes("xray"); $("#bX").classList.toggle("on", S.xray);
}
function montarPassos() {
  const p = svc().passos, i = S.step;
  $("#dots").innerHTML = p.map((x, k) => `<button aria-label="Passo ${k + 1}: ${x.t}" data-i="${k}" class="${k === i ? "on" : (i < 0 || k < i) ? "done" : ""}"></button>`).join("");
  if (i < 0) { $("#stN").textContent = `Resultado final · ${p.length} etapas`; $("#stDur").textContent = "Tempo médio: " + svc().tempo; $("#stT").textContent = svc().nome; $("#stD").textContent = "Carregue em ▶ para ver a obra a ser feita, passo a passo."; }
  else { $("#stN").textContent = `Passo ${i + 1} de ${p.length}`; $("#stDur").textContent = "≈ " + p[i].dur; $("#stT").textContent = p[i].t; $("#stD").textContent = p[i].d; }
  $("#stRes").hidden = i < 0;
}
function cta() {
  const s = svc(), l = [`Olá! Usei o Showroom 3D e gostaria de um orçamento.`, ``, `Serviço: ${s.nome}`];
  if (s.cfg.includes("micro")) l.push(`Microcimento: pavimento ${S.micro.cor.piso}, paredes ${S.micro.cor.parede}, bancada ${S.micro.cor.bancada}`, `Textura ${S.micro.tex === "F" ? "fina" : "rústica"}, verniz ${S.micro.ver === "matte" ? "Ultra Matte" : "acetinado"}`);
  if (s.cfg.includes("tinta")) l.push(`Pintura: ${S.tinta.cor}${S.tinta.usaDestaque ? ` com parede de destaque ${S.tinta.destaque}` : ""} (${S.tinta.acab === "mate" ? "mate" : "acetinado"})`);
  if (s.cfg.includes("pav")) l.push(`Pavimento: ${PAV[S.pav].n}`);
  if (s.cfg.includes("fachada")) l.push(`Fachada: ${S.fach.cor}, barra ${S.fach.barra}`);
  if (s.cfg.includes("pladur")) l.push(`Pladur: ${[S.pladur.sanca && "sanca com LED", S.pladur.nicho && "nicho iluminado"].filter(Boolean).join(", ") || "teto falso"}`);
  if (s.cfg.includes("ilum")) l.push(`Iluminação: ${[S.ilum.spots && "focos", S.ilum.fita && "fita LED", S.ilum.pendente && "candeeiro suspenso"].filter(Boolean).join(", ")}`);
  if (s.cfg.includes("torneira")) l.push(`Torneiras: ${TORN[S.torn][0]}`);
  const L = cena() === "fachada" ? LUZ_EXT[S.luzE] : LUZ_INT[S.luzI]; l.push(`Luz de referência: ${L.nome} (${L.k} K)`);
  $("#cta").href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(l.join("\n"));
}
function tudoUI() { document.querySelectorAll("#svcs button").forEach(b => b.classList.toggle("on", b.dataset.s === S.svc)); montarInfo(); montarCfg(); montarLuzes(); montarVistas(); montarPassos(); leitura(); cta(); guardar(); }
function refrescar() { aplicarEstado(); montarCfg(); montarLuzes(); montarPassos(); leitura(); cta(); guardar(); }

function trocarServico(id, inst) {
  const antes = cena(); S.svc = id; S.step = -1; parar();
  history.replaceState(null, "", "#" + id);
  aplicarEstado(); limitesCamara();
  if (antes !== cena() || inst) irPara("geral", true);
  tudoUI();
}
let timer = null;
function irPasso(i) {
  const n = svc().passos.length; S.step = i >= n ? -1 : i;
  aplicarEstado(); montarPassos();
  const cam = S.step < 0 ? "geral" : svc().passos[S.step].cam; irPara(cam);
}
function tocar() {
  if (timer) { parar(); return; }
  $("#icPlay").setAttribute("d", "M7 5h4v14H7zM13 5h4v14h-4z");
  if (S.step < 0) irPasso(0);
  timer = setInterval(() => { if (S.step === svc().passos.length - 1) { irPasso(-1); parar(); } else irPasso(S.step + 1); }, 4800);
}
function parar() { clearInterval(timer); timer = null; $("#icPlay").setAttribute("d", "M8 5v14l11-7z"); }

/* eventos */
$("#svcs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) trocarServico(b.dataset.s); });
$("#cfg").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.k) S.micro.surf = b.dataset.k;
  else if (b.id === "applyAll") { const c = S.micro.cor[S.micro.surf]; for (const k in S.micro.cor) S.micro.cor[k] = c; }
  else if (b.dataset.c) S.micro.cor[S.micro.surf] = b.dataset.c;
  else if (b.dataset.p) { if (S.tinta.alvo === "destaque") { S.tinta.destaque = b.dataset.p; S.tinta.usaDestaque = true; } else S.tinta.cor = b.dataset.p; }
  else if (b.dataset.pv) S.pav = b.dataset.pv;
  else if (b.dataset.f) S.fach.cor = b.dataset.f;
  else if (b.dataset.b) S.fach.barra = b.dataset.b;
  else if (b.dataset.t) { const t = b.dataset.t; if (t === "xray") S.xray = !S.xray; else if (t === "usaDestaque") S.tinta.usaDestaque = !S.tinta.usaDestaque; else if (t in S.pladur) S.pladur[t] = !S.pladur[t]; else S.ilum[t] = !S.ilum[t]; $("#bX").classList.toggle("on", S.xray); }
  else if (b.dataset.v) { const g = b.parentElement.dataset.g; if (g === "tex") S.micro.tex = b.dataset.v; if (g === "ver") S.micro.ver = b.dataset.v; if (g === "alvo") S.tinta.alvo = b.dataset.v; if (g === "acab") S.tinta.acab = b.dataset.v; if (g === "torn") S.torn = b.dataset.v; }
  else return;
  const sc = $("aside").scrollTop; refrescar(); $("aside").scrollTop = sc;
});
$("#lights").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; if (cena() === "fachada") S.luzE = b.dataset.l; else S.luzI = b.dataset.l; if (S.step >= 0 && !estado().luzes) irPasso(-1); refrescar(); });
$("#inten").addEventListener("input", e => { S.inten = e.target.value / 100; aplicarLuz(estado()); $("#intenV").textContent = e.target.value + "%"; guardar(); });
$("#views").addEventListener("click", e => { const b = e.target.closest("button"); if (b) irPara(b.dataset.v); });
$("#bX").addEventListener("click", () => { S.xray = !S.xray; if (S.step >= 0) irPasso(-1); refrescar(); $("#bX").classList.toggle("on", S.xray); });
$("#bAuto").addEventListener("click", () => { S.auto = !S.auto; controls.autoRotate = S.auto; $("#bAuto").classList.toggle("on", S.auto); });
$("#bFull").addEventListener("click", () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); });
$("#bShot").addEventListener("click", () => { render(); const a = document.createElement("a"); a.href = renderer.domElement.toDataURL("image/jpeg", .92); a.download = `pm-remodelacoes-${S.svc}.jpg`; a.click(); });
$("#stPrev").addEventListener("click", () => { parar(); const n = svc().passos.length; irPasso(S.step < 0 ? n - 1 : Math.max(0, S.step - 1)); });
$("#stNext").addEventListener("click", () => { parar(); irPasso(S.step < 0 ? 0 : S.step + 1); });
$("#stPlay").addEventListener("click", tocar);
$("#stRes").addEventListener("click", () => { parar(); irPasso(-1); });
$("#dots").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { parar(); irPasso(+b.dataset.i); } });
controls.addEventListener("start", () => { anim = null; $("#hint").style.opacity = 0; });
addEventListener("keydown", e => { if (e.target.closest("input")) return; if (e.key === "ArrowRight") $("#stNext").click(); if (e.key === "ArrowLeft") $("#stPrev").click(); if (e.key === " ") { e.preventDefault(); tocar(); } });

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false); composer && composer.setSize(w, h);
  camera.aspect = w / h; camera.fov = w / h < .9 ? 62 : 45; camera.updateProjectionMatrix();
}
addEventListener("resize", resize);
let t0 = 0;
function render() { composer ? composer.render() : renderer.render(scene, camera); }
renderer.setAnimationLoop(now => {
  if (anim) anim(now); controls.update();
  const st = S.step >= 0 ? svc().passos[S.step].s : null;
  const pulso = st && st.teste ? (Math.sin(now / 220) * .5 + .5) * .9 : 0;
  [M.azul, M.vermelho, M.branco2, M.pvc].forEach(m => m.emissiveIntensity = pulso * .5); M.conduta.emissiveIntensity = pulso;
  render();
});

/* ================= Arranque ================= */
construirCasco(); construirTeto(); construirFeature(); construirWC(); construirInstalacoes(); construirRodape();
// ambiente provisório (instantâneo) até o céu HDR chegar
{ const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; }
montarServicos();
await montarComposer();
trocarServico(S.svc, true);
const fim = () => {
  if (pronto) return; pronto = true; render();
  $("#loading").classList.add("off"); setTimeout(() => $("#hint").style.opacity = 0, 7000);
  // segundo plano: céu, planta, oclusão de ambiente
  setTimeout(() => {
    new RGBELoader(fundo).load("assets/ceu.hdr", t => { t.mapping = THREE.EquirectangularReflectionMapping; hdr = t; scene.environment = t; aplicarEstado(); });
    construirComum(); ativarAO();
  }, 150);
};
function verificarPronto() { if (pendentes <= 0 && arrancou) fim(); }
arrancou = true; verificarPronto(); setTimeout(fim, 6000);
window.__sr = { S, irPasso, trocarServico, irPara, aplicarEstado, scene, MOD };
