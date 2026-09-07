// Gera as imagens OG (img/og/<página>-<lang>.jpg e og.png) no mundo actual do site:
// grafite #151B23, tinta #E9EEF3, um só acento azul-gelo #3FAEFF, Archivo variável
// alojada no próprio repo, zero raio, réguas de 1px, a marca PR. e o título grande e apertado.
// Correr depois de criar/renomear um artigo: cd tests && node og_gen.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ARCHIVO = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'fonts/archivo-latin-wdth-wght-normal.woff2')).toString('base64');
const FILES = ['preco-site-suica', 'multilingue-valais', 'google-business-valais', 'site-restaurante-valais', 'manutencao-site', 'fotografia-site-negocio', 'site-hotel-valais', 'caso-hotel-alpina', 'auditoria-site-valais'];
const LANGS = ['pt', 'de', 'fr', 'it', 'en'];
const FOOT = { pt: 'prstudio.ch — Stalden · Valais · Suíça', de: 'prstudio.ch — Stalden · Wallis · Schweiz', fr: 'prstudio.ch — Stalden · Valais · Suisse', it: 'prstudio.ch — Stalden · Vallese · Svizzera', en: 'prstudio.ch — Stalden · Valais · Switzerland' };
/* placa de reserva (og.png): serve páginas legais em cinco idiomas, por isso não leva frase traduzida */
const NEUTRAL_FOOT = 'prstudio.ch — Stalden · Valais · CH';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let warned = 0;

/* ---------- a folha ---------- */
/* um só registo tipográfico por posição: a marca PR. no cabeçalho, o título na placa,
   e — quando existe — uma frase de apoio por baixo dele. Sem rótulo no canto. */
