/* Valmag store — i18n DE/FR, plan toggle, checkout link.
 * CONFIG: preencher depois de criar a loja Shopify (ver autopilot/build/shopify-setup.md). */
(function () {
  'use strict';
  var CONFIG = {
    shop: 'valmag.myshopify.com',          // domínio Shopify
    variantOnce: 'VARIANT_ID_ONCE',         // variante compra única (CHF 44)
    variantSub: 'VARIANT_ID_SUB',           // variante subscrição (CHF 37.40, selling plan)
    sellingPlan: 'SELLING_PLAN_ID',         // Shopify Subscriptions plan id
    priceOnce: 44, priceSub: 37.4
  };
  var I18N = {
    de: {
      'meta.title': 'Valmag — Magnesium-Bisglycinat aus dem Wallis · Schlaf & Erholung',
      'meta.desc': 'Hochdosiertes Magnesium-Bisglycinat mit B6. 90 Kapseln für 30 Tage. Versand aus der Schweiz, TWINT & Twint-Abo mit 15 % Rabatt.',
      'nav.buy': 'Jetzt bestellen',
      'hero.pill1': 'Hergestellt in der EU · GMP', 'hero.pill2': 'Versand aus der Schweiz', 'hero.pill3': 'TWINT · Kreditkarte',
      'hero.h1': 'Besser schlafen.<br>Schneller <em>erholen.</em>',
      'hero.lead': 'Magnesium-Bisglycinat mit Vitamin B6 — die gut verträgliche Form, die Ihr Körper tatsächlich aufnimmt. 90 Kapseln, 30 Tage, ein Abo, das Sie jederzeit pausieren.',
      'hero.cta1': 'Jetzt bestellen — CHF 44', 'hero.cta2': 'Inhaltsstoffe ansehen',
      'label.name': 'Valmag', 'label.sub': 'Magnesium · B6 · 90 Kaps.',
      'why.h2': 'Warum Bisglycinat?',
      'why.1.h': 'Hohe Bioverfügbarkeit', 'why.1.p': 'An Glycin gebunden — schonend für den Magen, keine abführende Wirkung wie bei Magnesiumoxid.',
      'why.2.h': 'Für Schlaf & Muskeln', 'why.2.p': 'Magnesium trägt zur normalen Muskelfunktion und zur Verringerung von Müdigkeit bei. Vitamin B6 unterstützt das Nervensystem.',
      'why.3.h': 'Sauber & geprüft', 'why.3.p': 'Ohne Zucker, Gluten, Laktose, Farbstoffe. Chargengeprüft, GMP-zertifizierte Herstellung in der EU.',
      'how.h2': 'So einfach', 'how.1': 'Bestellen — mit TWINT oder Karte, ohne Konto.', 'how.2': 'Versand aus der Schweiz, in 1–3 Werktagen bei Ihnen.', 'how.3': '2 Kapseln abends. Nach 2–3 Wochen spüren Sie den Unterschied.',
      'buy.h2': 'Wählen Sie Ihren Plan',
      'buy.once': 'Einmal kaufen', 'buy.once.s': '90 Kapseln · 30 Tage',
      'buy.sub': 'Monats-Abo', 'buy.sub.s': 'Alle 30 Tage · jederzeit pausieren oder kündigen', 'buy.sub.badge': '−15 %',
      'buy.cta': 'Zur Kasse', 'buy.per': 'pro Monat', 'buy.note': '90 Kapseln · 30 Tage · inkl. 2.6 % MwSt.',
      'trust.1': '✓ Versand CHF 0 ab 2 Dosen', 'trust.2': '✓ 30 Tage Geld-zurück', 'trust.3': '✓ Sichere Zahlung (Shopify)',
      'facts.h2': 'Inhaltsstoffe', 'facts.c1': 'Pro Tagesdosis (2 Kapseln)', 'facts.c2': 'Menge', 'facts.c3': '% NRV*',
      'facts.mg': 'Magnesium (als Bisglycinat)', 'facts.b6': 'Vitamin B6 (Pyridoxal-5-Phosphat)',
      'facts.note': '*NRV = Nährstoffbezugswert. Nahrungsergänzungsmittel sind kein Ersatz für eine ausgewogene Ernährung. Empfohlene Tagesdosis nicht überschreiten. Ausserhalb der Reichweite von Kindern lagern.',
      'faq.h2': 'Fragen',
      'faq.1.q': 'Wann sollte ich Magnesium einnehmen?', 'faq.1.a': '2 Kapseln am Abend mit Wasser. Bisglycinat wirkt beruhigend und passt gut vor dem Schlafen.',
      'faq.2.q': 'Wie funktioniert das Abo?', 'faq.2.a': 'Alle 30 Tage automatisch eine neue Dose zum Abo-Preis. Pausieren, verschieben oder kündigen Sie jederzeit per Link in der Bestellbestätigung — ohne Mindestlaufzeit.',
      'faq.3.q': 'Woher kommt das Produkt?', 'faq.3.a': 'Hergestellt in einem GMP-zertifizierten Betrieb in der EU, abgefüllt und etikettiert für den Schweizer Markt, versendet aus dem Wallis.',
      'faq.4.q': 'Gibt es Nebenwirkungen?', 'faq.4.a': 'Bisglycinat ist die magenfreundlichste Form. Bei Nierenerkrankungen oder Medikamenteneinnahme vorher ärztlichen Rat einholen.',
      'foot.copy': '© 2026 Valmag · Wallis, Schweiz', 'foot.imp': 'Impressum', 'foot.ds': 'Datenschutz', 'foot.agb': 'AGB',
      'sticky.price': 'CHF 44 · 30 Tage'
    },
    fr: {
      'meta.title': 'Valmag — Bisglycinate de magnésium du Valais · Sommeil & récupération',
      'meta.desc': 'Bisglycinate de magnésium hautement dosé avec B6. 90 gélules pour 30 jours. Expédié depuis la Suisse, TWINT et abonnement −15 %.',
      'nav.buy': 'Commander',
      'hero.pill1': 'Fabriqué en UE · GMP', 'hero.pill2': 'Expédié depuis la Suisse', 'hero.pill3': 'TWINT · Carte',
      'hero.h1': 'Mieux dormir.<br>Récupérer <em>plus vite.</em>',
      'hero.lead': 'Bisglycinate de magnésium avec vitamine B6 — la forme bien tolérée que votre corps assimile vraiment. 90 gélules, 30 jours, un abonnement que vous mettez en pause quand vous voulez.',
      'hero.cta1': 'Commander — CHF 44', 'hero.cta2': 'Voir la composition',
      'label.name': 'Valmag', 'label.sub': 'Magnésium · B6 · 90 gél.',
      'why.h2': 'Pourquoi le bisglycinate ?',
      'why.1.h': 'Haute biodisponibilité', 'why.1.p': 'Lié à la glycine — doux pour l’estomac, sans effet laxatif contrairement à l’oxyde de magnésium.',
      'why.2.h': 'Sommeil & muscles', 'why.2.p': 'Le magnésium contribue à une fonction musculaire normale et à réduire la fatigue. La vitamine B6 soutient le système nerveux.',
      'why.3.h': 'Propre & contrôlé', 'why.3.p': 'Sans sucre, gluten, lactose ni colorants. Lots testés, fabrication certifiée GMP en UE.',
      'how.h2': 'Simple', 'how.1': 'Commandez — TWINT ou carte, sans compte.', 'how.2': 'Expédié depuis la Suisse, chez vous en 1 à 3 jours ouvrables.', 'how.3': '2 gélules le soir. Après 2–3 semaines, vous sentez la différence.',
      'buy.h2': 'Choisissez votre formule',
      'buy.once': 'Achat unique', 'buy.once.s': '90 gélules · 30 jours',
      'buy.sub': 'Abonnement mensuel', 'buy.sub.s': 'Tous les 30 jours · pause ou annulation à tout moment', 'buy.sub.badge': '−15 %',
      'buy.cta': 'Passer commande', 'buy.per': 'par mois', 'buy.note': '90 gélules · 30 jours · TVA 2.6 % incluse',
      'trust.1': '✓ Livraison CHF 0 dès 2 flacons', 'trust.2': '✓ Satisfait ou remboursé 30 jours', 'trust.3': '✓ Paiement sécurisé (Shopify)',
      'facts.h2': 'Composition', 'facts.c1': 'Par dose journalière (2 gélules)', 'facts.c2': 'Quantité', 'facts.c3': '% VNR*',
      'facts.mg': 'Magnésium (bisglycinate)', 'facts.b6': 'Vitamine B6 (pyridoxal-5-phosphate)',
      'facts.note': '*VNR = valeur nutritionnelle de référence. Les compléments alimentaires ne remplacent pas une alimentation équilibrée. Ne pas dépasser la dose journalière recommandée. Tenir hors de portée des enfants.',
      'faq.h2': 'Questions',
      'faq.1.q': 'Quand prendre le magnésium ?', 'faq.1.a': '2 gélules le soir avec de l’eau. Le bisglycinate est apaisant et convient avant le coucher.',
      'faq.2.q': 'Comment fonctionne l’abonnement ?', 'faq.2.a': 'Un nouveau flacon tous les 30 jours au prix abonné. Pause, report ou annulation à tout moment via le lien de votre confirmation — sans engagement.',
      'faq.3.q': 'D’où vient le produit ?', 'faq.3.a': 'Fabriqué dans un site certifié GMP en UE, conditionné et étiqueté pour le marché suisse, expédié depuis le Valais.',
      'faq.4.q': 'Y a-t-il des effets secondaires ?', 'faq.4.a': 'Le bisglycinate est la forme la plus douce pour l’estomac. En cas de maladie rénale ou de traitement, demandez conseil à votre médecin.',
      'foot.copy': '© 2026 Valmag · Valais, Suisse', 'foot.imp': 'Mentions légales', 'foot.ds': 'Confidentialité', 'foot.agb': 'CGV',
      'sticky.price': 'CHF 44 · 30 jours'
    }
  };
  var lang = (function () {
    try { var s = localStorage.getItem('valmag.lang'); if (s && I18N[s]) return s; } catch (e) {}
    var q = new URLSearchParams(location.search).get('lang'); if (q && I18N[q]) return q;
    return (navigator.language || 'de').slice(0, 2) === 'fr' ? 'fr' : 'de';
  })();
  function apply() {
    var t = I18N[lang];
    document.documentElement.lang = lang === 'fr' ? 'fr-CH' : 'de-CH';
    document.title = t['meta.title'];
    var m = document.querySelector('meta[name="description"]'); if (m) m.content = t['meta.desc'];
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); if (t[k] != null) el.innerHTML = t[k]; });
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { lang = b.dataset.lang; try { localStorage.setItem('valmag.lang', lang); } catch (e) {} apply(); });
  });
  /* plan toggle + checkout permalink */
  var sub = false;
  function checkoutUrl() {
    var v = sub ? CONFIG.variantSub : CONFIG.variantOnce;
    var u = 'https://' + CONFIG.shop + '/cart/' + v + ':1';
    if (sub) u += '?selling_plan=' + CONFIG.sellingPlan;
    return u;
  }
  function paint() {
    document.querySelectorAll('.opt').forEach(function (o) { o.classList.toggle('on', (o.dataset.plan === 'sub') === sub); });
    var price = (sub ? CONFIG.priceSub : CONFIG.priceOnce).toFixed(2).replace('.00', '');
    document.querySelectorAll('[data-price]').forEach(function (el) { el.textContent = 'CHF ' + price; });
    document.querySelectorAll('[data-checkout]').forEach(function (a) { a.href = checkoutUrl(); });
  }
  document.querySelectorAll('.opt input').forEach(function (r) { r.addEventListener('change', function () { sub = r.value === 'sub'; paint(); }); });
  document.querySelectorAll('[data-checkout]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (/VARIANT_ID|SELLING_PLAN/.test(a.href)) { e.preventDefault(); alert(lang === 'fr' ? 'Boutique en préparation — le paiement sera activé au lancement.' : 'Shop in Vorbereitung — die Kasse wird zum Launch aktiviert.'); }
    });
  });
  apply(); paint();
})();
