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

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://prstudio.ch';

const LANGS = ['pt', 'de', 'fr', 'it', 'en'];
const HTML_LANG = { pt: 'pt-PT', de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en' };
const OG_LOCALE = { pt: 'pt_PT', de: 'de_CH', fr: 'fr_CH', it: 'it_CH', en: 'en_US' };
/* prefixo de URL de cada idioma; o português é a raiz */
const PREFIX = { pt: '/', de: '/de/', fr: '/fr/', it: '/it/', en: '/en/' };

/* páginas com o sistema .i18n-doc (um bloco por idioma no mesmo ficheiro) */
const DOC_PAGES = ['blog.html', 'preco-site-suica.html', 'multilingue-valais.html', 'hotel-direkt.html']
  .filter((f) => fs.existsSync(path.join(ROOT, f)));
/* ficheiros copiados tal e qual para a raiz de dist/ */
const COPY_FILES = [
  'privacidade.html', 'termos.html', 'informacao-legal.html',
  'supabase.min.js', 'og.png', 'favicon.ico', 'robots.txt',
  'site.webmanifest', '_headers',
];
const COPY_DIRS = ['img', 'hotel-alpina', 'demos'];  /* store/ só quando a loja arrancar */

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

function writeFile(rel, content) {
  const full = path.join(DIST, rel);
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

    html = rewriteHead(html, lang, pathFor, TITLES[lang].t, TITLES[lang].d);
    html = injectLangGlobals(html, lang);
    if (lang !== 'pt') html = absolutize(html, lang);

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

function buildDocPage(file) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) { console.log('  aviso: ' + file + ' não existe — ignorado'); return; }
  const src = fs.readFileSync(abs, 'utf8');
  const TITLES = evalObject(src, 'var TITLES =');
  const pathFor = (l) => PREFIX[l] + file;

  LANGS.forEach((lang) => {
    // mantém só os blocos do idioma pedido
    let html = src.replace(
      /<(div|span)([^>]*\bclass="[^"]*i18n-doc[^"]*"[^>]*)>([\s\S]*?)<\/\1>/g,
      (m, tag, attrs) => {
        const l = (attrs.match(/data-lang="([^"]+)"/) || [])[1];
        return l === lang ? m : '';
      }
    );
    // já não está escondido por JS: mostra-o de raiz
    html = html.replace(/\.i18n-doc \{ display:none; \}/,
      () => '.i18n-doc { display:block; }\n.i18n-doc.lg-links { display:flex; }');

    const block = (src.match(
      new RegExp('<div class="i18n-doc" data-lang="' + lang + '">([\\s\\S]*?)</div>')
    ) || [, ''])[1];

    html = rewriteHead(html, lang, pathFor, TITLES[lang], firstParagraph(block));
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

function buildSitemap() {
  const stamp = today();
  const groups = [{ pathFor: (l) => PREFIX[l], priority: '1.0', freq: 'weekly' }];
  DOC_PAGES.forEach((f) => {
    groups.push({
      pathFor: (l) => PREFIX[l] + f,
      priority: '0.7',
      freq: f === 'blog.html' ? 'monthly' : 'monthly',
    });
  });

  const urls = [];
  groups.forEach((g) => {
    LANGS.forEach((lang) => {
      const alts = LANGS
        .map((l) => '    <xhtml:link rel="alternate" hreflang="' + l + '" href="' + ORIGIN + g.pathFor(l) + '"/>')
        .concat(['    <xhtml:link rel="alternate" hreflang="x-default" href="' + ORIGIN + g.pathFor('pt') + '"/>'])
        .join('\n');
      urls.push(
        '  <url>\n' +
        '    <loc>' + ORIGIN + g.pathFor(lang) + '</loc>\n' +
        '    <lastmod>' + stamp + '</lastmod>\n' +
        '    <changefreq>' + g.freq + '</changefreq>\n' +
        '    <priority>' + g.priority + '</priority>\n' +
        alts + '\n' +
        '  </url>'
      );
    });
  });

  ['privacidade.html', 'termos.html', 'informacao-legal.html'].forEach((f) => {
    urls.push(
      '  <url>\n    <loc>' + ORIGIN + '/' + f + '</loc>\n' +
      '    <lastmod>' + stamp + '</lastmod>\n' +
      '    <changefreq>yearly</changefreq>\n    <priority>0.3</priority>\n  </url>'
    );
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

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  console.log('PR Studio — a gerar site multilingue em dist/\n');
  buildHome();
  DOC_PAGES.forEach(buildDocPage);
  buildSitemap();
  buildRedirects();

  COPY_FILES.forEach(copyInto);
  COPY_DIRS.forEach(copyInto);
  console.log('  estáticos             ' + (COPY_FILES.length + COPY_DIRS.length) + ' itens copiados');

  console.log('\nPronto. Publicar a pasta dist/.');
}

main();
