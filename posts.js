'use strict';
// Build-time: lê posts publicados (PostgREST, chave anon; RLS só expõe 'published')
// e renderiza páginas estáticas com o mesmo esqueleto dos artigos existentes.
// Sem env → devolve [] e o build continua sem artigos da BD.

const SB = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;

const LANGS = ['pt', 'de', 'fr', 'it', 'en'];
const HTML_LANG = { pt: 'pt-PT', de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en' };
const UI = {
  pt: { back: 'Voltar ao site', blog: 'Blog', read: 'Ler artigo →', more: 'Mais artigos', cta: 'Queres um site assim para o teu negócio?', ctaSub: 'Avaliação gratuita e sem compromisso, em 48 horas.', ctaBtn: 'Falar comigo', prices: 'Ver preços', wa: 'Olá Pedro! Li o artigo "%s" e gostava de falar sobre o meu projeto.', feed: 'Artigos — PR Studio' },
  de: { back: 'Zurück zur Website', blog: 'Blog', read: 'Artikel lesen →', more: 'Weitere Artikel', cta: 'Möchten Sie so eine Website für Ihr Unternehmen?', ctaSub: 'Kostenlose und unverbindliche Bewertung, innert 48 Stunden.', ctaBtn: 'Kontakt aufnehmen', prices: 'Preise ansehen', wa: 'Guten Tag Pedro! Ich habe den Artikel "%s" gelesen und möchte über mein Projekt sprechen.', feed: 'Artikel — PR Studio' },
  fr: { back: 'Retour au site', blog: 'Blog', read: "Lire l'article →", more: "Plus d'articles", cta: 'Vous voulez un site comme celui-ci pour votre entreprise ?', ctaSub: 'Évaluation gratuite et sans engagement, sous 48 heures.', ctaBtn: 'Me contacter', prices: 'Voir les prix', wa: 'Bonjour Pedro ! J\'ai lu l\'article "%s" et j\'aimerais parler de mon projet.', feed: 'Articles — PR Studio' },
  it: { back: 'Torna al sito', blog: 'Blog', read: 'Leggi l’articolo →', more: 'Altri articoli', cta: 'Vuoi un sito così per la tua attività?', ctaSub: 'Valutazione gratuita e senza impegno, entro 48 ore.', ctaBtn: 'Contattami', prices: 'Vedi i prezzi', wa: 'Ciao Pedro! Ho letto l\'articolo "%s" e vorrei parlare del mio progetto.', feed: 'Articoli — PR Studio' },
  en: { back: 'Back to site', blog: 'Blog', read: 'Read article →', more: 'More articles', cta: 'Want a website like this for your business?', ctaSub: 'Free, no-obligation assessment within 48 hours.', ctaBtn: 'Get in touch', prices: 'See prices', wa: 'Hi Pedro! I read the article "%s" and would like to talk about my project.', feed: 'Articles — PR Studio' },
};
const WA = 'https://wa.me/41798257078';

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (iso, lang) => new Date(iso).toLocaleDateString(HTML_LANG[lang], { day: 'numeric', month: 'long', year: 'numeric' });
const stripTags = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

async function fetchPosts() {
  if (!SB || !KEY) { console.warn('  (posts) SUPABASE_URL/SUPABASE_ANON_KEY ausentes — sem artigos da BD'); return []; }
  const url = `${SB}/rest/v1/posts?status=eq.published&select=slug,lang,title,description,body_html,published_at,updated_at&order=published_at.desc`;
  const r = await fetch(url, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!r.ok) throw new Error(`posts: ${r.status} ${await r.text()}`);
  const rows = await r.json();
  // só slugs/langs válidos chegam ao sistema de ficheiros
  return rows.filter((p) => /^[a-z0-9-]{1,80}$/.test(p.slug) && LANGS.includes(p.lang));
}

// caminho público de um post
const pathFor = (PREFIX, lang, slug) => `${PREFIX[lang]}blog/${slug}.html`;

// CSS partilhado com os artigos fixos (preco-site-suica.html)
const CSS = `:root{--bg:#04060B;--card:#0A1120;--ink:#F2F6FE;--ink-2:#8A97AF;--ink-3:#75829D;--line:rgba(160,190,255,0.14);--line-2:rgba(160,190,255,0.26);--red:#2E6BFF;--red-ink:#6FA0FF}
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:"Instrument Sans",-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.6;font-size:1rem}
a{color:var(--red-ink)}.wrap{max-width:760px;margin:0 auto;padding:0 20px}
header.lg-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:22px 0;border-bottom:1px solid var(--line);flex-wrap:wrap}
.logo{font-family:"Bricolage Grotesque",sans-serif;font-weight:600;font-size:1.1rem;text-decoration:none;color:var(--ink)}.logo .dot{color:var(--red)}
.langs{display:flex;gap:6px}.langs a{font-family:"Spline Sans Mono",monospace;font-size:0.72rem;letter-spacing:0.04em;background:transparent;border:1px solid var(--line-2);color:var(--ink-2);border-radius:999px;padding:6px 11px;text-decoration:none}
.langs a[aria-current="page"]{background:var(--red);border-color:var(--red);color:#fff}
main{padding:40px 0 40px}main h1{font-family:"Bricolage Grotesque",sans-serif;font-weight:600;font-size:2rem;margin:0 0 6px;line-height:1.15}
main h2{font-family:"Bricolage Grotesque",sans-serif;font-weight:600;font-size:1.2rem;margin:34px 0 10px}main h3{font-size:1.02rem;margin:26px 0 8px}
main p{color:var(--ink-2);margin:0 0 14px}main ul,main ol{color:var(--ink-2);padding-left:1.2em}main li{margin-bottom:8px}
main img{max-width:100%;height:auto;border-radius:12px}main blockquote{margin:18px 0;padding:10px 18px;border-left:3px solid var(--red);color:var(--ink-2)}
main code{background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:5px;font-family:"Spline Sans Mono",monospace;font-size:0.88em}
.lg-updated{font-family:"Spline Sans Mono",monospace;font-size:0.78rem;color:var(--ink-3);margin-bottom:28px}
.lg-tbl{width:100%;border-collapse:collapse;margin:14px 0 20px;font-size:0.88rem}.lg-tbl th,.lg-tbl td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}
.lg-tbl th{color:var(--ink);font-family:"Spline Sans Mono",monospace;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.04em}.lg-tbl td{color:var(--ink-2)}
.cta{margin:44px 0 0;padding:26px 28px;border:1px solid var(--line-2);border-radius:18px;background:linear-gradient(135deg,rgba(46,107,255,0.12),rgba(46,107,255,0.03))}
.cta h2{margin:0 0 6px;font-size:1.3rem}.cta p{margin:0 0 16px}.cta .btns{display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-block;padding:11px 18px;border-radius:999px;text-decoration:none;font-weight:600;font-size:0.92rem}.btn-red{background:var(--red);color:#fff}.btn-ghost{border:1px solid var(--line-2);color:var(--ink)}
.more{margin-top:40px}.more h2{font-size:1.05rem;margin:0 0 12px}.blog-list{display:flex;flex-direction:column;gap:12px}
.blog-card{display:block;text-decoration:none;background:rgba(255,255,255,0.03);border:1px solid var(--line);border-radius:16px;padding:18px 20px}.blog-card:hover{border-color:var(--red)}
.blog-card h2,.blog-card h3{margin:0 0 6px;font-size:1.02rem;color:var(--ink)}.blog-card p{margin:0 0 8px;font-size:0.92rem}.blog-card span{color:var(--red-ink);font-size:0.86rem;font-weight:600}
footer.lg-foot{border-top:1px solid var(--line);padding:24px 0 40px;display:flex;gap:16px;flex-wrap:wrap;justify-content:space-between;align-items:center}
footer.lg-foot .lg-links{display:flex;gap:16px;flex-wrap:wrap}footer.lg-foot a{color:var(--ink-2);text-decoration:none;font-size:0.86rem}footer.lg-foot a:hover{color:var(--red-ink)}
.lg-mono{font-family:"Spline Sans Mono",monospace;font-size:0.76rem;color:var(--ink-3)}`;

const FONTS = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Spline+Sans+Mono:wght@300..700&display=swap';

// página completa de um post. related = outros posts do mesmo idioma (máx. 3)
function renderPost(p, langsForSlug, { ORIGIN, PREFIX }, related = []) {
  const self = ORIGIN + pathFor(PREFIX, p.lang, p.slug);
  const alts = langsForSlug.map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${pathFor(PREFIX, l, p.slug)}">`);
  const xdef = langsForSlug.includes('pt') ? 'pt' : langsForSlug[0];
  alts.push(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}${pathFor(PREFIX, xdef, p.slug)}">`);
  const words = stripTags(p.body_html).split(' ').length;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: p.title, description: p.description, inLanguage: HTML_LANG[p.lang], wordCount: words,
    author: { '@type': 'Person', name: 'Pedro Ribeiro', url: `${ORIGIN}/` },
    publisher: { '@type': 'Organization', name: 'PR Studio', logo: { '@type': 'ImageObject', url: `${ORIGIN}/img/icon-512.png` } },
    mainEntityOfPage: self, datePublished: p.published_at, dateModified: p.updated_at, image: `${ORIGIN}/og.png`,
  };
  const ui = UI[p.lang];
  const langBar = langsForSlug.map((l) => `<a href="${pathFor(PREFIX, l, p.slug)}" hreflang="${l}"${l === p.lang ? ' aria-current="page"' : ''}>${l.toUpperCase()}</a>`).join('');
  const waHref = `${WA}?text=${encodeURIComponent(ui.wa.replace('%s', p.title))}`;
  const rel = related.length ? `<section class="more"><h2>${ui.more}</h2><div class="blog-list">${related.map((r) => renderCard(r, { PREFIX }, 'h3')).join('')}</div></section>` : '';
  return `<!doctype html>
<html lang="${HTML_LANG[p.lang]}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)} — PR Studio</title>
<meta name="description" content="${esc(p.description)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${self}">
${alts.join('\n')}
<meta name="theme-color" content="#05070F">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/img/favicon-32x32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png" sizes="180x180">
<link rel="alternate" type="application/rss+xml" title="${esc(ui.feed)}" href="${PREFIX[p.lang]}feed.xml">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${self}">
<meta property="og:image" content="${ORIGIN}/og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="article:published_time" content="${esc(p.published_at)}"><meta property="article:modified_time" content="${esc(p.updated_at)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONTS}" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<style>${CSS}</style>
</head>
<body>
<div class="wrap">
  <header class="lg-head">
    <a class="logo" href="${PREFIX[p.lang]}">PR<span class="dot">.</span></a>
    <nav class="langs" aria-label="Language">${langBar}</nav>
  </header>
  <main>
    <article>
      <h1>${esc(p.title)}</h1>
      <p class="lg-updated"><time datetime="${esc(String(p.published_at).slice(0, 10))}">${esc(fmtDate(p.published_at, p.lang))}</time> · Pedro Ribeiro</p>
      ${p.body_html}
    </article>
    <aside class="cta">
      <h2>${ui.cta}</h2>
      <p>${ui.ctaSub}</p>
      <div class="btns"><a class="btn btn-red" href="${waHref}" target="_blank" rel="noopener">${ui.ctaBtn}</a><a class="btn btn-ghost" href="${PREFIX[p.lang]}#precos">${ui.prices}</a></div>
    </aside>
    ${rel}
  </main>
  <footer class="lg-foot">
    <span class="lg-links"><a href="${PREFIX[p.lang]}">${ui.back}</a><a href="${PREFIX[p.lang]}blog.html">${ui.blog}</a></span>
    <span class="lg-mono">© ${new Date().getFullYear()} Pedro Ribeiro · Stalden VS</span>
  </footer>
</div>
</body>
</html>
`;
}

// cartão para a listagem blog.html (e "mais artigos")
function renderCard(p, { PREFIX }, tag = 'h2') {
  return `<a class="blog-card" href="${pathFor(PREFIX, p.lang, p.slug)}"><${tag}>${esc(p.title)}</${tag}><p>${esc(p.description)}</p><span>${UI[p.lang].read}</span></a>`;
}

// feed RSS por idioma
function renderFeed(lang, posts, { ORIGIN, PREFIX }) {
  const items = posts.map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${ORIGIN}${pathFor(PREFIX, lang, p.slug)}</link>
    <guid isPermaLink="true">${ORIGIN}${pathFor(PREFIX, lang, p.slug)}</guid>
    <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
    <description>${esc(p.description)}</description>
  </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(UI[lang].feed)}</title>
  <link>${ORIGIN}${PREFIX[lang]}blog.html</link>
  <atom:link href="${ORIGIN}${PREFIX[lang]}feed.xml" rel="self" type="application/rss+xml"/>
  <description>${esc(UI[lang].feed)}</description>
  <language>${HTML_LANG[lang]}</language>
${items}
</channel>
</rss>
`;
}

module.exports = { fetchPosts, renderPost, renderCard, renderFeed, pathFor, LANGS };
