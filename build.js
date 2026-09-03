#!/usr/bin/env node
/*
 * PR Studio — gerador de páginas estáticas por idioma.
 *
 * PORQUÊ: até agora as "5 línguas" do site eram só troca de texto por
 * JavaScript no mesmo URL. Todas as versões serviam HTML idêntico e todas
 * apontavam o canonical para "/", por isso o Google juntava tudo numa só
 * página e descartava as anotações hreflang — não havia versão alemã nem
 * francesa para indexar, justamente o mercado do Valais.
 *
 * O QUE FAZ: escreve para dist/ uma cópia do site com uma pasta por idioma
 * (/de/, /fr/, /it/, /en/; o português fica na raiz). Cada página leva o seu
 * próprio canonical, o conjunto completo e recíproco de hreflang, e o texto
 * já traduzido no HTML — sem depender de JavaScript.
 *
 * Sem dependências: corre com `node build.js`, nada para instalar.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const posts = require('./posts');          // artigos vindos da BD (Supabase)

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://prstudio.ch';

const LANGS = ['pt', 'de', 'fr', 'it', 'en'];
const HTML_LANG = { pt: 'pt-PT', de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en' };
const OG_LOCALE = { pt: 'pt_PT', de: 'de_CH', fr: 'fr_CH', it: 'it_CH', en: 'en_US' };
/* prefixo de URL de cada idioma; o português é a raiz */
const PREFIX = { pt: '/', de: '/de/', fr: '/fr/', it: '/it/', en: '/en/' };

/* páginas com o sistema .i18n-doc (um bloco por idioma no mesmo ficheiro) */
/* Site do Hotel Alpina — trocar aqui quando passar para domínio próprio (Netlify, branch alpina) */
const ALPINA_URL = 'https://pedro2993.github.io/website/hotel-alpina/';

const DOC_PAGES = [
  'blog.html', 'preco-site-suica.html', 'multilingue-valais.html', 'google-business-valais.html', 'site-restaurante-valais.html', 'manutencao-site.html', 'fotografia-site-negocio.html', 'site-hotel-valais.html', 'caso-hotel-alpina.html',
  'privacidade.html', 'termos.html', 'informacao-legal.html',
];
/* as páginas legais não precisam de posição no Google, mas precisam de
   existir em cada idioma: um comprador suíço abre o Impressum antes de
   enviar dinheiro, e não pode encontrá-lo na língua errada */
const NOINDEX_PAGES = ['privacidade.html', 'termos.html', 'informacao-legal.html'];
/* ficheiros copiados tal e qual para a raiz de dist/ */
const COPY_FILES = [
  'supabase.min.js', 'og.png', 'favicon.ico', 'robots.txt',
  'site.webmanifest', '_headers', '404.html',
];
const COPY_DIRS = ['img', 'css', 'fonts'];

/* preenchido por buildPosts(); consumido por buildSitemap() e buildDocPage(blog.html) */
let DB_POSTS = [];

/* ------------------------------------------------------------------ */
/* utilitários                                                         */
/* ------------------------------------------------------------------ */

