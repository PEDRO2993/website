// Verificações estáticas do dist/: feed RSS por idioma, links "Ler também", honeypot traduzido, og:url, tabela com scroll.
const { DIST } = require('./_env');
const fs = require('fs');
const path = require('path');
let pass = 0, fail = 0;
function ok(name, cond, extra) { if (cond) { pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); } }
const read = (rel) => fs.readFileSync(path.join(DIST, rel), 'utf8');
const LANGS = ['', 'de/', 'fr/', 'it/', 'en/'];
for (const l of LANGS) {
  const feed = read(l + 'feed.xml');
  ok(l + 'feed.xml com >= 3 itens', (feed.match(/<item>/g) || []).length >= 3);
  ok(l + 'feed.xml sem entidades HTML por escapar', !/&nbsp;|&amp;amp;/.test(feed));
  ok(l + 'blog.html liga ao feed do idioma', read(l + 'blog.html').includes('href="/' + l + 'feed.xml"'));
  for (const a of ['preco-site-suica.html', 'multilingue-valais.html', 'google-business-valais.html']) {
    const h = read(l + a);
    const more = (h.match(/<p class="lg-more">[\s\S]*?<\/p>/) || [''])[0];
    ok(l + a + ': "Ler também" com 3 links', (more.match(/<a /g) || []).length === 3);
    ok(l + a + ': BreadcrumbList + Article', /BreadcrumbList/.test(h) && /"@type":\s*"Article"/.test(h));
    ok(l + a + ': aside CTA presente', /<aside class="cta">/.test(h));
    ok(l + a + ': linha de partilha + script', /<p class="lg-share">/.test(h) && /data-share="wa"\]/.test(h));
  }
  for (const p of ['privacidade.html', 'termos.html', 'informacao-legal.html']) {
    ok(l + p + ': og:url do idioma', read(l + p).includes('property="og:url" content="https://prstudio.ch/' + l + p + '"'));
  }
}
for (const l of LANGS) {
  const lg = l ? l.slice(0, 2) : 'pt';
  ok(l + 'index.html: og:image do idioma', read(l + 'index.html').includes('og:image" content="https://prstudio.ch/img/og/home-' + lg + '.jpg"'));
  ok(l + 'blog.html: ItemList + BreadcrumbList', /"@type":"ItemList"/.test(read(l + 'blog.html')) && /"@type":"BreadcrumbList"/.test(read(l + 'blog.html')));
  ok(l + 'blog.html: og:image do idioma', read(l + 'blog.html').includes('/img/og/blog-' + lg + '.jpg"'));
  for (const a of ['preco-site-suica', 'multilingue-valais', 'google-business-valais', 'site-restaurante-valais', 'manutencao-site', 'fotografia-site-negocio', 'site-hotel-valais']) {
    const h = read(l + a + '.html');
    ok(l + a + ': og:image + alt do idioma', h.includes('/img/og/' + a + '-' + lg + '.jpg"') && /og:image:alt" content="[^"]{10,}"/.test(h));
    ok(l + a + ': imagem OG existe em dist', fs.existsSync(path.join(DIST, 'img/og', a + '-' + lg + '.jpg')));
  }
}
for (const l of LANGS) ok(l + 'index.html: teaser do blog com 3 cartões do idioma', (read(l + 'index.html').match(new RegExp('class="card reveal" href="/' + l + '[a-z-]+\\.html"', 'g')) || []).length === 3);
ok('preco-site-suica: tabela dentro de .lg-tbl-wrap', /<div class="lg-tbl-wrap"[^>]*><table class="lg-tbl">/.test(read('de/preco-site-suica.html')));
const HP = { 'de/': 'Nicht ausfüllen:', 'fr/': 'Ne pas remplir', 'it/': 'Non compilare:', 'en/': 'Do not fill in:' };
for (const [l, t] of Object.entries(HP)) ok(l + 'index.html: honeypot traduzido', read(l + 'index.html').includes(t));
for (const l of LANGS) {
  const h = read(l + "index.html");
  const faq = JSON.parse((h.match(/<script type="application\/ld\+json">\s*(\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?\})\s*<\/script>/) || [])[1] || "{}");
  ok(l + "index.html: FAQPage com 9 perguntas", faq.mainEntity && faq.mainEntity.length === 9);
  ok(l + "index.html: dica de idioma antes do header", h.indexOf("LANG_HINT") > 0 && h.indexOf("LANG_HINT") < h.indexOf("<header"));
}
console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
process.exit(fail ? 1 : 0);
