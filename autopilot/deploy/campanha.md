# AUTOPILOT · DEPLOY · Campanha de validação (CHF 300 / 5 dias)

## Go-live (ordem)
1. Shopify criado e IDs colados em `store/js/store.js` (setup em `autopilot/build/shopify-setup.md`).
2. Domínio valmag.ch → landing `store/` (Netlify: publicar `store/` como site próprio, ou Pages `/store/`) e Shopify no checkout.
3. Pixels Meta + TikTok + GA4 com consentimento; evento Purchase testado com 1 compra real de CHF 1 (produto teste) e reembolsada.

## Orçamento e estrutura
| Canal | Dia 1–5 | Estrutura |
|---|---|---|
| Meta (IG Reels + FB Feed) | CHF 40/dia = 200 | 1 campanha Vendas, 2 ad sets (DE-CH, FR-CH), 3 criativos cada, Advantage+ placements |
| TikTok | CHF 20/dia = 100 | 1 campanha, 1 ad group CH 25–54, 3 criativos |
Público: CH, 25–54, interesses sono/fitness/wellness. Excluir compradores. Landing: valmag.ch/?lang=de|fr conforme ad set.

## 3 criativos UGC (15 s, vertical, legendas DE e FR)
1. **"3 semanas depois"** — pessoa na cama, hook: "Ich habe 3 Wochen Magnesium genommen. Das ist passiert." → 3 mudanças (adormecer, cãibras, energia) → dose na mão → "Valmag, aus dem Wallis. Link unten."
2. **"Bisglycinat vs. Oxid"** — hook: "Dein Magnesium wirkt nicht? Falsche Form." → mostrar rótulo de supermercado (oxid) vs Valmag (bisglycinat) → "80 % NRV, keine Magenprobleme" → CTA abo −15 %.
3. **"Unboxing Post CH"** — encomenda a chegar (Post CH), abrir, 2 cápsulas à noite, "Versand aus der Schweiz, TWINT, jederzeit pausierbar" → CTA.

## Regras de corte (automáticas, verificar 1×/dia às 09:00)
- Criativo com CTR < 0.8 % após CHF 30 gasto → desligar.
- Ad set com CPA > CHF 17.60 (40 % do preço) após CHF 80 → reduzir 50 %.
- Dia 5: ROAS ≥ 2.0 → fase OPTIMIZE (escalar +30 %/dia no vencedor). ROAS < 2.0 → pivot skincare (research #2), reabrir PLAN.

## KPIs a registar em `autopilot/metrics/` (CSV diário)
data, canal, gasto, impressões, cliques, CTR, add_to_cart, compras, receita, CPA, ROAS, % abo.
