# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Donos e gerentes de pequenos negócios do Alto Valais (Suíça): hotéis e alojamento, restaurantes, clínicas e serviços locais. Falam alemão, francês, italiano, português ou inglês. Não são técnicos; decidem sozinhos, muitas vezes ao telemóvel, entre um serviço e outro. Job: ter um site que traga reservas/clientes, saber quanto custa e falar com uma pessoa concreta.

## Product Purpose

prstudio.ch é o site de apresentação e captação de clientes de PR Studio — Pedro Ribeiro, em Stalden (VS). Vende três serviços: websites, marketing digital (Google/Meta Ads, SEO local, ficha Google Business) e gestão de redes sociais. Sucesso = pedido de avaliação gratuita (WhatsApp, telefone, email ou formulário).

## Positioning

Um só interlocutor, na língua do cliente (PT/DE/FR/IT/EN), com preço fixo em CHF acordado antes de começar, sem fidelizações longas (30 dias de aviso), e o site fica propriedade do cliente (domínio, conteúdo, código). "Precisão suíça, alma portuguesa" é a frase da marca.

## Operating Context

Site estático gerado por `build.js` para `dist/` (uma pasta por idioma; PT na raiz), publicado no Netlify a partir do branch `main`. Fonte de verdade: `index.html` com dicionários I18N (`data-i18n`), mais 13 páginas de artigos/legais. Blog alimentado por Supabase e por um escritor automático agendado. Área de administração e área de cliente embutidas no `index.html` (login, mensagens, encomendas, reuniões). Demos de 7 setores extraídas no build para `demos.html`. Testes Playwright em `tests/` dependem de IDs/classes estruturais (`#trabalho .tw-*`, `.folio-cta`, `.price-guarantee`, `#contacto`, `#f-name`…).

## Capabilities and Constraints

- Todo o texto visível tem chave `data-i18n` com tradução nos 5 dicionários; o build assinala textos em falta.
- Registo das traduções: DE Sie, FR vous, IT tu, PT tu.
- Cartões do blog na homepage são injetados no build (não editar à mão).
- Leads rastreados por `fireLead`/`fireCta` com secção de origem e idioma.
- Sem framework; CSS/JS inline em `index.html`, minificados no build.
- Rebranding visual em curso (2026-09-06): mundo escolhido pelo dono, "Ateliê suíço" — claro, grelha tipográfica suíça, vermelho suíço como único acento, trabalho real em destaque; pedido explícito de muita animação, moderna e orquestrada.

## Brand Commitments

- Nome: PR Studio (logótipo "PR." com ponto no acento). Frase: "Precisão suíça, alma portuguesa."
- Voz: direta, tuteia em PT/IT, sem jargão, sem promessas vazias.
- Preços públicos e fixos em CHF (Websites 2'400 / 4'900 / 9'800; Marketing desde 790/mês; Social Media desde 690/mês; manutenção 95–290/mês). Nunca inventar outros.
- Localização: Stalden, Valais; zona de atuação Alto Valais (Visp, Brig, Zermatt, Saas-Fee, Grächen, Sierre, Sion).

## Evidence on Hand

- Trabalho real: Hotel Alpina, Grächen (site em 4 línguas com reservas diretas; `img/work-alpina.jpg`, caso em `caso-hotel-alpina.html`); MedVisp / Walk-In Visp (gestão de marketing e redes sociais; `img/work-medvisp.png`). Só factos neutros sobre o "Trabalho recente" (nunca dizer se foi encomendado, oferecido ou pago).
- Fotografias de setor para as demos em `img/` (rest, gym, barb, clin, foto, imob, moda) — não são clientes reais.
- Sem retrato do Pedro, sem fotografia própria do Valais, sem testemunhos: não fabricar. (Confirmado pelo dono a 2026-09-06: usar só o que existe.)

## Product Principles

- Mostrar o trabalho real antes de falar de si.
- Preço e prazo visíveis sem clicar; nada de "pedir orçamento" às escuras.
- Cada língua é um mercado: nada pode depender de JavaScript para ser lido pelo Google.
- Falar com uma pessoa, não com uma agência: o WhatsApp é a ação principal.
- Não afirmar o que não se pode provar.
