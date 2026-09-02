const { ROOT, DIST, DISTURL, CHROME } = require('./_env');
const { chromium } = require('playwright');
const http = require('http'); const fs = require('fs'); const path = require('path');
const SITE=DIST;
let pass=0, fail=0;
const ok=(n,c,e)=>{ if(c){pass++;console.log('  ✓ '+n);} else {fail++;console.log('  ✗ '+n+(e?' — '+e:''));} };
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
function serve(){return new Promise(r=>{const s=http.createServer((q,p)=>{let u=decodeURIComponent(q.url.split('?')[0]); if(u.endsWith('/'))u+='index.html';
 fs.readFile(path.join(SITE,u),(e,d)=>{if(e){p.writeHead(404);p.end();return;} p.writeHead(200,{'Content-Type':MIME[path.extname(u)]||'application/octet-stream'});p.end(d);});});s.listen(0,()=>r(s));});}

const EXP = {
 '/':    { eyebrow:'Trabalho recente',  badge:'Website', p1:'Hotel Alpina · Grächen' },
 '/de/': { eyebrow:'Aktuelle Arbeiten', badge:'Website', p1:'Hotel Alpina · Grächen' },
 '/fr/': { eyebrow:'Travaux récents',   badge:'Site web', p1:'Hôtel Alpina · Grächen' },
 '/it/': { eyebrow:'Lavori recenti',    badge:'Sito web', p1:'Hotel Alpina · Grächen' },
 '/en/': { eyebrow:'Recent work',       badge:'Website', p1:'Hotel Alpina · Grächen' },
};

(async()=>{
 const srv=await serve(); const base='http://127.0.0.1:'+srv.address().port;
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});

 console.log('1. Secção presente e traduzida em cada idioma');
 for (const [url,exp] of Object.entries(EXP)) {
   const ctx=await b.newContext({locale:'pt-PT'});
   await ctx.addInitScript(()=>{localStorage.setItem('pr-consent','denied');sessionStorage.setItem('pr-seen','1');});
   const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
   await pg.goto(base+url); await pg.waitForTimeout(400);
   ok(url+' secção #trabalho existe', await pg.locator('#trabalho').count()===1);
   ok(url+' eyebrow traduzida', (await pg.textContent('#trabalho .eyebrow')).trim()===exp.eyebrow, await pg.textContent('#trabalho .eyebrow'));
   ok(url+' selo traduzido', (await pg.locator('#trabalho .tw-badge').first().textContent()).trim()===exp.badge);
   ok(url+' nome do projeto', (await pg.locator('#trabalho .tw-card h3').first().textContent()).trim()===exp.p1);
   ok(url+' 2 maquetas', await pg.locator('#trabalho .tw-mock').count()===2);
   ok(url+' 2 selos', await pg.locator('#trabalho .tw-badge').count()===2);
   ok(url+' sem erros JS', errs.length===0, errs.join(' | '));
   await ctx.close();
 }

 console.log('\n2. Honestidade: nada apresentado como trabalho de cliente');
 {
   const ctx=await b.newContext({locale:'pt-PT'});
   await ctx.addInitScript(()=>{localStorage.setItem('pr-consent','denied');sessionStorage.setItem('pr-seen','1');});
   const pg=await ctx.newPage(); await pg.goto(base+'/'); await pg.waitForTimeout(400);
   const txt=await pg.textContent('#trabalho');
   ok('a nota não afirma contratação nem pagamento', !/contratou|pagou|de graça|ofereci/.test(txt));
   ok('a nota diz que os negócios são reais e o trabalho é do Pedro', /Negócios reais do Alto Valais; o trabalho é meu/.test(txt));
   ok('nenhum uso da palavra "cliente" como afirmação', !/nossos clientes|meus clientes/i.test(txt));
   const de=await b.newContext(); const p2=await de.newPage();
   await p2.goto(base+'/de/'); await p2.waitForTimeout(300);
   const dtxt=await p2.textContent('#trabalho');
   ok('DE: sem afirmações sobre encomenda/pagamento', !/nicht beauftragt|verschenkt|bezahlt/.test(dtxt));
   ok('DE: sem afirmações sobre Kundenarbeit/Auftrag', !/Kundenarbeit|Auftrag|verschenkt/.test(dtxt));
   await de.close(); await ctx.close();
 }

 console.log('\n3. Acessibilidade dos mockups');
 {
   const ctx=await b.newContext({locale:'pt-PT'});
   await ctx.addInitScript(()=>{localStorage.setItem('pr-consent','denied');sessionStorage.setItem('pr-seen','1');});
   const pg=await ctx.newPage(); await pg.goto(base+'/'); await pg.waitForTimeout(400);
   const labels=await pg.$$eval('#trabalho .tw-mock',els=>els.map(e=>({r:e.getAttribute('role'),a:e.getAttribute('aria-label'),tag:e.tagName})));
   ok('todos os mockups têm role=img ou são ligações com aria-label', labels.every(l=>l.r==='img'||l.tag==='A'));
   ok('todos têm aria-label descritivo', labels.every(l=>l.a&&l.a.length>25), JSON.stringify(labels.map(l=>l.a&&l.a.length)));
   await ctx.close();
 }

 console.log('\n4. Layout mobile sem overflow horizontal');
 {
   const ctx=await b.newContext({viewport:{width:375,height:800},locale:'pt-PT'});
   await ctx.addInitScript(()=>{localStorage.setItem('pr-consent','denied');sessionStorage.setItem('pr-seen','1');});
   const pg=await ctx.newPage(); await pg.goto(base+'/'); await pg.waitForTimeout(400);
   const over=await pg.evaluate(()=>{const s=document.getElementById('trabalho');
     return {doc:document.documentElement.scrollWidth, win:window.innerWidth, sec:s.scrollWidth};});
   ok('sem scroll horizontal na página', over.doc<=over.win+1, JSON.stringify(over));
   ok('a secção cabe no ecrã', over.sec<=over.win+1, JSON.stringify(over));
   const cards=await pg.$$eval('#trabalho .tw-mock',els=>els.map(e=>Math.round(e.getBoundingClientRect().width)));
   ok('cards em coluna única', cards.every(w=>w>250), JSON.stringify(cards));
   await ctx.close();
 }

 await b.close(); srv.close();
 console.log('\nResultado: '+pass+' passaram, '+fail+' falharam');
 process.exit(fail?1:0);
})();
