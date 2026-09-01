-- BD → Netlify: qualquer transição de/para 'published' dispara um build.
-- Requer: Netlify → Site settings → Build & deploy → Build hooks → criar e copiar o URL.
create extension if not exists pg_net;

-- URL do hook fora do código (Vault). Substitui o URL e corre UMA vez.
select vault.create_secret('https://api.netlify.com/build_hooks/SUBSTITUI-PELO-TEU-ID', 'netlify_build_hook');

create or replace function public.trigger_netlify_build() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  hook text;
  fire boolean := false;
begin
  -- só builds úteis: publicar, despublicar, editar um publicado, apagar um publicado
  if tg_op = 'INSERT' then fire := new.status = 'published';
  elsif tg_op = 'UPDATE' then fire := new.status = 'published' or old.status = 'published';
  elsif tg_op = 'DELETE' then fire := old.status = 'published';
  end if;
  if not fire then return coalesce(new, old); end if;

  select decrypted_secret into hook from vault.decrypted_secrets where name = 'netlify_build_hook';
  if hook is null then raise warning 'netlify_build_hook não definido no Vault'; return coalesce(new, old); end if;

  perform net.http_post(
    url     := hook,
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body    := jsonb_build_object('trigger_title', tg_op || ' ' || coalesce(new.slug, old.slug) || ' (' || coalesce(new.lang, old.lang) || ')')
  );
  return coalesce(new, old);
end $$;

drop trigger if exists posts_publish_build on public.posts;
create trigger posts_publish_build
  after insert or update or delete on public.posts
  for each row execute function public.trigger_netlify_build();

-- verificação: select * from net._http_response order by created desc limit 5;
