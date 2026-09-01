'use strict';
// Build-time: lê posts publicados (PostgREST, chave anon; RLS só expõe 'published')
// e renderiza páginas estáticas com o mesmo esqueleto dos artigos existentes.
// Sem env → devolve [] e o build continua sem artigos da BD.

const SB = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;

const HTML_LANG = { pt: 'pt-PT', de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en' };
const UI = {
  pt: { back: 'Voltar ao site', blog: 'Blog', read: 'Ler artigo →' },
  de: { back: 'Zurück zur Website', blog: 'Blog', read: 'Artikel lesen →' },
  fr: { back: 'Retour au site', blog: 'Blog', read: "Lire l'article →" },
  it: { back: 'Torna al sito', blog: 'Blog', read: 'Leggi l’articolo →' },
  en: { back: 'Back to site', blog: 'Blog', read: 'Read article →' },
};

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (iso, lang) => new Date(iso).toLocaleDateString(HTML_LANG[lang], { day: 'numeric', month: 'long', year: 'numeric' });

async function fetchPosts() {
  if (!SB || !KEY) { console.warn('  (posts) SUPABASE_URL/SUPABASE_ANON_KEY ausentes — sem artigos da BD'); return []; }
  const url = `${SB}/rest/v1/posts?status=eq.published&select=slug,lang,title,description,body_html,published_at,updated_at&order=published_at.desc`;
  const r = await fetch(url, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!r.ok) throw new Error(`posts: ${r.status} ${await r.text()}`);
  return r.json();
}

// caminho público de um post
const pathFor = (PREFIX, lang, slug) => `${PREFIX[lang]}blog/${slug}.html`;

// página completa de um post
function renderPost(p, langsForSlug, { ORIGIN, PREFIX }) {
  const self = ORIGIN + pathFor(PREFIX, p.lang, p.slug);
  const alts = langsForSlug.map(l => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${pathFor(PREFIX, l, p.slug)}">`);
  const xdef = langsForSlug.includes('pt') ? 'pt' : langsForSlug[0];
  alts.push(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}${pathFor(PREFIX, xdef, p.slug)}">`);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: p.title, description: p.description, inLanguage: HTML_LANG[p.lang],
    author: { '@type': 'Person', name: 'Pedro Ribeiro' },
    publisher: { '@type': 'Organization', name: 'PR Studio', logo: { '@type': 'ImageObject', url: `${ORIGIN}/img/icon-512.png` } },
    mainEntityOfPage: self, datePublished: p.published_at, dateModified: p.updated_at, image: `${ORIGIN}/og.png`,
  };
  const ui = UI[p.lang];
  return `<!doctype html>
<html lang="${HTML_LANG[p.lang]}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)} — PR Studio</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${self}">
${alts.join('\n')}
<meta property="og:type" content="article"><meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${self}">
<meta property="og:image" content="${ORIGIN}/og.png"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
:root{--bg:#04060B;--ink:#F2F6FE;--ink-2:#8A97AF;--ink-3:#75829D;--line:rgba(160,190,255,.14);--red:#2E6BFF;--red-ink:#6FA0FF}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:1rem/1.6 "Instrument Sans",system-ui,sans-serif}
a{color:var(--red-ink)}.wrap{max-width:760px;margin:0 auto;padding:0 20px}
header{display:flex;justify-content:space-between;align-items:center;padding:22px 0;border-bottom:1px solid var(--line)}
.logo{font-weight:600;text-decoration:none;color:var(--ink)}.logo b{color:var(--red)}
main{padding:40px 0 60px}h1{font-size:2rem;line-height:1.15;margin:0 0 6px}h2{font-size:1.2rem;margin:34px 0 10px}
main p,main li{color:var(--ink-2)}.date{font:.78rem ui-monospace,monospace;color:var(--ink-3);margin-bottom:28px}
footer{border-top:1px solid var(--line);padding:24px 0 40px;font-size:.86rem;display:flex;gap:16px;flex-wrap:wrap}footer a{text-decoration:none;color:var(--ink-2)}
</style>
</head>
<body>
<div class="wrap">
  <header><a class="logo" href="${PREFIX[p.lang]}">PR<b>.</b></a><a href="${PREFIX[p.lang]}blog.html">${ui.blog}</a></header>
  <main>
    <h1>${esc(p.title)}</h1>
    <p class="date">${esc(fmtDate(p.published_at, p.lang))}</p>
    ${p.body_html}
  </main>
  <footer><a href="${PREFIX[p.lang]}">${ui.back}</a><a href="${PREFIX[p.lang]}blog.html">${ui.blog}</a></footer>
</div>
</body>
</html>
`;
}

// cartão para a listagem blog.html
function renderCard(p, { PREFIX }) {
  return `<a class="blog-card" href="${pathFor(PREFIX, p.lang, p.slug)}"><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><span>${UI[p.lang].read}</span></a>`;
}

module.exports = { fetchPosts, renderPost, renderCard, pathFor };
