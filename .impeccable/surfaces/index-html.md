---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief — index.html (homepage)

Scope: homepage only, mode Persuade. Audience: donos de hotéis, restaurantes, clínicas e serviços do Alto Valais, ao telemóvel, não técnicos. Job: perceber a oferta, ver prova real, saber o preço, falar com o Pedro. Ação: pedir avaliação gratuita (WhatsApp primeiro). Prova: Hotel Alpina (img/work-alpina.jpg), MedVisp; preços fixos em CHF. Constraints: markup/IDs/classes e chaves data-i18n intactos (testes Playwright, build i18n); sem retrato, sem paisagem, sem testemunhos; muita animação, orquestrada, moderna.

Unresolved: nenhum retrato do Pedro (secção "Sobre" fica tipográfica).

## Direction contract

THESIS: A precisão suíça que o Pedro vende é o próprio design: uma folha de papel com grelha tipográfica rigorosa, duas tintas (preto, vermelho suíço) e o trabalho real como peça. Refusa o hero escuro com decoração abstrata e o kit de cartões iguais.

OWN-WORLD (paleta revista a 2026-09-06, "Graphite Control Room", escolhida pelo dono entre três auditadas; réguas de coluna do hero retiradas a pedido dele): grafite azulado #151B23, tinta clara #E9EEF3, azul-gelo #3FAEFF como único acento (texto sobre o acento #151B23), réguas #243240/#364656 só nas linhas horizontais de bloco, ardósia #232D39 só nas molduras dos ecrãs, faixas #294263 com texto #F2F5FA. Archivo variável (wdth 62–125) para tudo; display em largura expandida e peso 800, texto em largura normal. Componentes: sem cartões com sombra; blocos definidos por réguas de grelha de 1px; botões retangulares pretos/vermelhos de canto reto; números tabulares.

STORY: Entende em 3 segundos "sites que trazem reservas, preço fixo em CHF, uma pessoa"; vê o Alpina real; acredita pela precisão; carrega em WhatsApp.

FIRST VIEWPORT: Grelha de 12 colunas (invisível desde a revisão de cores; só a rota vermelha e as réguas horizontais marcam a estrutura). Esquerda (col 1–7): título de 3 linhas em Archivo expandido, a largura das letras a respirar; sob ele a frase de valor e o botão vermelho. Direita (col 8–12): a peça real — o ecrã do Alpina em moldura ardósia, a entrar por deslize na grelha. Uma única linha vermelha (a "rota") desce da marca PR. e atravessa o viewport, desenhando-se ao carregar.

FORM: Ateliê suíço (grelha tipográfica internacional), direção pinada pelo dono, minha candidata 1; seed e139c7c4, atribuição 5 recusada por pin. Raises: duas tintas totais (handbill), grelha sagrada em todos os ecrãs (teletext), peça desenhada primeiro e texto a encaixar (mapa), rota vermelha única (mapa), grotesco variável como instrumento do hero (portal).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
