// Gera as imagens OG (img/og/<página>-<lang>.jpg) no mundo actual do site:
// grafite #151B23, tinta #E9EEF3, um só acento azul-gelo #3FAEFF, Archivo variável
// alojada no próprio repo, zero raio, réguas de 1px, a marca PR. e o título grande e apertado.
// Correr depois de criar/renomear um artigo: cd tests && node og_gen.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ARCHIVO = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'fonts/archivo-latin-wdth-wght-normal.woff2')).toString('base64');
const FILES = ['preco-site-suica', 'multilingue-valais', 'google-business-valais', 'site-restaurante-valais', 'manutencao-site', 'fotografia-site-negocio', 'site-hotel-valais', 'caso-hotel-alpina'];
const LANGS = ['pt', 'de', 'fr', 'it', 'en'];
/* rótulo do canto superior direito: "Blog" é a palavra usada nos cinco idiomas (ver blog.html) */
const EYE = { pt: 'Blog', de: 'Blog', fr: 'Blog', it: 'Blog', en: 'Blog' };
const FOOT = { pt: 'prstudio.ch — Stalden · Valais · Suíça', de: 'prstudio.ch — Stalden · Wallis · Schweiz', fr: 'prstudio.ch — Stalden · Valais · Suisse', it: 'prstudio.ch — Stalden · Vallese · Svizzera', en: 'prstudio.ch — Stalden · Valais · Switzerland' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let warned = 0;

/* ---------- a folha ---------- */
const page = ({ lang, title, sub, eyebrow }) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
@font-face { font-family: "Archivo"; font-style: normal; font-weight: 100 900; font-stretch: 62% 125%;
  src: url(${ARCHIVO}) format("woff2-variations"), url(${ARCHIVO}) format("woff2"); }
:root { --paper:#151B23; --ink:#E9EEF3; --ink-2:#AAB5C1; --ink-3:#7E8A97; --rule:#243240; --red:#3FAEFF; }
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1200px; height:630px; background:var(--paper); color:var(--ink);
  font-family:"Archivo","Helvetica Neue",Arial,sans-serif; font-weight:400; font-variation-settings:"wdth" 100;
  -webkit-font-smoothing:antialiased; overflow:hidden; }
.card { width:1200px; height:630px; display:flex; flex-direction:column; padding:54px 64px 46px; }
/* cabeçalho: marca PR. à esquerda, rótulo à direita, régua de 1px por baixo (como o header do site) */
.head { display:flex; align-items:baseline; justify-content:space-between; gap:32px;
  padding-bottom:24px; border-bottom:1px solid var(--ink); }
.logo { font-weight:800; font-size:46px; line-height:1; letter-spacing:-0.04em; font-variation-settings:"wdth" 118; }
.logo i { color:var(--red); font-style:normal; }
.eye { font-weight:600; font-size:21px; line-height:1; color:var(--ink-2); text-align:right; }
/* corpo: a rota azul-gelo desce da marca, o título encosta-lhe */
.body { flex:1 1 auto; min-height:0; position:relative; display:flex; align-items:center; padding:36px 0 36px 42px; }
.route { position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--red); }
.stack { width:100%; min-width:0; }
h1 { font-weight:800; font-size:70px; line-height:0.95; letter-spacing:-0.035em;
  font-variation-settings:"wdth" 112; text-wrap:pretty; }