/* substituição literal: evita que $& / $1 no texto sejam interpretados */
function sub(str, re, value) {
  return str.replace(re, () => value);
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escAttr(s) {
  return escHtml(s).replace(/"/g, '&quot;');
}

/* Lê um literal de objeto do JS inline (ex.: `var I18N = { ... }`) fazendo
   contagem de chavetas e ignorando o que está dentro de strings. */
function extractObject(src, declaration) {
  const at = src.indexOf(declaration);
  if (at < 0) throw new Error('declaração não encontrada: ' + declaration);
  const start = src.indexOf('{', at);
  let depth = 0, quote = null, escaped = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (c === '\\') { escaped = true; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return src.slice(start, i + 1);
  }
  throw new Error('chavetas desequilibradas em ' + declaration);
}

function evalObject(src, declaration) {
  // eslint-disable-next-line no-new-func
  return new Function('return (' + extractObject(src, declaration) + ');')();
}

/* Google Fonts → fontes locais (posts.FONT_HEAD): remove preconnect/preload/stylesheet externos */
function selfHostFonts(html) {
  html = html.replace(/<noscript><link[^>]*fonts\.googleapis[^>]*><\/noscript>\s*/g, '');
  let done = false;
  return html.replace(/[ \t]*<link[^>]*fonts\.g(?:oogleapis|static)[^>]*>\s*/g, () => (done ? '' : (done = true, posts.FONT_HEAD + '\n')));
}
function writeFile(rel, content) {
  if (typeof content === 'string') content = content.split('https://__alpina__/').join(ALPINA_URL);
  const full = path.join(DIST, rel);
  if (rel.endsWith('.html')) content = selfHostFonts(content);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function copyInto(rel) {
  const from = path.join(ROOT, rel);
  if (!fs.existsSync(from)) { console.warn('  (aviso) não existe, ignorado: ' + rel); return; }
  fs.cpSync(from, path.join(DIST, rel), { recursive: true });
}

/* ------------------------------------------------------------------ */
/* cabeçalho comum: canonical + hreflang recíproco                     */
/* ------------------------------------------------------------------ */

function altLinks(pathFor) {
  const rows = LANGS.map(
    (l) => '<link rel="alternate" hreflang="' + l + '" href="' + ORIGIN + pathFor(l) + '">'
  );
  rows.push('<link rel="alternate" hreflang="x-default" href="' + ORIGIN + pathFor('pt') + '">');
  return rows.join('\n');
}

function rewriteHead(html, lang, pathFor, title, description) {
  const self = ORIGIN + pathFor(lang);

  html = sub(html, /<html lang="[^"]*"/, '<html lang="' + HTML_LANG[lang] + '"');
  html = sub(html, /<title>[\s\S]*?<\/title>/, '<title>' + escHtml(title) + '</title>');

  if (/<meta name="description"/.test(html)) {
    html = sub(html, /<meta name="description" content="[^"]*">/,
      '<meta name="description" content="' + escAttr(description) + '">');
  } else {
    html = sub(html, /<link rel="canonical"/,
      '<meta name="description" content="' + escAttr(description) + '">\n<link rel="canonical"');
  }

  html = sub(html, /<link rel="canonical" href="[^"]*">/,
    '<link rel="canonical" href="' + self + '">');

  // conjunto hreflang: substitui o antigo se existir, senão insere
  if (/hreflang="x-default"/.test(html)) {
    html = sub(html, /<link rel="alternate" hreflang="pt"[\s\S]*?hreflang="x-default"[^>]*>/,
      altLinks(pathFor));
  } else {
    html = sub(html, /(<link rel="canonical" href="[^"]*">)/,
      '<link rel="canonical" href="' + self + '">\n' + altLinks(pathFor));
  }

  // Open Graph
  html = sub(html, /<meta property="og:url" content="[^"]*">/,
    '<meta property="og:url" content="' + self + '">');
  html = sub(html, /<meta property="og:title" content="[^"]*">/,
    '<meta property="og:title" content="' + escAttr(title) + '">');
  html = sub(html, /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="' + escAttr(description) + '">');
  html = sub(html, /<meta property="og:locale" content="[^"]*">/,
    '<meta property="og:locale" content="' + OG_LOCALE[lang] + '">');
  html = sub(html, /(?:<meta property="og:locale:alternate" content="[^"]*">\s*)+/,
    LANGS.filter((l) => l !== lang)
      .map((l) => '<meta property="og:locale:alternate" content="' + OG_LOCALE[l] + '">')
      .join('\n') + '\n');

  return html;
}

/* injeta o idioma da página para o JS não voltar a adivinhar */
function injectLangGlobals(html, lang) {
  return html.replace(/<body([^>]*)>/, (m, attrs) =>
    '<body' + attrs + '>\n<script>window.__PR_LANG=' + JSON.stringify(lang) +
    ';window.__PR_STATIC=true;</script>');
}

