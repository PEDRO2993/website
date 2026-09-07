'use strict';
// Build-time: lê posts publicados (PostgREST, chave anon; RLS só expõe 'published')
// e renderiza páginas estáticas com o mesmo esqueleto dos artigos existentes.
// Sem env → devolve [] e o build continua sem artigos da BD.

const SB = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;

const LANGS = ['pt', 'de', 'fr', 'it', 'en'];
const HTML_LANG = { pt: 'pt-PT', de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en' };
const UI = {
  pt: { share: ["Partilhar:","Copiar link","Link copiado"], back: 'Voltar ao site', blog: 'Blog', read: 'Ler artigo →', more: 'Mais artigos', cta: 'Queres um site assim para o teu negócio?', ctaSub: 'Avaliação gratuita e sem compromisso, em 48 horas.', ctaBtn: 'Falar comigo', prices: 'Ver preços', wa: 'Olá Pedro! Li o artigo "%s" e gostava de falar sobre o meu projeto.', feed: 'Artigos — PR Studio' },
  de: { share: ["Teilen:","Link kopieren","Link kopiert"], back: 'Zurück zur Website', blog: 'Blog', read: 'Artikel lesen →', more: 'Weitere Artikel', cta: 'Möchten Sie so eine Website für Ihr Unternehmen?', ctaSub: 'Kostenlose und unverbindliche Bewertung, innert 48 Stunden.', ctaBtn: 'Kontakt aufnehmen', prices: 'Preise ansehen', wa: 'Guten Tag, Pedro! Ich habe den Artikel "%s" gelesen und möchte über mein Projekt sprechen.', feed: 'Artikel — PR Studio' },
  fr: { share: ["Partager :","Copier le lien","Lien copié"], back: 'Retour au site', blog: 'Blog', read: 'Lire l’article →', more: 'Plus d’articles', cta: 'Vous voulez un site comme celui-ci pour votre entreprise ?', ctaSub: 'Évaluation gratuite et sans engagement, sous 48 heures.', ctaBtn: 'Me contacter', prices: 'Voir les prix', wa: 'Bonjour Pedro ! J’ai lu l\'article "%s" et j\'aimerais parler de mon projet.', feed: 'Articles — PR Studio' },
  it: { share: ["Condividi:","Copia link","Link copiato"], back: 'Torna al sito', blog: 'Blog', read: 'Leggi l’articolo →', more: 'Altri articoli', cta: 'Vuoi un sito così per la tua attività?', ctaSub: 'Valutazione gratuita e senza impegno, entro 48 ore.', ctaBtn: 'Contattami', prices: 'Vedi i prezzi', wa: 'Ciao Pedro! Ho letto l\'articolo "%s" e vorrei parlare del mio progetto.', feed: 'Articoli — PR Studio' },
  en: { share: ["Share:","Copy link","Link copied"], back: 'Back to site', blog: 'Blog', read: 'Read article →', more: 'More articles', cta: 'Want a website like this for your business?', ctaSub: 'Free, no-obligation assessment within 48 hours.', ctaBtn: 'Get in touch', prices: 'See prices', wa: 'Hi Pedro! I read the article "%s" and would like to talk about my project.', feed: 'Articles — PR Studio' },
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
const TBL_LABEL = { pt: 'Tabela', de: 'Tabelle', fr: 'Tableau', it: 'Tabella', en: 'Table' };
const wrapTables = (h, lang) => String(h || '').replace(/<table class="lg-tbl">[\s\S]*?<\/table>/g, (t) => '<div class="lg-tbl-wrap" tabindex="0" role="region" aria-label="' + (TBL_LABEL[lang] || 'Table') + '">' + t + '</div>');
const shareRow = (ui) => `<p class="lg-share"><span>${ui.share[0]}</span><a data-share="wa" href="#" target="_blank" rel="noopener">WhatsApp</a><a data-share="li" href="#" target="_blank" rel="noopener">LinkedIn</a><button type="button" data-share="copy" data-done="${esc(ui.share[2])}">${esc(ui.share[1])}</button></p>`;
const SHARE_JS = "<script>\n/* partilha: URLs construídos no browser (título + endereço da página); copiar link com fallback */\n(function () {\n  var t = document.title, u = location.href, e = encodeURIComponent;\n  document.querySelectorAll('.lg-share').forEach(function (p) {\n    p.querySelector('[data-share=\"wa\"]').href = 'https://wa.me/?text=' + e(t + ' ' + u);\n    p.querySelector('[data-share=\"li\"]').href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + e(u);\n    var b = p.querySelector('[data-share=\"copy\"]'), txt = b.textContent;\n    b.addEventListener('click', function () {\n      var done = function () { b.textContent = b.getAttribute('data-done'); b.classList.add('done'); setTimeout(function () { b.textContent = txt; b.classList.remove('done'); }, 2200); };\n      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(done, function () { window.prompt('Link:', u); });\n      else window.prompt('Link:', u);\n    });\n  });\n})();\n</script>";
const pathFor = (PREFIX, lang, slug) => `${PREFIX[lang]}blog/${slug}.html`;

// CSS partilhado com os artigos fixos (preco-site-suica.html)
const CSS = `/* ==================================================================
   PR STUDIO — páginas de documento (blog, artigos, páginas legais).
   O mesmo mundo da homepage ("Graphite Control Room"): papel grafite,
   uma tinta clara, um só acento azul-gelo, Archivo variável (largura
   expandida nos títulos, normal no texto), cantos retos, sem sombras —
   os blocos são definidos por réguas de 1px.
   Estrutura: uma só margem esquerda. O texto pára na medida (~68
   caracteres); os painéis — tabelas, faixa CTA, partilha, leitura
   seguinte, índice do blog — continuam até à moldura, à direita.
   Uma única folha, igual nas 13 páginas e em posts.js.
   ================================================================== */
:root {
  /* paleta auditada da homepage: tinta 14.8:1 · ink-2 8.3:1 · ink-3 4.9:1 · acento 7.2:1 */
  --paper:#151B23; --paper-2:#1B222B; --ink:#E9EEF3; --ink-2:#AAB5C1; --ink-3:#7E8A97;
  --rule:#243240; --rule-2:#364656; --red:#3FAEFF; --red-ink:#3FAEFF; --on-red:#151B23;
  --band:#294263; --on-band:#F2F5FA; --on-band-2:#AAB5C1;
  --measure:34rem;   /* coluna de leitura: ~68 caracteres a 17px */
  --frame:700px;     /* a moldura: painéis e réguas do cabeçalho/pé */
  --pad:clamp(20px,4vw,48px);
  --ease:cubic-bezier(0.16,1,0.3,1);
}
* { box-sizing:border-box; }
html, body { margin:0; padding:0; }
html { scrollbar-color:var(--rule-2) var(--paper); }
body { background:var(--paper); color:var(--ink); color-scheme:dark;
  font-family:"Archivo","Helvetica Neue",Arial,sans-serif; font-size:17px; line-height:1.62;
  -webkit-font-smoothing:antialiased; }
::selection { background:var(--red); color:var(--on-red); }
:focus-visible { outline:2px solid var(--red); outline-offset:3px; }
a { color:var(--red-ink); }
h1, h2, h3 { font-weight:800; letter-spacing:-0.03em; line-height:1.05; font-variation-settings:"wdth" 112;
  text-wrap:balance; overflow-wrap:break-word; }

/* a rota de progresso do scroll da homepage, aqui sem JS */
@supports (animation-timeline:scroll()) {
  body::before { content:""; position:fixed; top:0; left:0; right:0; height:2px; z-index:60;
    background:var(--red); transform:scaleX(0); transform-origin:0 50%;
    animation:lgProgress linear both; animation-timeline:scroll(root block); }
  @keyframes lgProgress { to { transform:scaleX(1); } }
}

/* ---------- moldura: a régua do cabeçalho e do pé marca a largura máxima ---------- */
.wrap { max-width:796px; margin:0 auto; padding:0 var(--pad); }
/* uma só margem esquerda: o texto pára na medida, os painéis vão até à moldura */
main { max-width:var(--frame); margin:0 auto; padding:0 0 88px; }
main p, main ul, main ol, main h3, main blockquote, .lg-sub { max-width:var(--measure); }
.lg-updated, .lg-share, .lg-more { max-width:none; }

/* ---------- cabeçalho ---------- */
header.lg-head { position:sticky; top:0; z-index:40; background:var(--paper);
  display:flex; align-items:center; justify-content:space-between; gap:14px;
  flex-wrap:wrap; padding:16px 0; border-bottom:1px solid var(--ink); }
.logo { display:inline-flex; align-items:baseline; font-size:1.35rem; font-weight:800;
  letter-spacing:-0.04em; font-variation-settings:"wdth" 118; text-decoration:none; color:var(--ink); }
.logo .dot { color:var(--red); }
.lg-back { text-decoration:none; color:var(--ink-2); font-size:0.9rem; }
.lg-back:hover { color:var(--red-ink); }
.langs { display:flex; gap:0; border:0; padding:0; background:none; }
.langs button, .langs a { font:inherit; font-size:0.78rem; font-weight:600; letter-spacing:0;
  padding:8px 9px; color:var(--ink-3); background:none; border:0; border-bottom:2px solid transparent;
  text-decoration:none; cursor:pointer; transition:color .15s ease, border-color .15s ease; }
.langs button:hover, .langs a:hover { color:var(--ink); }
.langs button[aria-pressed="true"], .langs a[aria-current="page"] { color:var(--ink); border-bottom-color:var(--red); }
@media (max-width:480px) { .langs button, .langs a { min-height:44px; padding:11px 7px; } }

/* ---------- bloco do título ---------- */
main h1 { margin:clamp(40px,7vw,66px) 0 0; color:var(--ink); font-size:clamp(2rem,4.6vw,2.75rem);
  line-height:1.02; letter-spacing:-0.035em; font-variation-settings:"wdth" 112; }
.lg-updated { margin:22px 0 44px; padding-top:14px; border-top:1px solid var(--rule-2);
  color:var(--ink-3); font-size:0.85rem; font-variant-numeric:tabular-nums; }
/* a marca da homepage: um quadrado do acento a abrir a linha de dados */
.lg-updated::before { content:""; display:inline-block; width:8px; height:8px; margin-right:10px;
  background:var(--red); vertical-align:0.06em; }
/* a entrada do artigo, um degrau acima do corpo */
.lg-updated + p { color:var(--ink); font-size:1.12rem; line-height:1.5; margin-bottom:24px; }
.lg-sub { margin:20px 0 42px; color:var(--ink-2); font-size:1.1rem; line-height:1.5; text-wrap:pretty; }

/* ---------- corpo do artigo ---------- */
main p { margin:0 0 18px; color:var(--ink-2); text-wrap:pretty; }
main strong { color:var(--ink); font-weight:700; }
main em { font-style:italic; }
main a { color:var(--red-ink); text-decoration:underline; text-underline-offset:3px;
  text-decoration-thickness:1px; text-decoration-color:color-mix(in srgb,var(--red-ink) 42%,transparent);
  transition:text-decoration-color .15s ease; }
main a:hover { text-decoration-color:var(--red-ink); }
main h2 { margin:52px 0 16px; padding-top:20px; border-top:1px solid var(--rule); color:var(--ink);
  font-size:clamp(1.38rem,3.2vw,1.62rem); line-height:1.1; letter-spacing:-0.025em;
  font-variation-settings:"wdth" 108; }
main h2::after { content:"."; color:var(--red); }
main h3 { margin:34px 0 10px; color:var(--ink); font-size:1.12rem; font-weight:700;
  line-height:1.2; letter-spacing:-0.02em; font-variation-settings:"wdth" 105; }
main ul, main ol { margin:0 0 22px; padding:0; list-style:none; color:var(--ink-2); }
main ol { counter-reset:lgol; }
main li { position:relative; padding-left:1.6em; margin-bottom:10px; }
main ul > li::before { content:"—"; position:absolute; left:0; color:var(--red); font-weight:700; }
main ol > li::before { counter-increment:lgol; content:counter(lgol) "."; position:absolute; left:0;
  color:var(--red); font-weight:700; font-variant-numeric:tabular-nums; }
main blockquote { margin:28px 0; padding:2px 0 2px 22px; border-left:2px solid var(--red);
  color:var(--ink); font-size:1.06rem; }
main blockquote p { color:inherit; }
main img { display:block; max-width:100%; height:auto; border-radius:0; border:1px solid var(--rule-2); margin:26px 0; }
main hr { border:0; border-top:1px solid var(--rule); margin:38px 0; }
/* uma só família: o código distingue-se pela caixa e pela largura, não por outra letra */
main code { font-family:inherit; font-size:0.94em; font-variation-settings:"wdth" 90;
  font-variant-numeric:tabular-nums; color:var(--ink); background:var(--paper-2);
  border:1px solid var(--rule); border-radius:0; padding:1px 6px; }

/* ---------- tabelas: desenhadas a régua, sem preenchimentos ---------- */
.lg-tbl-wrap { margin:28px 0 34px; overflow-x:auto; -webkit-overflow-scrolling:touch;
  background:
    linear-gradient(to right,var(--paper) 30%,rgba(21,27,35,0)) 0 0/24px 100% no-repeat local,
    linear-gradient(to left,var(--paper) 30%,rgba(21,27,35,0)) 100% 0/24px 100% no-repeat local,
    linear-gradient(to right,rgba(233,238,243,.22),rgba(233,238,243,0)) 0 0/12px 100% no-repeat scroll,
    linear-gradient(to left,rgba(233,238,243,.22),rgba(233,238,243,0)) 100% 0/12px 100% no-repeat scroll; }
.lg-tbl { width:100%; min-width:560px; border-collapse:collapse; margin:0;
  font-size:0.95rem; line-height:1.45; font-variant-numeric:tabular-nums; }
.lg-tbl th { padding:0 18px 11px 0; text-align:left; vertical-align:bottom; color:var(--ink);
  font-size:0.82rem; font-weight:700; letter-spacing:0; border-bottom:1px solid var(--ink); }
.lg-tbl td { padding:15px 18px 15px 0; text-align:left; vertical-align:top; color:var(--ink-2);
  border-bottom:1px solid var(--rule); }
.lg-tbl td:first-child { color:var(--ink); font-weight:600; }
.lg-tbl th:last-child, .lg-tbl td:last-child { padding-right:0; }
.lg-tbl tbody tr:last-child td { border-bottom:1px solid var(--rule-2); }

/* ---------- botões ---------- */
.btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:48px;
  padding:14px 22px; border:1px solid var(--ink); border-radius:0; background:var(--ink); color:var(--paper);
  font:inherit; font-size:0.95rem; font-weight:600; line-height:1.2; text-align:center; text-decoration:none;
  cursor:pointer; position:relative; overflow:hidden; isolation:isolate; box-shadow:none;
  transition:color .25s ease, border-color .25s ease; }
.btn::before { content:""; position:absolute; inset:0; background:var(--red);
  transform:translateX(-101%); transition:transform .45s var(--ease); z-index:-1; }
.btn:hover::before { transform:none; }
.btn:hover { border-color:var(--red); color:var(--on-red); }
.btn-red { background:var(--red); border-color:var(--red); color:var(--on-red); }
.btn-red::before { background:var(--ink); }
.btn-red:hover { border-color:var(--ink); color:var(--paper); }
.btn-ghost { background:transparent; border-color:var(--ink); color:var(--ink); }
.btn-ghost::before { background:var(--ink); }
.btn-ghost:hover { border-color:var(--ink); color:var(--paper); }

/* ---------- faixa de contacto: a mesma faixa da homepage ---------- */
.cta { margin:64px 0 0; padding:34px clamp(22px,5vw,38px) 36px;
  border:0; border-radius:0; box-shadow:none; background:var(--band); color:var(--on-band); }
.cta h2 { margin:0; padding:0; border:0; color:var(--on-band); font-size:clamp(1.45rem,3.6vw,2rem);
  line-height:1.06; letter-spacing:-0.03em; font-variation-settings:"wdth" 110; max-width:20ch; }
.cta h2::after { content:none; }
.cta p { margin:12px 0 0; color:var(--on-band-2); max-width:46ch; }
.cta .btns { display:flex; flex-wrap:wrap; gap:10px; margin-top:26px; }
.cta .btn-ghost { border-color:var(--on-band); color:var(--on-band); }
.cta .btn-ghost::before { background:var(--on-band); }
.cta .btn-ghost:hover { color:var(--band); border-color:var(--on-band); }
.cta :focus-visible { outline-color:var(--on-band); }
@media (max-width:480px) { .cta .btns { flex-direction:column; gap:8px; } .cta .btn { width:100%; } }

/* ---------- partilha ---------- */
.lg-share { display:flex; flex-wrap:wrap; align-items:center; gap:10px;
  margin:56px 0 0; padding-top:20px; border-top:1px solid var(--ink);
  color:var(--ink-3); font-size:0.85rem; }
.lg-share > span:first-child { margin-right:6px; }
.lg-share a, .lg-share button { display:inline-flex; align-items:center; min-height:44px; padding:0 16px;
  font:inherit; font-size:0.9rem; font-weight:600; color:var(--ink); background:transparent;
  border:1px solid var(--rule-2); border-radius:0; text-decoration:none; cursor:pointer;
  transition:color .15s ease, border-color .15s ease; }
.lg-share a:hover, .lg-share button:hover { color:var(--red-ink); border-color:var(--red); }
.lg-share button.done { color:var(--red-ink); border-color:var(--red); }

/* ---------- leitura seguinte ---------- */
.lg-more { margin:56px 0 0; padding-top:16px; border-top:1px solid var(--ink);
  color:var(--ink-3); font-size:0.85rem; }
.lg-more a { display:flex; align-items:baseline; justify-content:space-between; gap:18px;
  margin-top:14px; padding-top:14px; border-top:1px solid var(--rule); color:var(--ink);
  font-size:1.02rem; font-weight:600; letter-spacing:-0.015em; line-height:1.3;
  text-decoration:none; transition:color .15s ease; }
.lg-more a:first-of-type { margin-top:16px; }
.lg-more a::after { content:"→"; flex:none; color:var(--red-ink); }
.lg-more a:hover { color:var(--red-ink); }

/* ---------- índice do jornal (blog.html e "mais artigos") ---------- */
.more { margin:64px 0 0; }
.more h2 { margin:0 0 4px; padding-top:16px; border-top:1px solid var(--ink); color:var(--ink-3);
  font-size:0.85rem; font-weight:600; letter-spacing:0; font-variation-settings:"wdth" 100; }
.more h2::after { content:none; }
.blog-list { counter-reset:lgpost; margin:0; border-bottom:1px solid var(--rule-2); }
/* o número fica pendurado na margem; o texto do cartão alinha com o corpo do artigo */
.blog-card { position:relative; display:block; padding:24px 0 28px clamp(2.4rem,7vw,3.4rem);
  border:0; border-top:1px solid var(--ink); border-radius:0; background:transparent; box-shadow:none;
  text-decoration:none; color:var(--ink); transition:border-color .15s ease; }
.blog-card::before { counter-increment:lgpost; content:counter(lgpost,decimal-leading-zero);
  position:absolute; left:0; top:26px; color:var(--red); font-size:1.4rem; font-weight:800;
  line-height:1; letter-spacing:-0.04em; font-variation-settings:"wdth" 118; font-variant-numeric:tabular-nums; }
.more .blog-card::before { content:none; }
.more .blog-card { padding-left:0; }
.blog-card h2, .blog-card h3 { margin:0; padding:0; border:0; max-width:var(--measure); color:var(--ink);
  font-size:1.32rem; line-height:1.16; letter-spacing:-0.028em; font-variation-settings:"wdth" 108;
  transition:color .15s ease; }
.blog-card h2::after { content:none; }
.blog-card .lg-meta { display:block; margin:9px 0 0; color:var(--ink-3); font-size:0.85rem;
  font-variant-numeric:tabular-nums; }
.blog-card p { margin:10px 0 14px; color:var(--ink-2); font-size:0.98rem; max-width:56ch; }
.blog-card > span:last-child { color:var(--red-ink); font-size:0.92rem; font-weight:600; }
.blog-card:hover { border-top-color:var(--red); }
.blog-card:hover h2, .blog-card:hover h3 { color:var(--red-ink); }

/* ---------- pé ---------- */
footer.lg-foot { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between;
  gap:4px 24px; padding:18px 0 46px; border-top:1px solid var(--ink); }
footer.lg-foot .lg-links { display:flex; flex-wrap:wrap; gap:0 20px; }
footer.lg-foot a { display:inline-flex; align-items:center; min-height:44px; padding:0;
  color:var(--ink-2); font-size:0.9rem; text-decoration:none; transition:color .15s ease; }
footer.lg-foot a:hover { color:var(--red-ink); }
.lg-mono { color:var(--ink-3); font-size:0.85rem; font-variant-numeric:tabular-nums; }

@media (prefers-reduced-motion:reduce) {
  body::before { display:none; }
  .btn::before { transition:none; }
  * { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
}
`;

/* Fontes alojadas no próprio site (fonts/*.woff2 variáveis, subconjunto latin, display swap) — sem pedidos a fonts.googleapis.com */
const FONT_UR = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const FONT_FACES = [["Archivo","archivo","100 900",false]];
const fontFace = (fam, file, range, st) => '@font-face{font-family:"' + fam + '";font-style:' + st + ';font-weight:' + range + ';font-stretch:62% 125%;font-display:swap;src:url(/fonts/' + file + '-latin-wdth-wght-' + st + '.woff2) format("woff2-variations"),url(/fonts/' + file + '-latin-wdth-wght-' + st + '.woff2) format("woff2");unicode-range:' + FONT_UR + '}';
const FONT_HEAD = '<link rel="preload" as="font" type="font/woff2" href="/fonts/archivo-latin-wdth-wght-normal.woff2" crossorigin>'
  + '<style>' + FONT_FACES.map(([fam, file, range, ital]) => fontFace(fam, file, range, "normal") + (ital ? fontFace(fam, file, range, "italic") : "")).join("") + '</style>';

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
    mainEntityOfPage: self, datePublished: p.published_at, dateModified: p.updated_at, image: `${ORIGIN}/img/og/blog-${p.lang}.jpg`,
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
<meta name="theme-color" content="#151B23">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/img/favicon-32x32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png" sizes="180x180">
<link rel="alternate" type="application/rss+xml" title="${esc(ui.feed)}" href="${PREFIX[p.lang]}feed.xml">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${self}">
<meta property="og:image" content="${ORIGIN}/img/og/blog-${p.lang}.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(p.title)}">
<meta property="article:published_time" content="${esc(p.published_at)}"><meta property="article:modified_time" content="${esc(p.updated_at)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'PR Studio', item: ORIGIN + PREFIX[p.lang] }, { '@type': 'ListItem', position: 2, name: ui.blog, item: ORIGIN + PREFIX[p.lang] + 'blog.html' }, { '@type': 'ListItem', position: 3, name: p.title, item: self } ] }).replace(/</g, '\\u003c')}</script>
${FONT_HEAD}
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
      <p class="lg-updated"><time datetime="${esc(String(p.published_at).slice(0, 10))}">${esc(fmtDate(p.published_at, p.lang))}</time> · Pedro Ribeiro · ${Math.max(1, Math.round(words / 200))} min</p>
      ${wrapTables(p.body_html, p.lang)}
    </article>
    ${shareRow(ui)}
    ${rel}
    <aside class="cta">
      <h2>${ui.cta}</h2>
      <p>${ui.ctaSub}</p>
      <div class="btns"><a class="btn btn-red" href="${waHref}" target="_blank" rel="noopener">${ui.ctaBtn}</a><a class="btn btn-ghost" href="${PREFIX[p.lang]}#precos">${ui.prices}</a></div>
    </aside>
  </main>
  ${SHARE_JS}
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
  const mins = p.mins || (p.body_html ? Math.max(1, Math.round(stripTags(p.body_html).split(' ').length / 200)) : 0);
  const meta = p.published_at ? `<span class="lg-meta">${esc(fmtDate(p.published_at, p.lang))}${mins ? ' · ' + mins + ' min' : ''}</span>` : '';
  return `<a class="blog-card" href="${p.href || pathFor(PREFIX, p.lang, p.slug)}"><${tag}>${esc(p.title)}</${tag}>${meta}<p>${esc(p.description)}</p><span>${UI[p.lang].read}</span></a>`;
}

// feed RSS por idioma
function renderFeed(lang, posts, { ORIGIN, PREFIX }) {
  const items = posts.map((p) => { const url = p.url || ORIGIN + pathFor(PREFIX, lang, p.slug); return `  <item>
    <title>${esc(p.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
    <description>${esc(p.description)}</description>
  </item>`; }).join('\n');
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

module.exports = { FONT_HEAD, fetchPosts, renderPost, renderCard, renderFeed, pathFor, fmtDate, LANGS, UI, WA };
