# Revisão dos emails · 2026-09-02 · o que estava mal e o que mudou

Revisão feita por um agente do swarm com olhos suíços, mais verificação da lei. Encontrou seis coisas que teriam queimado a lista. Todas corrigidas.

## Bloqueadores (estavam em 12 dos 15 emails)
1. **Texto português dentro de emails alemães e franceses.** A linha "Calculadora de comissão" ficou colada em 12 emails quando acrescentei o link da página de oferta. Um hoteleiro suíço percebe em dois segundos que é um modelo copiado por alguém que não fala a língua dele. Removida.
2. **O link da demo dava 404.** `hotel-alpina` não estava na lista de pastas copiadas pelo `build.js`, e o build rebentava num ficheiro em falta. A Netlify publica `dist/`, por isso a demo nunca chegava lá. Corrigido: build passa a ignorar ficheiros ausentes e copia `hotel-alpina/` e `demos/`. **Abrir https://prstudio.ch/hotel-alpina/ antes do primeiro envio.**
3. **"Re:" escrito à mão** num email que não era resposta. É um dos truques de spam mais antigos. Agora o follow-up envia-se como resposta dentro do fio original e o Gmail põe o "Re:" sozinho.
4. **Nenhum dos 30 emails tinha como dizer "pare".** É uma das três exigências da lei suíça. Todos passaram a ter identificação completa do remetente e uma frase de saída.
5. **Duas afirmações falsas**, ambas para a mesma aldeia de 1'300 pessoas: dizia-se que a demo tinha sido feita para Grächen. Não foi. Reescrito como "uma página que construí como modelo".
6. **Links de dois domínios diferentes**, um deles pedro2993.github.io. Um prospeto que clica vê um nome de utilizador do GitHub, e o Gmail marca como suspeito um link cujo domínio não bate certo com a assinatura. Agora só prstudio.ch.

## Tom (estes não se respondem, ofendem)
- Assunto que gozava com o endereço gmx do dono do Kreuzboden.
- Assunto que dizia a uma senhora que o site dela "afugenta os clientes", visível na caixa de entrada antes de abrir.
- Assunto que dizia a um viticultor de Salgesch que "ninguém pode comprar os seus vinhos" — provavelmente falso, ele vende à porta e em mercados. E apontava para as caves abertas de maio, daqui a oito meses, em vez da vindima e do Natal, que são agora.
- Aspas de escárnio à volta do "site" de um restaurante com 874 avaliações.
- Conta errada: comissão sobre receita não é margem. Estava a explicar aritmética mal feita a quem faz essas contas todos os dias.

## Língua
- `Grüezi` seguido do nome próprio. Numa carta comercial suíça diz-se `Grüezi Herr Zurbriggen` ou, numa caixa geral, `Grüezi mitenand`. Este era o sinal mais claro de estrangeiro.
- Vírgula a seguir à saudação alemã, que faltava em todas.
- `9.3` e `4.5` com ponto decimal. Em alemão e francês suíços é vírgula.
- Aspas retas em vez de «».
- "Holland" em vez de "die Niederlande". `site à vous` quatro vezes, que soa a tradução do português.
- Cinco assuntos passavam dos 78 caracteres e cortavam no Gmail. Todos agora abaixo de 60.

## Eficácia
- Pediam-se duas coisas ao mesmo tempo, a prévia grátis e um telefonema. Duas perguntas partem a resposta. Ficou só a prévia, que é o pedido mais fácil de aceitar e é o nosso diferenciador.
- A prova estava enterrada a meio de um parágrafo entre três URLs. Agora tem linha própria e é o único link.

## Lei suíça, em concreto
O artigo 3.º, alínea 1, letra o da UWG proíbe a **publicidade em massa** por email sem consentimento, e exige três coisas a quem envia: consentimento prévio, **identificação correta do remetente**, e **uma forma fácil e gratuita de recusar** mais mensagens.

O ponto que decide o nosso caso: "massa" define-se por **automatização**, não por número. A comissão suíça de lealdade comercial e o tribunal superior de Zurique aplicaram esse critério. Emails escritos e enviados um a um, com factos investigados sobre aquela empresa concreta, ficam **fora** da norma. O método manual é a decisão mais protetora de todo este plano.

**Nunca passar a uma ferramenta de envio em massa, mail-merge ou sequenciador.** No momento em que se automatiza, entra-se na norma sem consentimento nenhum, e isso não se corrige depois.

Mesmo estando fora, as duas exigências que não custam nada ficam incluídas: morada postal real e frase de saída. Quem pedir para parar sai da lista no próprio dia, para sempre. A condenação que criou a jurisprudência foi contra alguém que **continuou a escrever depois de lhe terem dito para parar** — é isso que transforma uma chatice em processo-crime, punível com pena até três anos, mediante queixa.

Proteção de dados: a lei revista protege apenas pessoas singulares. Endereços genéricos como info@ recolhidos de um site público são aceitáveis em contexto empresarial. Endereços com nome de pessoa, como o da Ancienne Poste, são dados pessoais e obrigam a informar. **Falta escrever uma política de privacidade em alemão e francês** e ligá-la na assinatura.

## Fica por fazer (precisa de ti)
1. **Morada postal e telefone reais** nos emails. Estão como marcadores entre parêntesis retos em todos os rascunhos. Sem isso não se envia nenhum.
2. **Abrir https://prstudio.ch/hotel-alpina/ e https://prstudio.ch/de/hotel-direkt.html** e confirmar que carregam.
3. **Política de privacidade DE/FR** e página de informação legal da PR Studio. A única que existe no repositório é da Valmag e está cheia de marcadores.
4. **Caixa de correio em prstudio.ch** com SPF, DKIM e DMARC. Assinar prstudio.ch enviando de gmail.com é uma incoerência que custa confiança.
