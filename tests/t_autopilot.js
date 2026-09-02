// Escritor automático (função de fundo): pipeline completo com Supabase e Anthropic simulados.
// Verifica: token, limite de rascunhos, tema automático, 5 idiomas, editor, slug único, notas do admin.
const path = require('path');
let pass = 0, fail = 0;
function ok(name, cond, extra) { if (cond) { pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); } }

process.env.SUPABASE_URL = 'https://sb.test';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key-de-teste';
process.env.ANTHROPIC_API_KEY = 'ak-teste';
process.env.AUTOPILOT_STATUS = 'draft';
process.env.AUTOPILOT_MAX_DRAFTS = '3';

const state = { topics: [], posts: [], notes: '', calls: [], drafts: 0, patches: [] };
const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });
const article = (lang, title) => ({ title, description: 'Descrição de teste com comprimento suficiente para o Google e para o cartão do blog, ok.', body_html: '<p>' + ('palavra ' + lang + ' ').repeat(340) + '</p>' });

global.fetch = async (url, opt = {}) => {
  const u = String(url); const m = opt.method || 'GET'; state.calls.push(m + ' ' + u.replace('https://sb.test/rest/v1/', ''));
  if (u.startsWith('https://api.anthropic.com')) {
    const body = JSON.parse(opt.body); const sys = body.system;
    let out;
    if (/Planeias o blog/.test(sys)) out = { topic: 'Site para salão de cabeleireiro em Visp: marcações online', brief: 'Ângulo: marcações e horários.' };
    else if (/És o editor/.test(sys)) { const d = JSON.parse(body.messages[0].content); out = { ...d, description: d.description.replace('ok.', 'revisto.') }; }
    else { const lang = (sys.match(/Escreves em ([a-zç]+)/) || [])[1]; out = article(lang, lang === 'portugu' ? 'Site para salão em Visp: marcações que funcionam' : 'Titel ' + lang); }
    return json({ content: [{ type: 'text', text: JSON.stringify(out) }] });
  }
  const p = u.replace('https://sb.test/rest/v1/', '');
  if (m === 'GET' && p.startsWith('posts?status=eq.draft')) return json(Array.from({ length: state.drafts }, (_, i) => ({ slug: 'd' + i })));
  if (m === 'GET' && p.startsWith('post_topics?status=eq.pending')) return json(state.topics.filter((t) => t.status === 'pending').slice(0, 1));
  if (m === 'GET' && p.startsWith('post_topics?status=in.')) return json([]);
  if (m === 'GET' && p.startsWith('posts?lang=eq.pt')) return json([{ title: 'Artigo antigo', slug: 'antigo' }]);
  if (m === 'GET' && p.startsWith('posts?slug=eq.')) { const s = decodeURIComponent(p.match(/slug=eq\.([^&]+)/)[1]); return json(state.posts.some((x) => x.slug === s) ? [{ slug: s }] : []); }
  if (m === 'GET' && p.startsWith('admin_notes')) return json([{ content: state.notes }]);
  if (m === 'POST' && p.startsWith('post_topics')) { const t = { ...JSON.parse(opt.body), id: 't' + (state.topics.length + 1), status: 'pending' }; state.topics.push(t); return json([t], 201); }
  if (m === 'PATCH' && p.startsWith('post_topics')) { const patch = JSON.parse(opt.body); const id = decodeURIComponent(p.match(/id=eq\.([^&]+)/)[1]); const t = state.topics.find((x) => x.id === id); if (t) Object.assign(t, patch); state.patches.push(patch); return new Response(null, { status: 204 }); }
  if (m === 'POST' && p.startsWith('posts')) { state.posts.push(...JSON.parse(opt.body)); return new Response('', { status: 201 }); }
  if (m === 'POST' && p.startsWith('admin_notes')) { state.notes = JSON.parse(opt.body).content; return new Response('', { status: 201 }); }
  return new Response('rota não simulada: ' + m + ' ' + p, { status: 500 });
};

(async () => {
  const mod = await import('file://' + path.resolve(__dirname, '../netlify/functions/autopilot-writer-background.mjs'));
  const handler = mod.default, token = mod.token();

  // 1) token errado → 401
  const r401 = await handler(new Request('https://x/.netlify/functions/autopilot-writer-background', { method: 'POST', headers: { 'x-autopilot-token': 'errado' } }));
  ok('token errado devolve 401', r401.status === 401);

  // 2) fila vazia → tema automático, artigo em 5 idiomas, editor, rascunho
  const r = await handler(new Request('https://x/', { method: 'POST', headers: { 'x-autopilot-token': token } }));
  const txt = await r.text();
  ok('corre com token certo', r.status === 200, txt);
  ok('tema automático criado na fila', state.topics.length === 1 && /\[auto\]/.test(state.topics[0].brief), JSON.stringify(state.topics[0]));
  ok('tema marcado como done com slug', state.topics[0].status === 'done' && !!state.topics[0].slug);
  ok('5 idiomas inseridos', state.posts.length === 5 && ['pt', 'de', 'fr', 'it', 'en'].every((l) => state.posts.some((p) => p.lang === l)), state.posts.map((p) => p.lang).join(','));
  ok('estado draft e sem published_at', state.posts.every((p) => p.status === 'draft' && p.published_at === null));
  ok('slug derivado do título PT', state.posts[0].slug === 'site-para-salao-em-visp-marcacoes-que-funcionam', state.posts[0].slug);
  ok('editor aplicado (description revista)', state.posts.every((p) => /revisto\./.test(p.description)));
  ok('nota no admin com o título', /Rascunho pronto para rever/.test(state.notes) && /marcações que funcionam/.test(state.notes), state.notes.slice(0, 80));
  const anth = state.calls.filter((c) => /anthropic/.test(c)).length;
  ok('chamadas à API: 1 tema + 5 artigos + 5 editor', anth === 11, String(anth));

  // 3) slug repetido → sufixo -2
  state.topics.push({ id: 't9', topic: 'Outro tema', brief: '', langs: ['pt', 'de'], status: 'pending' });
  state.calls.length = 0;
  const r2 = await handler(new Request('https://x/', { method: 'POST', headers: { 'x-autopilot-token': token } }));
  ok('segundo artigo com o mesmo título ganha slug -2', r2.status === 200 && state.posts.slice(-2).every((p) => p.slug === 'site-para-salao-em-visp-marcacoes-que-funcionam-2'), state.posts.slice(-1)[0] && state.posts.slice(-1)[0].slug);
  ok('só os idiomas pedidos no tema', state.posts.slice(-2).map((p) => p.lang).sort().join(',') === 'de,pt');

  // 4) limite de rascunhos por rever
  state.drafts = 3;
  const r3 = await handler(new Request('https://x/', { method: 'POST', headers: { 'x-autopilot-token': token } }));
  ok('com 3 rascunhos por rever não escreve', /rascunhos por rever/.test(await r3.text()));

  console.log('\nResultado: ' + pass + ' passaram, ' + fail + ' falharam');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
