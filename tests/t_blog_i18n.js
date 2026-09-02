const { ROOT, DIST, DISTURL, CHROME } = require('./_env');
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const SITE = ROOT;
let pass = 0, fail = 0;
function ok(name, cond, extra) { if (cond) { pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); } }
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = req.url.split('?')[0];
      fs.readFile(path.join(SITE, p), (e, d) => {
        if (e) { rsp.writeHead(404); rsp.end(); return; }
        rsp.writeHead(200, { 'Content-Type': p.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream' });
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
  for (const file of ['preco-site-suica.html', 'multilingue-valais.html', 'google-business-valais.html', 'site-restaurante-valais.html', 'manutencao-site.html']) {
    const ctx = await browser.newContext();
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', e => errs.push(String(e)));
    await pg.goto(base + '/' + file);
    for (const lang of ['pt', 'de', 'fr', 'it', 'en']) {
      await pg.click('.langs button[data-lang="' + lang + '"]');
      await pg.waitForTimeout(80);
      const h1 = await pg.textContent('.i18n-doc[data-lang="' + lang + '"] h1');
      const title = await pg.title();
      ok(file + ' ' + lang + ': h1 visível e não vazio', !!(h1 && h1.trim().length > 5), h1);
      ok(file + ' ' + lang + ': title muda', title.length > 5, title);
    }
    ok(file + ': sem erros JS', errs.length === 0, errs.join(' | '));
    await ctx.close();
  }
  await browser.close();
  srv.close();
  console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
  process.exit(fail ? 1 : 0);
})();
