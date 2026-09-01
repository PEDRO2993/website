// Cron Netlify (agendado em netlify.toml). Publica o que está 'scheduled' com
// publish_at vencido. A mudança de status dispara o trigger da BD → build.
// Sem dependências: Node 20 tem fetch.

const SB   = process.env.SUPABASE_URL;
const KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;   // SÓ aqui (server-side). Nunca no build nem no cliente.
const HOOK = process.env.NETLIFY_BUILD_HOOK;          // opcional: redundância se o trigger da BD estiver desligado

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

export default async () => {
  if (!SB || !KEY) return new Response('env em falta', { status: 500 });

  const now = new Date().toISOString();
  const due = await fetch(
    `${SB}/rest/v1/posts?status=eq.scheduled&publish_at=lte.${encodeURIComponent(now)}&select=id,slug,lang`,
    { headers: H }
  ).then(r => r.json());

  if (!Array.isArray(due) || due.length === 0) return new Response('nada a publicar');

  const ids = due.map(p => p.id).join(',');
  const upd = await fetch(`${SB}/rest/v1/posts?id=in.(${ids})`, {
    method: 'PATCH',
    headers: { ...H, Prefer: 'return=minimal' },
    body: JSON.stringify({ status: 'published', published_at: now }),
  });
  if (!upd.ok) return new Response(`erro ${upd.status}: ${await upd.text()}`, { status: 502 });

  // trigger da BD já dispara o build; só chama o hook se for pedido explicitamente
  if (HOOK && process.env.NETLIFY_BUILD_HOOK_FALLBACK === '1') await fetch(HOOK, { method: 'POST' });

  return new Response(`publicados: ${due.map(p => `${p.slug}/${p.lang}`).join(', ')}`);
};