/* dentro de /de/, /fr/… os caminhos relativos partiriam — torna-os absolutos */
function absolutize(html, lang) {
  const q = lang === 'pt' ? '' : '?lang=' + lang;
  html = html.replace(/(href|src)="(?!https?:|\/|#|mailto:|tel:|data:)([^"]+)"/g,
    (m, attr, url) => {
      /* o JS inline monta markup por concatenação (href="' + url + '");
         isso não é um caminho, é código — deixar intacto */
      if (/['"+]/.test(url)) return m;
      if (DOC_PAGES.indexOf(url) >= 0) return attr + '="' + PREFIX[lang] + url + '"';
      if (/^(privacidade|termos|informacao-legal)\.html$/.test(url)) {
        return attr + '="/' + url + q + '"';
      }
      if (url === 'index.html') return attr + '="' + PREFIX[lang] + '"';
      return attr + '="/' + url + '"';
    });
  // caminhos construídos dentro do JavaScript
  html = html.replace(/this\.src='img\//g, () => "this.src='/img/");
  html = html.replace(/"supabase\.min\.js"/g, () => '"/supabase.min.js"');
  html = html.replace(/"img\/"/g, () => '"/img/"');
  return html;
}

/* ------------------------------------------------------------------ */
/* index.html — sistema data-i18n                                      */
/* ------------------------------------------------------------------ */

function buildHome() {
  const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  const I18N = evalObject(src, 'var I18N =');
  const LG_I18N = evalObject(src, 'var LG_I18N =');
  const TITLES = evalObject(src, 'var TITLES =');
  const WA_TEXT = evalObject(src, 'var WA_TEXT =');
  // o site funde LG_I18N em I18N em runtime; aqui fazemos o mesmo
  Object.keys(LG_I18N).forEach((l) => {
    if (I18N[l]) Object.assign(I18N[l], LG_I18N[l]);
  });

  const pathFor = (l) => PREFIX[l];
  /* o JS constrói markup com data-i18n="' + meta.key + '"; não é um
     elemento real do documento, por isso não conta como texto por traduzir */
  const isRealKey = (k) => !/['"+]/.test(k);

  LANGS.forEach((lang) => {
    let html = src;
    let replaced = 0, total = 0, missing = new Set();

    // só o dicionário do idioma da página (−40 KB gzip em pt, −27 KB em de)
    ['var I18N =', 'var TPL_TR ='].forEach((decl) => {
      const lit = extractObject(src, decl);
      const obj = evalObject(src, decl);
      const keep = lang === 'pt' ? {} : { [lang]: obj[lang] };
      html = html.replace(lit, () => JSON.stringify(keep));
    });

    if (lang !== 'pt') {
      const dict = I18N[lang];
      if (!dict) throw new Error('sem dicionário para ' + lang);
      html = html.replace(
        /(<([a-zA-Z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g,
        (m, open, tag, key, inner, close) => {
          if (!isRealKey(key)) return m;
          total++;
          const t = dict[key];
          if (t == null) { missing.add(key); return m; }
          replaced++;
          return open + escHtml(t) + close;
        }
      );
    }

    if (lang !== 'pt') {
      const dict = I18N[lang];
      /* aria-labels marcados com data-i18n-aria="chave" */
      // links WhatsApp já no idioma certo (sem esperar pelo JS)
      if (WA_TEXT[lang]) html = html.split('wa.me/41798257078?text=Ol%C3%A1%20Pedro!').join('wa.me/41798257078?text=' + encodeURIComponent(WA_TEXT[lang]));
      html = html.replace(/data-i18n-aria="([^"]+)"(\s+)aria-label="[^"]*"/g,
        (m, key, ws) => dict[key] != null
          ? 'data-i18n-aria="' + key + '"' + ws + 'aria-label="' + escAttr(dict[key]) + '"'
          : m);
      /* FAQPage JSON-LD: o schema tem de dizer o mesmo que a FAQ visível */
      const faq = [];
      for (let n = 1; n <= 12; n++) {
        const q = dict['fq' + n + '.q'], a = dict['fq' + n + '.a'];
        if (q == null || a == null) break;
        faq.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
      }
      if (faq.length) {
        html = html.replace(/(<script type="application\/ld\+json">\s*)(\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?)(\s*<\/script>)/,
          (m, open, body, close) => open + JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq }) + close);
      }
    }

    html = html.replace(/href="\/feed\.xml"/, () => 'href="' + PREFIX[lang] + 'feed.xml"'); // RSS do idioma (homepage)
    if (fs.existsSync(path.join(ROOT, 'img/og/home-' + lang + '.jpg'))) html = html.replace(/(<meta property="og:image" content=")[^"]*/, (m, o) => o + ORIGIN + '/img/og/home-' + lang + '.jpg');
    /* teaser do blog: os 3 artigos mais recentes do idioma */
    const teaser = newestFirst(STATIC_FEED[lang]).slice(0, 3)
      .map((e) => '<a class="card reveal" href="' + e.href + '"><span class="lg-meta">' + posts.fmtDate(e.published_at, lang) + ' · ' + e.mins + ' min</span><h3>' + e.title.replace(/&/g, '&amp;') + '</h3><p>' + e.description.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</p></a>').join('');
    if (teaser) html = html.replace('<div class="blog-teaser" id="blogTeaser"></div>', () => '<div class="blog-teaser" id="blogTeaser">' + teaser + '</div>');
    html = rewriteHead(html, lang, pathFor, TITLES[lang].t, TITLES[lang].d);
    html = injectLangGlobals(html, lang);
    if (lang !== 'pt') html = absolutize(html, lang);

    /* demos dos 6 setores: markup fora da página (carregado ao abrir uma demo) */
    {
      const tpls = html.match(/<template[\s\S]*?<\/template>/g) || [];
      if (tpls.length) {
        /* fica na página só a capa de cada demo (miniaturas do portfólio, ~11 KiB) */
        const thumbs = tpls.map((t) => {
          const key = (t.match(/id="tpl-([a-z]+)"/) || [])[1];
          const svg = (t.match(/<svg[\s\S]*?<\/svg>/) || [])[0];
          return key && svg ? '<span data-tpl="' + key + '">' + svg + '</span>' : '';
        }).join('');
        html = html.replace(/[ \t]*<template[\s\S]*?<\/template>\n?/g, "");
        html = html.replace('</main>', '</main>\n<div id="tplThumbs" hidden>' + thumbs + '</div>');
        writeFile((lang === "pt" ? "" : lang + "/") + "demos.html", tpls.join("\n"));
      }
    }
    writeFile(lang === 'pt' ? 'index.html' : lang + '/index.html', html);

    if (lang === 'pt') {
      console.log('  index.html            pt  (texto original)');
    } else {
      const miss = missing.size ? '  ⚠ ' + missing.size + ' chave(s) sem tradução' : '';
      console.log('  ' + (lang + '/index.html').padEnd(22) + lang +
        '  ' + replaced + '/' + total + ' textos traduzidos' + miss);
      if (missing.size) console.log('      em falta: ' + [...missing].slice(0, 12).join(', '));
    }
  });
}

/* ------------------------------------------------------------------ */
/* blog + artigos — sistema .i18n-doc                                  */
/* ------------------------------------------------------------------ */

function firstParagraph(block) {
  const m = block.match(/<p(?![^>]*class="lg-updated")[^>]*>([\s\S]*?)<\/p>/);
  if (!m) return '';
  let txt = m[1].replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ').trim();
  if (txt.length > 158) txt = txt.slice(0, 155).replace(/[\s,;:]+\S*$/, '') + '…';
  return txt;
}

/* bloco .i18n-doc de um idioma, com aninhamento de <div> (ex.: .lg-tbl-wrap) */
function extractBlock(src, lang) {
  const open = new RegExp('<div class="i18n-doc" data-lang="' + lang + '">');
  const m = src.match(open); if (!m) return '';
  const tag = /<div[\s>]|<\/div\s*>/g; let depth = 1, t;
  tag.lastIndex = m.index + m[0].length;
  while ((t = tag.exec(src))) { depth += t[0][1] === '/' ? -1 : 1; if (depth === 0) return src.slice(m.index + m[0].length, t.index); }
  return '';
}
/* remove os blocos .i18n-doc dos outros idiomas.
   <span> não tem aninhamento; <div> pode conter outros <div> (ex.: .blog-list),
   por isso procura-se o </div> correspondente contando a profundidade. */
function stripDocBlocks(html, lang) {
  html = html.replace(
    /<span([^>]*\bclass="[^"]*i18n-doc[^"]*"[^>]*)>([\s\S]*?)<\/span>/g,
    (m, attrs) => {
      const l = (attrs.match(/data-lang="([^"]+)"/) || [])[1];
      return l === lang ? m : '';
    }
  );
  const open = /<div([^>]*\bclass="[^"]*i18n-doc[^"]*"[^>]*)>/g;
  const tag = /<div[\s>]|<\/div\s*>/g;
  let out = '', pos = 0, m;
  while ((m = open.exec(html))) {
    const l = (m[1].match(/data-lang="([^"]+)"/) || [])[1];
    let depth = 1, end = -1, t;
    tag.lastIndex = m.index + m[0].length;
    while ((t = tag.exec(html))) {
      depth += t[0][1] === '/' ? -1 : 1;
      if (depth === 0) { end = t.index + t[0].length; break; }
    }
    if (end < 0) throw new Error('bloco .i18n-doc sem </div> correspondente (' + l + ')');
    out += html.slice(pos, m.index) + (l === lang ? html.slice(m.index, end) : '');
    pos = end;
    open.lastIndex = end;
  }
  return out + html.slice(pos);
}

function buildDocPage(file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const TITLES = evalObject(src, 'var TITLES =');
  const pathFor = (l) => PREFIX[l] + file;

  LANGS.forEach((lang) => {
    // mantém só os blocos do idioma pedido
    let html = stripDocBlocks(src, lang);
    // já não está escondido por JS: mostra-o de raiz
    html = html.replace(/\.i18n-doc \{ display:none; \}/,
      () => '.i18n-doc { display:block; }\n.i18n-doc.lg-links { display:flex; }');
    // o JS da página respeita o idioma da página estática (window.__PR_LANG)
    // e os botões de idioma navegam para a versão estática correspondente
    html = sub(html, /setLang\(detect\(\)\);/, 'setLang(window.__PR_LANG || detect());');
    html = sub(html,
      /b\.addEventListener\("click", function \(\) \{ setLang\(b\.getAttribute\("data-lang"\)\); \}\);/,
      'b.addEventListener("click", function () { var l = b.getAttribute("data-lang"); ' +
      'if (window.__PR_STATIC) { location.href = ' + JSON.stringify(PREFIX) +
      '[l] + location.pathname.split("/").pop(); return; } setLang(l); });');

    // blog.html: feed RSS do idioma
    if (file === 'blog.html') {
      const hasFeed = DB_POSTS.some((p) => p.lang === lang) || STATIC_FEED[lang].length > 0;
      html = hasFeed ? html.replace(/href="\/feed\.xml"/, () => 'href="' + PREFIX[lang] + 'feed.xml"') : html.replace(/<link rel="alternate" type="application\/rss\+xml"[^>]*>\n?/, '');
    }
    // blog.html: cartões dos posts da BD, antes dos cartões fixos
    if (file === 'blog.html') {
      /* cartões fixos: data e tempo de leitura do artigo nesse idioma */
      html = html.replace(/(<a class="blog-card" href="([a-z0-9-]+\.html)"><h2>[\s\S]*?<\/h2>)/g, (m, open, href) => {
        const e = STATIC_FEED[lang].find((x) => x.file === href);
        return e ? open + '<span class="lg-meta">' + posts.fmtDate(e.published_at, lang) + ' · ' + e.mins + ' min</span>' : m;
      });
      const cards = DB_POSTS.filter((p) => p.lang === lang).map((p) => posts.renderCard(p, { PREFIX })).join('');
      if (cards) html = html.replace(/<div class="blog-list">/, () => '<div class="blog-list">' + cards);
    }

    const block = extractBlock(src, lang);

    const desc = firstParagraph(block);
    /* tempo de leitura por bloco de idioma (só artigos) */
    if (/"@type":\s*"Article"/.test(html)) {
      html = html.replace(/(<div class="i18n-doc" data-lang="[a-z]{2}">)([\s\S]*?)(?=<div class="i18n-doc"|<\/main>)/g, (m, open, body) => {
        const words = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
        const mins = Math.max(1, Math.round(words / 200));
        const bl = (open.match(/data-lang="([a-z]{2})"/) || [])[1];
        const ui = posts.UI[bl];
        const h1 = ((body.match(/<h1[^>]*>([^<]*)/) || [, ''])[1]).replace(/&amp;/g, '&');
        const cta = ui ? '<aside class="cta"><h2>' + ui.cta + '</h2><p>' + ui.ctaSub + '</p><div class="btns"><a class="btn btn-red" href="' + posts.WA + '?text=' + encodeURIComponent(ui.wa.replace('%s', h1)) + '" target="_blank" rel="noopener">' + ui.ctaBtn + '</a><a class="btn btn-ghost" href="' + PREFIX[bl] + '#precos">' + ui.prices + '</a></div></aside>' : '';
        body = body.replace(/(<p class="lg-updated">)([^<]*)(<\/p>)/, (mm, o, t, c) => o + t + ' · ' + mins + ' min' + c);
        if (cta) body = body.replace(/<\/div>(\s*)$/, cta + '</div>$1');
        return open + body;
      });
    }
    /* BreadcrumbList do blog: início → blog */
    if (file === 'blog.html' && !/BreadcrumbList/.test(html)) {
      const bcb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'PR Studio', item: ORIGIN + PREFIX[lang] },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: ORIGIN + PREFIX[lang] + 'blog.html' } ] };
      html = html.replace('</head>', '<script type="application/ld+json">' + JSON.stringify(bcb) + '</script>\n</head>');
    }
    /* WebPage JSON-LD para páginas sem Article nem ld+json (legais) */
    if (!/"@type":\s*"Article"/.test(html) && file !== 'blog.html' && !/application\/ld\+json/.test(html)) {
      const h1w = (block.match(/<h1[^>]*>([^<]*)/) || [, ''])[1].replace(/&amp;/g, '&');
      const wp = { '@context': 'https://schema.org', '@type': 'WebPage', name: h1w, description: desc, inLanguage: HTML_LANG[lang], url: ORIGIN + pathFor(lang),
        isPartOf: { '@type': 'WebSite', name: 'PR Studio', url: ORIGIN + '/' },
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PR Studio', item: ORIGIN + PREFIX[lang] },
          { '@type': 'ListItem', position: 2, name: h1w, item: ORIGIN + pathFor(lang) } ] } };
      html = html.replace('</head>', '<script type="application/ld+json">' + JSON.stringify(wp).replace(/</g, '\\u003c') + '</script>\n</head>');
    }
    /* BreadcrumbList: início → blog → artigo (só páginas com Article) */
    if (/"@type":\s*"Article"/.test(html) && !/BreadcrumbList/.test(html)) {
      const BLOG = { pt: 'Blog', de: 'Blog', fr: 'Blog', it: 'Blog', en: 'Blog' };
      const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'PR Studio', item: ORIGIN + PREFIX[lang] },
        { '@type': 'ListItem', position: 2, name: BLOG[lang], item: ORIGIN + PREFIX[lang] + 'blog.html' },
        { '@type': 'ListItem', position: 3, name: (block.match(/<h1[^>]*>([^<]*)/) || [, ''])[1].replace(/&amp;/g, '&'), item: ORIGIN + pathFor(lang) } ] };
      html = html.replace('</head>', '<script type="application/ld+json">' + JSON.stringify(bc) + '</script>\n</head>');
    }
    /* Article JSON-LD: headline/description/inLanguage/mainEntityOfPage por idioma */
    if (/"@type":\s*"Article"/.test(html)) {
      const ogCand = 'img/og/' + file.replace(/\.html$/, '') + '-' + lang + '.jpg';
      const ogRel = fs.existsSync(path.join(ROOT, ogCand)) ? ogCand : null;
      const h1 = (block.match(/<h1>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<[^>]+>/g, '').trim();
      html = html.replace(/(<script type="application\/ld\+json">\s*)(\{[^\n]*"@type":\s*"Article"[^\n]*\})(\s*<\/script>)/,
        (m, open, body, close) => {
          let o; try { o = JSON.parse(body); } catch (e) { return m; }
          if (h1) o.headline = h1;
          if (desc) o.description = desc;
          o.inLanguage = HTML_LANG[lang];
          o.mainEntityOfPage = ORIGIN + pathFor(lang);
          if (ogRel) o.image = ORIGIN + '/' + ogRel;
          o.dateModified = lastModOf(file); /* data real do último commit do artigo */
          return open + JSON.stringify(o) + close;
        });
      /* imagem OG por artigo e idioma (img/og/<página>-<lang>.jpg, gerada offline) */
      if (ogRel) html = html.replace(/(<meta property="og:image" content=")[^"]*/, (m, o) => o + ORIGIN + '/' + ogRel);
      if (ogRel && h1 && !/og:image:alt/.test(html)) html = html.replace(/(<meta property="og:image:height"[^>]*>)/, (m) => m + '\n<meta property="og:image:alt" content="' + h1.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '">');
    }
    /* blog.html: BreadcrumbList (início → blog) + ItemList dos artigos do idioma */
    if (file === 'blog.html') {
      const items = DB_POSTS.filter((p) => p.lang === lang).map((p) => ({ title: p.title, url: ORIGIN + posts.pathFor(PREFIX, lang, p.slug), published_at: p.published_at }))
        .concat(newestFirst(STATIC_FEED[lang]));
      const ld = [
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PR Studio', item: ORIGIN + PREFIX[lang] },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: ORIGIN + PREFIX[lang] + 'blog.html' } ] },
        { '@context': 'https://schema.org', '@type': 'ItemList', itemListOrder: 'https://schema.org/ItemListOrderDescending', numberOfItems: items.length,
          itemListElement: items.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.title, url: e.url })) },
      ];
      html = html.replace('</head>', ld.map((o) => '<script type="application/ld+json">' + JSON.stringify(o).replace(/</g, '\\u003c') + '</script>').join('\n') + '\n</head>');
    }
    if (file === 'blog.html' && fs.existsSync(path.join(ROOT, 'img/og/blog-' + lang + '.jpg'))) {
      html = html.replace(/(<meta property="og:image" content=")[^"]*/, (m, o) => o + ORIGIN + '/img/og/blog-' + lang + '.jpg');
    }
    html = rewriteHead(html, lang, pathFor, TITLES[lang], desc);
    html = injectLangGlobals(html, lang);
    if (lang !== 'pt') html = absolutize(html, lang);

    writeFile(lang === 'pt' ? file : lang + '/' + file, html);
  });
  console.log('  ' + file.padEnd(22) + '× ' + LANGS.length + ' idiomas');
}

