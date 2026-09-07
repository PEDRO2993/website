/* As sete demos, abertas, não podem ter overflow horizontal.
   PORQUÊ: overflow.js mede as 12 páginas, mas nenhuma suite abria uma demo antes de
   medir. Quando o content-visibility entrou, a regra `footer { contain-intrinsic-size:
   auto 1250px }` ficou sem âmbito e apanhou o <footer> que cada demo traz consigo — um
   só comprimento aplica-se às duas dimensões, por isso dentro do visualizador ficava
   uma caixa contida de 1250px. Cinco das sete demos passaram a ter 1270-1318px de
   largura num telemóvel de 430, e a suite inteira continuou verde. */
const { ROOT, CHROME } = require('./_env');
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const KEYS = ['rest', 'gym', 'barb', 'clin', 'foto', 'moda', 'imob'];
const LARGURAS = [320, 430, 768];
let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); }
};

function serve() {
  return new Promise((res) => {
    const srv = http.createServer((req, rsp) => {
      const p = req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0];
      if (req.method === 'POST') { rsp.writeHead(200); return rsp.end('ok'); }
      fs.readFile(path.join(ROOT, p), (e, d) => {
        if (e) { rsp.writeHead(404); return rsp.end(); }
        const ext = path.extname(p).toLowerCase();
        const type = ext === '.html' ? 'text/html; charset=utf-8'
          : ext === '.css' ? 'text/css; charset=utf-8'
          : ext === '.js' || ext === '.mjs' ? 'text/javascript'
          : 'application/octet-stream';
        rsp.writeHead(200, { 'Content-Type': type });
        rsp.end(d);
      });
    });
    srv.listen(0, () => res(srv));
  });
}

(async () => {
  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ executablePath: CHROME });

  for (const largura of LARGURAS) {
    const ctx = await browser.newContext({ viewport: { width: largura, height: 860 }, locale: 'pt-PT' });
    await ctx.addInitScript(() => {
      try { localStorage.setItem('pr-consent', 'denied'); sessionStorage.setItem('pr-seen', '1'); } catch (e) {}
    });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', (e) => errs.push(String(e)));

    for (const key of KEYS) {
      await pg.goto(base + '/index.html');
      await pg.waitForTimeout(500);
      await pg.evaluate((k) => {
        const a = document.querySelector('[data-tpl="' + k + '"]');
        a.scrollIntoView();
        a.click();
      }, key);
      await pg.waitForSelector('#tplBody .tw', { timeout: 15000 });
      await pg.waitForTimeout(500);

      const m = await pg.evaluate(() => {
        const body = document.getElementById('tplBody');
        /* qual é o elemento mais largo, para o erro dizer onde doi */
        let pior = null, piorW = 0;
        body.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > piorW) { piorW = r.width; pior = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''); }
        });
        return { scrollW: body.scrollWidth, clientW: body.clientWidth, pior, piorW: Math.round(piorW) };
      });

      ok(
        `${key} @${largura}px sem overflow`,
        m.scrollW <= m.clientW,
        `${m.scrollW}/${m.clientW} — o mais largo é ${m.pior} com ${m.piorW}px`
      );
    }

    ok(`sem erros JS @${largura}px`, errs.length === 0, errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  await browser.close();
  srv.close();
  console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
  process.exit(fail ? 1 : 0);
})();
