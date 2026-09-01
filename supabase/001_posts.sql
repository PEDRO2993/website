-- posts: um registo por (slug, lang). O build lê só status='published'.
create extension if not exists pgcrypto;

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,                              -- ex.: 'seo-local-wallis'
  lang         text not null check (lang in ('pt','de','fr','it','en')),
  title        text not null,
  description  text not null,                              -- meta description + cartão
  body_html    text not null,                              -- HTML já pronto e sanitizado na origem
  status       text not null default 'draft'
               check (status in ('draft','scheduled','published')),
  publish_at   timestamptz,                                -- só para 'scheduled'
  published_at timestamptz,
  updated_at   timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (slug, lang)
);
create index if not exists posts_due_idx on public.posts (status, publish_at);

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

-- RLS: o build usa a chave anon → só vê publicados. Escrita: admin (is_admin() já existe) ou service_role.
alter table public.posts enable row level security;
drop policy if exists posts_public_read on public.posts;
create policy posts_public_read on public.posts
  for select to anon, authenticated using (status = 'published');
drop policy if exists posts_admin_all on public.posts;
create policy posts_admin_all on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
