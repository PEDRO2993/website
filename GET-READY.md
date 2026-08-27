# 🏔️ GET READY — Hotel Alpina Grächen
### Guia completo: da reunião ao site no ar

---

## 1. O que tens na pasta `hotel-alpina/`

| Ficheiro | Para quê |
|---|---|
| `index.html` + `css/style.css` + `js/main.js` | **O site real** — é isto que vai para a net |
| `impressum.html` / `datenschutz.html` | Páginas legais (obrigatórias na Suíça) |
| `robots.txt` | SEO — diz ao Google para indexar tudo |
| `alpina-demo.html` | **Ficheiro único para a reunião** — abre com duplo clique, não precisa de servidor (só internet, para as fotos) |

**Na reunião: abre `alpina-demo.html` no browser em fullscreen (F11).** Mostra também a versão mobile: F12 → ícone de telemóvel.

---

## 2. O que já está funcional de origem

- ✅ **Checkout de reserva em 3 passos** — o cliente escolhe datas/hóspedes na barra, abre o modal: **1) Zimmer** (quartos com preços reais por noite, quartos pequenos demais desativam-se sozinhos, total ao vivo) → **2) Gäste** (dados) → **3) Zahlung** com duas opções:
  - **"Jetzt online buchen & bezahlen"** — 100% funcional e **embutido no site**: o motor oficial (SimpleBooking) abre num overlay com a marca Alpina, datas/hóspedes/língua pré-preenchidos; o cliente escolhe a tarifa e paga com cartão (ou "Book now, pay later") **sem sair do site**. Verificado até à página de pagamento. Sem contas novas, sem backend. (Se um dia colares Stripe/Payrexx links no `PAYMENT_LINKS`, esses abrem em novo separador — não permitem iframe.)
  - **"Per E-Mail anfragen — vor Ort bezahlen"** — 100% funcional já: abre o email do cliente com reserva completa (quarto, datas, total, dados) para `info@hotelalpinagraechen.ch`.
- ✅ **Formulário de contacto** — mesmo sistema (mailto).
- ✅ **Telefone clicável** em todo o site (no telemóvel liga logo).
- ✅ **SEO completo** — meta tags, Open Graph (preview bonito no WhatsApp/Facebook), dados estruturados Schema.org (Google mostra estrelas, preço, morada nos resultados).
- ✅ **4 línguas (DE · FR · IT · EN)** — seletor no header e no menu mobile; troca instantânea de TODO o site (textos, calendário, checkout, emails gerados, e até o motor de reservas abre na língua certa). A escolha fica memorizada no browser do visitante. Romanche deixado de fora deliberadamente: nenhum hotel do Valais o usa.
- ✅ **Fotos dos quartos no checkout** — miniaturas reais em cada opção de quarto.
- ✅ **Responsivo** — desktop, tablet e telemóvel, com menu fullscreen mobile.
- ✅ **Acessibilidade e performance** — lazy loading de imagens, animações desativáveis (prefers-reduced-motion), fontes otimizadas.

---

## 3. Antes de lançar — checklist com o dono

1. **Preços** ✅ — retirados do motor de reservas oficial (SimpleBooking, set. 2026): DZ/DRZ ab CHF 163 · FZ ab 177 · Ferienwohnung ab 262 · single ab 97. São tarifas "ab" da época baixa — variam por temporada; validar com o dono se quer mostrar outros valores.
2. **Citações de hóspedes** — as 3 reviews são placeholders. Pedir ao dono 3 reviews reais do Tripadvisor/Google e colar (secção `bewertungen` no HTML).
3. **Fotos** — o site usa as fotos do site atual dele (hotlink). Antes do lançamento: pedir as fotos originais ao dono, guardar em `img/` e trocar os URLs. *(Bónus: sugerir sessão fotográfica profissional — é upsell teu.)*
4. **Impressum** — preencher o nome do dono e o número UID (CHE-...) no `impressum.html`. Na Suíça é obrigatório.
5. **Email** — confirmar que `info@hotelalpinagraechen.ch` é o email correto para receber reservas.

---

## 4. Como pôr na net (3 opções, da mais fácil à melhor)

### Opção A — Netlify Drop (grátis, 2 minutos, ideal para mostrar já)
1. Vai a **app.netlify.com/drop**
2. Arrasta a pasta `hotel-alpina` inteira para a janela
3. Recebes um link tipo `random-name.netlify.app` — envia ao dono no próprio dia da reunião
4. Podes mudar o nome do link em Site settings → Change site name (ex: `alpina-graechen-preview.netlify.app`)

### Opção B — Cloudflare Pages (grátis, rápido, profissional)
1. Cria conta em **pages.cloudflare.com**
2. "Upload assets" → arrasta a pasta
3. Liga o domínio final quando o dono aprovar

### Opção C — Infomaniak (suíço 🇨🇭 — o argumento certo para clientes suíços)
1. **infomaniak.com** — alojamento web suíço, ~CHF 5-7/mês
2. Compra/transfere lá o domínio (ver ponto 5)
3. Upload via o gestor de ficheiros deles ou FTP (FileZilla): envia o conteúdo da pasta para `web/`
4. Suíços confiam em dados alojados na Suíça — usa isto na venda

### 4b. Como ativar o pagamento online (15 minutos, sem programar)

O botão "Jetzt online buchen & bezahlen" JÁ FUNCIONA: abre o motor oficial do hotel (SimpleBooking) com as datas e hóspedes pré-preenchidos — pagamento real com cartão desde o dia 1, sem contas novas. Os preços do site são os reais do motor (DZ/DRZ ab CHF 163, FZ 177, FeWo 262, single 97). Alternativa com links próprios:

**Opção recomendada — Stripe Payment Links** (aceita cartões + TWINT + Apple Pay na Suíça):
1. O **dono** cria conta em **stripe.com** (precisa dos dados da empresa dele + IBAN — é ele que recebe o dinheiro, tu nunca tocas nos valores)
2. No dashboard Stripe: **Payment Links → Create link** — criar 1 link por tipo de quarto (ex: "Doppelzimmer — 1 Nacht, CHF 146.70" com quantidade ajustável = noites)
3. Abrir `js/main.js` e colar os 5 links no bloco `PAYMENT_LINKS` no topo do ficheiro:
   ```js
   var PAYMENT_LINKS = {
     doppelzimmer: "https://buy.stripe.com/xxxxx",
     ...
   };
   ```
4. Pronto — o botão passa a abrir a página de pagamento segura do Stripe. Comissão Stripe: ~2.9% + CHF 0.30 (vs 15-25% do Booking).

**Alternativa suíça — Payrexx** (payrexx.com, empresa suíça, TWINT nativo, argumento forte para o dono): mesmo processo, criam-se "One-Page Shops"/payment links e colam-se no mesmo sítio.

**Fase 2 a sério** (projeto pago): motor de reservas com calendário de disponibilidade real e pagamento integrado — Beds24, Sirvoy ou o sistema que o grupo Matterhorn Valley já usa, embebido no site. O desenho do site já está preparado para isso.

⚠️ Nota honesta para a reunião: sem backend, o site não verifica disponibilidade real — o pagamento online confirma a compra, mas o hotel deve confirmar disponibilidade (por isso a via email diz "innert 24 h"). O motor de reservas da Fase 2 resolve isso.

### Domínio
- O dono **já tem** `hotelalpinagraechen.ch`. Duas vias:
  - **Substituir o site atual**: pedir acesso ao registrar do domínio dele e apontar o DNS (registo A / CNAME) para o novo alojamento. O site novo fica no domínio que o Google já conhece — **melhor para SEO**.
  - **Preview primeiro**: lançar em subdomínio ou domínio temporário, mostrar, e só depois trocar o DNS.
- DNS: no painel do domínio, apontar o registo `A` para o IP do alojamento (ou seguir as instruções do Netlify/Cloudflare — eles dão os valores exatos). Propagação: 1-24h.
- HTTPS: Netlify/Cloudflare/Infomaniak dão certificado SSL automático e grátis. Nada a fazer.

---

## 5. Argumentos para a reunião 💰
*("ele tem de pensar que ganha mais comigo")*

1. **Matemática das comissões** — Booking.com/Expedia levam 15-25% de comissão. Num quarto de CHF 163: **CHF 24-40 perdidos por noite, por quarto**. Com 19 quartos e boa ocupação, são **dezenas de milhares de CHF por ano**. O site novo é desenhado para converter reserva direta: barra de reserva no topo, Bestpreisgarantie em destaque, secção inteira "Direkt buchen. Besser schlafen." e dock fixo de reserva.
2. **O site atual não vende** — é um template partilhado do grupo Matterhorn Valley, igual aos dos concorrentes. O novo é só dele, com identidade própria e visual de hotel boutique — atrai o cliente que paga mais.
3. **Primeira impressão = preço que aceitam pagar** — um site premium justifica subir preços. O visual atual diz "3 estrelas genérico"; o novo diz "boutique alpino".
4. **Google adora** — dados estruturados (estrelas 4,6, preços, morada aparecem direto nos resultados), velocidade, mobile perfeito.
5. **Custos de manutenção ~zero** — site estático: sem WordPress para atualizar, sem plugins, sem hacks, alojamento por CHF 0-7/mês.
6. **Já funciona hoje** — reservas chegam por email desde o primeiro dia. Fase 2 (upsell): motor de reservas real com pagamento (ver ponto 6).

---

## 6. Fase 2 — upsells para propor depois do "sim"

| Upgrade | Ferramenta | Valor para ti |
|---|---|---|
| Formulários sem abrir email (recebe direto na inbox) | Formspree / Web3Forms (grátis até 50/mês) | 30 min de trabalho |
| Pagamento online já no dia 1 | Stripe / Payrexx payment links (ver secção 4b) | 15 min + conta do dono |
| Motor de reservas com disponibilidade real | Beds24, Sirvoy, ou o que o grupo MVH já usa (embed) | projeto pago |
| Versões EN + FR do site | duplicar HTML, traduzir | projeto pago |
| Google Business Profile otimizado + fotos | gratuito | fideliza o cliente |
| Newsletter / ofertas sazonais | Mailchimp / Brevo | avença mensal |
| Sessão fotográfica profissional | fotógrafo local | margem tua |
| Relatório mensal de visitas | Plausible/Umami (CHF 9/mês, sem cookies = sem banner) | avença mensal |

---

## 7. Como editar o site (cheat sheet)

- **Textos**: no `index.html` (alemão, base) e as traduções FR/IT/EN em `js/i18n.js` — uma chave por texto, editar lá as 4 línguas
- **Preços**: procura `CHF` no `index.html`
- **Cores**: topo do `css/style.css`, variáveis `--gold`, `--ink`, `--cream`
- **Fotos**: troca os `src="https://hotelalpinagraechen.ch/..."` por `src="img/nome.jpg"`
- **Depois de editar**: se quiseres regenerar o ficheiro único de demo, diz-me — eu faço.

*Konzept & Design: Pedro Ribeiro Digital — boa sorte na reunião! 🤝*
