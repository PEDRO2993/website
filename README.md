# Hotel Alpina Grächen — website

Site estático (HTML/CSS/JS, sem build) feito por **PR Studio** — Pedro Ribeiro, Stalden (Valais).

| Ficheiro | Para quê |
|---|---|
| `index.html`, `css/style.css`, `js/main.js`, `js/i18n.js` | O site |
| `impressum.html`, `datenschutz.html` | Páginas legais (obrigatórias na Suíça) |
| `alpina-demo.html` | Ficheiro único para mostrar numa reunião (abre com duplo clique) |
| `GET-READY.md` | Guia: da reunião ao site no ar |

## Estado

Pré-visualização: todas as páginas levam `noindex, nofollow` e o `robots.txt` bloqueia os motores de busca — o site não compete com o do hotel enquanto for uma proposta. Quando o hotel adotar o site, tirar o `noindex` e abrir o `robots.txt`.

As fotografias ainda são carregadas do site atual do hotel; se o servidor bloquear, cada imagem desaparece sem partir o desenho (fundo neutro). Guardar as originais em `img/` antes do lançamento.

## Publicar no Netlify

1. Netlify → **Add new project → Import an existing project → GitHub → PEDRO2993/website**.
2. **Branch to deploy: `alpina`** · Base directory: vazio · **Publish directory: `.`** · Build command: vazio.
3. Deploy. Depois, em *Site configuration → Change site name*, dar um nome (ex.: `hotel-alpina-graechen`).

Antes de mostrar ao cliente, ver a checklist no `GET-READY.md` (fotos originais, reviews reais, UID no Impressum, email de reservas).
