// Escritor automático — função de fundo (até 15 min no Netlify). É chamada pela função
// agendada autopilot-writer.mjs com um token derivado da chave de serviço.
// Pipeline: fila de temas (ou tema automático) → artigo PT → adaptações DE/FR/IT/EN em
// paralelo → passagem de editor por idioma → slug único → posts (draft por omissão) →
// nota no bloco de notas do admin. HTTP direto (o projeto não tem npm install).
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY,
//      AUTOPILOT_STATUS=draft|published, AUTOPILOT_MODEL, AUTOPILOT_AUTOTOPIC=1|0,
//      AUTOPILOT_MAX_DRAFTS=3 (não escreve mais enquanto houver N rascunhos por rever).

import { createHmac } from 'node:crypto';

const env = (k, d) => (process.env[k] === undefined || process.env[k] === '' ? d : process.env[k]);
const SB = env('SUPABASE_URL'), KEY = env('SUPABASE_SERVICE_ROLE_KEY'), AK = env('ANTHROPIC_API_KEY');
const MODEL = env('AUTOPILOT_MODEL', 'claude-sonnet-5');
const STATUS = env('AUTOPILOT_STATUS') === 'published' ? 'published' : 'draft';
const AUTOTOPIC = env('AUTOPILOT_AUTOTOPIC', '1') !== '0';
const MAX_DRAFTS = Math.max(1, parseInt(env('AUTOPILOT_MAX_DRAFTS', '3'), 10) || 3);
const BACKOFF = String(env('AUTOPILOT_RETRY_MS', '2000,6000,15000')).split(',').map((n) => Math.max(0, parseInt(n, 10) || 0));
const ADMIN_NOTES_ID = '00000000-0000-4000-8000-000000000001';

export const token = () => createHmac('sha256', String(KEY || '')).update('prstudio-autopilot').digest('hex');

