/* ====================================================================
   Hotel Alpina Grächen — i18n (DE · FR · IT · EN)
   DE is the source of truth; FR/IT/EN filled by translation pass.
   Strings may contain <em>/<br> — keep tags intact when translating.
   Placeholders {n} {name} {room} {offer} {in} {out} {guests} {total}
   {mail} {phone} {note} are replaced at runtime — keep them verbatim.
   Pipe-separated lists (months, weekdays) must keep the same count.
   ==================================================================== */
window.I18N = {

de: {
  /* --- nav / header --- */
  "nav.zimmer": "Zimmer",
  "nav.angebote": "Angebote",
  "nav.gastronomie": "Gastronomie",
  "nav.wellness": "Wellness",
  "nav.graechen": "Grächen",
  "nav.kontakt": "Kontakt",
  "nav.cta": "Direkt buchen",
  "menu.zimmer": "Zimmer &amp; Ferienwohnung",
  "menu.angebote": "Angebote",
  "menu.gastronomie": "Gastronomie",
  "menu.wellness": "Hannigspa",
  "menu.erleben": "Grächen erleben",
  "menu.kontakt": "Kontakt &amp; Anreise",
  "cursor.view": "Entdecken",

  /* --- dock --- */
  "dock.line": "Zimmer ab <b>CHF 97</b> / Nacht",
  "dock.sub": "Bestpreisgarantie · Keine Anzahlung",
  "dock.btn": "Jetzt buchen",

  /* --- hero --- */
  "hero.pill1": "<span class=\"star\">★</span> 4,6 / 5 · Gästebewertungen",
  "hero.pill2": "Matterhorn Valley · Wallis",
  "hero.h1": "Hoch über<br>dem <em>Alltag.</em>",
  "hero.sub": "Ihr Boutique-Berghotel im Sonnendorf Grächen — 300 Sonnentage, 270° Bergpanorama und ein Balkon mit Blick auf die Walliser Viertausender. Zu jedem Zimmer.",
  "hero.cta1": "Verfügbarkeit prüfen",
  "hero.cta2": "Zimmer entdecken",

  /* --- booking bar --- */
  "bb.title": "Direkt buchen — <em>mit Bestpreisgarantie</em>",
  "bb.note": "Keine Anzahlung · Keine Buchungsgebühr · Offizielle Website",
  "bb.in": "Anreise",
  "bb.out": "Abreise",
  "bb.guests": "Gäste",
  "bb.g1": "1 Gast",
  "bb.g2": "2 Gäste",
  "bb.g3": "3 Gäste",
  "bb.g4": "4 Gäste",
  "bb.g5": "5+ / Familie",
  "bb.btn": "Jetzt buchen&nbsp;→",
  "bb.sub": "Sicher online buchen &amp; bezahlen oder vor Ort — Sie entscheiden. Fragen? <a href=\"tel:+41279552600\">027 955 26 00</a>",

  /* --- kinetic --- */
  "kin.1": "Panorama-Zimmer. <em>Walliser Genuss.</em> Panorama-Zimmer.",
  "kin.2": "<em>Hannigspa.</em> 300 Sonnentage. <em>Hannigspa.</em>",
  "kin.3": "Pure Erholung. <em>Einfach Alpina.</em> Pure Erholung.",

  /* --- intro --- */
  "intro.eyebrow": "Willkommen im Alpina",
  "intro.h2": "Ankommen. Durchatmen.<br><em>Bleiben wollen.</em>",
  "intro.lead": "Einfach Ferien. Einfach gut. Einfach Alpina. Im autofreien Dorfteil gelegen, nahe bei den Bergbahnen und fussläufig zum Dorfzentrum, zeichnet sich das Hotel Alpina durch tollen Service aus — begleitet von aufmerksamem und freundlichem Personal.",
  "intro.p2": "Morgens weckt Sie die Alpenwelt auf dem eigenen Balkon, tagsüber liegen Ihnen Pisten, Höhenwege und die Wälder von Grächen zu Füssen. Abends verwöhnen Sie die preisgekrönten Köche in unserem Schwesterhotel Désirée — und im Partnerhotel Hannigalp nutzen Sie das einzige Hallenschwimmbad in Grächen kostenlos.",
  "intro.stat1": "Zimmer &amp; FeWo",
  "intro.stat2": "Sonnentage",
  "intro.stat3": "° Panorama",
  "intro.stat4": "Bewertung",
  "intro.badge1": "Einfach Ferien. Einfach gut.",
  "intro.badge2": "Einfach Alpina.",

  /* --- rooms --- */
  "rooms.eyebrow": "Zimmer &amp; Suiten",
  "rooms.h2": "Jedes Zimmer mit Balkon.<br><em>Jeder Balkon mit Panorama.</em>",
  "rooms.note": "19 charmant eingerichtete Einzel-, Doppel- &amp; Familienzimmer sowie eine Ferienwohnung — alle mit Balkon und Panoramablick auf die Walliser Alpen, WLAN, Sat-TV, Safe und Kaffee- &amp; Teestation.",
  "rooms.tag": "Am beliebtesten",
  "rooms.from": "ab",
  "rooms.perNight": "/ Nacht",
  "rooms.book": "Jetzt buchen <span>→</span>",
  "rooms.foot": "„Ab\"-Preise pro Zimmer/Nacht inkl. Frühstück, gemäss offiziellem Buchungssystem (günstigste Rate, saisonabhängig) · exkl. Kurtaxe.",
  "room.dz.name": "Doppelzimmer",
  "room.dz.desc": "Pures Ferienglück zu Zweit: gemütliche 20 m² mit Panoramabalkon und Frühstück inklusive — mit Bett in 200×180 cm.",
  "room.dz.f1": "20 m²",
  "room.dz.f2": "2 Personen",
  "room.dz.f3": "Balkon &amp; Bergblick",
  "room.dz.f4": "Frühstück inkl.",
  "room.ez.name": "Einzelzimmer",
  "room.ez.desc": "Die perfekte Ferieninsel für Einzelreisende: 15 m² mit Balkon, Panoramablick und Frühstück inklusive.",
  "room.ez.f1": "15 m²",
  "room.ez.f2": "1 Person",
  "room.ez.f3": "Balkon &amp; Bergblick",
  "room.drz.name": "Dreibettzimmer",
  "room.drz.desc": "Ferienreich für Gross und Klein: 22 m² mit zwei Badezimmern — ideal für Eltern mit einem Kind.",
  "room.drz.f1": "22 m²",
  "room.drz.f2": "3 Personen",
  "room.drz.f3": "2 Badezimmer",
  "room.fz.name": "Familienzimmer",
  "room.fz.desc": "Grosszügiges Ferienparadies: 45 m² mit Etagenbetten für die Kinder — alles, was das Urlauberherz begehrt.",
  "room.fz.f1": "45 m²",
  "room.fz.f2": "2 Erw. + Kinder",
  "room.fz.f3": "Etagenbetten",
  "room.fewo.name": "Ferienwohnung",
  "room.fewo.desc": "120 m² pures Ferienglück für bis zu 5 Personen: zwei Schlafzimmer, zwei Bäder, Küche mit Fondue-Rechaud und zwei Balkone.",
  "room.fewo.f1": "120 m²",
  "room.fewo.f2": "2 Erw. + 3 Kinder",
  "room.fewo.f3": "2 Balkone",

  /* --- direct booking band --- */
  "direct.eyebrow": "Warum direkt?",
  "direct.h2": "Direkt buchen.<br><em>Besser schlafen.</em>",
  "direct.p1t": "Bestpreisgarantie",
  "direct.p1": "Der beste Tarif — garantiert. Nur auf der offiziellen Website, keine Buchungsgebühr.",
  "direct.p2t": "Keine Anzahlung",
  "direct.p2": "Book now, pay later: Sie zahlen bequem im Hotel — mit kostenloser Stornierung bei der flexiblen Rate.",
  "direct.p3t": "Generations-Rabatt",
  "direct.p3": "Mit 3 Generationen der Familie anreisen und 10% sparen — exklusiv bei direkter Buchung.",
  "direct.cta": "Jetzt Verfügbarkeit prüfen",

  /* --- offers --- */
  "offers.eyebrow": "Spezialangebote",
  "offers.h2": "Mehr Ferien <em>fürs Geld.</em>",
  "offer.1t": "Retreat Woche — Entschleunigung &amp; Selfcare",
  "offer.1": "Eine Woche raus aus dem Alltag: tägliches Morgen-Yoga, Meditation &amp; Atemarbeit, geführte Retreats zu Selfcare und Resilienz — mit Halbpension (Abendessen im Hotel Désirée) und professionellem Kinderprogramm.",
  "offer.1p": "Ab <strong>CHF 145.–</strong> pro Person/Tag",
  "offer.2t": "Mountainbike Familienferien",
  "offer.2": "Ereignisreiche Bike-Ferien im Mattertal: 4 Übernachtungen inkl. Frühstück, Nutzung des Mountainbike-Raums und freie Nutzung der Wellnessanlagen.",
  "offer.2p": "Ab <strong>CHF 799.–</strong> für 2 Personen",
  "offer.3t": "Generations-Rabatt",
  "offer.3": "Kommen Sie mit 3 Generationen Ihrer Familie in die Ferien und buchen Sie Ihre Zimmer inklusive Frühstück 10% günstiger — nur bei direkter Buchung erhältlich.",
  "offer.3p": "<strong>−10%</strong> auf Zimmer inkl. Frühstück",
  "offers.ask": "Jetzt anfragen <span>→</span>",

  /* --- gastronomy --- */
  "gastro.eyebrow": "Gastronomie",
  "gastro.h2": "Kulinarische <em>Höhenflüge.</em>",
  "gastro.lead": "Starten Sie den Tag mit unserem vielfältigen Frühstück — täglich bis 10:30 Uhr, mit frischen Eiern, köstlichem Käse und erstklassiger Wurst vom heimischen Metzger. Abends verwöhnen Sie die preisgekrönten Köche in unserem Schwesterhotel Désirée mit frischen, regionalen Menüs.",
  "gastro.c1": "Frühstück im Haus — täglich bis 10:30 Uhr",
  "gastro.c2": "Abendessen im Family Hotel &amp; Spa Désirée (auf Vorreservation)",
  "gastro.c3": "Les Trois Fondues — drei Käsefondues im handgefertigten Caquelon",
  "gastro.c4": "Aufenthaltsraum mit Spielen &amp; Gratis-Kühlschrank",
  "gastro.btn": "Tisch reservieren",
  "gastro.cap": "Les Trois Fondues — Walliser Klassiker, neu gedacht",

  /* --- wellness --- */
  "well.eyebrow": "Hannigspa",
  "well.h2": "Erst der Berg,<br><em>dann die Ruhe.</em>",
  "well.lead": "Keine zehn Gehminuten entfernt, im Partnerhotel Aktiv Hotel &amp; Spa Hannigalp, tanken Körper, Geist und Seele neue Energie: das einzige Hallenbad in Grächen und ein grosszügiger SPA-Bereich in den farbenfrohen Welten des Feng Shui.",
  "well.c1": "Hallenschwimmbad (6×12 m) mit Whirlpool — für Alpina-Gäste gratis",
  "well.c2": "Finnische Sauna, Bio-Sauna &amp; Dampfbad mit Panoramafenster",
  "well.c3": "Wellness- &amp; Beauty-Angebote (kleiner Aufpreis für den SPA-Bereich)",
  "well.c4": "Thermalbad Brigerbad nur 30 Min. entfernt",
  "well.btn": "Mehr erfahren",
  "well.cap": "Hannigspa — Ihre Auszeit in den Alpen, 10 Gehminuten vom Alpina",

  /* --- erleben --- */
  "erleben.eyebrow": "Grächen erleben",
  "erleben.h2": "365 Tage <em>Berge vor der Tür.</em>",
  "erleben.note": "Insider-Tipps unserer Gastgeber — erleben Sie Grächen und das Mattertal wie die Einheimischen.",
  "tip.1t": "Winter auf der Hannigalp",
  "tip.1": "Sonnige, familienfreundliche Pisten — die Bergbahn liegt fünf Gehminuten vom Hotel.",
  "tip.2t": "Thermalbad Brigerbad",
  "tip.2": "2'600 m² Thermal- und Wellnessoase mit Blick auf die Walliser Alpen — ganzjährig.",
  "tip.3t": "Jungen &amp; Moosalp",
  "tip.3": "Seilbahnfahrt zum idyllischen Jungensee, dann Höhenweg mit atemberaubendem Panorama.",
  "tip.4t": "Ausflug nach Zermatt",
  "tip.4": "Das Matterhorn vor der Linse und der grösste Kids-Seilpark der Schweiz gleich daneben.",
  "tip.5t": "Feeblitz Saas-Fee",
  "tip.5": "Mit bis zu 40 km/h die höchste Alpen-Achterbahn hinunter — Adrenalin inklusive.",
  "tip.6t": "Kneipp-Garten Taa",
  "tip.6": "Zwischen Waldrand und Grächersee: Wassertreten und Erfrischung nach der Wanderung.",
  "erleben.hint": "← Ziehen zum Entdecken →",

  /* --- reviews --- */
  "rev.eyebrow": "Gästestimmen",
  "rev.h2": "Das sagen <em>unsere Gäste</em>",
  "rev.sub": "aus 40 Bewertungen auf Tripadvisor &amp; Google",
  "rev.1": "«Hier ein echtes Gästezitat von Tripadvisor oder Google einsetzen — z. B. zum Frühstück, zur Aussicht oder zum Team.»",
  "rev.1f": "Gast aus der Schweiz · Winter",
  "rev.2": "«Hier ein echtes Gästezitat einsetzen — die eigenen Gäste verkaufen das Hotel besser als jeder Werbetext.»",
  "rev.2f": "Gast aus Deutschland · Sommer",
  "rev.3": "«Hier ein echtes Gästezitat einsetzen — idealerweise eines, das die Lage und das Panorama erwähnt.»",
  "rev.3f": "Gast aus Belgien · Herbst",

  /* --- contact --- */
  "ct.eyebrow": "Kontakt &amp; Anreise",
  "ct.h2": "Wir freuen uns <em>auf Sie.</em>",
  "ct.addr": "<strong>Hotel Alpina***</strong><br>Hofe 454 · 3925 Grächen<br>Wallis, Schweiz",
  "ct.car": "Mit dem Auto",
  "ct.carP": "Zufahrt bis zum Dorfzentrum (teilweise autofrei). Parkplätze &amp; Parkhaus im Zentrum — gerne holen wir Sie dort mit unserem Elektroauto ab.",
  "ct.train": "Mit dem Zug",
  "ct.trainP": "SBB bis Visp, Matterhorn Gotthard Bahn bis St.&nbsp;Niklaus, dann Bus 551 bis Grächen Dorf — durch das am tiefsten eingeschnittene Tal der Schweiz.",
  "ct.checkin": "Check-in",
  "ct.checkout": "Check-out",
  "ct.maps": "Route in Google Maps",
  "ct.formT": "Schreiben Sie uns",
  "ct.fName": "Name",
  "ct.fMail": "E-Mail",
  "ct.fMsg": "Nachricht",
  "ct.fPh": "Wann möchten Sie kommen? Haben Sie Wünsche?",
  "ct.fBtn": "Nachricht senden",

  /* --- footer --- */
  "ft.tag": "Boutique-Berghotel im Sonnendorf Grächen.<br>300 Sonnentage. Ein Zuhause.",
  "ft.h1": "Entdecken",
  "ft.l1": "Zimmer &amp; Suiten",
  "ft.l2": "Gastronomie",
  "ft.l3": "Wellness &amp; Spa",
  "ft.l4": "Grächen erleben",
  "ft.h2": "Kontakt",
  "ft.h3": "Direkt buchen",
  "ft.direct": "Bestpreisgarantie, keine Anzahlung, keine Buchungsgebühr — nur auf der offiziellen Website.",
  "ft.btn": "Verfügbarkeit prüfen",
  "ft.credit": "Konzept &amp; Design: Pedro Ribeiro Digital",

  /* --- checkout modal --- */
  "bm.s1": "Zimmer",
  "bm.s2": "Gäste",
  "bm.s3": "Zahlung",
  "bm.h1": "Wählen Sie Ihr Zimmer",
  "bm.sumPerk": "Bestpreisgarantie · keine Buchungsgebühr",
  "bm.total": "Total ab",
  "bm.sumNote": "inkl. Frühstück · günstigste Rate (saisonabhängig) · exkl. Kurtaxe",
  "bm.next": "Weiter&nbsp;→",
  "bm.h2": "Ihre Angaben",
  "bm.name": "Name *",
  "bm.mail": "E-Mail *",
  "bm.phone": "Telefon",
  "bm.wishes": "Wünsche (optional)",
  "bm.wishesPh": "z. B. Haustier, Anreisezeit, Zimmerlage…",
  "bm.back": "←&nbsp;Zurück",
  "bm.toPay": "Weiter zur Zahlung&nbsp;→",
  "bm.h3": "Zahlung",
  "bm.pay1": "Jetzt online buchen &amp; bezahlen",
  "bm.pay1b": "Sofort bestätigt",
  "bm.pay1s": "Sichere Zahlung über das offizielle Buchungssystem — Ihre Daten werden übernommen · auch «Book now, pay later» wählbar",
  "bm.pay2": "Per E-Mail anfragen — vor Ort bezahlen",
  "bm.pay2s": "Wir bestätigen persönlich innert 24 h · keine Anzahlung",
  "bm.ssl": "🔒 SSL-verschlüsselt",

  /* --- dynamic (JS) --- */
  "cal.months": "Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember",
  "cal.monthsShort": "Jan.|Feb.|März|Apr.|Mai|Juni|Juli|Aug.|Sept.|Okt.|Nov.|Dez.",
  "cal.wdShort": "So.|Mo.|Di.|Mi.|Do.|Fr.|Sa.",
  "cal.dows": "Mo|Di|Mi|Do|Fr|Sa|So",
  "cal.pickIn": "Anreise wählen",
  "cal.pickOut": "Abreise wählen",
  "cal.nightSel": "1 Nacht ausgewählt",
  "cal.nightsSel": "{n} Nächte ausgewählt",
  "cal.clear": "Löschen",
  "cal.pickDate": "Datum wählen",
  "u.night": "Nacht",
  "u.nights": "Nächte",
  "u.guest": "Gast",
  "u.guests": "Gäste",
  "u.from": "ab",
  "meta.ez": "15 m² · 1 Person · Balkon & Bergblick",
  "meta.dz": "20 m² · 2 Personen · Balkon & Bergblick",
  "meta.drz": "22 m² · 2 Erw. + 1 Kind · 2 Badezimmer",
  "meta.fz": "45 m² · Familie · Etagenbetten",
  "meta.fewo": "120 m² · 2 Erw. + 3 Kinder · Küche",
  "recap.incl": "inkl. Frühstück · günstigste Rate",
  "pay.noteOnline": "Das offizielle Buchungssystem wurde mit Ihren Daten geöffnet — dort sicher bezahlen oder «Book now, pay later» wählen.",
  "pay.noteLater": "Ihr E-Mail-Programm öffnet sich mit der fertigen Anfrage. Wir bestätigen innert 24 h.",
  "mail.bookSubject": "Buchungsanfrage {room} — Zahlung vor Ort",
  "mail.bookBody": "Guten Tag\n\nIch möchte gerne verbindlich anfragen:\n\nZimmer:  {room}\nAnreise: {in}\nAbreise: {out}\nGäste:   {guests}\nTotal:   ab {total} ({n} Nächte, inkl. Frühstück)\n\nName:    {name}\nE-Mail:  {mail}\n{phone}{note}\nFreundliche Grüsse\n{name}",
  "mail.phoneLine": "Telefon: {phone}\n",
  "mail.noteLine": "\nWünsche: {note}\n",
  "mail.contactSubject": "Anfrage über die Website — {name}",
  "mail.offerSubject": "Anfrage: {offer}",
  "mail.offerBody": "Guten Tag\n\nIch interessiere mich für das Angebot «{offer}». Bitte senden Sie mir weitere Informationen.\n\nFreundliche Grüsse",
  "form.err": "Bitte füllen Sie alle Felder aus.",
  "form.ok": "Vielen Dank, {name}! Ihr E-Mail-Programm öffnet sich.",
  "sb.lang": "DE",
  "pay.frameTitle": "Sicheres Buchungssystem — Hotel Alpina",
  "pay.frameExt": "In neuem Tab öffnen",
  "ms.open": "E-Mail-Programm öffnen",
  "ms.copy": "Nachricht kopieren",
  "ms.copied": "Kopiert!",
  "ms.to": "An",
  "ms.or": "Oder direkt:"
},

fr: {"nav.zimmer":"Chambres","nav.angebote":"Offres","nav.gastronomie":"Gastronomie","nav.wellness":"Bien-être","nav.graechen":"Grächen","nav.kontakt":"Contact","nav.cta":"Réserver en direct","menu.zimmer":"Chambres \u0026amp; appartement","menu.angebote":"Offres","menu.gastronomie":"Gastronomie","menu.wellness":"Hannigspa","menu.erleben":"Vivre Grächen","menu.kontakt":"Contact \u0026amp; accès","cursor.view":"Découvrir","dock.line":"Chambres dès \u003cb\u003eCHF 97\u003c/b\u003e / nuit","dock.sub":"Meilleur prix garanti · Sans acompte","dock.btn":"Réserver","hero.pill1":"\u003cspan class=\"star\"\u003e★\u003c/span\u003e 4,6 / 5 · Avis de nos hôtes","hero.pill2":"Matterhorn Valley · Valais","hero.h1":"Bien au-dessus\u003cbr\u003edu \u003cem\u003equotidien.\u003c/em\u003e","hero.sub":"Votre boutique-hôtel de montagne au village ensoleillé de Grächen — 300 jours de soleil, un panorama alpin à 270° et un balcon avec vue sur les 4000 valaisans. Dans chaque chambre.","hero.cta1":"Vérifier les disponibilités","hero.cta2":"Découvrir les chambres","bb.title":"Réserver en direct — \u003cem\u003eau meilleur prix garanti\u003c/em\u003e","bb.note":"Sans acompte · Sans frais de réservation · Site officiel","bb.in":"Arrivée","bb.out":"Départ","bb.guests":"Personnes","bb.g1":"1 personne","bb.g2":"2 personnes","bb.g3":"3 personnes","bb.g4":"4 personnes","bb.g5":"5+ / famille","bb.btn":"Réserver\u0026nbsp;→","bb.sub":"Réservez \u0026amp; payez en ligne en toute sécurité ou sur place — à vous de choisir. Des questions? \u003ca href=\"tel:+41279552600\"\u003e027 955 26 00\u003c/a\u003e","kin.1":"Chambres panorama. \u003cem\u003eSaveurs valaisannes.\u003c/em\u003e Chambres panorama.","kin.2":"\u003cem\u003eHannigspa.\u003c/em\u003e 300 jours de soleil. \u003cem\u003eHannigspa.\u003c/em\u003e","kin.3":"Pure détente. \u003cem\u003eSimplement Alpina.\u003c/em\u003e Pure détente.","intro.eyebrow":"Bienvenue à l\u0027Alpina","intro.h2":"Arriver. Respirer.\u003cbr\u003e\u003cem\u003eVouloir rester.\u003c/em\u003e","intro.lead":"Simplement les vacances. Simplement bien. Simplement Alpina. Situé dans la partie sans voitures du village, à deux pas des remontées mécaniques et du centre, l\u0027Hôtel Alpina se distingue par un service remarquable — porté par une équipe attentionnée et chaleureuse.","intro.p2":"Le matin, le monde alpin vous accueille sur votre balcon; la journée, pistes, sentiers d\u0027altitude et forêts de Grächen s\u0027étendent à vos pieds. Le soir, les chefs primés de notre hôtel jumeau Désirée vous régalent — et à l\u0027hôtel partenaire Hannigalp, la seule piscine couverte de Grächen vous est offerte.","intro.stat1":"Chambres \u0026amp; appart.","intro.stat2":"Jours de soleil","intro.stat3":"° panorama","intro.stat4":"Note","intro.badge1":"Simplement les vacances. Simplement bien.","intro.badge2":"Simplement Alpina.","rooms.eyebrow":"Chambres \u0026amp; suites","rooms.h2":"Chaque chambre avec balcon.\u003cbr\u003e\u003cem\u003eChaque balcon avec panorama.\u003c/em\u003e","rooms.note":"19 chambres simples, doubles \u0026amp; familiales au charme soigné ainsi qu\u0027un appartement de vacances — tous avec balcon et vue panoramique sur les Alpes valaisannes, WiFi, TV satellite, coffre-fort et station café \u0026amp; thé.","rooms.tag":"La plus demandée","rooms.from":"dès","rooms.perNight":"/ nuit","rooms.book":"Réserver \u003cspan\u003e→\u003c/span\u003e","rooms.foot":"Prix «dès» par chambre/nuit, petit-déjeuner inclus, selon le système de réservation officiel (tarif le plus bas, selon la saison) · taxe de séjour en sus.","room.dz.name":"Chambre double","room.dz.desc":"Le bonheur des vacances à deux : 20 m² douillets avec balcon panoramique et petit-déjeuner inclus — lit de 200×180 cm.","room.dz.f1":"20 m²","room.dz.f2":"2 personnes","room.dz.f3":"Balcon \u0026amp; vue montagne","room.dz.f4":"Petit-déjeuner incl.","room.ez.name":"Chambre simple","room.ez.desc":"Le refuge idéal des voyageurs solo : 15 m² avec balcon, vue panoramique et petit-déjeuner inclus.","room.ez.f1":"15 m²","room.ez.f2":"1 personne","room.ez.f3":"Balcon \u0026amp; vue montagne","room.drz.name":"Chambre triple","room.drz.desc":"Un royaume de vacances pour petits et grands : 22 m² avec deux salles de bains — idéal pour des parents avec un enfant.","room.drz.f1":"22 m²","room.drz.f2":"3 personnes","room.drz.f3":"2 salles de bains","room.fz.name":"Chambre familiale","room.fz.desc":"Un vaste paradis de vacances : 45 m² avec lits superposés pour les enfants — tout ce dont rêvent les vacanciers.","room.fz.f1":"45 m²","room.fz.f2":"2 ad. + enfants","room.fz.f3":"Lits superposés","room.fewo.name":"Appartement","room.fewo.desc":"120 m² de pur bonheur pour 5 personnes au maximum : deux chambres, deux salles de bains, cuisine avec réchaud à fondue et deux balcons.","room.fewo.f1":"120 m²","room.fewo.f2":"2 ad. + 3 enfants","room.fewo.f3":"2 balcons","direct.eyebrow":"Pourquoi en direct?","direct.h2":"Réserver en direct.\u003cbr\u003e\u003cem\u003eDormir tranquille.\u003c/em\u003e","direct.p1t":"Meilleur prix garanti","direct.p1":"Le meilleur tarif — garanti. Uniquement sur le site officiel, sans frais de réservation.","direct.p2t":"Sans acompte","direct.p2":"Book now, pay later : vous réglez confortablement à l\u0027hôtel — avec annulation gratuite sur le tarif flexible.","direct.p3t":"Rabais générations","direct.p3":"Venez avec 3 générations de votre famille et économisez 10% — en exclusivité en réservation directe.","direct.cta":"Vérifier les disponibilités","offers.eyebrow":"Offres spéciales","offers.h2":"Plus de vacances \u003cem\u003epour votre budget.\u003c/em\u003e","offer.1t":"Semaine retreat — déconnexion \u0026amp; selfcare","offer.1":"Une semaine loin du quotidien : yoga matinal quotidien, méditation \u0026amp; travail respiratoire, retraites guidées autour du selfcare et de la résilience — en demi-pension (repas du soir à l\u0027hôtel Désirée) et avec programme enfants professionnel.","offer.1p":"Dès \u003cstrong\u003eCHF 145.–\u003c/strong\u003e par personne/jour","offer.2t":"Vacances VTT en famille","offer.2":"Des vacances VTT riches en aventures dans le Mattertal : 4 nuits avec petit-déjeuner, accès au local VTT et libre accès aux installations wellness.","offer.2p":"Dès \u003cstrong\u003eCHF 799.–\u003c/strong\u003e pour 2 personnes","offer.3t":"Rabais générations","offer.3":"Partez en vacances avec 3 générations de votre famille et réservez vos chambres avec petit-déjeuner 10% moins cher — uniquement en réservation directe.","offer.3p":"\u003cstrong\u003e−10%\u003c/strong\u003e sur les chambres, petit-déjeuner incl.","offers.ask":"Faire une demande \u003cspan\u003e→\u003c/span\u003e","gastro.eyebrow":"Gastronomie","gastro.h2":"Des sommets \u003cem\u003eculinaires.\u003c/em\u003e","gastro.lead":"Commencez la journée avec notre petit-déjeuner varié — tous les jours jusqu\u0027à 10h30, avec œufs frais, fromages savoureux et charcuterie de premier choix du boucher local. Le soir, les chefs primés de notre hôtel jumeau Désirée vous régalent de menus frais et régionaux.","gastro.c1":"Petit-déjeuner à l\u0027hôtel — tous les jours jusqu\u0027à 10h30","gastro.c2":"Repas du soir au Family Hotel \u0026amp; Spa Désirée (sur réservation)","gastro.c3":"Les Trois Fondues — trois fondues au fromage dans un caquelon artisanal","gastro.c4":"Salon avec jeux \u0026amp; frigo gratuit","gastro.btn":"Réserver une table","gastro.cap":"Les Trois Fondues — le classique valaisan réinventé","well.eyebrow":"Hannigspa","well.h2":"D\u0027abord la montagne,\u003cbr\u003e\u003cem\u003epuis le calme.\u003c/em\u003e","well.lead":"À moins de dix minutes à pied, à l\u0027hôtel partenaire Aktiv Hotel \u0026amp; Spa Hannigalp, corps, esprit et âme refont le plein d\u0027énergie : la seule piscine couverte de Grächen et un vaste espace spa dans les univers colorés du feng shui.","well.c1":"Piscine couverte (6×12 m) avec jacuzzi — gratuite pour les hôtes de l\u0027Alpina","well.c2":"Sauna finlandais, sauna bio \u0026amp; bain de vapeur avec fenêtre panoramique","well.c3":"Offres wellness \u0026amp; beauté (petit supplément pour l\u0027espace spa)","well.c4":"Bains thermaux de Brigerbad à seulement 30 min.","well.btn":"En savoir plus","well.cap":"Hannigspa — votre pause alpine, à 10 minutes à pied de l\u0027Alpina","erleben.eyebrow":"Vivre Grächen","erleben.h2":"365 jours \u003cem\u003ede montagne à la porte.\u003c/em\u003e","erleben.note":"Les conseils d\u0027initiés de vos hôtes — vivez Grächen et le Mattertal comme les gens d\u0027ici.","tip.1t":"L\u0027hiver sur la Hannigalp","tip.1":"Des pistes ensoleillées et familiales — la télécabine se trouve à cinq minutes à pied de l\u0027hôtel.","tip.2t":"Bains thermaux de Brigerbad","tip.2":"2\u0027600 m² d\u0027oasis thermale et wellness avec vue sur les Alpes valaisannes — toute l\u0027année.","tip.3t":"Jungen \u0026amp; Moosalp","tip.3":"Montée en téléphérique jusqu\u0027à l\u0027idyllique lac de Jungen, puis sentier d\u0027altitude au panorama époustouflant.","tip.4t":"Excursion à Zermatt","tip.4":"Le Cervin dans l\u0027objectif et le plus grand parc de cordes pour enfants de Suisse juste à côté.","tip.5t":"Feeblitz Saas-Fee","tip.5":"Jusqu\u0027à 40 km/h sur les plus hautes montagnes russes des Alpes — adrénaline incluse.","tip.6t":"Kneipp-Garten Taa","tip.6":"Entre la lisière de la forêt et le Grächersee : marche dans l\u0027eau et fraîcheur après la randonnée.","erleben.hint":"← Faites glisser pour découvrir →","rev.eyebrow":"Avis de nos hôtes","rev.h2":"Ce que disent \u003cem\u003enos hôtes\u003c/em\u003e","rev.sub":"d\u0027après 40 avis sur Tripadvisor \u0026amp; Google","rev.1":"«Insérer ici une citation authentique d\u0027un hôte, tirée de Tripadvisor ou Google — p. ex. sur le petit-déjeuner, la vue ou l\u0027équipe.»","rev.1f":"Hôte de Suisse · hiver","rev.2":"«Insérer ici une citation authentique — vos hôtes vendent l\u0027hôtel mieux que n\u0027importe quel texte publicitaire.»","rev.2f":"Hôte d\u0027Allemagne · été","rev.3":"«Insérer ici une citation authentique — idéalement une qui évoque la situation et le panorama.»","rev.3f":"Hôte de Belgique · automne","ct.eyebrow":"Contact \u0026amp; accès","ct.h2":"Au plaisir \u003cem\u003ede vous accueillir.\u003c/em\u003e","ct.addr":"\u003cstrong\u003eHotel Alpina***\u003c/strong\u003e\u003cbr\u003eHofe 454 · 3925 Grächen\u003cbr\u003eValais, Suisse","ct.car":"En voiture","ct.carP":"Accès jusqu\u0027au centre du village (en partie sans voitures). Places de parc \u0026amp; parking couvert au centre — nous venons volontiers vous y chercher avec notre voiture électrique.","ct.train":"En train","ct.trainP":"SBB jusqu\u0027à Visp, Matterhorn Gotthard Bahn jusqu\u0027à St.\u0026nbsp;Niklaus, puis bus 551 jusqu\u0027à Grächen Dorf — à travers la vallée la plus encaissée de Suisse.","ct.checkin":"Check-in","ct.checkout":"Check-out","ct.maps":"Itinéraire sur Google Maps","ct.formT":"Écrivez-nous","ct.fName":"Nom","ct.fMail":"E-mail","ct.fMsg":"Message","ct.fPh":"Quand souhaitez-vous venir? Avez-vous des souhaits?","ct.fBtn":"Envoyer le message","ft.tag":"Boutique-hôtel de montagne au village ensoleillé de Grächen.\u003cbr\u003e300 jours de soleil. Un chez-soi.","ft.h1":"Découvrir","ft.l1":"Chambres \u0026amp; suites","ft.l2":"Gastronomie","ft.l3":"Bien-être \u0026amp; spa","ft.l4":"Vivre Grächen","ft.h2":"Contact","ft.h3":"Réserver en direct","ft.direct":"Meilleur prix garanti, sans acompte, sans frais de réservation — uniquement sur le site officiel.","ft.btn":"Vérifier les disponibilités","ft.credit":"Concept \u0026amp; design : Pedro Ribeiro Digital","bm.s1":"Chambre","bm.s2":"Coordonnées","bm.s3":"Paiement","bm.h1":"Choisissez votre chambre","bm.sumPerk":"Meilleur prix garanti · sans frais de réservation","bm.total":"Total dès","bm.sumNote":"petit-déjeuner incl. · tarif le plus bas (selon saison) · taxe de séjour en sus","bm.next":"Continuer\u0026nbsp;→","bm.h2":"Vos coordonnées","bm.name":"Nom *","bm.mail":"E-mail *","bm.phone":"Téléphone","bm.wishes":"Souhaits (facultatif)","bm.wishesPh":"p. ex. animal, heure d\u0027arrivée, situation de la chambre…","bm.back":"←\u0026nbsp;Retour","bm.toPay":"Passer au paiement\u0026nbsp;→","bm.h3":"Paiement","bm.pay1":"Réserver \u0026amp; payer en ligne","bm.pay1b":"Confirmation immédiate","bm.pay1s":"Paiement sécurisé via le système de réservation officiel — vos données sont reprises · «Book now, pay later» également disponible","bm.pay2":"Demander par e-mail — payer sur place","bm.pay2s":"Nous confirmons personnellement dans les 24 h · sans acompte","bm.ssl":"🔒 Chiffrement SSL","cal.months":"Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Août|Septembre|Octobre|Novembre|Décembre","cal.monthsShort":"Jan.|Fév.|Mars|Avr.|Mai|Juin|Juil.|Août|Sept.|Oct.|Nov.|Déc.","cal.wdShort":"Dim.|Lun.|Mar.|Mer.|Jeu.|Ven.|Sam.","cal.dows":"Lu|Ma|Me|Je|Ve|Sa|Di","cal.pickIn":"Choisir l\u0027arrivée","cal.pickOut":"Choisir le départ","cal.nightSel":"1 nuit sélectionnée","cal.nightsSel":"{n} nuits sélectionnées","cal.clear":"Effacer","cal.pickDate":"Choisir une date","u.night":"nuit","u.nights":"nuits","u.guest":"personne","u.guests":"personnes","u.from":"dès","meta.ez":"15 m² · 1 personne · Balcon \u0026 vue montagne","meta.dz":"20 m² · 2 personnes · Balcon \u0026 vue montagne","meta.drz":"22 m² · 2 ad. + 1 enfant · 2 salles de bains","meta.fz":"45 m² · Famille · Lits superposés","meta.fewo":"120 m² · 2 ad. + 3 enfants · Cuisine","recap.incl":"petit-déjeuner incl. · tarif le plus bas","pay.noteOnline":"Le système de réservation officiel s\u0027est ouvert avec vos données — payez-y en toute sécurité ou choisissez «Book now, pay later».","pay.noteLater":"Votre messagerie s\u0027ouvre avec la demande déjà rédigée. Nous confirmons dans les 24 h.","mail.bookSubject":"Demande de réservation {room} — paiement sur place","mail.bookBody":"Bonjour\n\nJe souhaite faire une demande de réservation ferme :\n\nChambre : {room}\nArrivée : {in}\nDépart :  {out}\nHôtes :   {guests}\nTotal :   dès {total} ({n} nuits, petit-déjeuner incl.)\n\nNom :     {name}\nE-mail :  {mail}\n{phone}{note}\nMeilleures salutations\n{name}","mail.phoneLine":"Téléphone : {phone}\n","mail.noteLine":"\nSouhaits : {note}\n","mail.contactSubject":"Demande via le site web — {name}","mail.offerSubject":"Demande : {offer}","mail.offerBody":"Bonjour\n\nJe m\u0027intéresse à l\u0027offre «{offer}». Merci de m\u0027envoyer de plus amples informations.\n\nMeilleures salutations","form.err":"Veuillez remplir tous les champs.","form.ok":"Merci beaucoup, {name}! Votre messagerie s\u0027ouvre.","sb.lang":"FR","pay.frameTitle":"Système de réservation sécurisé — Hôtel Alpina","pay.frameExt":"Ouvrir dans un nouvel onglet","ms.open":"Ouvrir l'application e-mail","ms.copy":"Copier le message","ms.copied":"Copié !","ms.to":"À","ms.or":"Ou directement :"},
it: {"nav.zimmer":"Camere","nav.angebote":"Offerte","nav.gastronomie":"Gastronomia","nav.wellness":"Wellness","nav.graechen":"Grächen","nav.kontakt":"Contatti","nav.cta":"Prenota diretto","menu.zimmer":"Camere \u0026amp; appartamento","menu.angebote":"Offerte","menu.gastronomie":"Gastronomia","menu.wellness":"Hannigspa","menu.erleben":"Vivere Grächen","menu.kontakt":"Contatti \u0026amp; arrivo","cursor.view":"Scopri","dock.line":"Camere da \u003cb\u003eCHF 97\u003c/b\u003e / notte","dock.sub":"Miglior prezzo garantito · Nessun acconto","dock.btn":"Prenota ora","hero.pill1":"\u003cspan class=\"star\"\u003e★\u003c/span\u003e 4,6 / 5 · Recensioni degli ospiti","hero.pill2":"Matterhorn Valley · Vallese","hero.h1":"In alto, sopra\u003cbr\u003ela \u003cem\u003eroutine.\u003c/em\u003e","hero.sub":"Il vostro boutique hotel di montagna nel soleggiato villaggio di Grächen — 300 giorni di sole, panorama alpino a 270° e un balcone con vista sui quattromila vallesani. In ogni camera.","hero.cta1":"Verifica disponibilità","hero.cta2":"Scopri le camere","bb.title":"Prenota direttamente — \u003cem\u003econ miglior prezzo garantito\u003c/em\u003e","bb.note":"Nessun acconto · Nessuna commissione · Sito ufficiale","bb.in":"Arrivo","bb.out":"Partenza","bb.guests":"Ospiti","bb.g1":"1 ospite","bb.g2":"2 ospiti","bb.g3":"3 ospiti","bb.g4":"4 ospiti","bb.g5":"5+ / famiglia","bb.btn":"Prenota ora\u0026nbsp;→","bb.sub":"Prenotate \u0026amp; pagate online in sicurezza o in hotel — decidete voi. Domande? \u003ca href=\"tel:+41279552600\"\u003e027 955 26 00\u003c/a\u003e","kin.1":"Camere panorama. \u003cem\u003eGusto vallesano.\u003c/em\u003e Camere panorama.","kin.2":"\u003cem\u003eHannigspa.\u003c/em\u003e 300 giorni di sole. \u003cem\u003eHannigspa.\u003c/em\u003e","kin.3":"Puro relax. \u003cem\u003eSemplicemente Alpina.\u003c/em\u003e Puro relax.","intro.eyebrow":"Benvenuti all\u0027Alpina","intro.h2":"Arrivare. Respirare.\u003cbr\u003e\u003cem\u003eVoler restare.\u003c/em\u003e","intro.lead":"Semplicemente vacanze. Semplicemente bene. Semplicemente Alpina. Situato nella parte del villaggio senza auto, vicino agli impianti di risalita e a pochi passi dal centro, l\u0027Hotel Alpina si distingue per un servizio eccellente — con un personale attento e cordiale.","intro.p2":"Al mattino il mondo alpino vi sveglia sul vostro balcone; di giorno piste, sentieri d\u0027alta quota e i boschi di Grächen sono ai vostri piedi. La sera vi viziano i premiati chef del nostro hotel gemello Désirée — e nell\u0027hotel partner Hannigalp usate gratuitamente l\u0027unica piscina coperta di Grächen.","intro.stat1":"Camere \u0026amp; appart.","intro.stat2":"Giorni di sole","intro.stat3":"° panorama","intro.stat4":"Valutazione","intro.badge1":"Semplicemente vacanze. Semplicemente bene.","intro.badge2":"Semplicemente Alpina.","rooms.eyebrow":"Camere \u0026amp; suite","rooms.h2":"Ogni camera con balcone.\u003cbr\u003e\u003cem\u003eOgni balcone con panorama.\u003c/em\u003e","rooms.note":"19 camere singole, doppie \u0026amp; familiari arredate con charme e un appartamento di vacanza — tutte con balcone e vista panoramica sulle Alpi vallesane, Wi-Fi, TV satellitare, cassaforte e angolo caffè \u0026amp; tè.","rooms.tag":"La più richiesta","rooms.from":"da","rooms.perNight":"/ notte","rooms.book":"Prenota ora \u003cspan\u003e→\u003c/span\u003e","rooms.foot":"Prezzi «da» per camera/notte con colazione inclusa, secondo il sistema di prenotazione ufficiale (tariffa più bassa, stagionale) · tassa di soggiorno esclusa.","room.dz.name":"Camera doppia","room.dz.desc":"Pura felicità di vacanza in due: accoglienti 20 m² con balcone panoramico e colazione inclusa — con letto da 200×180 cm.","room.dz.f1":"20 m²","room.dz.f2":"2 persone","room.dz.f3":"Balcone \u0026amp; vista monti","room.dz.f4":"Colazione incl.","room.ez.name":"Camera singola","room.ez.desc":"L\u0027isola di vacanza perfetta per chi viaggia da solo: 15 m² con balcone, vista panoramica e colazione inclusa.","room.ez.f1":"15 m²","room.ez.f2":"1 persona","room.ez.f3":"Balcone \u0026amp; vista monti","room.drz.name":"Camera tripla","room.drz.desc":"Un regno di vacanza per grandi e piccini: 22 m² con due bagni — ideale per genitori con un bambino.","room.drz.f1":"22 m²","room.drz.f2":"3 persone","room.drz.f3":"2 bagni","room.fz.name":"Camera familiare","room.fz.desc":"Un ampio paradiso di vacanza: 45 m² con letti a castello per i bambini — tutto ciò che un cuore in vacanza desidera.","room.fz.f1":"45 m²","room.fz.f2":"2 ad. + bambini","room.fz.f3":"Letti a castello","room.fewo.name":"Appartamento","room.fewo.desc":"120 m² di pura felicità per un massimo di 5 persone: due camere da letto, due bagni, cucina con réchaud per la fondue e due balconi.","room.fewo.f1":"120 m²","room.fewo.f2":"2 ad. + 3 bambini","room.fewo.f3":"2 balconi","direct.eyebrow":"Perché diretto?","direct.h2":"Prenota diretto.\u003cbr\u003e\u003cem\u003eDormi meglio.\u003c/em\u003e","direct.p1t":"Miglior prezzo garantito","direct.p1":"La tariffa migliore — garantita. Solo sul sito ufficiale, senza commissioni di prenotazione.","direct.p2t":"Nessun acconto","direct.p2":"Book now, pay later: pagate comodamente in hotel — con cancellazione gratuita per la tariffa flessibile.","direct.p3t":"Sconto generazioni","direct.p3":"Arrivate con 3 generazioni della famiglia e risparmiate il 10% — esclusiva della prenotazione diretta.","direct.cta":"Verifica ora la disponibilità","offers.eyebrow":"Offerte speciali","offers.h2":"Più vacanza \u003cem\u003eper il vostro budget.\u003c/em\u003e","offer.1t":"Settimana Retreat — rallentare \u0026amp; selfcare","offer.1":"Una settimana fuori dalla quotidianità: yoga ogni mattina, meditazione \u0026amp; respirazione consapevole, retreat guidati su selfcare e resilienza — con mezza pensione (cena all\u0027Hotel Désirée) e programma professionale per i bambini.","offer.1p":"Da \u003cstrong\u003eCHF 145.–\u003c/strong\u003e a persona/giorno","offer.2t":"Vacanze familiari in mountain bike","offer.2":"Vacanze in bici ricche di avventure nel Mattertal: 4 pernottamenti con colazione, locale mountain bike a disposizione e libero accesso alle strutture wellness.","offer.2p":"Da \u003cstrong\u003eCHF 799.–\u003c/strong\u003e per 2 persone","offer.3t":"Sconto generazioni","offer.3":"Venite in vacanza con 3 generazioni della vostra famiglia e prenotate le camere con colazione inclusa risparmiando il 10% — solo con prenotazione diretta.","offer.3p":"\u003cstrong\u003e−10%\u003c/strong\u003e sulle camere con colazione","offers.ask":"Richiedi ora \u003cspan\u003e→\u003c/span\u003e","gastro.eyebrow":"Gastronomia","gastro.h2":"Vette \u003cem\u003edel gusto.\u003c/em\u003e","gastro.lead":"Iniziate la giornata con la nostra ricca colazione — ogni giorno fino alle 10:30, con uova fresche, formaggi squisiti e salumi di prima qualità del macellaio del posto. La sera i premiati chef del nostro hotel gemello Désirée vi viziano con menu freschi e regionali.","gastro.c1":"Colazione in hotel — ogni giorno fino alle 10:30","gastro.c2":"Cena al Family Hotel \u0026amp; Spa Désirée (su prenotazione)","gastro.c3":"Les Trois Fondues — tre fondute di formaggio nel caquelon artigianale","gastro.c4":"Sala comune con giochi \u0026amp; frigo gratuito","gastro.btn":"Prenota un tavolo","gastro.cap":"Les Trois Fondues — il classico vallesano, reinventato","well.eyebrow":"Hannigspa","well.h2":"Prima la montagna,\u003cbr\u003e\u003cem\u003epoi la quiete.\u003c/em\u003e","well.lead":"A meno di dieci minuti a piedi, nell\u0027hotel partner Aktiv Hotel \u0026amp; Spa Hannigalp, corpo, mente e anima fanno il pieno di energia: l\u0027unica piscina coperta di Grächen e una generosa area SPA nei mondi colorati del Feng Shui.","well.c1":"Piscina coperta (6×12 m) con whirlpool — gratis per gli ospiti Alpina","well.c2":"Sauna finlandese, bio-sauna \u0026amp; bagno turco con finestra panoramica","well.c3":"Offerte wellness \u0026amp; beauty (piccolo supplemento per l\u0027area SPA)","well.c4":"Terme di Brigerbad a soli 30 min. di distanza","well.btn":"Scopri di più","well.cap":"Hannigspa — la vostra pausa nelle Alpi, a 10 minuti a piedi dall\u0027Alpina","erleben.eyebrow":"Vivere Grächen","erleben.h2":"365 giorni \u003cem\u003edi montagne davanti alla porta.\u003c/em\u003e","erleben.note":"I consigli dei nostri padroni di casa — vivete Grächen e il Mattertal come chi ci vive.","tip.1t":"Inverno sulla Hannigalp","tip.1":"Piste soleggiate e a misura di famiglia — la funivia è a cinque minuti a piedi dall\u0027hotel.","tip.2t":"Terme di Brigerbad","tip.2":"2\u0027600 m² di oasi termale e wellness con vista sulle Alpi vallesane — tutto l\u0027anno.","tip.3t":"Jungen \u0026amp; Moosalp","tip.3":"In funivia fino all\u0027idilliaco lago di Jungen, poi sentiero in quota con panorama mozzafiato.","tip.4t":"Gita a Zermatt","tip.4":"Il Cervino davanti all\u0027obiettivo e, proprio accanto, il più grande parco avventura per bambini della Svizzera.","tip.5t":"Feeblitz Saas-Fee","tip.5":"Fino a 40 km/h giù per l\u0027ottovolante alpino più alto — adrenalina inclusa.","tip.6t":"Kneipp-Garten Taa","tip.6":"Tra il bosco e il lago di Grächen: percorso Kneipp e refrigerio dopo l\u0027escursione.","erleben.hint":"← Trascina per scoprire →","rev.eyebrow":"Voci degli ospiti","rev.h2":"Cosa dicono \u003cem\u003ei nostri ospiti\u003c/em\u003e","rev.sub":"da 40 recensioni su Tripadvisor \u0026amp; Google","rev.1":"«Inserire qui una vera recensione da Tripadvisor o Google — ad es. sulla colazione, sulla vista o sul team.»","rev.1f":"Ospite dalla Svizzera · Inverno","rev.2":"«Inserire qui una vera citazione di un ospite — gli ospiti vendono l\u0027hotel meglio di qualsiasi testo pubblicitario.»","rev.2f":"Ospite dalla Germania · Estate","rev.3":"«Inserire qui una vera citazione di un ospite — idealmente una che citi la posizione e il panorama.»","rev.3f":"Ospite dal Belgio · Autunno","ct.eyebrow":"Contatti \u0026amp; arrivo","ct.h2":"Vi aspettiamo \u003cem\u003econ piacere.\u003c/em\u003e","ct.addr":"\u003cstrong\u003eHotel Alpina***\u003c/strong\u003e\u003cbr\u003eHofe 454 · 3925 Grächen\u003cbr\u003eVallese, Svizzera","ct.car":"In auto","ct.carP":"Accesso fino al centro del villaggio (in parte senza auto). Parcheggi \u0026amp; autosilo in centro — vi veniamo volentieri a prendere con la nostra auto elettrica.","ct.train":"In treno","ct.trainP":"SBB fino a Visp, Matterhorn Gotthard Bahn fino a St.\u0026nbsp;Niklaus, poi bus 551 fino a Grächen Dorf — attraverso la valle più incassata della Svizzera.","ct.checkin":"Check-in","ct.checkout":"Check-out","ct.maps":"Percorso su Google Maps","ct.formT":"Scriveteci","ct.fName":"Nome","ct.fMail":"E-mail","ct.fMsg":"Messaggio","ct.fPh":"Quando desiderate venire? Avete desideri particolari?","ct.fBtn":"Invia messaggio","ft.tag":"Boutique hotel di montagna nel soleggiato villaggio di Grächen.\u003cbr\u003e300 giorni di sole. Una casa.","ft.h1":"Scoprire","ft.l1":"Camere \u0026amp; suite","ft.l2":"Gastronomia","ft.l3":"Wellness \u0026amp; Spa","ft.l4":"Vivere Grächen","ft.h2":"Contatti","ft.h3":"Prenota diretto","ft.direct":"Miglior prezzo garantito, nessun acconto, nessuna commissione — solo sul sito ufficiale.","ft.btn":"Verifica disponibilità","ft.credit":"Concept \u0026amp; design: Pedro Ribeiro Digital","bm.s1":"Camera","bm.s2":"Ospiti","bm.s3":"Pagamento","bm.h1":"Scegliete la vostra camera","bm.sumPerk":"Miglior prezzo garantito · nessuna commissione","bm.total":"Totale da","bm.sumNote":"colazione incl. · tariffa più bassa (stagionale) · escl. tassa di soggiorno","bm.next":"Avanti\u0026nbsp;→","bm.h2":"I vostri dati","bm.name":"Nome *","bm.mail":"E-mail *","bm.phone":"Telefono","bm.wishes":"Desideri (facoltativo)","bm.wishesPh":"ad es. animale domestico, orario d\u0027arrivo, posizione della camera…","bm.back":"←\u0026nbsp;Indietro","bm.toPay":"Procedi al pagamento\u0026nbsp;→","bm.h3":"Pagamento","bm.pay1":"Prenota \u0026amp; paga subito online","bm.pay1b":"Conferma immediata","bm.pay1s":"Pagamento sicuro tramite il sistema di prenotazione ufficiale — i vostri dati vengono ripresi · selezionabile anche «Book now, pay later»","bm.pay2":"Richiesta via e-mail — pagamento in hotel","bm.pay2s":"Confermiamo personalmente entro 24 h · nessun acconto","bm.ssl":"🔒 Crittografia SSL","cal.months":"Gennaio|Febbraio|Marzo|Aprile|Maggio|Giugno|Luglio|Agosto|Settembre|Ottobre|Novembre|Dicembre","cal.monthsShort":"Gen.|Feb.|Mar.|Apr.|Mag.|Giu.|Lug.|Ago.|Set.|Ott.|Nov.|Dic.","cal.wdShort":"Do.|Lu.|Ma.|Me.|Gi.|Ve.|Sa.","cal.dows":"Lu|Ma|Me|Gi|Ve|Sa|Do","cal.pickIn":"Scegli l\u0027arrivo","cal.pickOut":"Scegli la partenza","cal.nightSel":"1 notte selezionata","cal.nightsSel":"{n} notti selezionate","cal.clear":"Cancella","cal.pickDate":"Scegli la data","u.night":"notte","u.nights":"notti","u.guest":"ospite","u.guests":"ospiti","u.from":"da","meta.ez":"15 m² · 1 persona · balcone \u0026 vista monti","meta.dz":"20 m² · 2 persone · balcone \u0026 vista monti","meta.drz":"22 m² · 2 ad. + 1 bambino · 2 bagni","meta.fz":"45 m² · famiglia · letti a castello","meta.fewo":"120 m² · 2 ad. + 3 bambini · cucina","recap.incl":"colazione incl. · tariffa più bassa","pay.noteOnline":"Il sistema di prenotazione ufficiale si è aperto con i vostri dati — pagate lì in tutta sicurezza o scegliete «Book now, pay later».","pay.noteLater":"Il vostro programma di posta si apre con la richiesta già pronta. Confermiamo entro 24 h.","mail.bookSubject":"Richiesta di prenotazione {room} — pagamento in hotel","mail.bookBody":"Buongiorno\n\nVorrei fare una richiesta vincolante:\n\nCamera:   {room}\nArrivo:   {in}\nPartenza: {out}\nOspiti:   {guests}\nTotale:   da {total} ({n} notti, colazione inclusa)\n\nNome:    {name}\nE-mail:  {mail}\n{phone}{note}\nCordiali saluti\n{name}","mail.phoneLine":"Telefono: {phone}\n","mail.noteLine":"\nDesideri: {note}\n","mail.contactSubject":"Richiesta dal sito web — {name}","mail.offerSubject":"Richiesta: {offer}","mail.offerBody":"Buongiorno\n\nSono interessato/a all\u0027offerta «{offer}». Vi prego di inviarmi maggiori informazioni.\n\nCordiali saluti","form.err":"Vi preghiamo di compilare tutti i campi.","form.ok":"Grazie mille, {name}! Il vostro programma di posta si sta aprendo.","sb.lang":"IT","pay.frameTitle":"Sistema di prenotazione sicuro — Hotel Alpina","pay.frameExt":"Apri in una nuova scheda","ms.open":"Apri l'app e-mail","ms.copy":"Copia il messaggio","ms.copied":"Copiato!","ms.to":"A","ms.or":"Oppure direttamente:"},
en: {"nav.zimmer":"Rooms","nav.angebote":"Offers","nav.gastronomie":"Dining","nav.wellness":"Wellness","nav.graechen":"Grächen","nav.kontakt":"Contact","nav.cta":"Book direct","menu.zimmer":"Rooms \u0026amp; Apartment","menu.angebote":"Offers","menu.gastronomie":"Dining","menu.wellness":"Hannigspa","menu.erleben":"Experience Grächen","menu.kontakt":"Contact \u0026amp; Directions","cursor.view":"Discover","dock.line":"Rooms from \u003cb\u003eCHF 97\u003c/b\u003e / night","dock.sub":"Best price guarantee · No deposit","dock.btn":"Book now","hero.pill1":"\u003cspan class=\"star\"\u003e★\u003c/span\u003e 4.6 / 5 · Guest reviews","hero.pill2":"Matterhorn Valley · Valais","hero.h1":"High above\u003cbr\u003ethe \u003cem\u003eeveryday.\u003c/em\u003e","hero.sub":"Your boutique mountain hotel in the sunny village of Grächen — 300 days of sunshine, a 270° mountain panorama and a balcony facing the 4,000-metre peaks of the Valais. With every room.","hero.cta1":"Check availability","hero.cta2":"Discover the rooms","bb.title":"Book direct — \u003cem\u003ewith best price guarantee\u003c/em\u003e","bb.note":"No deposit · No booking fees · Official website","bb.in":"Arrival","bb.out":"Departure","bb.guests":"Guests","bb.g1":"1 guest","bb.g2":"2 guests","bb.g3":"3 guests","bb.g4":"4 guests","bb.g5":"5+ / family","bb.btn":"Book now\u0026nbsp;→","bb.sub":"Book \u0026amp; pay securely online or at the hotel — the choice is yours. Questions? \u003ca href=\"tel:+41279552600\"\u003e027 955 26 00\u003c/a\u003e","kin.1":"Panorama rooms. \u003cem\u003eValais flavours.\u003c/em\u003e Panorama rooms.","kin.2":"\u003cem\u003eHannigspa.\u003c/em\u003e 300 days of sunshine. \u003cem\u003eHannigspa.\u003c/em\u003e","kin.3":"Pure relaxation. \u003cem\u003eSimply Alpina.\u003c/em\u003e Pure relaxation.","intro.eyebrow":"Welcome to the Alpina","intro.h2":"Arrive. Breathe deeply.\u003cbr\u003e\u003cem\u003eNever want to leave.\u003c/em\u003e","intro.lead":"Simply holidays. Simply good. Simply Alpina. Set in the car-free part of the village, close to the lifts and a short stroll from the village centre, Hotel Alpina stands out for its wonderful service — delivered by an attentive, friendly team.","intro.p2":"In the morning the Alpine world greets you on your own balcony; by day, the pistes, high trails and forests of Grächen lie at your feet. In the evening, the award-winning chefs at our sister hotel Désirée spoil you — and at our partner hotel Hannigalp you enjoy Grächen\u0027s only indoor pool free of charge.","intro.stat1":"Rooms \u0026amp; apartment","intro.stat2":"Days of sunshine","intro.stat3":"° panorama","intro.stat4":"Guest rating","intro.badge1":"Simply holidays. Simply good.","intro.badge2":"Simply Alpina.","rooms.eyebrow":"Rooms \u0026amp; Suites","rooms.h2":"Every room with a balcony.\u003cbr\u003e\u003cem\u003eEvery balcony with a panorama.\u003c/em\u003e","rooms.note":"19 charmingly furnished single, double \u0026amp; family rooms plus a holiday apartment — all with balcony and panoramic views of the Valais Alps, Wi-Fi, satellite TV, safe and coffee \u0026amp; tea station.","rooms.tag":"Most popular","rooms.from":"from","rooms.perNight":"/ night","rooms.book":"Book now \u003cspan\u003e→\u003c/span\u003e","rooms.foot":"“From” prices per room/night incl. breakfast, as per the official booking system (lowest rate, seasonal) · excl. visitor\u0027s tax.","room.dz.name":"Double Room","room.dz.desc":"Pure holiday bliss for two: a cosy 20 m² with panorama balcony and breakfast included — with a 200×180 cm bed.","room.dz.f1":"20 m²","room.dz.f2":"2 persons","room.dz.f3":"Balcony \u0026amp; mountain view","room.dz.f4":"Breakfast incl.","room.ez.name":"Single Room","room.ez.desc":"The perfect holiday retreat for solo travellers: 15 m² with balcony, panoramic views and breakfast included.","room.ez.f1":"15 m²","room.ez.f2":"1 person","room.ez.f3":"Balcony \u0026amp; mountain view","room.drz.name":"Triple Room","room.drz.desc":"A holiday realm for big and small: 22 m² with two bathrooms — ideal for parents with one child.","room.drz.f1":"22 m²","room.drz.f2":"3 persons","room.drz.f3":"2 bathrooms","room.fz.name":"Family Room","room.fz.desc":"A generous holiday paradise: 45 m² with bunk beds for the children — everything a holidaymaker\u0027s heart desires.","room.fz.f1":"45 m²","room.fz.f2":"2 adults + children","room.fz.f3":"Bunk beds","room.fewo.name":"Holiday Apartment","room.fewo.desc":"120 m² of pure holiday bliss for up to 5 people: two bedrooms, two bathrooms, a kitchen with fondue rechaud and two balconies.","room.fewo.f1":"120 m²","room.fewo.f2":"2 adults + 3 children","room.fewo.f3":"2 balconies","direct.eyebrow":"Why book direct?","direct.h2":"Book direct.\u003cbr\u003e\u003cem\u003eSleep better.\u003c/em\u003e","direct.p1t":"Best price guarantee","direct.p1":"The best rate — guaranteed. Only on the official website, with no booking fees.","direct.p2t":"No deposit","direct.p2":"Book now, pay later: simply pay at the hotel — with free cancellation on the flexible rate.","direct.p3t":"Generations discount","direct.p3":"Travel with 3 generations of your family and save 10% — exclusively when you book direct.","direct.cta":"Check availability now","offers.eyebrow":"Special offers","offers.h2":"More holiday \u003cem\u003efor your money.\u003c/em\u003e","offer.1t":"Retreat Week — Slowing Down \u0026amp; Self-Care","offer.1":"A week away from it all: daily morning yoga, meditation \u0026amp; breathwork, guided retreat sessions on self-care and resilience — with half board (dinner at Hotel Désirée) and a professional kids\u0027 programme.","offer.1p":"From \u003cstrong\u003eCHF 145.–\u003c/strong\u003e per person/day","offer.2t":"Mountain Bike Family Holidays","offer.2":"Action-packed bike holidays in the Mattertal: 4 nights incl. breakfast, use of the mountain bike room and free access to the wellness facilities.","offer.2p":"From \u003cstrong\u003eCHF 799.–\u003c/strong\u003e for 2 persons","offer.3t":"Generations Discount","offer.3":"Come on holiday with 3 generations of your family and book your rooms including breakfast at 10% off — available only when booking direct.","offer.3p":"\u003cstrong\u003e−10%\u003c/strong\u003e on rooms incl. breakfast","offers.ask":"Enquire now \u003cspan\u003e→\u003c/span\u003e","gastro.eyebrow":"Dining","gastro.h2":"Culinary \u003cem\u003eheights.\u003c/em\u003e","gastro.lead":"Start the day with our varied breakfast — served daily until 10:30, with fresh eggs, delicious cheese and first-class charcuterie from the local butcher. In the evening, the award-winning chefs at our sister hotel Désirée spoil you with fresh, regional menus.","gastro.c1":"Breakfast at the hotel — daily until 10:30","gastro.c2":"Dinner at the Family Hotel \u0026amp; Spa Désirée (by advance reservation)","gastro.c3":"Les Trois Fondues — three cheese fondues in a handcrafted caquelon","gastro.c4":"Lounge with games \u0026amp; complimentary fridge","gastro.btn":"Reserve a table","gastro.cap":"Les Trois Fondues — Valais classics, reimagined","well.eyebrow":"Hannigspa","well.h2":"First the mountain,\u003cbr\u003e\u003cem\u003ethen the calm.\u003c/em\u003e","well.lead":"Less than a ten-minute walk away, at our partner hotel Aktiv Hotel \u0026amp; Spa Hannigalp, body, mind and soul recharge: Grächen\u0027s only indoor pool and a generous spa area set in the colourful worlds of feng shui.","well.c1":"Indoor pool (6×12 m) with whirlpool — free for Alpina guests","well.c2":"Finnish sauna, bio sauna \u0026amp; steam bath with panoramic window","well.c3":"Wellness \u0026amp; beauty treatments (small surcharge for the spa area)","well.c4":"Brigerbad thermal baths just 30 min. away","well.btn":"Find out more","well.cap":"Hannigspa — your Alpine time-out, a 10-minute walk from the Alpina","erleben.eyebrow":"Experience Grächen","erleben.h2":"365 days of \u003cem\u003emountains on your doorstep.\u003c/em\u003e","erleben.note":"Insider tips from your hosts — experience Grächen and the Mattertal like a local.","tip.1t":"Winter on the Hannigalp","tip.1":"Sunny, family-friendly pistes — the mountain lift is a five-minute walk from the hotel.","tip.2t":"Brigerbad Thermal Baths","tip.2":"A 2\u0027600 m² thermal and wellness oasis with views of the Valais Alps — all year round.","tip.3t":"Jungen \u0026amp; Moosalp","tip.3":"A cable-car ride to idyllic Lake Jungen, then a high trail with breathtaking panoramas.","tip.4t":"Day trip to Zermatt","tip.4":"The Matterhorn in front of your lens and Switzerland\u0027s largest kids\u0027 rope park right next door.","tip.5t":"Feeblitz Saas-Fee","tip.5":"Speed down the highest Alpine coaster at up to 40 km/h — adrenaline included.","tip.6t":"Kneipp-Garten Taa","tip.6":"Between the forest\u0027s edge and the Grächersee: water treading and refreshment after your hike.","erleben.hint":"← Drag to explore →","rev.eyebrow":"Guest reviews","rev.h2":"What \u003cem\u003eour guests\u003c/em\u003e say","rev.sub":"from 40 reviews on Tripadvisor \u0026amp; Google","rev.1":"«Insert a genuine guest quote from Tripadvisor or Google here — e.g. about the breakfast, the view or the team.»","rev.1f":"Guest from Switzerland · Winter","rev.2":"«Insert a genuine guest quote here — your own guests sell the hotel better than any advertising copy.»","rev.2f":"Guest from Germany · Summer","rev.3":"«Insert a genuine guest quote here — ideally one that mentions the location and the panorama.»","rev.3f":"Guest from Belgium · Autumn","ct.eyebrow":"Contact \u0026amp; Directions","ct.h2":"We look forward \u003cem\u003eto welcoming you.\u003c/em\u003e","ct.addr":"\u003cstrong\u003eHotel Alpina***\u003c/strong\u003e\u003cbr\u003eHofe 454 · 3925 Grächen\u003cbr\u003eValais, Switzerland","ct.car":"By car","ct.carP":"Drive as far as the village centre (partly car-free). Parking spaces \u0026amp; car park in the centre — we are happy to collect you there in our electric car.","ct.train":"By train","ct.trainP":"SBB to Visp, Matterhorn Gotthard Bahn to St.\u0026nbsp;Niklaus, then bus 551 to Grächen Dorf — through Switzerland\u0027s most deeply carved valley.","ct.checkin":"Check-in","ct.checkout":"Check-out","ct.maps":"Directions in Google Maps","ct.formT":"Write to us","ct.fName":"Name","ct.fMail":"E-mail","ct.fMsg":"Message","ct.fPh":"When would you like to come? Any special requests?","ct.fBtn":"Send message","ft.tag":"Boutique mountain hotel in the sunny village of Grächen.\u003cbr\u003e300 days of sunshine. A home from home.","ft.h1":"Discover","ft.l1":"Rooms \u0026amp; Suites","ft.l2":"Dining","ft.l3":"Wellness \u0026amp; Spa","ft.l4":"Experience Grächen","ft.h2":"Contact","ft.h3":"Book direct","ft.direct":"Best price guarantee, no deposit, no booking fees — only on the official website.","ft.btn":"Check availability","ft.credit":"Concept \u0026amp; design: Pedro Ribeiro Digital","bm.s1":"Room","bm.s2":"Guests","bm.s3":"Payment","bm.h1":"Choose your room","bm.sumPerk":"Best price guarantee · no booking fees","bm.total":"Total from","bm.sumNote":"incl. breakfast · lowest rate (seasonal) · excl. visitor\u0027s tax","bm.next":"Continue\u0026nbsp;→","bm.h2":"Your details","bm.name":"Name *","bm.mail":"E-mail *","bm.phone":"Phone","bm.wishes":"Requests (optional)","bm.wishesPh":"e.g. pet, arrival time, room location…","bm.back":"←\u0026nbsp;Back","bm.toPay":"Continue to payment\u0026nbsp;→","bm.h3":"Payment","bm.pay1":"Book \u0026amp; pay online now","bm.pay1b":"Instantly confirmed","bm.pay1s":"Secure payment via the official booking system — your details are carried over · «Book now, pay later» also available","bm.pay2":"Enquire by e-mail — pay at the hotel","bm.pay2s":"We confirm personally within 24 h · no deposit","bm.ssl":"🔒 SSL encrypted","cal.months":"January|February|March|April|May|June|July|August|September|October|November|December","cal.monthsShort":"Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec","cal.wdShort":"Sun|Mon|Tue|Wed|Thu|Fri|Sat","cal.dows":"Mo|Tu|We|Th|Fr|Sa|Su","cal.pickIn":"Select arrival","cal.pickOut":"Select departure","cal.nightSel":"1 night selected","cal.nightsSel":"{n} nights selected","cal.clear":"Clear","cal.pickDate":"Select date","u.night":"night","u.nights":"nights","u.guest":"guest","u.guests":"guests","u.from":"from","meta.ez":"15 m² · 1 person · Balcony \u0026 mountain view","meta.dz":"20 m² · 2 persons · Balcony \u0026 mountain view","meta.drz":"22 m² · 2 adults + 1 child · 2 bathrooms","meta.fz":"45 m² · Family · Bunk beds","meta.fewo":"120 m² · 2 adults + 3 children · Kitchen","recap.incl":"incl. breakfast · lowest rate","pay.noteOnline":"The official booking system has opened with your details — pay securely there or choose «Book now, pay later».","pay.noteLater":"Your e-mail client opens with the request ready to send. We confirm within 24 h.","mail.bookSubject":"Booking request {room} — payment at the hotel","mail.bookBody":"Hello\n\nI would like to make a binding booking enquiry:\n\nRoom:      {room}\nArrival:   {in}\nDeparture: {out}\nGuests:    {guests}\nTotal:     from {total} ({n} nights, incl. breakfast)\n\nName:   {name}\nE-mail: {mail}\n{phone}{note}\nKind regards\n{name}","mail.phoneLine":"Phone: {phone}\n","mail.noteLine":"\nRequests: {note}\n","mail.contactSubject":"Enquiry via the website — {name}","mail.offerSubject":"Enquiry: {offer}","mail.offerBody":"Hello\n\nI am interested in the «{offer}» offer. Please send me further information.\n\nKind regards","form.err":"Please fill in all fields.","form.ok":"Thank you, {name}! Your e-mail client will now open.","sb.lang":"EN","pay.frameTitle":"Secure booking system — Hotel Alpina","pay.frameExt":"Open in a new tab","ms.open":"Open email app","ms.copy":"Copy message","ms.copied":"Copied!","ms.to":"To","ms.or":"Or directly:"}
};

/* ---------- runtime ---------- */
(function () {
  "use strict";
  var saved = "de";
  try { saved = localStorage.getItem("alpina-lang") || "de"; } catch (e) {}
  if (!window.I18N[saved] || !Object.keys(window.I18N[saved]).length) saved = "de";
  window.LANG = saved;

  window.T = function (key) {
    var d = window.I18N[window.LANG] || {};
    return (d[key] !== undefined ? d[key] : window.I18N.de[key]) || "";
  };

  window.applyLang = function (lang) {
    if (!window.I18N[lang] || (lang !== "de" && !Object.keys(window.I18N[lang]).length)) lang = "de";
    window.LANG = lang;
    try { localStorage.setItem("alpina-lang", lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.innerHTML = window.T(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", window.T(el.getAttribute("data-i18n-ph")));
    });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    document.dispatchEvent(new CustomEvent("alpina:lang"));
  };

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { window.applyLang(b.getAttribute("data-lang")); });
  });

  if (window.LANG !== "de") window.applyLang(window.LANG);
  else {
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === "de");
    });
  }
})();
