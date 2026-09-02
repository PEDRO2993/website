// Resumo semanal para o admin (agendado: segunda-feira 07:00 UTC, netlify.toml).
// Lê visitas dos últimos 7 dias, rascunhos por rever, temas na fila e últimos artigos,
// e escreve um bloco no topo das notas do admin. Só leitura na BD + 1 upsert; sem dependências.
const SB = process.env.SUPABASE_URL, KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_NOTES_ID = '00000000-0000-4000-8000-000000000001';
const H = () => ({ apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' });
const get = (path) => fetch(`${SB}/rest/v1/${path}`, { headers: H() }).then(async (r) => (r.ok ? r.json() : []));

export async function digest() {
  const since = new Date(Date.now() - 7 * 864e5).toISOString();
  const [visits, drafts, topics, latest] = await Promise.all([
    get(`visits?created_at=gte.${encodeURIComponent(since)}&select=lang&limit=5000`),
    get('posts?status=eq.draft&select=slug,title,lang'),
    get('post_topics?status=eq.pending&select=topic'),
    get('posts?status=eq.published&lang=eq.pt&select=title,published_at&order=published_at.desc&limit=3'),
  ]);
  const byLang = {};
  (Array.isArray(visits) ? visits : []).forEach((v) => { const l = v.lang || '?'; byLang[l] = (byLang[l] || 0) + 1; });
  const total = Object.values(byLang).reduce((a, b) => a + b, 0);
  const langs = Object.entries(byLang).sort((a, b) => b[1] - a[1]).map(([l, n]) => `${l.toUpperCase()} ${n}`).join(' · ');
  const draftSlugs = [...new Set((Array.isArray(drafts) ? drafts : []).map((d) => d.slug))];
  const draftTitles = draftSlugs.map((s) => (drafts.find((d) => d.slug === s && d.lang === 'pt') || drafts.find((d) => d.slug === s) || {}).title).filter(Boolean);
  const lines = [
    `▶ Resumo semanal ${new Date().toISOString().slice(0, 10)}`,
    `  Visitas (7 dias): ${total}${langs ? ' — ' + langs : ''}`,
    `  Rascunhos por rever: ${draftSlugs.length}${draftTitles.length ? ' — ' + draftTitles.slice(0, 3).join(' | ') : ''}`,
    `  Temas na fila: ${Array.isArray(topics) ? topics.length : 0}${Array.isArray(topics) && topics.length ? ' — ' + topics.slice(0, 3).map((t) => t.topic).join(' | ') : ' (o escritor propõe um tema sozinho)'}`,
    `  Últimos publicados: ${Array.isArray(latest) && latest.length ? latest.map((p) => `${p.title} (${String(p.published_at).slice(0, 10)})`).join(' | ') : 'ainda nenhum artigo da BD'}`,
  ];
  return lines.join('\n');
}

export default async () => {
  if (!SB || !KEY) return new Response('env em falta', { status: 500 });
  const text = await digest();
  const rows = await get(`admin_notes?id=eq.${ADMIN_NOTES_ID}&select=content`);
  const cur = Array.isArray(rows) && rows[0] ? String(rows[0].content || '') : '';
  const r = await fetch(`${SB}/rest/v1/admin_notes?on_conflict=id`, {
    method: 'POST', headers: { ...H(), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: ADMIN_NOTES_ID, content: `${text}\n\n${cur}`.slice(0, 20000), updated_at: new Date().toISOString() }),
  });
  console.log('[digest]', r.status, text.replace(/\n/g, ' | '));
  return new Response(r.ok ? text : `erro ao guardar (${r.status})`, { status: r.ok ? 200 : 502 });
};