/* ------------------------------------------------------------------ */
/* sitemap + redirects                                                 */
/* ------------------------------------------------------------------ */

function today() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

// lastmod real: data do último commit do ficheiro de origem (fallback: hoje)
function lastModOf(file) {
  try {
    const d = require('child_process').execSync('git log -1 --format=%cI -- ' + JSON.stringify(file), { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return d ? d.slice(0, 10) : today();
  } catch (e) { return today(); }
}

function buildSitemap() {
  const stamp = today();
  const groups = [{ pathFor: (l) => PREFIX[l], priority: '1.0', freq: 'weekly', file: 'index.html' }];
  DOC_PAGES.forEach((f) => {
    const legal = NOINDEX_PAGES.indexOf(f) >= 0;
    groups.push({
      pathFor: (l) => PREFIX[l] + f,
      file: f,
      priority: legal ? '0.3' : '0.7',
      freq: legal ? 'yearly' : 'monthly',
    });
  });

  const urls = [];
  groups.forEach((g) => {
    const mod = lastModOf(g.file);
    LANGS.forEach((lang) => {
      const alts = LANGS
        .map((l) => '    <xhtml:link rel="alternate" hreflang="' + l + '" href="' + ORIGIN + g.pathFor(l) + '"/>')
        .concat(['    <xhtml:link rel="alternate" hreflang="x-default" href="' + ORIGIN + g.pathFor('pt') + '"/>'])
        .join('\n');
      urls.push(
        '  <url>\n' +
        '    <loc>' + ORIGIN + g.pathFor(lang) + '</loc>\n' +
        '    <lastmod>' + mod + '</lastmod>\n' +
        '    <changefreq>' + g.freq + '</changefreq>\n' +
        '    <priority>' + g.priority + '</priority>\n' +
        alts + '\n' +
        '  </url>'
      );
    });
  });

  // posts da BD: um <url> por (slug, lang), hreflang só para os idiomas existentes
  const bySlug = {};
  DB_POSTS.forEach((p) => (bySlug[p.slug] = bySlug[p.slug] || []).push(p));
  Object.keys(bySlug).forEach((slug) => {
    const langs = bySlug[slug].map((p) => p.lang);
    bySlug[slug].forEach((p) => {
      const alts = langs.map((l) => '    <xhtml:link rel="alternate" hreflang="' + l + '" href="' + ORIGIN + posts.pathFor(PREFIX, l, slug) + '"/>').join('\n');
      urls.push('  <url>\n    <loc>' + ORIGIN + posts.pathFor(PREFIX, p.lang, slug) + '</loc>\n' +
        '    <lastmod>' + String(p.updated_at).slice(0, 10) + '</lastmod>\n' +
        '    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n' + alts + '\n  </url>');
    });
  });

  writeFile('sitemap.xml',
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls.join('\n') + '\n</urlset>\n');
  console.log('  sitemap.xml           ' + urls.length + ' URLs');
}

function buildRedirects() {
  // os antigos ?lang=xx passam a apontar para o URL definitivo
  const lines = ['# gerado por build.js — não editar à mão', ''];
  LANGS.forEach((l) => {
    lines.push('/'.padEnd(4) + ('lang=' + l).padEnd(10) + PREFIX[l] + '  301');
  });
  lines.push('');
  const extra = path.join(ROOT, '_redirects');
  if (fs.existsSync(extra)) lines.push(fs.readFileSync(extra, 'utf8').trim(), '');
  writeFile('_redirects', lines.join('\n'));
  console.log('  _redirects            ?lang=xx → /xx/');
}

/* ------------------------------------------------------------------ */

const STATIC_FEED = { pt: [], de: [], fr: [], it: [], en: [] };
/* mais recentes primeiro; em empate de data, o último adicionado (DOC_PAGES) é o mais novo */
function newestFirst(arr) { return arr.map((e, i) => [e, i]).sort((x, y) => String(y[0].published_at).localeCompare(String(x[0].published_at)) || (y[1] - x[1])).map((x) => x[0]); }
async function buildPosts() {
  DB_POSTS = await posts.fetchPosts();
  // artigos fixos (páginas .i18n-doc com Article) entram no feed com os posts da BD
  DOC_PAGES.forEach((file) => {
    const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    if (!/"@type":\s*"Article"/.test(src)) return;
    const date = (src.match(/"datePublished":\s*"([^"]+)"/) || [, new Date().toISOString().slice(0, 10)])[1];
    posts.LANGS.forEach((lang) => {
      const block = extractBlock(src, lang);
      const title = ((block.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1]).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
      if (!title) return;
      const mins = Math.max(1, Math.round(block.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length / 200));
      STATIC_FEED[lang].push({ lang, title, description: firstParagraph(block), published_at: date, mins, file, href: PREFIX[lang] + file, url: ORIGIN + PREFIX[lang] + file });
    });
  });
  const bySlug = {};
  DB_POSTS.forEach((p) => (bySlug[p.slug] = bySlug[p.slug] || []).push(p));
  DB_POSTS.forEach((p) => {
    const rel = (p.lang === 'pt' ? '' : p.lang + '/') + 'blog/' + p.slug + '.html';
    const related = DB_POSTS.filter((x) => x.lang === p.lang && x.slug !== p.slug).concat(STATIC_FEED[p.lang]).slice(0, 3);
    writeFile(rel, posts.renderPost(p, bySlug[p.slug].map((x) => x.lang), { ORIGIN, PREFIX }, related));
  });
  // feed RSS por idioma (posts da BD + artigos fixos, mais recentes primeiro)
  posts.LANGS.forEach((lang) => {
    const list = DB_POSTS.filter((p) => p.lang === lang).concat(STATIC_FEED[lang]).sort((a, b) => String(b.published_at).localeCompare(String(a.published_at)));
    if (list.length) writeFile((lang === 'pt' ? '' : lang + '/') + 'feed.xml', posts.renderFeed(lang, list, { ORIGIN, PREFIX }));
  });
  console.log('  posts (BD)            ' + DB_POSTS.length + ' páginas');
}

async function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  console.log('PR Studio — a gerar site multilingue em dist/\n');
  await buildPosts();                       // antes: blog.html e o sitemap precisam de DB_POSTS
  buildHome();
  DOC_PAGES.forEach(buildDocPage);
  buildSitemap();
  buildRedirects();

  COPY_FILES.forEach(copyInto);
  // 404: 3 artigos mais recentes por idioma (o JS da página escolhe pelo prefixo do URL)
  {
    const arts = {}; posts.LANGS.forEach((l) => { arts[l] = newestFirst(STATIC_FEED[l]).slice(0, 3).map((e) => ({ title: e.title, href: e.href })); });
    const f = path.join(DIST, '404.html');
    if (fs.existsSync(f)) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('/*__ARTS__*/', 'window.__ARTS = ' + JSON.stringify(arts).replace(/</g, '\\u003c') + ';'));
  }
  COPY_DIRS.forEach(copyInto);
  console.log('  estáticos             ' + (COPY_FILES.length + COPY_DIRS.length) + ' itens copiados');
  await minifyDist();

  console.log('\nPronto. Publicar a pasta dist/.');
}

