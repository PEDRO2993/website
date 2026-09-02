# Bot de prospeção PR Studio

Encontra hotéis, pensões, restaurantes e caves no Valais, audita o site de cada um e dá uma pontuação de 0 a 100 (mais alto = site pior = melhor alvo). Tu controlas os alvos no painel.

## 1. Chave Google Places (grátis até ao crédito mensal)
1. console.cloud.google.com → novo projeto "prstudio-bot" → APIs & Services → ativar **Places API (New)**.
2. Credentials → Create API key → restringir a "Places API (New)". Copiar a chave.
3. Billing tem de estar ativo (o Google exige cartão), mas o crédito mensal cobre milhares de pesquisas. Para não gastar: `--max 20` por localidade e correr 1× por semana.

## 2. Correr
```bash
cd autopilot/business/bot
GOOGLE_PLACES_KEY=xxxx node prospector.js --towns "Grächen,Saas-Fee,Zermatt" --types "hotel,restaurant" --max 20
```
Saída: `out/prospects.csv` e `out/prospects.json`, ordenados por score. Colunas: nome, localidade, tipo, site, score, flags (o que está mal), telefone, rating, reviews, morada, link Maps, já-no-pipeline.

Auditar um site à mão: `node audit.js https://exemplo.ch hotel`

## 3. O que a pontuação mede
| Sinal | Pontos |
|---|---|
| Sem site | 60 |
| Só Facebook/Instagram/Booking/site Google | 50 |
| Site inacessível ou partido | 20+ |
| Sem HTTPS | 15 |
| Não é mobile (sem viewport) | 15 |
| Hotel sem motor de reserva direta | 15 |
| HTML dos anos 2000 (frames, font, swf) | 15 |
| Uma só língua | 10 |
| Copyright antes de 2022 | 10 |
| CMS antigo (WordPress < 6, Joomla 1, Typo3 < 9) | 10 |
| Restaurante sem reserva online | 10 |
| Construtor barato (Wix, Jimdo, one.com…) | 8 |
| Lento > 5 s, sem título, sem description | 5 cada |

Regra prática: score ≥ 40 = enviar email; 25–39 = ligar; < 25 = ignorar.

## 4. Fluxo
prospector → painel de controlo (aprovar/rejeitar, notas) → eu gero o email DE/FR e o rascunho no Gmail → tu envias → resposta → demo em 48 h → contrato.

## 5. Painel de controlo (onde tu decides)
https://claude.ai/code/artifact/02e267a8-1dcd-429b-93e7-7985e53dfa1b — privado, funciona no telemóvel.
- Lista dos alvos com score, fraqueza, contacto e estado (novo → aprovado → rascunho → enviado → respondeu → cliente, ou rejeitado).
- Clicar num alvo abre: botões de estado, notas, edição, e o **email gerado em DE ou FR** com botão "Copiar" e "Abrir no Gmail".
- Formulário no fundo para acrescentar alvos à mão.
- Tudo o que mudares fica guardado para todos os teus dispositivos.

Fluxo com o bot: `node prospector.js` → `node to-panel.js --min 40` → dizes-me "importa out/panel" → aparecem no painel como "novo" → aprovas os que queres → eu crio os rascunhos no Gmail dos aprovados.
