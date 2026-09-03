# Sites e branches — PR Studio

Inventário do que existe, onde vive e como se publica. Atualizado a 2 de setembro de 2026.

## 1. prstudio.ch — site do PR Studio
- **Repo/branch:** `PEDRO2993/website` → `main`
- **Onde está:** Netlify, projeto `prwebdev` (domínio prstudio.ch)
- **Como se publica:** push para `main` → build automático (`node build.js` → `dist/`)
- **Fonte:** `index.html` (PT + dicionários I18N), artigos estáticos, `posts.js` (artigos da BD)

## 2. Hotel Alpina Grächen — site do hotel
- **Repo/branch:** `PEDRO2993/website` → `alpina` (site na raiz, sem build)
- **Onde está:** GitHub Pages em https://pedro2993.github.io/website/hotel-alpina/ (cópia antiga, no branch `claude/forms-bugs-improvement-2578kq`)
- **Branch das demos de prospeção:** `demos-prospecao` (ver `demos/README.md` — maquetas, não publicar sem dados reais)
- **Por fazer:** criar projeto Netlify a partir do branch `alpina` (publish `.`, sem build command) e apontar `alpina.prstudio.ch` ou domínio próprio. Depois trocar as ligações no prstudio.ch (`caso-hotel-alpina.html` e o cartão "Trabalho recente" em `index.html`).
- **Antes de mostrar ao dono:** fotos originais em `img/` (hoje vêm do site atual dele), 3 reviews reais, UID no `impressum.html`, confirmar o email de reservas. Checklist completa no `GET-READY.md` do branch.

## 3. Demos por setor (dentro do prstudio.ch)
Restaurante, ginásio, barbearia, clínica, fotografia, moda e imobiliária. Não são sites publicados: o markup é gerado no build para `demos.html` e carregado quando alguém abre uma demo.

## 4. Demos de prospeção — NÃO publicar como estão
No branch `claude/forms-bugs-improvement-2578kq`, pasta `demos/`: `les-berges` (Chippis), `mayen2003` (Anzère), `portjengrat` (Saas-Almagell).
São cópias do site do Alpina com o nome e a localidade trocados — o resto do conteúdo (quartos, spa, cozinha, preços) ainda é do Alpina. **Publicá-los assim afirmaria factos falsos sobre negócios reais.** Antes de mostrar seja o que for: substituir conteúdo, preços e fotografias pelos dados reais de cada casa.

## 5. Antigo
- `celadon-quokka-30151e` (Netlify Drop, nov. 2025): CV/página pessoal, parado. Apagar ou redirecionar para prstudio.ch.
