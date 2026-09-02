// Links internos do dist/ apontam para ficheiros reais; o sitemap só lista páginas que existem.
const { DIST } = require('./_env');
const fs = require('fs'); const path = require('path');
let pass = 0, fail = 0;
function ok(name, cond, extra) { if (cond) { pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); } }
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
const bad = []; let total = 0;
for (const f of walk(DIST)) {
  const h = fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<template[\s\S]*?<\/template>/g, '');
  for (const m of h.matchAll(/(?:href|src)="([^"#?]+)(?:[#?][^"]*)?"/g)) {
    const u = m[1]; if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(u)) continue; total++;
    let p = u.startsWith('/') ? path.join(DIST, u) : path.join(path.dirname(f), u); if (u.endsWith('/')) p = path.join(p, 'index.html');
    if (!fs.existsSync(p)) bad.push(f.slice(DIST.length + 1) + ' → ' + u);
  }
}
ok('links internos resolvem para ficheiros (' + total + ')', bad.length === 0, bad.slice(0, 5).join(' | '));
const sm = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://prstudio.ch', ''));
const missing = locs.filter((l) => { let p = path.join(DIST, l); if (l.endsWith('/')) p = path.join(p, 'index.html'); return !fs.existsSync(p); });
ok('sitemap: todas as URLs existem (' + locs.length + ')', missing.length === 0, missing.join(' | '));
const noindex = walk(DIST).filter((f) => /name="robots" content="noindex/.test(fs.readFileSync(f, 'utf8'))).map((f) => '/' + f.slice(DIST.length + 1));
ok('sitemap não inclui páginas noindex', !noindex.some((n) => locs.includes(n)), noindex.filter((n) => locs.includes(n)).join(' | '));
console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
process.exit(fail ? 1 : 0);
