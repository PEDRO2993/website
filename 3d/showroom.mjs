/* Sala de exposição 3D dos sete exemplos por setor (PlayCanvas, alojado no próprio site).
   Carregada só quando o visitante carrega no botão — nunca no arranque da página.
   Cada ecrã é uma captura real da demo; clicar no ecrã da frente abre essa demo. */
import { Application, Entity, Color, StandardMaterial, FILLMODE_NONE, RESOLUTION_AUTO } from './playcanvas.mjs';

const PAPER = new Color(0.082, 0.106, 0.137);  /* #151B23 */
const SLATE = new Color(0.137, 0.176, 0.224);  /* #232D39 */
const ACCENT = new Color(0.247, 0.682, 1);     /* #3FAEFF */
const R = 4.6;                                  /* raio do carrossel */
const W = 2.4, H = 1.5;                         /* ecrã 16/10, como as capturas */

/* material próprio, sem luz: a captura tem de aparecer exactamente como é
   (os primitivos partilham o material por omissão — sem isto todos os ecrãs
   mostravam a mesma textura) */
function unlit(entity, color) {
  const material = new StandardMaterial();
  material.useLighting = false;
  material.diffuse = new Color(0, 0, 0);
  material.emissive = color || new Color(1, 1, 1);
  material.emissiveIntensity = 1;
  material.useMetalness = false;
  material.update();
  entity.render.meshInstances[0].material = material;
  return material;
}

export function start(opts) {
  const { canvas, items, onPick, onLabel, reduced } = opts;
  const app = new Application(canvas, { graphicsDeviceOptions: { alpha: false, antialias: true } });
  app.setCanvasFillMode(FILLMODE_NONE);
  app.setCanvasResolution(RESOLUTION_AUTO);
  app.scene.ambientLight = new Color(0, 0, 0);

  const camera = new Entity('camera');
  camera.addComponent('camera', { clearColor: PAPER, fov: 52, farClip: 60 });
  camera.setPosition(0, 0.35, 7.6);
  camera.lookAt(0, 0, 0);
  app.root.addChild(camera);

  const ring = new Entity('carrossel');
  app.root.addChild(ring);

  const screens = [];
  items.forEach((it, i) => {
    const a = (i / items.length) * Math.PI * 2;
    const slot = new Entity('slot' + i);
    slot.setLocalPosition(Math.sin(a) * R, 0, Math.cos(a) * R);
    slot.setLocalEulerAngles(0, (a * 180) / Math.PI, 0);
    ring.addChild(slot);

    const frame = new Entity('moldura');
    frame.addComponent('render', { type: 'plane', castShadows: false, receiveShadows: false });
    frame.setLocalScale(W + 0.14, 1, H + 0.14);
    frame.setLocalEulerAngles(90, 0, 0);
    frame.setLocalPosition(0, 0, -0.01);
    unlit(frame, SLATE);
    slot.addChild(frame);

    /* régua de acento por baixo de cada ecrã: a rota vermelha do site, aqui em 3D */
    const rule = new Entity('regua');
    rule.addComponent('render', { type: 'plane', castShadows: false, receiveShadows: false });
    rule.setLocalScale(W + 0.14, 1, 0.035);
    rule.setLocalEulerAngles(90, 0, 0);
    rule.setLocalPosition(0, -(H / 2) - 0.12, 0);
    unlit(rule, ACCENT);
    slot.addChild(rule);

    const scr = new Entity('ecra');
    scr.addComponent('render', { type: 'plane', castShadows: false, receiveShadows: false });
    scr.setLocalScale(W, 1, H);
    scr.setLocalEulerAngles(90, 0, 0);
    slot.addChild(scr);
    const sm = unlit(scr, new Color(0.18, 0.22, 0.27));

    app.assets.loadFromUrl(it.img, 'texture', (err, asset) => {
      if (err || !asset) return;
      sm.emissive = new Color(1, 1, 1);
      sm.emissiveMap = asset.resource;
      sm.update();
    });

    screens.push({ slot, angle: a, item: it });
  });

  /* --- rotação: automática lenta, arrasto com inércia --- */
  let rot = 0, vel = reduced ? 0 : -0.13, dragging = false, lastX = 0, moved = 0, front = -1, touched = reduced;
  const step = (Math.PI * 2) / items.length;

  function updateFront() {
    let best = 0, bestC = -2;
    screens.forEach((s, i) => { const c = s.slot.getPosition().z; if (c > bestC) { bestC = c; best = i; } });
    if (best !== front) { front = best; onLabel(screens[best].item, best); }
  }

  app.on('update', (dt) => {
    if (!dragging) {
      if (touched && Math.abs(vel) < 0.6) {
        const target = Math.round(rot / step) * step;   /* encaixa no ecrã mais próximo */
        rot += (target - rot) * Math.min(1, dt * 5);
        vel *= 0.86;
      } else {
        if (Math.abs(vel) > 0.14) vel *= 0.93;
        rot += vel * dt;
      }
    }
    ring.setLocalEulerAngles(0, (rot * 180) / Math.PI, 0);
    screens.forEach((s) => {
      const face = s.slot.getPosition().z / R;          /* 1 = de frente para a câmara */
      const k = 0.9 + Math.max(0, face) * 0.18;
      s.slot.setLocalScale(k, k, k);
    });
    updateFront();
  });

  /* --- interação --- */
  const down = (e) => {
    dragging = true; moved = 0; lastX = e.clientX;
    if (canvas.setPointerCapture) { try { canvas.setPointerCapture(e.pointerId); } catch (err) {} }
  };
  const move = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx); touched = true;
    rot += dx * 0.005;
    vel = dx * 0.1;
  };
  const up = () => {
    if (!dragging) return;
    dragging = false;
    if (moved < 6 && front >= 0) onPick(screens[front].item);
  };
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  const keys = (e) => {
    if (e.key === 'ArrowLeft') { rot += step; vel = 0; touched = true; }
    else if (e.key === 'ArrowRight') { rot -= step; vel = 0; touched = true; }
    else if ((e.key === 'Enter' || e.key === ' ') && front >= 0) { onPick(screens[front].item); }
    else return;
    e.preventDefault();
  };
  canvas.addEventListener('keydown', keys);

  /* só o buffer de desenho — app.resizeCanvas() escreveria style.width/height inline no canvas
     e o inline ganha à folha (ver a mesma armadilha em stage.mjs) */
  const resize = () => app.updateCanvasSize();
  window.addEventListener('resize', resize);
  resize();
  app.start();

  return {
    destroy() {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('keydown', keys);
      app.destroy();
    },
  };
}
