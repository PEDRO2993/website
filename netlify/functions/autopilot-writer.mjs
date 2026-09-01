// Escritor automático (agendado em netlify.toml). Pega no tema pendente mais antigo,
// escreve o artigo em cada idioma com a API da Anthropic (HTTP direto: o projeto não
// tem npm install) e insere em posts. O trigger da BD dispara o build se for 'published'.
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY,
//      AUTOPILOT_STATUS = draft (por omissão, revês no admin) | published (sai logo).

const SB   = process.env.SUPABASE_URL;
const KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AK   = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.AUTOPILOT_MODEL || 'claude-sonnet-5';
const STATUS = process.env.AUTOPILOT_STATUS === 'published' ? 'published' : 'draft';

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const LANG_NAME = {
  pt: 'português europeu (trata o leitor por "tu")',
  de: 'Schweizer Hochdeutsch (Sie-Form, "ss" statt "ß")',
  fr: 'français de Suisse romande (vouvoiement)',
  it: 'italiano (dai del "tu")',
  en: 'English (British spelling)',
};

// factos que o modelo PODE usar; tudo o resto é proibido inventar
const FACTS = `Autor: Pedro Ribeiro, PR Studio, estúdio de uma pessoa em Stalden (Valais/Wallis, Suíça). Faz websites, marketing digital e social media para negócios locais do Alto Valais (Brig, Visp, Zermatt, Saas-Fee, Leukerbad, Sion) e trabalha em PT/DE/FR/IT/EN.
Preços fixos reais: landing page CHF 2'400 (~7 dias); site institucional até 5 páginas CHF 4'900 (~1 mês); loja online / aplicação à medida desde CHF 9'800 (até 3 meses); manutenção e alojamento CHF 95–290/mês; avaliação gratuita em 48 h; se a primeira proposta de design não convencer, o cliente não paga.`;

const RULES = `Regras: 650–900 palavras. Só HTML de corpo: <p>, <h2>, <h3>, <ul>/<li>, <strong>, <table class="lg-tbl"> se fizer sentido. Sem <h1>, sem <html>/<body>, sem imagens, sem links externos. Concreto e útil para donos de pequenos negócios no Valais; exemplos locais plausíveis mas SEM inventar clientes, testemunhos, estatísticas com fonte, ou preços fora da lista. Não termines com apelo à ação (a página já tem). Sem introduções tipo "neste artigo".`;

async function askClaude(system, user) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': AK, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 4000, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!r.ok) throw new Error(`anthropic ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const txt = (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  const m = txt.match(/\{[\s\S]*\}/); // o modelo devolve só JSON, mas protege-se
  if (!m) throw new Error('resposta sem JSON');
  return JSON.parse(m[0]);
}

const slugify = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

export default async () => {
  if (!SB || !KEY || !AK) return new Response('env em falta (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY)', { status: 500 });

  const [topic] = await fetch(`${SB}/rest/v1/post_topics?status=eq.pending&order=created_at.asc&limit=1`, { headers: H }).then((r) => r.json());
  if (!topic) return new Response('fila vazia');

  const mark = (patch) => fetch(`${SB}/rest/v1/post_topics?id=eq.${encodeURIComponent(topic.id)}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(patch),
  });
  await mark({ status: 'writing' });

  try {
    const langs = (topic.langs && topic.langs.length ? topic.langs : ['pt']).filter((l) => LANG_NAME[l]);
    const order = langs.includes('pt') ? ['pt', ...langs.filter((l) => l !== 'pt')] : langs;
    let slug = null, baseTitle = null, baseBody = null;
    const now = new Date().toISOString();
    const rows = [];

    for (const lang of order) {
      const system = `És o Pedro Ribeiro a escrever no blog do PR Studio. Escreves em ${LANG_NAME[lang]}. ${FACTS}\n${RULES}\nResponde APENAS com JSON: {"title": "...", "description": "... (120–155 caracteres, para o Google)", "body_html": "..."}.`;
      const user = baseBody
        ? `Adapta (não traduzas à letra) este artigo para ${LANG_NAME[lang]}, mantendo estrutura e factos:\nTÍTULO: ${baseTitle}\n${baseBody}`
        : `Tema: ${topic.topic}${topic.brief ? `\nNotas: ${topic.brief}` : ''}`;
      const out = await askClaude(system, user);
      if (!out.title || !out.description || !out.body_html) throw new Error(`resposta incompleta (${lang})`);
      if (!slug) slug = slugify(out.title) || slugify(topic.topic);
      if (!baseBody) { baseTitle = out.title; baseBody = out.body_html; }
      rows.push({
        slug, lang, title: out.title, description: String(out.description).slice(0, 160), body_html: out.body_html,
        status: STATUS, published_at: STATUS === 'published' ? now : null,
      });
    }

    const ins = await fetch(`${SB}/rest/v1/posts?on_conflict=slug,lang`, {
      method: 'POST', headers: { ...H, Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(rows),
    });
    if (!ins.ok) throw new Error(`posts insert ${ins.status}: ${await ins.text()}`);
    await mark({ status: 'done', slug, done_at: now, error: null });
    return new Response(`escrito: ${slug} [${order.join(',')}] como ${STATUS}`);
  } catch (e) {
    await mark({ status: 'error', error: String(e.message || e).slice(0, 500) });
    return new Response(`erro: ${e.message}`, { status: 502 });
  }
};
