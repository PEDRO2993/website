// Rastreio de leads: cliques em WhatsApp/telefone/email e CTAs registam origem, sem erros JS.
const { DIST, CHROME } = require('./_env');
const { chromium } = require('playwright');
const http = require('http'); const fs = require('fs'); const path = require('path');
let pass = 0, fail = 0;
const ok = (n, c, e) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n + (e ? ' — ' + e : '')); } };
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
function serve() { return new Promise((r) => { const s = http.createServer((q, p) => { let u = decodeURIComponent(q.url.split('?')[0]); if (u.endsWith('/')) u += 'index.html';
  fs.readFile(path.join(DIST, u), (e, d) => { if (e) { p.writeHead(404); p.end(); return; } p.writeHead(200, { 'Content-Type': MIME[path.extname(u)] || 'application/octet-stream' }); p.end(d); }); }); s.listen(0, () => r(s)); }); }

(async () => {
  const srv = await serve(); const base = 'http://127.0.0.1:' + srv.address().port;
  const b = await chromium.launch({ executablePath: CHROME });
  const ctx = await b.newContext({ locale: 'pt-PT' });
  await ctx.addInitScript(() => { localStorage.setItem('pr-consent', 'denied'); sessionStorage.setItem('pr-seen', '1'); });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', (e) => errs.push(String(e)));
  await pg.route('https://wa.me/**', (r) => r.abort());
  await pg.goto(base + '/'); await pg.waitForTimeout(500);

  // 1) WhatsApp do hero
  await pg.evaluate(() => document.querySelector('.hero a[href^="https://wa.me"]').click());
  // 2) CTA para #contacto (faixa de vendas)
  await pg.evaluate(() => document.querySelector('.cta-band a[href="#contacto"]').click());
  // 3) email e telefone do rodapé/contacto
  await pg.evaluate(() => { const m = document.querySelector('a[href^="mailto:"]'); if (m) { m.removeAttribute('href'); m.setAttribute('href', 'mailto:x@y.ch'); } });
  await pg.evaluate(() => { const a = document.querySelector('a[href^="mailto:"]'); a.addEventListener('click', (e) => e.preventDefault(), true); a.click(); });
  const tel = await pg.$('a[href^="tel:"]');
  if (tel) await pg.evaluate(() => { const a = document.querySelector('a[href^="tel:"]'); a.addEventListener('click', (e) => e.preventDefault(), true); a.click(); });

  const leads = await pg.evaluate(() => window.__leads || []);
  const ctas = await pg.evaluate(() => window.__ctas || []);
  ok('clique no WhatsApp regista um lead', leads.some((l) => l.method === 'whatsapp'), JSON.stringify(leads));
  ok('o lead do hero traz a origem "hero"', leads.some((l) => l.method === 'whatsapp' && /hero/.test(l.source)), JSON.stringify(leads));
  ok('o lead traz o idioma', leads.every((l) => typeof l.lang === 'string' && l.lang.length === 2), JSON.stringify(leads));
  ok('clique em email regista um lead', leads.some((l) => l.method === 'email'), JSON.stringify(leads));
  ok('CTA para #contacto regista cta_click', ctas.length >= 1, JSON.stringify(ctas));
  ok('sem erros JS', errs.length === 0, errs.join(' | '));

  // 4) envio do formulário → lead "formulario"
  await pg.route('**/', (r) => (r.request().method() === 'POST' ? r.fulfill({ status: 200, body: 'ok' }) : r.continue()));
  await pg.fill('#f-name', 'Teste'); await pg.fill('#f-mail', 'a@b.ch'); await pg.fill('#f-msg', 'olá');
  await pg.click('#contactForm button[type="submit"]'); await pg.waitForTimeout(900);
  const leads2 = await pg.evaluate(() => window.__leads || []);
  ok('envio do formulário regista lead "formulario"', leads2.some((l) => l.method === 'formulario' && l.source === 'contacto'), JSON.stringify(leads2));

  await ctx.close(); await b.close(); srv.close();
  console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
