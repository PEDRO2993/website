-- Reforços após revisão de segurança. Idempotente.

-- posts.slug: só minúsculas/dígitos/hífens (o build usa o slug como nome de ficheiro e URL)
alter table public.posts drop constraint if exists posts_slug_check;
alter table public.posts add constraint posts_slug_check
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 80);

-- visits: inserção anónima só com valores plausíveis (evita spam nas estatísticas do admin)
drop policy if exists "visits_insert" on public.visits;
create policy "visits_insert" on public.visits
  for insert to anon, authenticated
  with check (lang in ('pt','de','fr','it','en') and dev in ('mobile','desktop') and coalesce(length(ref), 0) <= 80);
