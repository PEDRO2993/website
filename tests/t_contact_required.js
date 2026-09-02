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
      const p = req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0];
      if (req.method === 'POST') { rsp.writeHead(200); rsp.end('ok'); return; }
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
  const ctx = await browser.newContext({ locale: 'pt-PT' });
  await ctx.addInitScript(() => { localStorage.setItem('pr-consent', 'denied'); sessionStorage.setItem('pr-seen', '1'); });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(base + '/');
  await pg.waitForTimeout(400);

  // --- GYM: Choose plan sem contacto ---
  await pg.click('.shot[data-tpl="gym"]');
  await pg.waitForSelector('#tplOverlay:not([hidden])');
  await pg.waitForTimeout(300);
  await pg.click('.dm-pick[data-plan="Duo"]');
  await pg.waitForTimeout(200);
  ok('GYM: sem contacto NÃO confirma', await pg.isHidden('[data-note].show'));
  ok('GYM: mostra aviso a pedir contacto', (await pg.textContent('#toast')).includes('contacto'));
  await pg.fill('[data-k="contacto"]', '+41791234567');
  await pg.click('.dm-pick[data-plan="Duo"]');
  await pg.waitForTimeout(200);
  ok('GYM: com contacto confirma', await pg.isVisible('[data-note].show'));
  await pg.click('#tplClose');
  await pg.waitForTimeout(200);

  // --- RESTAURANTE: reservar sem contacto ---
  await pg.click('.shot[data-tpl="rest"]');
  await pg.waitForSelector('#tplOverlay:not([hidden])');
  await pg.waitForTimeout(300);
  const resBtn = pg.locator('.dm-book[data-ref="AR"]');
  await resBtn.scrollIntoViewIfNeeded();
  await resBtn.click();
  await pg.waitForTimeout(200);
  const noteRest = pg.locator('#r-res [data-note]');
  ok('RESTAURANTE: sem contacto NÃO confirma', !(await noteRest.evaluate(el => el.classList.contains('show')).catch(() => false)));
  await pg.fill('#r-res [data-k="contacto"]', 'cliente@example.com');
  await resBtn.click();
  await pg.waitForTimeout(200);
  ok('RESTAURANTE: com contacto confirma', await noteRest.evaluate(el => el.classList.contains('show')));
  await pg.click('#tplClose');
  await pg.waitForTimeout(200);

  // --- MODA: checkout sem contacto ---
  await pg.click('.shot[data-tpl="moda"]');
  await pg.waitForSelector('#tplOverlay:not([hidden])');
  await pg.waitForTimeout(300);
  ok('MODA: campo de contacto agora existe no carrinho', await pg.locator('.dm-drawer [data-k="contacto"]').count() > 0);
  await pg.click('.tm-add');
  await pg.click('.dm-cartbtn, .t-m-cart');
  await pg.waitForTimeout(200);
  await pg.click('.dm-checkout');
  await pg.waitForTimeout(200);
  ok('MODA: sem contacto NÃO confirma checkout', await pg.isHidden('[data-checkout-note].show'));
  await pg.fill('.dm-drawer [data-k="contacto"]', 'cliente@example.com');
  await pg.click('.dm-checkout');
  await pg.waitForTimeout(200);
  ok('MODA: com contacto confirma checkout', await pg.isVisible('[data-checkout-note].show'));

  ok('sem erros JS em toda a sessão', errs.length === 0, errs.join(' | '));
  await browser.close();
  srv.close();
  console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
  process.exit(fail ? 1 : 0);
})();
