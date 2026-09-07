/* Peça 3D de cada demo por setor (PlayCanvas, alojado no próprio site). Carregada
   só quando o visitante carrega no botão — nunca no arranque da página. Cada cena
   é feita de primitivos e das fotografias da própria demo, nas cores que a demo
   já usa (--tp-accent, --tp-ink, ...). */
import { Application, Entity, Color, StandardMaterial, Texture,
  FILLMODE_NONE, RESOLUTION_AUTO, FILTER_LINEAR } from './playcanvas.mjs';

const K = new Color(0, 0, 0), W = new Color(1, 1, 1), DEG = 180 / Math.PI;

/* ---------- cor: as variáveis do tema chegam como texto CSS ---------- */
function toColor(css, fb) {
  const s = typeof css === 'string' ? css.trim().toLowerCase() : '';
  const named = { white: '#ffffff', black: '#000000' }[s] || s;
  let m = named.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    const h = m[1].length < 6 ? m[1].slice(0, 3).replace(/./g, (c) => c + c) : m[1];
    return new Color(parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255);
  }
  m = named.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map((v) => (v.endsWith('%') ? parseFloat(v) * 2.55 : parseFloat(v)));
    if (p.length >= 3 && p.every((v) => !isNaN(v))) return new Color(p[0] / 255, p[1] / 255, p[2] / 255);
  }
  return fb.clone();
}
const mix = (a, b, t) => new Color(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
const lum = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;

function tokens(p) {
  p = p || {};
  const accent = toColor(p.accent, new Color(0.89, 0.69, 0.35));
  const ink = toColor(p.ink, new Color(0.96, 0.93, 0.89));
  const card = toColor(p.card, new Color(0.13, 0.1, 0.07));
  const dark = lum(card) < 0.42;
  const line = toColor(p.line, mix(card, ink, 0.16));
  return {
    accent, ink, card, line, dark,
    muted: toColor(p.muted, mix(ink, card, 0.5)),
    onAccent: toColor(p.onAccent, dark ? card : W),
    bg: dark ? mix(card, K, 0.34) : mix(card, ink, 0.13),
    /* claro/escuro do próprio tema: porcelana, metal, sombra */
    pale: dark ? mix(ink, W, 0.3) : mix(W, line, 0.14),
    deep: dark ? mix(card, K, 0.62) : mix(ink, card, 0.1),
  };
}

export function start(opts) {
  const o = opts || {};
  const canvas = o.canvas;
  if (!canvas) return { destroy() {} };
  const P = tokens(o.palette);
  const images = (o.images || []).filter((u) => typeof u === 'string' && u).slice(0, 8);
  const reduced = !!o.reduced;
  let dead = false;

  const app = new Application(canvas, { graphicsDeviceOptions: { alpha: false, antialias: true } });
  app.setCanvasFillMode(FILLMODE_NONE); app.setCanvasResolution(RESOLUTION_AUTO);
  if (app.graphicsDevice) app.graphicsDevice.maxPixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
  app.scene.ambientLight = mix(P.bg, P.ink, P.dark ? 0.13 : 0.34);

  const root = new Entity('cena');
  app.root.addChild(root);

  /* ---------- construtores ---------- */
  function add(parent, type, c, s, p, r) {
    const e = new Entity(type);
    e.addComponent('render', { type, castShadows: false, receiveShadows: false });
    /* material próprio por entidade: os primitivos partilham o material por
       omissão e sem isto todos mostravam a mesma cor e a mesma textura */
    const m = new StandardMaterial();
    m.diffuse = c || W;
    m.useMetalness = true; m.metalness = 0; m.gloss = 0.3;
    m.update();
    e.render.meshInstances[0].material = m;
    e.mat = m;
    if (s) e.setLocalScale(s[0] === undefined ? s : s[0], s[1] === undefined ? s : s[1], s[2] === undefined ? s : s[2]);
    if (p) e.setLocalPosition(p[0], p[1], p[2]);
    if (r) e.setLocalEulerAngles(r[0], r[1], r[2]);
    (parent || root).addChild(e);
    return e;
  }
  const fin = (e, metal, gloss) => { e.mat.metalness = metal; e.mat.gloss = gloss; e.mat.update(); return e; };
  const glow = (e, c, i) => { e.mat.useLighting = false; e.mat.diffuse = K; e.mat.emissive = c || e.mat.diffuse; e.mat.emissiveIntensity = i == null ? 1 : i; e.mat.update(); return e; };

  /* parede/quadro de uma só face: vista de trás desaparece, por isso a
     câmara pode dar a volta completa sem nunca ficar tapada */
  const FACE = { n: [90, 0, 0], s: [-90, 0, 0], e: [0, 0, -90], w: [0, 0, 90] };
  function wall(c, face, w, h, p, yaw) {
    const r = FACE[face] || FACE.n;
    const e = add(root, 'plane', c, face === 'e' || face === 'w' ? [h, 1, w] : [w, 1, h], p, r);
    if (yaw) e.setLocalEulerAngles(90, yaw, 0);
    return e;
  }

  /* as fotografias da demo entram por um canvas reduzido: um único formato
     (RGBA, sem mipmaps) e no máximo 640px, que é o que um telemóvel aguenta */
  const cache = {};
  function paint(e, url, unlit, tile, off) {
    if (!url) return e;
    const apply = (t) => {
      if (dead) return;
      if (unlit) { e.mat.useLighting = false; e.mat.diffuse = K; e.mat.emissive = unlit === true ? W : unlit; e.mat.emissiveMap = t; }
      else { e.mat.diffuse = W; e.mat.diffuseMap = t; }   /* iluminada: o tecido reage à luz */
      if (tile) { e.mat.diffuseMapTiling.set(tile[0], tile[1]); e.mat.emissiveMapTiling.set(tile[0], tile[1]); }
      if (off) { e.mat.diffuseMapOffset.set(off[0], off[1]); e.mat.emissiveMapOffset.set(off[0], off[1]); }
      e.mat.update();
    };
    if (cache[url]) { apply(cache[url]); return e; }
    const im = new Image();
    im.onload = () => {
      if (dead) return;
      const k = Math.min(1, 640 / Math.max(im.width, im.height, 1));
      const w = Math.max(2, Math.round(im.width * k) || 2), h = Math.max(2, Math.round(im.height * k) || 2);
      apply(cache[url] = drawn(w, h, (c) => c.drawImage(im, 0, 0, w, h)));
    };
    im.src = url;
    return e;
  }
  const img = (i) => (images.length ? images[i % images.length] : null);

  /* quadro: a fotografia é mais grossa do que a moldura, por isso lê-se dos dois lados */
  function board(url, frameC, w, h, p, r, flat) {
    if (flat) {   /* encostado a uma parede: uma só face, some com a parede */
      const a = ((r ? r[1] : 0) * Math.PI) / 180, rot = [90, r ? r[1] : 0, 0];
      add(root, 'plane', frameC, [w + 0.16, 1, h + 0.16], p, rot);
      return paint(add(root, 'plane', P.pale, [w, 1, h], [p[0] + 0.02 * Math.sin(a), p[1], p[2] + 0.02 * Math.cos(a)], rot), url, true);
    }
    add(root, 'box', frameC, [w + 0.16, h + 0.16, 0.05], p, r);
    return paint(add(root, 'box', P.pale, [w, h, 0.16], p, r), url, true);
  }

  function drawn(w, h, draw) {
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
    const t = new Texture(app.graphicsDevice, { width: w, height: h, mipmaps: false, minFilter: FILTER_LINEAR, magFilter: FILTER_LINEAR });
    t.setSource(cv);
    return t;
  }
  const hex = (c) => 'rgb(' + Math.round(c.r * 255) + ',' + Math.round(c.g * 255) + ',' + Math.round(c.b * 255) + ')';

  /* o pivô é também o suporte das luzes quando a cena é uma peça só:
     assim a peça está sempre bem iluminada, rode-se para onde se rodar */
  const pivot = new Entity('orbita');
  app.root.addChild(pivot);
  function lamp(euler, c, intensity, follow) {
    const e = new Entity('luz');
    e.addComponent('light', { type: 'directional', color: c, intensity, castShadows: false });
    e.setLocalEulerAngles(euler[0], euler[1], euler[2]);
    (follow ? pivot : app.root).addChild(e);
  }
  function lights(keyI, fillI, rimI, follow) {
    lamp([52, 24, 0], mix(P.pale, W, 0.5), keyI, follow);
    lamp([16, -140, 0], mix(P.bg, P.ink, 0.55), fillI, follow);
    lamp([-24, 165, 0], mix(P.accent, W, 0.25), rimI, follow);
  }

  /* ---------- as sete cenas ---------- */
  const G = { rest, gym, barb, clin, foto, moda, imob };

  /* mesa posta: prato de assinatura visto de qualquer ângulo */
  function rest() {
    lights(1.05, 0.5, 0.55);
    const wood = mix(P.card, P.accent, 0.26), gold = P.accent;
    fin(add(root, 'cylinder', mix(P.card, K, 0.35), [7.5, 0.2, 7.5], [0, -0.08, 0]), 0, 0.2);
    fin(add(root, 'cylinder', wood, [7.1, 0.34, 7.1], [0, 0, 0]), 0, 0.42);
    add(root, 'box', mix(P.card, P.ink, 0.13), [2.2, 0.03, 6.9], [0, 0.18, 0]);
    fin(add(root, 'cylinder', mix(gold, P.card, 0.35), [2.52, 0.1, 2.52], [0, 0.21, 0.2]), 0.6, 0.6);
    fin(add(root, 'cylinder', P.pale, [2.34, 0.13, 2.34], [0, 0.22, 0.2]), 0, 0.6);
    fin(add(root, 'cylinder', mix(P.card, K, 0.05), [1.6, 0.02, 1.6], [0, 0.29, 0.2]), 0, 0.75);
    fin(add(root, 'cylinder', mix(gold, K, 0.56), [0.98, 0.26, 0.98], [0, 0.41, 0.12]), 0, 0.55);
    fin(add(root, 'sphere', mix(P.pale, gold, 0.3), [0.58, 0.34, 0.4], [-0.52, 0.36, 0.5]), 0, 0.4);
    add(root, 'sphere', mix(gold, P.ink, 0.25), [0.24, 0.2, 0.24], [0.46, 0.36, 0.5]);
    add(root, 'sphere', mix(gold, K, 0.2), [0.19, 0.16, 0.19], [0.2, 0.37, 0.62]);
    add(root, 'sphere', mix(P.ink, gold, 0.45), [0.15, 0.13, 0.15], [-0.1, 0.56, 0.12]);
    [-1.78, 1.78].forEach((x, i) => {
      fin(add(root, 'box', P.pale, [0.09, 0.03, 1.5], [x, 0.24, 0.2]), 0.9, 0.82);
      fin(add(root, 'box', P.pale, [0.17, 0.035, 0.42], [x, 0.245, i ? 0.86 : -0.46]), 0.9, 0.82);
    });
    [[1.62, -1.55, 1], [-1.62, -1.32, 0.9]].forEach(([x, z, k]) => {
      fin(add(root, 'cylinder', mix(P.pale, gold, 0.18), [0.56 * k, 0.05, 0.56 * k], [x, 0.23, z]), 0.2, 0.9);
      fin(add(root, 'cylinder', mix(P.pale, gold, 0.18), [0.06, 0.8 * k, 0.06], [x, 0.63 * k, z]), 0.2, 0.9);
      glow(fin(add(root, 'cone', mix(P.pale, gold, 0.22), [0.46 * k, 0.92 * k, 0.46 * k], [x, 1.16 * k + 0.14, z], [180, 0, 0]), 0.1, 1), mix(P.pale, gold, 0.3), 0.34);
    });
    /* duas cadeiras: bastam para dizer "sala de jantar" */
    [-1, 1].forEach((sx) => {
      const ch = new Entity('cadeira');
      ch.setLocalEulerAngles(0, sx * 90, 0); root.addChild(ch);
      fin(add(ch, 'box', mix(P.card, P.accent, 0.14), [1.1, 0.12, 1.05], [0, 0.72, -4.35]), 0, 0.3);
      fin(add(ch, 'box', mix(P.card, P.accent, 0.14), [1.1, 1.2, 0.14], [0, 1.3, -4.85], [-8, 0, 0]), 0, 0.3);
      [-0.45, 0.45].forEach((d) => fin(add(ch, 'box', mix(P.card, K, 0.15), [0.11, 0.72, 0.11], [d, 0.36, -4.85]), 0, 0.3));
    });
    add(root, 'box', gold, [0.95, 0.05, 1.25], [-0.05, 0.24, 2.0], [0, 14, 0]);
    fin(add(root, 'cylinder', P.pale, [0.22, 0.5, 0.22], [-1.85, 0.47, 1.55]), 0, 0.4);
    glow(add(root, 'sphere', gold, [0.14, 0.26, 0.14], [-1.85, 0.8, 1.55]), mix(gold, W, 0.45), 1.6);
    if (img(0)) board(img(0), mix(gold, P.card, 0.35), 1.3, 0.9, [2.5, 0.72, 1.9], [0, -18, 0]);
    return { dist: 8.6, pitch: 26, focus: 0.75, snap: 0, spin: 0.15, pmin: 6, pmax: 62 };
  }

  /* chão de treino: plataforma, rack e barra */
  function gym() {
    lights(1.0, 0.42, 0.75);
    const black = mix(P.card, K, 0.4), steel = mix(P.card, P.ink, 0.22);
    fin(add(root, 'box', P.deep, [10.4, 0.3, 8.2], [0, -0.15, 0]), 0, 0.32);
    [-3.2, 3.2].forEach((z) => add(root, 'box', mix(P.card, P.accent, 0.3), [10.4, 0.02, 0.1], [0, 0.02, z]));
    add(root, 'box', P.accent, [3.7, 0.06, 3.3], [0, 0.02, 0.2]);
    add(root, 'box', mix(P.card, P.ink, 0.08), [3.44, 0.1, 3.04], [0, 0.04, 0.2]);
    [-1.55, 1.55].forEach((x) => {
      add(root, 'box', black, [0.2, 3.3, 0.2], [x, 1.65, -1.4]);
      add(root, 'box', black, [0.24, 0.14, 1.7], [x, 0.07, -0.95]);
      add(root, 'box', P.accent, [0.24, 0.12, 0.24], [x, 3.34, -1.4]);
      add(root, 'box', P.accent, [0.13, 0.13, 0.5], [x, 2.12, -1.14]);
    });
    add(root, 'box', black, [3.3, 0.18, 0.18], [0, 3.18, -1.4]);
    fin(add(root, 'cylinder', P.pale, [0.09, 4.3, 0.09], [0, 2.2, -1.14], [0, 0, 90]), 0.9, 0.78);
    [-1, 1].forEach((k) => {
      fin(add(root, 'cylinder', P.accent, [1.02, 0.17, 1.02], [k * 1.74, 2.2, -1.14], [0, 0, 90]), 0, 0.45);
      fin(add(root, 'cylinder', black, [0.88, 0.15, 0.88], [k * 1.95, 2.2, -1.14], [0, 0, 90]), 0, 0.4);
    });
    fin(add(root, 'box', black, [0.78, 0.18, 2.3], [2.75, 1.05, 0.9]), 0, 0.35);
    fin(add(root, 'box', steel, [0.16, 1.0, 0.5], [2.75, 0.5, 0.0]), 0.7, 0.6);
    fin(add(root, 'box', steel, [0.16, 1.0, 0.5], [2.75, 0.5, 1.8]), 0.7, 0.6);
    [1.5, 2.25].forEach((z) => {
      fin(add(root, 'cylinder', P.pale, [0.07, 0.72, 0.07], [-3.1, 0.3, z], [0, 0, 90]), 0.9, 0.75);
      [-0.31, 0.31].forEach((d) => fin(add(root, 'cylinder', black, [0.56, 0.24, 0.56], [-3.1 + d, 0.3, z], [0, 0, 90]), 0, 0.4));
    });
    fin(add(root, 'sphere', black, [0.62, 0.58, 0.62], [-2.7, 0.3, -0.7]), 0.2, 0.5);
    add(root, 'box', black, [0.44, 0.1, 0.13], [-2.7, 0.62, -0.7]);
    if (img(0)) paint(wall(P.pale, 'n', 5.6, 2.8, [0, 2.0, -3.8]), img(0), mix(P.ink, P.card, 0.35));
    if (img(0)) add(root, 'box', P.accent, [5.6, 0.07, 0.07], [0, 0.52, -3.78]);
    return { dist: 8.0, pitch: 20, focus: 1.25, snap: 0, spin: 0.14, pmin: 5, pmax: 58 };
  }

  /* interior da barbearia: cadeira, espelho e poste */
  function barb() {
    lights(1.0, 0.5, 0.4);
    const tile = drawn(128, 128, (c) => {
      c.fillStyle = hex(P.pale); c.fillRect(0, 0, 128, 128);
      c.fillStyle = hex(mix(P.ink, P.card, 0.12)); c.fillRect(0, 0, 64, 64); c.fillRect(64, 64, 64, 64);
    });
    const floor = add(root, 'plane', W, [9.4, 1, 8.4], [0, 0, 0]);
    floor.mat.diffuseMap = tile; floor.mat.diffuseMapTiling.set(6, 5.4); floor.mat.gloss = 0.5; floor.mat.update();
    const wallc = mix(P.card, P.line, 0.75), wood = mix(P.ink, P.accent, 0.3);
    wall(wallc, 'n', 9.4, 3.6, [0, 1.8, -3.4]);
    wall(mix(wallc, P.line, 0.3), 'e', 8.4, 3.6, [-4.1, 1.8, 0]);
    add(root, 'box', mix(P.ink, P.card, 0.2), [9.4, 0.14, 0.06], [0, 0.07, -3.38]);
    wall(P.accent, 'n', 1.94, 2.34, [0, 1.95, -3.36]);
    fin(wall(mix(P.pale, P.card, 0.4), 'n', 1.66, 2.06, [0, 1.95, -3.34]), 0.9, 0.95);
    add(root, 'box', wood, [3.8, 0.13, 0.62], [0, 1.0, -3.05]);
    add(root, 'box', mix(wood, K, 0.25), [3.8, 0.9, 0.08], [0, 0.55, -2.78]);
    [[-1.35, P.accent, 0.52], [-1.05, mix(P.ink, P.card, 0.35), 0.44], [1.25, mix(P.pale, P.accent, 0.25), 0.48]].forEach(([x, c, h]) =>
      fin(add(root, 'cylinder', c, [0.17, h, 0.17], [x, 1.06 + h / 2, -3.02]), 0.1, 0.85));
    const chrome = mix(P.pale, P.line, 0.45), hide = mix(P.ink, P.accent, 0.22);
    add(root, 'cylinder', mix(P.ink, P.card, 0.08), [1.7, 0.02, 1.7], [0, 0.02, 0.3]);
    fin(add(root, 'cylinder', chrome, [1.15, 0.17, 1.15], [0, 0.09, 0.3]), 0.85, 0.8);
    fin(add(root, 'cylinder', chrome, [0.36, 0.82, 0.36], [0, 0.5, 0.3]), 0.85, 0.8);
    fin(add(root, 'box', hide, [1.14, 0.28, 1.08], [0, 1.02, 0.3]), 0, 0.42);
    fin(add(root, 'box', hide, [1.08, 1.3, 0.26], [0, 1.72, -0.2], [-10, 0, 0]), 0, 0.42);
    fin(add(root, 'box', hide, [0.58, 0.36, 0.22], [0, 2.44, -0.33], [-10, 0, 0]), 0, 0.42);
    [-0.62, 0.62].forEach((x) => { fin(add(root, 'box', chrome, [0.13, 0.1, 0.98], [x, 1.28, 0.34]), 0.85, 0.8);
      fin(add(root, 'box', chrome, [0.11, 0.3, 0.11], [x, 1.13, 0.74]), 0.85, 0.8); });
    fin(add(root, 'box', chrome, [0.78, 0.09, 0.4], [0, 0.44, 1.2]), 0.85, 0.8);
    const stripes = drawn(96, 96, (c) => {
      c.fillStyle = hex(P.pale); c.fillRect(0, 0, 96, 96); c.lineWidth = 12;
      for (let i = -2; i < 6; i++) {
        c.strokeStyle = hex(P.accent); c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32 + 96, 96); c.stroke();
        c.strokeStyle = hex(mix(P.ink, P.card, 0.25)); c.beginPath(); c.moveTo(i * 32 + 16, 0); c.lineTo(i * 32 + 112, 96); c.stroke();
      }
    });
    const pole = add(root, 'cylinder', W, [0.28, 1.5, 0.28], [3.1, 1.28, -2.7]);
    pole.mat.diffuseMap = stripes; pole.mat.diffuseMapTiling.set(1, 2); pole.mat.gloss = 0.6; pole.mat.update();
    [0.5, 2.06].forEach((y) => fin(add(root, 'cylinder', chrome, [0.36, 0.2, 0.36], [3.1, y, -2.7]), 0.85, 0.8));
    fin(add(root, 'cone', chrome, [0.34, 0.3, 0.34], [3.1, 2.3, -2.7]), 0.85, 0.8);
    fin(add(root, 'cylinder', chrome, [0.12, 0.5, 0.12], [3.1, 0.25, -2.7]), 0.85, 0.8);
    if (img(0)) board(img(0), P.accent, 1.84, 1.24, [-4.06, 1.95, 0.3], [0, 90, 0], true);
    return { dist: 7.9, pitch: 19, focus: 1.1, snap: 0, spin: 0.14, pmin: 5, pmax: 56 };
  }

  /* sala de tratamento: a clínica vende a confiança do espaço */
  function clin() {
    lights(0.95, 0.55, 0.35);
    const wallc = mix(P.card, P.line, 0.35), floorc = mix(P.card, P.line, 0.8);
    fin(add(root, 'plane', floorc, [8.6, 1, 7.4], [0, 0, 0]), 0, 0.45);
    wall(wallc, 'n', 8.6, 3.3, [0, 1.65, -3.55]);
    wall(mix(wallc, P.line, 0.25), 'e', 7.4, 3.3, [-4.25, 1.65, 0]);
    add(root, 'box', P.accent, [8.6, 0.07, 0.05], [0, 0.05, -3.52]);
    add(root, 'box', P.accent, [0.05, 0.07, 7.4], [-4.22, 0.05, 0]);
    wall(mix(P.pale, P.accent, 0.12), 'e', 2.8, 1.8, [-4.18, 1.95, -0.8]);
    add(root, 'box', P.pale, [0.07, 1.9, 0.09], [-4.15, 1.95, -0.8]);
    add(root, 'box', P.pale, [0.07, 0.09, 2.9], [-4.15, 1.95, -0.8]);
    const bed = mix(P.pale, P.line, 0.18);
    fin(add(root, 'box', mix(P.ink, P.card, 0.62), [0.72, 0.68, 0.6], [0.5, 0.34, 0.3]), 0.5, 0.55);
    add(root, 'box', mix(P.ink, P.card, 0.75), [1.05, 0.16, 2.5], [0.5, 0.74, 0.3]);
    fin(add(root, 'box', bed, [1.0, 0.24, 2.4], [0.5, 0.92, 0.3]), 0, 0.35);
    fin(add(root, 'box', bed, [1.0, 0.22, 1.0], [0.5, 1.16, -0.72], [-26, 0, 0]), 0, 0.35);
    add(root, 'box', mix(P.accent, P.pale, 0.72), [0.72, 0.16, 0.44], [0.5, 1.38, -1.05], [-26, 0, 0]);
    add(root, 'box', mix(P.pale, W, 0.4), [0.84, 0.02, 1.7], [0.5, 1.05, 0.45]);
    fin(add(root, 'cylinder', mix(P.pale, P.line, 0.5), [0.56, 0.07, 0.56], [-1.9, 0.04, -1.3]), 0.6, 0.6);
    fin(add(root, 'cylinder', mix(P.pale, P.line, 0.5), [0.1, 2.2, 0.1], [-1.9, 1.1, -1.3]), 0.6, 0.6);
    fin(add(root, 'cylinder', mix(P.pale, P.line, 0.5), [0.08, 1.25, 0.08], [-1.36, 2.11, -1.16], [0, -14, -98]), 0.6, 0.6);
    fin(add(root, 'cone', mix(P.pale, P.line, 0.3), [0.74, 0.5, 0.74], [-0.82, 1.86, -1.02], [0, 0, -12]), 0.3, 0.7);
    glow(add(root, 'sphere', W, [0.4, 0.2, 0.4], [-0.84, 1.6, -1.02]), mix(P.pale, P.accent, 0.1), 1.3);
    fin(add(root, 'box', P.pale, [1.8, 1.0, 0.55], [2.6, 0.5, -3.2]), 0, 0.4);
    add(root, 'box', mix(P.accent, P.card, 0.55), [1.9, 0.07, 0.62], [2.6, 1.03, -3.2]);
    [0.34, 0.68].forEach((y) => add(root, 'box', P.accent, [1.8, 0.035, 0.03], [2.6, y, -2.91]));
    fin(add(root, 'cylinder', P.accent, [0.58, 0.13, 0.58], [-1.5, 0.63, 1.3]), 0, 0.4);
    fin(add(root, 'cylinder', mix(P.pale, P.line, 0.5), [0.11, 0.6, 0.11], [-1.5, 0.3, 1.3]), 0.6, 0.6);
    fin(add(root, 'cylinder', mix(P.pale, P.line, 0.5), [0.64, 0.06, 0.64], [-1.5, 0.03, 1.3]), 0.6, 0.6);
    add(root, 'cylinder', mix(P.card, P.line, 0.6), [0.42, 0.44, 0.42], [3.3, 0.22, 2.1]);
    add(root, 'sphere', mix(P.accent, P.ink, 0.28), [0.74, 0.8, 0.74], [3.3, 0.76, 2.1]);
    add(root, 'sphere', mix(P.accent, P.ink, 0.4), [0.46, 0.46, 0.46], [3.46, 1.1, 1.96]);
    if (img(0)) board(img(0), P.accent, 1.9, 1.2, [-1.1, 2.0, -3.52], null, true);
    return { dist: 8.8, pitch: 22, focus: 1.15, snap: 45, spin: 0.13, pmin: 6, pmax: 60 };
  }

  /* galeria à volta do visitante: as fotografias do próprio fotógrafo */
  function foto() {
    lights(0.85, 0.45, 0.3, true);   /* a luz acompanha a vista: nunca há um lado às escuras */
    const n = Math.max(5, Math.min(8, images.length || 6));
    const R = 4.2;
    fin(add(root, 'cylinder', mix(P.card, P.ink, 0.05), [15, 0.16, 15], [0, -0.04, 0]), 0, 0.3);
    fin(add(root, 'cylinder', P.deep, [14.2, 0.18, 14.2], [0, 0, 0]), 0, 0.55);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, yaw = a * DEG + 180;
      const px = Math.sin(a), pz = Math.cos(a);
      const seg = (2 * Math.PI * R) / n;
      wall(mix(P.card, P.ink, 0.13), 'n', seg * 1.1, 3.9, [px * R, 1.95, pz * R], yaw);
      add(root, 'box', mix(P.card, P.ink, 0.2), [seg * 1.1, 0.14, 0.07], [px * (R - 0.05), 0.07, pz * (R - 0.05)], [0, yaw, 0]);
      const b = ((i + 0.5) / n) * Math.PI * 2;
      add(root, 'box', mix(P.card, P.ink, 0.04), [0.22, 3.9, 0.22], [Math.sin(b) * (R + 0.06), 1.95, Math.cos(b) * (R + 0.06)], [0, b * DEG, 0]);
      const tall = i % 2 === 1, w = tall ? 1.5 : 2.4, h = tall ? 2.0 : 1.58;
      glow(add(root, 'plane', W, [w + 0.16, 1, h + 0.16], [px * (R - 0.08), 1.9, pz * (R - 0.08)], [90, yaw, 0]), mix(P.accent, P.card, 0.3), 0.7);
      paint(add(root, 'plane', mix(P.card, P.ink, 0.2), [w, 1, h], [px * (R - 0.12), 1.9, pz * (R - 0.12)], [90, yaw, 0]), img(i), true);
      glow(add(root, 'box', P.accent, [0.16, 0.09, 0.12], [px * (R - 0.5), 3.5, pz * (R - 0.5)], [0, yaw, 0]), mix(P.accent, W, 0.2), 0.9);
    }
    return { dist: 1.3, pitch: 2, focus: 1.9, snap: 360 / n, spin: 0.1, pmin: -14, pmax: 26, fov: 62 };
  }

  /* volta de 360° à peça: a vista 3D clássica do comércio electrónico */
  function moda() {
    lights(1.15, 0.6, 0.42, true);
    const wood = mix(P.ink, P.accent, 0.45), plinth = mix(P.card, P.line, 0.75);
    fin(add(root, 'cylinder', mix(P.card, P.line, 0.4), [13, 0.2, 13], [0, -1.82, 0]), 0, 0.2);
    fin(add(root, 'cylinder', P.accent, [3.05, 0.14, 3.05], [0, -1.66, 0]), 0.5, 0.65);
    fin(add(root, 'cylinder', plinth, [2.8, 0.32, 2.8], [0, -1.52, 0]), 0, 0.4);
    add(root, 'cylinder', mix(plinth, K, 0.1), [1.7, 0.01, 1.7], [0, -1.35, 0]);
    /* arara: dois prumos e a barra onde a peça fica pendurada */
    const brass = mix(P.pale, P.accent, 0.72);
    [-1.42, 1.42].forEach((x) => { fin(add(root, 'cylinder', brass, [0.36, 0.09, 0.36], [x, -1.31, 0]), 0.25, 0.85);
      fin(add(root, 'cylinder', brass, [0.09, 3.1, 0.09], [x, 0.2, 0]), 0.25, 0.85); });
    fin(add(root, 'cylinder', brass, [0.08, 3.0, 0.08], [0, 1.72, 0], [0, 0, 90]), 0.25, 0.85);
    fin(add(root, 'cylinder', brass, [0.05, 0.78, 0.05], [0, 1.36, 0]), 0.25, 0.85);
    fin(add(root, 'sphere', brass, [0.13, 0.13, 0.13], [0, 1.72, 0]), 0.25, 0.85);
    /* a peça: corpo com volume, ombro em cone, duas mangas */
    const cloth = mix(P.pale, P.accent, 0.05);
    const body = fin(add(root, 'cylinder', cloth, [1.42, 1.75, 0.66], [0, 0.08, 0]), 0, 0.36);
    const shoulder = fin(add(root, 'cone', cloth, [1.42, 0.26, 0.67], [0, 1.08, 0]), 0, 0.36);
    const arms = [-1, 1].map((s) => fin(add(root, 'cylinder', cloth, [0.4, 1.16, 0.4], [s * 0.76, 0.38, 0], [0, 0, s * -7]), 0, 0.36));
    /* a textura é um recorte pequeno do centro da fotografia: dá o tecido
       da peça sem colar a fotografia inteira à volta do cilindro */
    if (img(0)) [body, shoulder].concat(arms).forEach((e) => paint(e, img(0), false, [0.42, 0.42], [0.3, 0.32]));
    /* etiqueta de preço: o pormenor que diz "à venda" */
    fin(add(root, 'box', wood, [0.02, 0.4, 0.02], [1.02, 1.0, 0.1]), 0, 0.4);
    fin(add(root, 'box', mix(P.card, P.line, 0.2), [0.32, 0.22, 0.03], [1.02, 0.72, 0.1], [0, 0, 7]), 0, 0.5);
    if (images.length > 1) [[-3.4, 24], [3.4, -24]].forEach(([x, ry], i) => board(img(i + 1), wood, 1.5, 2.16, [x, -0.3, -1.5], [0, ry, 0]));
    return { dist: 6.2, pitch: 8, focus: 0.05, snap: 90, spin: 0.19, pmin: -8, pmax: 52 };
  }

  /* planta do apartamento: a vista 3D clássica do imobiliário */
  function imob() {
    lights(1.0, 0.5, 0.3);
    const slab = P.pale, wallc = mix(P.pale, P.line, 0.55), wood = mix(P.line, P.ink, 0.24);
    fin(add(root, 'box', P.accent, [7.9, 0.12, 6.1], [0, -0.24, 0]), 0, 0.3);
    fin(add(root, 'box', slab, [7.4, 0.3, 5.6], [0, -0.05, 0]), 0, 0.35);
    add(root, 'box', wood, [3.85, 0.06, 5.1], [1.55, 0.13, 0]);
    add(root, 'box', mix(P.line, P.pale, 0.55), [3.0, 0.06, 2.75], [-1.9, 0.13, -1.25]);
    add(root, 'box', mix(P.line, P.accent, 0.2), [1.85, 0.06, 2.3], [-2.45, 0.13, 1.3]);
    const W_ = (s, p) => fin(add(root, 'box', wallc, s, p), 0, 0.25);
    W_([7.4, 0.95, 0.14], [0, 0.58, -2.73]); W_([7.4, 0.95, 0.14], [0, 0.58, 2.73]);
    W_([0.14, 0.95, 5.6], [-3.63, 0.58, 0]); W_([0.14, 0.95, 5.6], [3.63, 0.58, 0]);
    W_([0.12, 0.95, 2.1], [-0.45, 0.58, -1.6]);
    W_([2.35, 0.95, 0.12], [-2.4, 0.58, 0.15]);
    W_([0.12, 0.95, 1.5], [-1.5, 0.58, 1.95]);
    add(root, 'box', P.accent, [0.12, 0.05, 2.1], [-0.45, 1.08, -1.6]);
    add(root, 'box', P.accent, [2.35, 0.05, 0.12], [-2.4, 1.08, 0.15]);
    add(root, 'box', mix(P.accent, P.ink, 0.1), [2.3, 0.44, 0.95], [1.5, 0.38, 1.75]);
    add(root, 'box', mix(P.accent, P.ink, 0.22), [2.3, 0.34, 0.28], [1.5, 0.6, 1.3]);
    [-1.15, 1.15].forEach((d) => add(root, 'box', mix(P.accent, P.ink, 0.22), [0.22, 0.3, 0.95], [1.5 + d, 0.55, 1.75]));
    add(root, 'box', mix(P.line, P.accent, 0.1), [3.0, 0.02, 1.9], [1.5, 0.17, 0.9]);
    fin(add(root, 'box', mix(P.ink, P.line, 0.35), [0.95, 0.11, 0.6], [1.5, 0.44, 0.55]), 0, 0.4);
    fin(add(root, 'cylinder', slab, [1.3, 0.1, 1.3], [2.45, 0.7, -1.1]), 0, 0.4);
    fin(add(root, 'cylinder', mix(P.ink, P.line, 0.4), [0.3, 0.55, 0.3], [2.45, 0.42, -1.1]), 0.4, 0.5);
    [[1.6, -1.1], [3.3, -1.1], [2.45, -0.25]].forEach(([x, z]) => add(root, 'box', mix(P.line, P.ink, 0.3), [0.4, 0.5, 0.4], [x, 0.4, z]));
    fin(add(root, 'box', slab, [2.5, 0.58, 0.62], [1.9, 0.44, -2.3]), 0, 0.4);
    add(root, 'box', mix(P.ink, P.card, 0.7), [2.6, 0.07, 0.68], [1.9, 0.76, -2.3]);
    fin(add(root, 'cylinder', mix(P.pale, P.line, 0.4), [0.42, 0.06, 0.42], [1.25, 0.79, -2.3]), 0.7, 0.7);
    fin(add(root, 'box', slab, [1.55, 0.34, 2.05], [-1.95, 0.3, -1.35]), 0, 0.35);
    add(root, 'box', mix(P.pale, P.line, 0.3), [1.5, 0.2, 2.0], [-1.95, 0.55, -1.35]);
    add(root, 'box', mix(P.accent, P.pale, 0.68), [1.52, 0.14, 1.25], [-1.95, 0.68, -0.85]);
    [-0.38, 0.38].forEach((d) => add(root, 'box', slab, [0.58, 0.14, 0.34], [-1.95 + d, 0.7, -2.15]));
    [-1.05, 1.05].forEach((d) => fin(add(root, 'box', mix(P.line, P.ink, 0.2), [0.38, 0.4, 0.38], [-1.95 + d, 0.35, -2.25]), 0, 0.4));
    fin(add(root, 'box', slab, [0.92, 0.46, 1.7], [-2.9, 0.36, 1.5]), 0, 0.5);
    add(root, 'box', mix(P.line, P.accent, 0.3), [0.74, 0.06, 1.5], [-2.9, 0.61, 1.5]);
    fin(add(root, 'cylinder', slab, [0.55, 0.16, 0.55], [-2.0, 0.72, 0.85]), 0, 0.5);
    fin(add(root, 'box', slab, [0.16, 0.6, 0.16], [-2.0, 0.42, 0.85]), 0, 0.5);
    if (img(0)) board(img(0), mix(P.ink, P.card, 0.82), 2.7, 1.66, [0, 0.98, -3.34]);
    if (img(0)) add(root, 'box', P.accent, [2.9, 0.09, 0.09], [0, 0.06, -3.33]);
    return { dist: 9.6, pitch: 39, focus: 0.4, snap: 45, spin: 0.13, pmin: 12, pmax: 74 };
  }

  /* ---------- câmara em órbita ---------- */
  const cfg = (G[o.sector] || foto)();
  pivot.setLocalPosition(0, cfg.focus, 0);
  const camera = new Entity('camara');
  camera.addComponent('camera', { clearColor: P.bg, fov: cfg.fov || 46, nearClip: 0.1, farClip: 120 });
  camera.setLocalPosition(0, 0, cfg.dist);
  pivot.addChild(camera);

  let yaw = cfg.snap ? 0 : -0.28, pitch = cfg.pitch, vel = 0;
  let dragging = false, touched = reduced, auto = !reduced, lx = 0, ly = 0;
  const snap = (cfg.snap || 0) / DEG;
  const clampP = (v) => Math.max(cfg.pmin, Math.min(cfg.pmax, v));

  app.on('update', (dt) => {
    const d = Math.min(dt, 0.05);
    if (!dragging) {
      if (Math.abs(vel) > 0.0015) {
        yaw += vel * d;
        vel *= Math.pow(0.09, d);
      } else if (touched && snap) {
        const t = Math.round(yaw / snap) * snap;
        yaw += (t - yaw) * Math.min(1, d * 5);
        vel = 0;
      } else if (auto && !touched) {
        yaw += cfg.spin * d;
      }
    }
    pivot.setLocalEulerAngles(-pitch, yaw * DEG, 0);
  });

  /* ---------- interação ---------- */
  const stop = () => { touched = true; auto = false; };
  const down = (e) => {
    dragging = true; lx = e.clientX; ly = e.clientY; vel = 0; stop();
    if (canvas.setPointerCapture) { try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* sem captura */ } }
    canvas.focus({ preventScroll: true });
  };
  const move = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lx, dy = e.clientY - ly;
    lx = e.clientX; ly = e.clientY;
    yaw += dx * 0.0062;
    pitch = clampP(pitch + dy * 0.16);
    vel = dx * 0.11;
    if (e.cancelable) e.preventDefault();
  };
  const up = () => { dragging = false; };
  const keys = (e) => {
    const step = snap || 0.28;
    if (e.key === 'ArrowLeft') { yaw -= step; vel = 0; stop(); }
    else if (e.key === 'ArrowRight') { yaw += step; vel = 0; stop(); }
    else if (e.key === 'ArrowUp') { pitch = clampP(pitch + 5); stop(); }
    else if (e.key === 'ArrowDown') { pitch = clampP(pitch - 5); stop(); }
    else if (e.key === 'Enter' || e.key === ' ') { if (!reduced) { auto = !auto; touched = !auto; vel = 0; } }
    else return;
    e.preventDefault();
  };
  const bound = [['pointerdown', down], ['pointermove', move, { passive: false }], ['pointerup', up],
    ['pointercancel', up], ['pointerleave', up], ['keydown', keys]];
  bound.forEach(([n, f, opt]) => canvas.addEventListener(n, f, opt));

  const resize = () => app.resizeCanvas(Math.max(1, canvas.clientWidth), Math.max(1, canvas.clientHeight));
  window.addEventListener('resize', resize);
  let ro = null;   /* a demo pode mudar de largura sem a janela mudar */
  if (window.ResizeObserver) { ro = new ResizeObserver(resize); ro.observe(canvas); }
  /* não desenhar o que ninguém está a ver — é o que poupa a bateria do telemóvel */
  let seen = true, io = null;
  const draw = () => { app.autoRender = seen && !document.hidden; };
  if (window.IntersectionObserver) {
    io = new IntersectionObserver((es) => { seen = es[es.length - 1].isIntersecting; draw(); }, { threshold: 0 });
    io.observe(canvas);
  }
  document.addEventListener('visibilitychange', draw);

  resize();
  app.start();

  return {
    destroy() {
      if (dead) return;
      dead = true;
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', draw);
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      bound.forEach(([n, f]) => canvas.removeEventListener(n, f));
      try { app.destroy(); } catch (err) { /* já destruída */ }
    },
  };
}
