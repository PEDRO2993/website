// Gera as imagens OG dos artigos fixos (img/og/<página>-<lang>.jpg). Correr depois de criar/renomear um artigo: node og_gen.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), F = path.join(__dirname, 'node_modules/@fontsource');
const font = (p) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(F, p)).toString('base64');
const FILES = ['preco-site-suica', 'multilingue-valais', 'google-business-valais'];
const EYE = { pt: 'BLOG · PR STUDIO', de: 'BLOG · PR STUDIO', fr: 'BLOG · PR STUDIO', it: 'BLOG · PR STUDIO', en: 'BLOG · PR STUDIO' };
const FOOT = { pt: 'prstudio.ch — Stalden · Valais · Suíça', de: 'prstudio.ch — Stalden · Wallis · Schweiz', fr: 'prstudio.ch — Stalden · Valais · Suisse', it: 'prstudio.ch — Stalden · Vallese · Svizzera', en: 'prstudio.ch — Stalden · Valais · Switzerland' };
(async () => {
  const b = await chromium.launch({ executablePath: require('./_env').CHROME });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  fs.mkdirSync(path.join(ROOT, 'img/og'), { recursive: true });
  for (const f of FILES) {
    const src = fs.readFileSync(path.join(ROOT, f + '.html'), 'utf8');
    for (const lang of ['pt', 'de', 'fr', 'it', 'en']) {
      const title = ((src.match(new RegExp('<div class="i18n-doc" data-lang="' + lang + '"><h1>([^<]*)</h1>')) || [])[1] || '').replace(/&amp;/g, '&');
      await render(lang, title, path.join(ROOT, 'img/og', f + '-' + lang + '.jpg'));
    }
  }
  async function render(lang, title, out) {
    {
      const size = title.length > 70 ? 54 : title.length > 55 ? 60 : 66;
      const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:B;src:url(${font('bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2')}) format('woff2');font-weight:700}
@font-face{font-family:B;src:url(${font('bricolage-grotesque/files/bricolage-grotesque-latin-ext-700-normal.woff2')}) format('woff2');font-weight:700;unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:I;src:url(${font('instrument-sans/files/instrument-sans-latin-500-normal.woff2')}) format('woff2');font-weight:500}
@font-face{font-family:I;src:url(${font('instrument-sans/files/instrument-sans-latin-ext-500-normal.woff2')}) format('woff2');font-weight:500;unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:M;src:url(${font('spline-sans-mono/files/spline-sans-mono-latin-500-normal.woff2')}) format('woff2');font-weight:500}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#04060B;color:#F2F6FE;font-family:I,sans-serif;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(160,190,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(160,190,255,.07) 1px,transparent 1px);background-size:60px 60px}
.glow{position:absolute;right:-180px;bottom:-260px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(46,107,255,.42),rgba(46,107,255,0) 62%)}
.glow2{position:absolute;left:-200px;top:-260px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(46,107,255,.16),rgba(46,107,255,0) 62%)}
.in{position:absolute;inset:0;padding:74px 90px 70px;display:flex;flex-direction:column;justify-content:space-between}
.logo{font-family:B;font-weight:700;font-size:44px;letter-spacing:.06em}.logo i{color:#2E6BFF;font-style:normal}
.eye{font-family:M;font-size:20px;letter-spacing:.22em;color:#6FA0FF;margin-top:22px}
h1{font-family:B;font-weight:700;font-size:${size}px;line-height:1.08;letter-spacing:-.02em;max-width:980px;text-wrap:balance;margin-top:22px}
.bar{width:220px;height:4px;background:linear-gradient(90deg,#2257E8,#4D8DFF);border-radius:2px;margin:26px 0 0}
.foot{font-size:24px;color:#8A97AF;font-weight:500}
</style></head><body><div class="grid"></div><div class="glow2"></div><div class="glow"></div><div class="in"><div><div class="logo">PR<i>.</i></div><div class="eye">${EYE[lang]}</div><h1>${title.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</h1><div class="bar"></div></div><div class="foot">${FOOT[lang]}</div></div></body></html>`;
      await p.setContent(html, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(80);
      await p.screenshot({ path: out, type: 'jpeg', quality: 84 });
      console.log(path.basename(out), fs.statSync(out).size, 'B', 'fonts=' + await p.evaluate(() => document.fonts.check('700 20px B') && document.fonts.check('500 20px I')));
    }
  }
  /* blog.html: imagem por idioma com a frase de introdução (.lg-sub) */
  const blogSrc = fs.readFileSync(path.join(ROOT, "blog.html"), "utf8");
  for (const lang of ["pt", "de", "fr", "it", "en"]) {
    const t = ((blogSrc.match(new RegExp('<div class="i18n-doc" data-lang="' + lang + '">[\\s\\S]*?<p class="lg-sub">([^<]*)')) || [])[1] || "Blog").replace(/\.$/, "");
    await render(lang, t, path.join(ROOT, "img/og", "blog-" + lang + ".jpg"));
  }
  await b.close();
})();
