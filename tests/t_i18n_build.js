const { ROOT, DIST, DISTURL, CHROME } = require('./_env');
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const SITE = DIST;
let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); }
}
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.json': 'application/json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const full = path.join(SITE, p);
      fs.readFile(full, (e, d) => {
        if (e) { rsp.writeHead(404); rsp.end('404'); return; }
        rsp.writeHead(200, { 'Content-Type': MIME[path.extname(full)] || 'application/octet-stream' });
        rsp.end(d);
      });
    });
    srv.listen(0, () => res(srv));
  });
}

const EXPECT = {
  '/':     { htmlLang: 'pt-PT', nav: 'Exemplos',  plan: "CHF 2'400", once: 'projeto único', hot: 'Mais pedido',      view: 'Ver demonstração' },
  '/de/':  { htmlLang: 'de-CH', nav: 'Beispiele', plan: "CHF 2'400", once: 'einmalig',      hot: 'Beliebteste Wahl', view: 'Demo ansehen' },
  '/fr/':  { htmlLang: 'fr-CH', nav: 'Exemples',  plan: "CHF 2'400", once: 'paiement unique', hot: 'Le plus demandé',  view: 'Voir la démo' },
  '/it/':  { htmlLang: 'it-CH', nav: 'Esempi',    plan: "CHF 2'400", once: 'una tantum', hot: 'Il più richiesto', view: 'Vedi la demo' },
  '/en/':  { htmlLang: 'en',    nav: 'Examples',  plan: "CHF 2'400", once: 'one-off project', hot: 'Most popular',   view: 'View demo' },
};