const page = ({ lang, title, sub }) => `<!doctype html><html lang="${lang || 'en'}"><head><meta charset="utf-8"><style>
@font-face { font-family: "Archivo"; font-style: normal; font-weight: 100 900; font-stretch: 62% 125%;
  src: url(${ARCHIVO}) format("woff2-variations"), url(${ARCHIVO}) format("woff2"); }
:root { --paper:#151B23; --ink:#E9EEF3; --ink-2:#AAB5C1; --ink-3:#7E8A97; --rule:#243240; --red:#3FAEFF; }
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1200px; height:630px; background:var(--paper); color:var(--ink);
  font-family:"Archivo","Helvetica Neue",Arial,sans-serif; font-weight:400; font-variation-settings:"wdth" 100;
  -webkit-font-smoothing:antialiased; overflow:hidden; }
.card { width:1200px; height:630px; display:flex; flex-direction:column; padding:54px 64px 46px; }
/* cabeçalho: só a marca PR. e a régua de 1px por baixo (como o header do site) */
.head { display:flex; align-items:baseline; padding-bottom:24px; border-bottom:1px solid var(--ink); }
.logo { font-weight:800; font-size:46px; line-height:1; letter-spacing:-0.04em; font-variation-settings:"wdth" 118; }
.logo i { color:var(--red); font-style:normal; }
/* corpo: a rota azul-gelo desce da marca, o título encosta-lhe */
.body { flex:1 1 auto; min-height:0; position:relative; display:flex; align-items:center; padding:36px 0 36px 42px; }
.route { position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--red); }
.stack { width:100%; min-width:0; }
h1 { font-weight:800; font-size:70px; line-height:0.95; letter-spacing:-0.035em;
  font-variation-settings:"wdth" 112; text-wrap:pretty; }
.sub { margin-top:24px; color:var(--ink-2); font-size:26px; line-height:1.36; letter-spacing:-0.012em;
  max-width:52ch; text-wrap:pretty; }
/* rodapé: régua fina e a linha do lugar */
.foot { padding-top:22px; border-top:1px solid var(--rule); color:var(--ink-3); font-weight:500; font-size:21px; line-height:1; }
</style></head><body><div class="card">
<div class="head"><div class="logo">PR<i>.</i></div></div>
<div class="body"><div class="route"></div><div class="stack"><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div></div>
<div class="foot">${esc(FOOT[lang] || NEUTRAL_FOOT)}</div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch({ executablePath: require('./_env').CHROME });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  fs.mkdirSync(path.join(ROOT, 'img/og'), { recursive: true });

  async function render(lang, title, out, sub, hMax) {
    if (!title) { console.error('!! sem título:', path.basename(out)); warned++; title = 'PR Studio'; }
    await p.setContent(page({ lang, title, sub }), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    /* ajusta a pilha inteira à caixa: o título encolhe se o alemão/francês longos não couberem
       e cresce (até 104px) quando é curto; depois a frase de apoio cresce para o espaço que sobra,
       de modo que nenhuma placa fique meia vazia e nada seja cortado */
    const fit = await p.evaluate((H_MAX) => {
      const h = document.querySelector('h1'), sub = document.querySelector('.sub');
      const stack = document.querySelector('.stack'), box = document.querySelector('.body');
      const room = box.clientHeight - 72; const H_MIN = 30, S_MIN = 26;
      let s = 70, ss = S_MIN;
      const setH = (v) => { h.style.fontSize = (s = v) + 'px'; };
      const setS = (v) => { sub.style.fontSize = (ss = v) + 'px'; };
      const over = () => stack.offsetHeight > room || h.scrollWidth > h.clientWidth + 1
        || (sub && sub.scrollWidth > sub.clientWidth + 1);
      if (sub) setS(S_MIN);
      setH(s);
      if (over()) { while (s > H_MIN && over()) setH(s - 1); }
      else { while (s < H_MAX) { setH(s + 1); if (over()) { setH(s - 1); break; } } }
      if (sub) { const cap = Math.round(s * 0.5); while (ss < cap) { setS(ss + 1); if (over()) { setS(ss - 1); break; } } }
      return { size: s, sub: sub ? ss : 0, h: stack.offsetHeight, room, clipped: over() };
    }, hMax || 104);
    await p.waitForTimeout(60);
    await p.screenshot({ path: out, type: out.endsWith('.png') ? 'png' : 'jpeg', quality: out.endsWith('.png') ? undefined : 88 });
    const ok = await p.evaluate(() => document.fonts.check('800 40px Archivo') && document.fonts.check('400 20px Archivo'));
    if (!ok || fit.clipped) warned++;
    console.log(path.basename(out).padEnd(32), String(fs.statSync(out).size).padStart(6) + ' B',
      'h1=' + String(fit.size).padStart(3), 'sub=' + String(fit.sub).padStart(2),
      String(fit.h).padStart(3) + '/' + fit.room, 'font=' + ok, fit.clipped ? 'CLIPPED' : '');
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
    const sub = ((block.match(/<p class="lg-sub">([^<]*)/) || [])[1] || '').replace(/&amp;/g, '&').trim();
    if (!sub) { console.error('!! sem .lg-sub em blog.html:', lang); warned++; }
    await render(lang, h1, path.join(ROOT, 'img/og', 'blog-' + lang + '.jpg'), sub);
  }

  /* homepage: tagline do rodapé (ft.tag) por idioma — "frase — promessa" */
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const tags = { pt: (idx.match(/data-i18n="ft\.tag">([^<]*)/) || [])[1] };
  const dictOrder = ['de', 'en', 'fr', 'it']; let di = 0;
  for (const m of idx.matchAll(/"ft\.tag": "([^"]*)"/g)) tags[dictOrder[di++]] = m[1];
  for (const lang of LANGS) {
    const [t, e] = String(tags[lang] || '').trim().split(' — ');
    await render(lang, (t || '').trim(), path.join(ROOT, 'img/og', 'home-' + lang + '.jpg'), (e || '').trim());
  }

  /* og.png: placa de reserva das páginas legais (e do 404) — sem frase traduzida */
  await render(null, 'PR Studio', path.join(ROOT, 'og.png'), '', 200);

  await b.close();
  if (warned) { console.error('\n' + warned + ' aviso(s) — ver acima.'); process.exit(1); }
  console.log('\nOK — todas as imagens geradas sem cortes.');
})();