.sub { margin-top:24px; color:var(--ink-2); font-size:26px; line-height:1.45; max-width:60ch; text-wrap:pretty; }
/* rodapé: régua fina e a linha do lugar */
.foot { padding-top:22px; border-top:1px solid var(--rule); color:var(--ink-3); font-weight:500; font-size:21px; line-height:1; }
</style></head><body><div class="card">
<div class="head"><div class="logo">PR<i>.</i></div><div class="eye">${esc(eyebrow)}</div></div>
<div class="body"><div class="route"></div><div class="stack"><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div></div>
<div class="foot">${esc(FOOT[lang])}</div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch({ executablePath: require('./_env').CHROME });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  fs.mkdirSync(path.join(ROOT, 'img/og'), { recursive: true });

  async function render(lang, title, out, eyebrow, sub) {
    if (!title) { console.error('!! sem título:', path.basename(out)); warned++; title = 'PR Studio'; }
    await p.setContent(page({ lang, title, sub, eyebrow: eyebrow === undefined ? EYE[lang] : eyebrow }), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    /* ajusta o corpo do título à caixa: encolhe se o alemão/francês longos não couberem,
       cresce (até 104px) quando o título é curto — nenhum é cortado, todos ocupam a placa */
    const fit = await p.evaluate(() => {
      const h = document.querySelector('h1'), stack = document.querySelector('.stack'), box = document.querySelector('.body');
      const room = box.clientHeight - 72; const MIN = 30, MAX = 104; let s = 70;
      const set = (v) => { h.style.fontSize = v + 'px'; };
      const over = () => stack.offsetHeight > room || h.scrollWidth > h.clientWidth + 1;
      set(s);
      if (over()) { while (s > MIN && over()) set(--s); }
      else { while (s < MAX) { set(s + 1); if (over()) { set(s); break; } s++; } }
      return { size: s, h: stack.offsetHeight, room, clipped: over() };
    });
    await p.waitForTimeout(60);
    await p.screenshot({ path: out, type: 'jpeg', quality: 88 });
    const ok = await p.evaluate(() => document.fonts.check('800 40px Archivo') && document.fonts.check('400 20px Archivo'));
    if (!ok || fit.clipped) warned++;
    console.log(path.basename(out).padEnd(32), String(fs.statSync(out).size).padStart(6) + ' B',
      'fs=' + String(fit.size).padStart(2), fit.h + '/' + fit.room, 'font=' + ok, fit.clipped ? 'CLIPPED' : '');
  }

  /* artigos: o <h1> de cada bloco i18n-doc */
  for (const f of FILES) {
    const src = fs.readFileSync(path.join(ROOT, f + '.html'), 'utf8');
    for (const lang of LANGS) {
      const title = ((src.match(new RegExp('<div class="i18n-doc" data-lang="' + lang + '"><h1>([^<]*)</h1>')) || [])[1] || '').replace(/&amp;/g, '&');
      await render(lang, title, path.join(ROOT, 'img/og', f + '-' + lang + '.jpg'));
    }
  }

  /* blog.html: título "Blog" e a frase de introdução (.lg-sub) por baixo, como na página */
  const blogSrc = fs.readFileSync(path.join(ROOT, 'blog.html'), 'utf8');
  for (const lang of LANGS) {
    const block = (blogSrc.match(new RegExp('<div class="i18n-doc" data-lang="' + lang + '">([\\s\\S]*?)</div>')) || [])[1] || '';
    const h1 = ((block.match(/<h1>([^<]*)<\/h1>/) || [])[1] || 'Blog').replace(/&amp;/g, '&');
    const sub = ((block.match(/<p class="lg-sub">([^<]*)/) || [])[1] || '').replace(/&amp;/g, '&');
    if (!sub) { console.error('!! sem .lg-sub em blog.html:', lang); warned++; }
    /* sem rótulo no canto: aqui o próprio título é "Blog" */
    await render(lang, h1, path.join(ROOT, 'img/og', 'blog-' + lang + '.jpg'), '', sub);
  }

  /* homepage: tagline do rodapé (ft.tag) por idioma — "frase — rótulo" */
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const tags = { pt: (idx.match(/data-i18n="ft\.tag">([^<]*)/) || [])[1] };
  const dictOrder = ['de', 'en', 'fr', 'it']; let di = 0;
  for (const m of idx.matchAll(/"ft\.tag": "([^"]*)"/g)) tags[dictOrder[di++]] = m[1];
  for (const lang of LANGS) {
    const [t, e] = String(tags[lang] || '').split(' — ');
    await render(lang, t, path.join(ROOT, 'img/og', 'home-' + lang + '.jpg'), (e || '').replace(/\.$/, ''));
  }

  await b.close();
  if (warned) { console.error('\n' + warned + ' aviso(s) — ver acima.'); process.exit(1); }
  console.log('\nOK — todas as imagens geradas sem cortes.');
})();
