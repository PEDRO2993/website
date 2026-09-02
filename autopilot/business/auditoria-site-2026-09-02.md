# Auditoria do site · 2026-09-02 · defeitos verificados e corrigidos

Feita por um agente do swarm com Chromium e verificação de cada achado. Nada de opiniões de estilo: só defeitos reproduzidos.

## Corrigido hoje

| Gravidade | O que estava mal | Correção |
|---|---|---|
| Crítico | **O manual de vendas interno estava publicado no site.** `GET-READY.md` está em `hotel-alpina/` e nas três demos: contém os argumentos de venda, a lista de preços com uma coluna "margem tua" e a frase "um site premium justifica subir preços". Um prospeto que abrisse `/hotel-alpina/GET-READY.md` lia a nossa posição negocial. | O deploy passa a apagar todos os `GET-READY.md` e `build-demo.sh` antes de publicar. |
| Crítico | **Sete imagens partidas na secção "Exemplos"**, que é a prova principal da página inicial. A pasta `img/` nunca foi versionada. | O carregador deixa de mostrar o ícone partido: se o ficheiro não existir, a imagem some-se. As sete imagens continuam por criar. |
| Crítico | **Doze links para `blog.html`**, ficheiro que não existe: dois na página inicial, cinco em cada página multilingue. | Links removidos. `blog.html` sai da lista do build e do sitemap, que passou de 28 para 23 URLs, sem nenhum 404. |
| Grave | **A demo do hotel dizia ao Google que a página canónica era `hotelalpinagraechen.ch`**, o site do hotel verdadeiro. O Google descartaria a nossa página, e estávamos a publicar os dados estruturados do hotel real (telefone, avaliação 4,6) sob o nosso domínio. | Canónico e og:url apontam para prstudio.ch. |
| Grave | **As três demos de prospetos e a demo de vendas estavam indexáveis** e partilhavam um canónico para `/demos/`, que nem existe. | Cada uma com o seu canónico e `noindex`. |
| Grave | **Com o JavaScript desligado, três páginas ficavam em branco.** O CSS escondia todos os idiomas e só o JS revelava um. O Google e qualquer leitor sem JS viam 156 caracteres. | A regra passou a depender de uma classe posta pelo JS: sem JS mostra-se o conteúdo todo (10'400 caracteres) em vez de nada. |
| Grave | **O rodapé das mesmas páginas mostrava os cinco idiomas empilhados** mesmo com JS, por um conflito de especificidade no CSS. | Regra corrigida; verificado com Chromium: um só rodapé com JS, cinco sem JS. |
| Grave | **A política de segurança bloqueava as fotos da demo do hotel** e o motor de reservas. Onde o `_headers` é respeitado, a demo aparecia sem uma única imagem. | Domínios acrescentados ao `img-src`, `connect-src` e `frame-src`. |
| Menor | O rodapé anunciava **"três línguas"** nas quatro traduções, contra cinco botões e cinco idiomas reais. | Passou a cinco em todas. |
| Menor | Sete números de telefone de demonstração eram **links clicáveis** para um número inexistente. | Deixaram de ser links. |
| Menor | A pasta `store/` da loja Valmag, com um Impressum cheio de marcadores, era copiada para o site publicado pela Netlify. | Fora da lista de cópia até a loja arrancar. |

Verificado depois das correções, com Chromium: zero imagens partidas, zero links para blog, zero ids duplicados, zero erros de JavaScript, troca de idioma a funcionar.

## Por corrigir — precisa de conteúdo ou de decisão tua

| Gravidade | O que falta |
|---|---|
| Crítico | **Política de privacidade, termos e informação legal.** O banner de cookies pede consentimento e liga a uma política que não existe. Três páginas por escrever, e devem existir em alemão e francês. |
| Grave | **As sete imagens do portfólio** (`img/rest`, `gym`, `barb`, `clin`, `foto`, `imob`, `moda`, em webp e jpg). Sem elas a secção de exemplos fica sem prova visual. |
| Grave | **`og.png`** (1200×630). Sem ela, cada partilha no WhatsApp ou LinkedIn aparece sem imagem. |
| Grave | **Favicons e `site.webmanifest`**, todos em falta. Nenhuma página tem ícone no separador. |
| Menor | O Impressum da demo do hotel mostra marcadores por preencher a um prospeto. |
| Menor | As fotos da demo são carregadas do servidor do hotel verdadeiro. Alojá-las connosco seria mais limpo. |

## Verificado e limpo
As 235 chaves de tradução existem nos quatro dicionários, sem sobras nem faltas. Todas as âncoras internas resolvem. Sem ids duplicados, sem etiquetas por fechar, sem erros de JavaScript em nenhuma página. Nenhuma falha de contraste real. Sem imagens sem texto alternativo, sem botões ou campos sem nome acessível. Todos os `outline:none` têm substituto visível no foco. Os sete blocos de dados estruturados são válidos. O formulário de contacto degrada corretamente e a calculadora de comissão está certa nos cinco idiomas.
