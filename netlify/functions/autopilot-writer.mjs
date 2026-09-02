// Escritor automático — gatilho agendado (netlify.toml: todos os dias às 06:00 UTC).
// As funções agendadas têm um limite de execução curto; o trabalho real (5 idiomas +
// editor, vários minutos) corre em autopilot-writer-background.mjs, uma função de fundo.
// Este gatilho só a chama com um token derivado da chave de serviço e termina.
// Sem URL do site (dev local), corre o pipeline em linha.

import bg, { token, run } from './autopilot-writer-background.mjs';

export default async () => {
  const site = process.env.URL || process.env.DEPLOY_PRIME_URL;
  if (!site) {
    try { return new Response(await run()); } catch (e) { return new Response(`erro: ${e.message}`, { status: 502 }); }
  }
  const r = await fetch(`${site}/.netlify/functions/autopilot-writer-background`, {
    method: 'POST', headers: { 'x-autopilot-token': token(), 'content-type': 'application/json' }, body: '{}',
  }).catch((e) => ({ ok: false, status: 0, text: async () => String(e.message) }));
  const body = await r.text().catch(() => '');
  console.log('[autopilot] gatilho →', r.status, body.slice(0, 200));
  return new Response(`gatilho: ${r.status} ${body.slice(0, 200)}`, { status: r.ok || r.status === 202 ? 200 : 502 });
};

export { bg as background };