const H = () => ({ apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' });
const LANG_NAME = {
  pt: 'português europeu (trata o leitor por "tu")',
  de: 'Schweizer Hochdeutsch (Sie-Form, "ss" statt "ß", Schweizer Begriffe: Offerte, Reservation, Abo)',
  fr: 'français de Suisse romande (vouvoiement; espace insécable U+00A0 avant : ; ? ! et à l’intérieur des « »)',
  it: 'italiano (dai del "tu")',
  en: 'English (British spelling)',
};
const LANGS = ['pt', 'de', 'fr', 'it', 'en'];
const PREFIX = { pt: '/', de: '/de/', fr: '/fr/', it: '/it/', en: '/en/' };

const FACTS = `Autor: Pedro Ribeiro, PR Studio, estúdio de uma pessoa em Stalden (Alto Valais / Oberwallis, Suíça). Faz websites, marketing digital e social media para negócios locais do Alto Valais (Brig, Visp, Zermatt, Saas-Fee, Leukerbad, Sion) e trabalha em PT/DE/FR/IT/EN.
Preços fixos reais: landing page CHF 2'400 (~1 semana); site institucional até 5 páginas CHF 4'900 (~1 mês); loja online / aplicação à medida desde CHF 9'800 (até 3 meses); manutenção e alojamento CHF 95–290/mês, cancelável com 30 dias de aviso; avaliação gratuita em 48 h; os ficheiros do site são do cliente.`;
const STATIC_ARTICLES = [
  ['preco-site-suica.html', 'Quanto custa um site profissional na Suíça (preços reais)'],
  ['multilingue-valais.html', 'Porque a tua empresa no Valais precisa de um site multilingue'],
  ['google-business-valais.html', 'Ficha Google Business no Valais: aparecer no mapa antes da concorrência'],
  ['site-restaurante-valais.html', 'Site para restaurante no Valais: o que precisa mesmo ter'],
  ['manutencao-site.html', 'Manutenção de um site: o que inclui e o que acontece sem ela'],
  ['fotografia-site-negocio.html', 'Fotografia para o site de um negócio local: o que preparar antes da sessão'],
  ['site-hotel-valais.html', 'Site para hotel ou alojamento de montanha: reservas diretas'],
];
const RULES = (lang) => `Regras: 650–900 palavras. Só HTML de corpo: <p>, <h2>, <h3>, <ul>/<li>, <strong>, <table class="lg-tbl"> se fizer sentido. Sem <h1>, sem <html>/<body>, sem imagens. Concreto e útil para donos de pequenos negócios no Alto Valais; exemplos locais plausíveis mas SEM inventar clientes, testemunhos, estatísticas com fonte, prémios ou preços fora da lista. Nunca afirmes ordens de importância, percentagens ou "estudos" que não possas citar; prefere "muitos" a "a maioria". Não termines com apelo à ação (a página já tem). Sem introduções tipo "neste artigo". Podes incluir no máximo 2 links internos, só quando forem mesmo úteis, com estes URLs exatos: ${STATIC_ARTICLES.map(([f, t]) => PREFIX[lang] + f + ' (' + t + ')').join('; ')}.`;
const EDITOR = (lang) => `És o editor do blog do PR Studio. Recebes um artigo em ${LANG_NAME[lang]} e devolves a versão corrigida com o MESMO formato JSON {"title","description","body_html"}. Corrige: registo (${lang === 'de' ? 'Sie' : lang === 'fr' ? 'vous' : 'tu/you'}), ortografia suíça (DE sem ß; FR com espaço insecável U+00A0 antes de : ; ? ! e dentro de « »), calques de outras línguas, apóstrofos tipográficos (’), afirmações absolutas ou estatísticas sem fonte (suaviza), preços diferentes dos reais (remove), clientes ou testemunhos inventados (remove), description com 120–155 caracteres, title com menos de 70 caracteres. Mantém a estrutura, as ideias e o HTML. Se estiver tudo bem, devolve igual. Responde APENAS com o JSON.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slugify = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
const words = (html) => String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
/* A Suíça não escreve ß. O modelo é instruído duas vezes (escritor e editor),
   mas instrução não é garantia — e quem revê o rascunho lê português, por isso
   um ß no meio do alemão passa despercebido até estar publicado. Determinístico. */
const swissDe = (lang, s) => (lang === 'de' ? String(s).replace(/ß/g, 'ss') : String(s));

async function askClaude(system, user, { maxTokens = 4500, tries = 3 } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': AK, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
      });
      if (r.status === 429 || r.status === 529 || r.status >= 500) { last = new Error(`anthropic ${r.status}`); await sleep(BACKOFF[i] === undefined ? BACKOFF[BACKOFF.length - 1] : BACKOFF[i]); continue; }
      if (!r.ok) throw new Error(`anthropic ${r.status}: ${(await r.text()).slice(0, 300)}`);
      const j = await r.json();
      const txt = (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
      const m = txt.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('resposta sem JSON');
      return JSON.parse(m[0]);
    } catch (e) {
      last = e;
      if (i === tries - 1) break;
      await sleep(BACKOFF[i] === undefined ? BACKOFF[BACKOFF.length - 1] : BACKOFF[i]);
    }
  }
  throw last || new Error('anthropic: sem resposta');
}

const sbGet = (path) => fetch(`${SB}/rest/v1/${path}`, { headers: H() }).then(async (r) => { if (!r.ok) throw new Error(`supabase GET ${path}: ${r.status}`); return r.json(); });
const sbWrite = (method, path, body, prefer = 'return=minimal') => fetch(`${SB}/rest/v1/${path}`, {
  method, headers: { ...H(), Prefer: prefer }, body: JSON.stringify(body),
}).then(async (r) => { if (!r.ok) throw new Error(`supabase ${method} ${path}: ${r.status} ${(await r.text()).slice(0, 200)}`); return prefer.includes('representation') ? r.json() : null; });

async function pendingDraftSlugs() {
  const rows = await sbGet('posts?status=eq.draft&select=slug');
  return [...new Set((Array.isArray(rows) ? rows : []).map((p) => p.slug))];
}

async function autoTopic() {
  const posts = await sbGet('posts?lang=eq.pt&select=title,slug&order=created_at.desc&limit=60').catch(() => []);
  const done = await sbGet('post_topics?status=in.(done,pending,writing)&select=topic&order=created_at.desc&limit=60').catch(() => []);
  const existing = [...STATIC_ARTICLES.map(([, t]) => t), ...(Array.isArray(posts) ? posts.map((p) => p.title) : []), ...(Array.isArray(done) ? done.map((t) => t.topic) : [])];
  const system = `Planeias o blog do PR Studio (Pedro Ribeiro, Stalden, Alto Valais). ${FACTS}\nPúblico: donos de restaurantes, hotéis e alojamento, clínicas e consultórios, salões e barbearias, ginásios, lojas e artesãos, imobiliárias e serviços locais do Alto Valais. Temas possíveis: site (o que precisa, erros, custos, fotografia, domínio e alojamento, reservas e formulários), presença local (Google Business, avaliações, mapas, diretórios), redes sociais (Instagram, o que publicar, frequência), anúncios locais (Google Ads, Meta Ads, quando faz sentido), multilingue e turismo, manutenção e segurança, e-mail e newsletters.\nEscolhe UM tema novo, prático e específico, que NÃO se sobreponha a estes já existentes:\n- ${existing.join('\n- ')}\nResponde APENAS com JSON: {"topic": "título de trabalho em português, concreto (setor + problema)", "brief": "2–3 frases: ângulo, público, o que o leitor fica a saber"}.`;
  const out = await askClaude(system, 'Propõe o próximo tema.', { maxTokens: 600 });
  if (!out.topic) throw new Error('tema automático inválido');
  const rows = await sbWrite('POST', 'post_topics', { topic: String(out.topic).slice(0, 200), brief: '[auto] ' + String(out.brief || '').slice(0, 600), langs: LANGS }, 'return=representation');
  return rows && rows[0];
}

async function uniqueSlug(base) {
  let slug = base || 'artigo', n = 2;
  for (let i = 0; i < 20; i++) {
    const rows = await sbGet(`posts?slug=eq.${encodeURIComponent(slug)}&select=slug&limit=1`);
    if (!Array.isArray(rows) || rows.length === 0) return slug;
    slug = `${base}-${n++}`;
  }
  return `${base}-${Date.now()}`;
}

async function writeLang(lang, topic, base) {
  const system = `És o Pedro Ribeiro a escrever no blog do PR Studio. Escreves em ${LANG_NAME[lang]}. ${FACTS}\n${RULES(lang)}\nResponde APENAS com JSON: {"title": "...", "description": "... (120–155 caracteres, para o Google)", "body_html": "..."}.`;
  const user = base
    ? `Adapta (não traduzas à letra) este artigo para ${LANG_NAME[lang]}, mantendo estrutura, factos e links (troca o prefixo dos links internos para ${PREFIX[lang]}):\nTÍTULO: ${base.title}\n${base.body_html}`
    : `Tema: ${topic.topic}${topic.brief ? `\nNotas: ${topic.brief}` : ''}`;
  let out = await askClaude(system, user);
  if (!out.title || !out.description || !out.body_html) throw new Error(`resposta incompleta (${lang})`);
  if (!base && words(out.body_html) < 500) {
    out = await askClaude(system, `${user}\n\nO artigo anterior tinha só ${words(out.body_html)} palavras; escreve a versão completa com 650–900 palavras.`);
    if (!out.title || !out.description || !out.body_html) throw new Error(`resposta incompleta (${lang}, 2.ª tentativa)`);
  }
  return out;
}

async function editLang(lang, draft) {
  try {
    const out = await askClaude(EDITOR(lang), JSON.stringify({ title: draft.title, description: draft.description, body_html: draft.body_html }), { maxTokens: 4500, tries: 2 });
    if (out && out.title && out.description && out.body_html && words(out.body_html) >= words(draft.body_html) * 0.7) return { ...out, edited: true };
  } catch (e) { /* o editor é opcional: fica o rascunho */ }
  return { ...draft, edited: false };
}

async function notifyAdmin(line) {
  try {
    const rows = await sbGet(`admin_notes?id=eq.${ADMIN_NOTES_ID}&select=content`);
    const cur = Array.isArray(rows) && rows[0] ? String(rows[0].content || '') : '';
    await sbWrite('POST', 'admin_notes?on_conflict=id', { id: ADMIN_NOTES_ID, content: `${line}\n${cur}`.slice(0, 20000), updated_at: new Date().toISOString() }, 'resolution=merge-duplicates,return=minimal');
  } catch (e) { /* notificação é best-effort */ }
}

export async function run() {
  if (!SB || !KEY || !AK) return 'env em falta (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY)';
  const drafts = await pendingDraftSlugs();
  if (drafts.length >= MAX_DRAFTS) return `${drafts.length} rascunhos por rever no admin — não escrevo mais até serem publicados ou apagados`;

  let [topic] = await sbGet('post_topics?status=eq.pending&order=created_at.asc&limit=1');
  let auto = false;
  if (!topic) {
    if (!AUTOTOPIC) return 'fila vazia (tema automático desligado)';
    topic = await autoTopic(); auto = true;
    if (!topic) return 'fila vazia e sem tema automático';
  }
  const mark = (patch) => sbWrite('PATCH', `post_topics?id=eq.${encodeURIComponent(topic.id)}`, patch);
  await mark({ status: 'writing', error: null });

  try {
    const langs = (Array.isArray(topic.langs) && topic.langs.length ? topic.langs : LANGS).filter((l) => LANG_NAME[l]);
    const first = langs.includes('pt') ? 'pt' : langs[0];
    const base = await writeLang(first, topic, null);
    const others = await Promise.all(langs.filter((l) => l !== first).map((l) => writeLang(l, topic, base).then((d) => [l, d])));
    const drafts0 = Object.fromEntries([[first, base], ...others]);
    const edited = Object.fromEntries(await Promise.all(Object.entries(drafts0).map(async ([l, d]) => [l, await editLang(l, d)])));

    const slug = await uniqueSlug(slugify(edited[first].title) || slugify(topic.topic));
    const now = new Date().toISOString();
    const rows = Object.entries(edited).map(([lang, d]) => ({
      slug, lang,
      title: swissDe(lang, d.title).slice(0, 120),
      description: swissDe(lang, d.description).slice(0, 160),
      body_html: swissDe(lang, d.body_html),
      status: STATUS, published_at: STATUS === 'published' ? now : null,
    }));
    await sbWrite('POST', 'posts?on_conflict=slug,lang', rows, 'resolution=merge-duplicates,return=minimal');
    await mark({ status: 'done', slug, done_at: now, error: null });
    const nEdited = Object.values(edited).filter((d) => d.edited).length;
    await notifyAdmin(`• ${now.slice(0, 16).replace('T', ' ')} — ${STATUS === 'draft' ? 'Rascunho pronto para rever' : 'Artigo publicado'}: "${edited[first].title}" [${Object.keys(edited).join(',')}]${auto ? ' (tema automático)' : ''}`);
    return `escrito: ${slug} [${Object.keys(edited).join(',')}] como ${STATUS}${auto ? ' (tema automático)' : ''}; editor corrigiu ${nEdited}/${Object.keys(edited).length}`;
  } catch (e) {
    await mark({ status: 'error', error: String(e && e.message || e).slice(0, 500) }).catch(() => {});
    throw e;
  }
}

export default async (req) => {
  const got = req && req.headers && (req.headers.get('x-autopilot-token') || '');
  if (!KEY || got !== token()) return new Response('não autorizado', { status: 401 });
  try {
    const msg = await run();
    console.log('[autopilot]', msg);
    return new Response(msg);
  } catch (e) {
    console.error('[autopilot] erro', e && e.message);
    return new Response(`erro: ${e && e.message}`, { status: 502 });
  }
};
