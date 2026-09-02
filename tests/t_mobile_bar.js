// Barra fixa mobile + FAB WhatsApp: a barra aparece depois do hero, o FAB esconde-se com a barra e no rodapé.
const { DIST, CHROME } = require('./_env');
const { chromium } = require('playwright');
let pass = 0, fail = 0;
function ok(name, cond, extra) { if (cond) { pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); } }
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const lang of ['', 'de/']) {
    const pg = await browser.newPage({ viewport: { width: 360, height: 780 }, locale: 'de-CH' });
    const errs = []; pg.on('pageerror', (e) => errs.push(String(e)));
    await pg.goto('file://' + DIST + '/' + lang + 'index.html'); await pg.waitForTimeout(700);
    try { await pg.click('#cookieDeny', { timeout: 1500 }); } catch (e) {}
    const state = () => pg.evaluate(() => [document.body.classList.contains('has-sticky'), document.body.classList.contains('in-footer'), getComputedStyle(document.querySelector('.wa-fab')).opacity, document.querySelector('.sticky-cta').classList.contains('show')]);
    const top = await state();
    ok(lang + 'index: no topo sem barra e FAB visível', !top[0] && top[2] === '1', JSON.stringify(top));
    for (let i = 0; i < 8; i++) { await pg.mouse.wheel(0, 600); await pg.waitForTimeout(60); }
    await pg.waitForTimeout(400); const mid = await state();
    ok(lang + 'index: a meio barra visível e FAB escondido', mid[0] && mid[3] && mid[2] === '0', JSON.stringify(mid));
    for (let i = 0; i < 60; i++) { await pg.mouse.wheel(0, 800); await pg.waitForTimeout(30); }
    await pg.waitForTimeout(500); const end = await state();
    ok(lang + 'index: no rodapé sem barra e FAB escondido', end[1] && !end[3] && end[2] === '0', JSON.stringify(end));
    const skip = await pg.evaluate(() => document.body.children[1] && document.body.children[1].className === 'skip-link' || document.body.children[0].className === 'skip-link');
    ok(lang + 'index: skip-link é o primeiro elemento visível do body', skip);
    ok(lang + 'index: sem erros JS', errs.length === 0, errs.join(' | '));
    await pg.close();
  }
  await browser.close();
  console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
  process.exit(fail ? 1 : 0);
})();
