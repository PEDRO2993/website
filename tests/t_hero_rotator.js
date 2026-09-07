/* A palavra que roda no título não pode invadir o parágrafo, nem apagar-se.
   PORQUÊ: `.rotator.swap` deslocava translateY(0.35em) — 33,6px num título de 96px —
   e a folga até ao .hero-pitch é de 19px. De três em três segundos, para sempre, a
   palavra azul atravessava o texto de baixo meia transparente. Nenhuma suite mediu
   nada em movimento, por isso esteve publicado sem ninguém dar por ela.
   O segundo teste guarda a armadilha do lado oposto: se `rotIn` levar `opacity`,
   remover .swap repõe o animation-name, a animação rearranca do princípio e leva o
   atraso de 0.85s — a palavra desaparece quase um segundo em cada troca. */
const { ROOT, CHROME } = require('./_env');
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(ROOT, 'dist');
const CASOS = [
  { lang: '', w: 1440 },
  { lang: 'de/', w: 1440 },   /* alemão: palavras mais longas, título mais pequeno */
  { lang: '', w: 390 },
];
let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); }
};

const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
function serve() {
  return new Promise((res) => {
    const srv = http.createServer((q, s) => {
      let p = decodeURIComponent(q.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      fs.readFile(path.join(DIST, p), (e, b) => {
        if (e) { s.writeHead(404); return s.end(); }
        s.writeHead(200, { 'Content-Type': TIPOS[path.extname(p).toLowerCase()] || 'application/octet-stream' });
        s.end(b);
      });
    });
    srv.listen(0, () => res(srv));
  });
}

/* amostra 8 s: apanha a entrada e duas ou três trocas */
const amostrar = () => new Promise((res) => {
  const rot = document.querySelector('.hero h1 .rotator');
  const dot = document.querySelector('.hero h1 .dot');
  const pit = document.querySelector('.hero-pitch');
  if (!rot || !pit) return res({ erro: 'faltam elementos' });
  let folga = 1e9, quem = '', apagadaSeq = 0, apagadaMax = 0, n = 0;
  const t = setInterval(() => {
    const topo = pit.getBoundingClientRect().top;
    [[rot, 'palavra'], [dot, 'ponto']].forEach(([el, nome]) => {
      if (!el) return;
      const d = topo - el.getBoundingClientRect().bottom;
      if (d < folga) { folga = Math.round(d); quem = nome; }
    });
    if (+getComputedStyle(rot).opacity < 0.5) { apagadaSeq++; if (apagadaSeq > apagadaMax) apagadaMax = apagadaSeq; }
    else apagadaSeq = 0;
    if (++n > 80) { clearInterval(t); res({ folga, quem, apagadaMax_ms: apagadaMax * 100 }); }
  }, 100);
});

(async () => {
  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ executablePath: CHROME });

  for (const c of CASOS) {
    const ctx = await browser.newContext({ viewport: { width: c.w, height: 900 }, locale: 'pt-PT' });
    await ctx.addInitScript(() => { try { localStorage.setItem('pr-consent', 'denied'); } catch (e) {} });
    const pg = await ctx.newPage();
    await pg.goto(base + c.lang + 'index.html');
    const r = await pg.evaluate(amostrar);
    const nome = (c.lang || 'pt/') + ' @' + c.w + 'px';

    ok(nome + ': a palavra nunca toca no parágrafo', !r.erro && r.folga >= 0,
      r.erro || ('folga mínima ' + r.folga + 'px, no ' + r.quem));
    /* a transição são 280 ms; acima de 600 ms é a animação a rearrancar com o atraso */
    ok(nome + ': não se apaga mais do que a transição', !r.erro && r.apagadaMax_ms <= 600,
      r.erro || ('apagada ' + r.apagadaMax_ms + ' ms seguidos'));
    await ctx.close();
  }

  await browser.close();
  srv.close();
  console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
  process.exit(fail ? 1 : 0);
})();