/* Minificação de CSS/JS inline em dist/ (terser + csso são opcionais: sem node_modules, as páginas ficam como estão).
   Só espaços e comentários — sem renomear identificadores — para os testes e o /*__ARTS__* / continuarem legíveis. */
function walkHtml(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walkHtml(p) : (d.name.endsWith('.html') ? [p] : []);
  });
}
async function minifyDist() {
  let terser, csso;
  try { terser = require('terser'); csso = require('csso'); } catch (e) { console.log('  minificação           saltada (npm install para ativar)'); return; }
  const files = walkHtml(DIST);
  let saved = 0;
  for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    let out = html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (m, o, css, c) => {
      try { return o + csso.minify(css).css + c; } catch (e) { return m; }
    });
    const re = /(<script(?:\s[^>]*)?>)([\s\S]*?)(<\/script>)/g;
    let res = '', last = 0, mm;
    while ((mm = re.exec(out))) {
      const [all, o, js, c] = mm;
      const type = (o.match(/type="([^"]*)"/) || [])[1];
      res += out.slice(last, mm.index); last = mm.index + all.length;
      if (!js.trim() || (type && type !== 'text/javascript' && type !== 'module')) { res += all; continue; }
      let min = js;
      try {
        const r = await terser.minify(js, { compress: false, mangle: false, module: type === 'module', format: { comments: false } });
        if (r.code) min = r.code;
      } catch (e) { console.log('  aviso: ' + path.relative(DIST, f) + ' — script não minificado: ' + String(e.message).slice(0, 90)); }
      res += o + min + c;
    }
    res += out.slice(last);
    saved += html.length - res.length;
    fs.writeFileSync(f, res);
  }
  console.log('  minificação           ' + files.length + ' páginas, −' + Math.round(saved / 1024) + ' KiB');
}

main().catch((e) => { console.error(e); process.exit(1); });