(async () => {
  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ executablePath: CHROME });

  console.log('1. Cada idioma renderiza correctamente');
  for (const [url, exp] of Object.entries(EXPECT)) {
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => { localStorage.setItem('pr-consent', 'denied'); sessionStorage.setItem('pr-seen', '1'); });
    const pg = await ctx.newPage();
    const errs = [], notFound = [];
    pg.on('pageerror', e => errs.push(String(e)));
    pg.on('response', r => { if (r.status() === 404) notFound.push(r.url()); });
    await pg.goto(base + url);
    await pg.waitForTimeout(500);

    ok(url + ' <html lang>', await pg.getAttribute('html', 'lang') === exp.htmlLang);
    ok(url + ' nav traduzida', (await pg.textContent('a[data-i18n="nav.folio"]')).trim() === exp.nav, await pg.textContent('a[data-i18n="nav.folio"]'));
    const priceTxt = await pg.textContent('#panel-web .plan-amount');
    ok(url + ' preço + sufixo traduzidos', priceTxt.includes(exp.plan) && priceTxt.includes(exp.once), priceTxt.trim());
    ok(url + ' selo "mais pedido" traduzido', (await pg.textContent('#panel-web .plan-flag')).trim() === exp.hot, await pg.textContent('#panel-web .plan-flag'));
    ok(url + ' cartão de portfólio traduzido', (await pg.textContent('.shot-view')).trim() === exp.view, await pg.textContent('.shot-view'));
    ok(url + ' sem 404 em assets', notFound.length === 0, notFound.slice(0, 3).join(' | '));
    ok(url + ' sem erros JS', errs.length === 0, errs.join(' | '));
    await ctx.close();
  }

  console.log('\n2. O seletor de idioma navega entre URLs');
  {
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => { localStorage.setItem('pr-consent', 'denied'); sessionStorage.setItem('pr-seen', '1'); });
    const pg = await ctx.newPage();
    await pg.goto(base + '/');
    await pg.click('.langs button[data-lang="de"]');
    await pg.waitForURL('**/de/');
    ok('PT → clique DE leva a /de/', pg.url().endsWith('/de/'), pg.url());
    ok('e mostra alemão', (await pg.textContent('a[data-i18n="nav.folio"]')).trim() === 'Beispiele');
    await pg.click('.langs button[data-lang="fr"]');
    await pg.waitForURL('**/fr/');
    ok('DE → clique FR leva a /fr/', pg.url().endsWith('/fr/'), pg.url());
    await pg.click('.langs button[data-lang="pt"]');
    await pg.waitForTimeout(400);
    ok('FR → clique PT volta à raiz', new URL(pg.url()).pathname === '/', pg.url());
    await ctx.close();
  }

  console.log('\n3. Browser alemão em / : sugere, não redireciona');
  {
    const ctx = await browser.newContext({ locale: 'de-CH' });
    await ctx.addInitScript(() => { localStorage.setItem('pr-consent', 'denied'); sessionStorage.setItem('pr-seen', '1'); });
    const pg = await ctx.newPage();
    await pg.goto(base + '/');
    await pg.waitForTimeout(600);
    ok('NÃO redireciona automaticamente', new URL(pg.url()).pathname === '/', pg.url());
    ok('conteúdo continua português', (await pg.textContent('a[data-i18n="nav.folio"]')).trim() === 'Exemplos');
    ok('mostra a barra de sugestão', await pg.isVisible('.lang-hint'));
    ok('a sugestão aponta para /de/', (await pg.getAttribute('.lang-hint a', 'href')) === '/de/');
    await pg.click('.lang-hint button');
    await pg.waitForTimeout(200);
    ok('a barra fecha-se', !(await pg.isVisible('.lang-hint')));
    await pg.reload();
    await pg.waitForTimeout(500);
    ok('e não volta depois de fechada', !(await pg.isVisible('.lang-hint')));
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ locale: 'de-CH' });
    await ctx.addInitScript(() => { localStorage.setItem('pr-consent', 'denied'); sessionStorage.setItem('pr-seen', '1'); });
    const pg = await ctx.newPage();
    await pg.goto(base + '/de/');
    await pg.waitForTimeout(500);
    ok('em /de/ com browser DE não há sugestão', !(await pg.isVisible('.lang-hint')));
    await ctx.close();
  }

  console.log('\n4. As templates demo continuam a funcionar em /de/');
  {
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => { localStorage.setItem('pr-consent', 'denied'); sessionStorage.setItem('pr-seen', '1'); });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', e => errs.push(String(e)));
    await pg.goto(base + '/de/');
    await pg.waitForTimeout(400);
    await pg.click('.shot[data-tpl="rest"]');
    await pg.waitForSelector('#tplOverlay:not([hidden])');
    await pg.waitForTimeout(400);
    const body = await pg.textContent('#tplBody');
    ok('template abre em /de/', body.length > 200);
    ok('template está em alemão', /Reservieren|Speisekarte|Tisch/i.test(body), body.slice(0, 100));
    const img = await pg.getAttribute('.tm-p .ph img, .t-i-thumb img, #tplBody img', 'src').catch(() => null);
    ok('imagens da template com caminho absoluto', img === null || img.startsWith('/img/') || img.startsWith('http'), String(img));
    await pg.click('#tplClose');
    await pg.waitForTimeout(200);
    ok('template fecha sem erros', errs.length === 0, errs.join(' | '));
    await ctx.close();
  }

  console.log('\n5. Artigos do blog por idioma');
  for (const [lang, expect] of [['de', 'Was kostet eine professionelle Website'], ['fr', 'Combien coûte un site web professionnel'], ['it', 'Quanto costa un sito web professionale']]) {
    const ctx = await browser.newContext();
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', e => errs.push(String(e)));
    await pg.goto(base + '/' + lang + '/preco-site-suica.html');
    await pg.waitForTimeout(300);
    const h1s = await pg.$$eval('h1', els => els.map(e => e.textContent.trim()));
    ok('/' + lang + '/preco-site-suica.html tem 1 h1 traduzido', h1s.length === 1 && h1s[0].startsWith(expect), JSON.stringify(h1s));
    ok('/' + lang + '/ artigo com preço novo', (await pg.content()).includes("4'900") || (await pg.content()).includes('4,900'));
    ok('/' + lang + '/ artigo sem erros JS', errs.length === 0, errs.join(' | '));
    await ctx.close();
  }

  await browser.close();
  srv.close();
  console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
  process.exit(fail ? 1 : 0);
})();
