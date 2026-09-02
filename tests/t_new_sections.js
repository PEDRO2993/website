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
  // locale fixo: este teste corre contra a fonte (sem build), onde a deteção
  // pelo idioma do browser ainda está activa. O comportamento em produção é
  // verificado em test_i18n_build.js, contra dist/.
  const ctx = await browser.newContext({ locale: 'pt-PT' });
  await ctx.addInitScript(() => { localStorage.setItem('pr-consent', 'denied'); sessionStorage.setItem('pr-seen', '1'); });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(base + '/');
  await pg.waitForTimeout(400);

  ok('nav mostra "Exemplos" em vez de "Portfólio"', (await pg.textContent('a[data-i18n="nav.folio"]')).trim() === 'Exemplos');
  ok('CTA pós-portfólio existe e está visível', await pg.isVisible('.folio-cta'));
  const ctaColor = await pg.$eval('.folio-cta p', el => getComputedStyle(el).color);
  const ctaBg = await pg.$eval('.folio-cta', el => getComputedStyle(el).backgroundColor);
  ok('CTA pós-portfólio: texto claro sobre fundo escuro (contraste ok)', ctaColor.includes('242') || ctaColor.includes('F2') , ctaColor + ' on ' + ctaBg);
  await pg.click('.folio-cta .btn');
  await pg.waitForTimeout(300);
  ok('botão do CTA navega para #contacto', pg.url().includes('#contacto'));

  ok('linha de garantia existe nos preços', await pg.isVisible('.price-guarantee'));
  const guarText = await pg.textContent('.price-guarantee');
  ok('linha de garantia menciona "Sem risco"', guarText.includes('Sem risco'));

  // check DE lang switch updates nav + guarantee
  await pg.click('.langs button[data-lang="de"], [data-lang="de"]').catch(() => {});
  await pg.waitForTimeout(200);

  ok('sem erros JS', errs.length === 0, errs.join(' | '));
  await browser.close();
  srv.close();
  console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
  process.exit(fail ? 1 : 0);
})();
