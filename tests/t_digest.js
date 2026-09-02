// Resumo semanal: consultas simuladas e texto do resumo.
let pass = 0, fail = 0;
function ok(name, cond, extra) { if (cond) { pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); } }
process.env.SUPABASE_URL = 'https://sb.test'; process.env.SUPABASE_SERVICE_ROLE_KEY = 'k';
const json = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'content-type': 'application/json' } });
let saved = null;
global.fetch = async (url, opt = {}) => {
  const p = String(url).replace('https://sb.test/rest/v1/', ''); const m = opt.method || 'GET';
  if (m === 'GET' && p.startsWith('visits')) return json([{ lang: 'de' }, { lang: 'de' }, { lang: 'pt' }]);
  if (m === 'GET' && p.startsWith('posts?status=eq.draft')) return json([{ slug: 'a', title: 'Rascunho A', lang: 'pt' }, { slug: 'a', title: 'Entwurf A', lang: 'de' }]);
  if (m === 'GET' && p.startsWith('post_topics')) return json([]);
  if (m === 'GET' && p.startsWith('posts?status=eq.published')) return json([{ title: 'Publicado X', published_at: '2026-09-01T06:00:00Z' }]);
  if (m === 'GET' && p.startsWith('admin_notes')) return json([{ content: 'nota antiga' }]);
  if (m === 'POST' && p.startsWith('admin_notes')) { saved = JSON.parse(opt.body).content; return new Response(null, { status: 204 }); }
  return new Response('rota não simulada ' + p, { status: 500 });
};
(async () => {
  const mod = await import('file://' + require('path').resolve(__dirname, '../netlify/functions/weekly-digest.mjs'));
  const r = await mod.default(); const t = await r.text();
  ok('responde 200', r.status === 200, t);
  ok('conta visitas por idioma', /Visitas \(7 dias\): 3 — DE 2 · PT 1/.test(t), t);
  ok('rascunhos únicos por slug com título PT', /Rascunhos por rever: 1 — Rascunho A/.test(t), t);
  ok('fila vazia explica o tema automático', /o escritor propõe um tema sozinho/.test(t));
  ok('últimos publicados', /Publicado X \(2026-09-01\)/.test(t));
  ok('resumo fica no topo das notas, nota antiga preservada', saved && saved.startsWith('▶ Resumo semanal') && /nota antiga$/.test(saved));
  console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam'); process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
