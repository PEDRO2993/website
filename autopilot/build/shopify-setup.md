# Shopify · setup em 60 min (fase BUILD → DEPLOY)

1. **Conta:** shopify.com → Basic, país Suíça, moeda CHF, IVA 2.6% ("Lebensmittel") incluído nos preços.
2. **Produto:** "Valmag Magnesium-Bisglycinat + B6 · 90 Kapseln", SKU VALMAG-MG-90, preço CHF 44, peso 150 g, HS 2106.90. Traduções DE/FR via app "Translate & Adapt" (grátis).
3. **Subscrições:** app "Shopify Subscriptions" (grátis) → plano "Monats-Abo", 30 dias, −15 % → CHF 37.40. Copiar `selling_plan` id e o `variant` id (URL da variante em Admin → Produkte) para `store/js/store.js` CONFIG.
4. **Pagamentos:** Shopify Payments → ativar TWINT, cartões, Apple/Google Pay. Sem gateway externo.
5. **Envio:** Zona Schweiz + Liechtenstein: CHF 6.90 · grátis ≥ CHF 80 (2 dosen). Post "PostPac Priority".
6. **Legal:** copiar `store/impressum.html`, `datenschutz.html`, `agb.html` para Shopify → Richtlinien; ativar cookie-banner (Shopify Customer Privacy).
7. **Domínio:** registar valmag.ch em nic.ch (ou via Shopify) → apontar para a loja; a landing em `store/` fica como pré-lançamento/landing de ads em prstudio.ch/store ou no domínio.
8. **Pixels:** Meta Pixel + Conversions API (canal "Facebook & Instagram"), TikTok Pixel (app TikTok), GA4 (Google & YouTube). Consentimento via Customer Privacy.
9. **Emails:** Shopify Email → 3 automações de `autopilot/build/emails.md` (0 h, dia 10, dia 22).
10. **Teste:** Bogus Gateway em modo teste → checkout completo mobile; depois desativar teste. Ver `autopilot/TASKS.md` fase TEST.
