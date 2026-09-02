const { ROOT, DIST, DISTURL, CHROME } = require('./_env');
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ executablePath: CHROME });
  const pages = ['index.html','de/index.html','fr/index.html','blog.html','de/preco-site-suica.html','fr/multilingue-valais.html','it/google-business-valais.html','en/site-restaurante-valais.html','fr/manutencao-site.html','de/site-hotel-valais.html','de/fotografia-site-negocio.html','privacidade.html'];
  const out = [];
  for (const pg of pages) for (const w of [320, 430, 768, 1024, 1280, 1920]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, locale: 'pt-PT' });
    const errs=[]; p.on('pageerror', e => errs.push(e.message));
    await p.goto(DISTURL + '/' + pg); await p.waitForTimeout(400);
    const r = await p.evaluate(() => { const sw=document.documentElement.scrollWidth, iw=innerWidth; let wide=null; if(sw>iw){ for(const el of document.querySelectorAll('body *')){ const rc=el.getBoundingClientRect(); if(rc.right>iw+1 && rc.width>20){ wide=el.tagName+'.'+(el.className||'').toString().slice(0,30); break; } } } return {sw,iw,wide}; });
    if (r.sw > r.iw || errs.length) out.push(pg+'@'+w+' '+JSON.stringify(r)+' '+errs.join(';'));
    await p.close(); }
  await b.close(); console.log(out.length ? out.join('\n') : 'sem overflow nem erros JS em '+pages.length+' páginas × 6 larguras'); })();
