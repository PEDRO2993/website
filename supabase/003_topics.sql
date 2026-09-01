-- Fila de temas para o escritor automático (netlify/functions/autopilot-writer.mjs).
-- O admin mete temas; a função semanal escreve os artigos nos idiomas pedidos.
create table if not exists public.post_topics (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null,                                  -- ex.: 'SEO local para restaurantes em Brig'
  brief       text,                                           -- notas opcionais (ângulo, público, palavras-chave)
  langs       text[] not null default '{pt,de,fr,it,en}',
  status      text not null default 'pending' check (status in ('pending','writing','done','error')),
  error       text,
  slug        text,                                           -- preenchido quando escrito
  created_at  timestamptz not null default now(),
  done_at     timestamptz
);
create index if not exists post_topics_status_idx on public.post_topics (status, created_at);

alter table public.post_topics enable row level security;
drop policy if exists post_topics_admin_all on public.post_topics;
create policy post_topics_admin_all on public.post_topics
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- a função usa service_role (ignora RLS); anon não vê nada.
