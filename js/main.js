/* ====================================================================
   Hotel Alpina Grächen — Alpine Quiet Luxury engine
   Preloader · Snow · Custom cursor · Magnetic CTAs · Kinetic scroll
   Split-line reveals · Booking checkout (SimpleBooking hid=9145)
   ==================================================================== */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ================================================================
     BUCHUNGS-KONFIGURATION
     "Online buchen & bezahlen" führt zum offiziellen Buchungssystem
     (SimpleBooking, hid=9145) mit übernommenen Daten. Optional können
     pro Zimmer Payment-Links (Stripe/Payrexx) eingetragen werden,
     die dann Vorrang haben.
     ================================================================ */
  var SB_HOTEL_ID = "9145";
  var PAYMENT_LINKS = {
    einzelzimmer: "",
    doppelzimmer: "",
    dreibettzimmer: "",
    familienzimmer: "",
    ferienwohnung: ""
  };

  /* "Ab"-Preise pro Nacht inkl. Frühstück — günstigste Rate gemäss
     offiziellem Buchungssystem (Stand Sept. 2026, saisonabhängig). */
  var IMG_BASE = "https://hotelalpinagraechen.ch/wp-content/uploads/";
  var ROOMS = {
    einzelzimmer:  { name: "Einzelzimmer",   price: 97,  max: 1, meta: "15 m² · 1 Person · Balkon & Bergblick",  img: IMG_BASE + "2020/01/Zimmer-EZ-Preview-Hotel-Alpina.jpg" },
    doppelzimmer:  { name: "Doppelzimmer",   price: 163, max: 2, meta: "20 m² · 2 Personen · Balkon & Bergblick", img: IMG_BASE + "2020/01/Zimmer-DZ-Preview-Hotel-Alpina.jpg" },
    dreibettzimmer:{ name: "Dreibettzimmer", price: 163, max: 3, meta: "22 m² · 2 Erw. + 1 Kind · 2 Badezimmer",  img: IMG_BASE + "2020/01/Zimmer-DRZ-Preview-Hotel-Alpina.jpg" },
    familienzimmer:{ name: "Familienzimmer", price: 177, max: 4, meta: "45 m² · Familie · Etagenbetten",          img: IMG_BASE + "2020/01/Zimmer-FZ-Preview-Hotel-Alpina.jpg" },
    ferienwohnung: { name: "Ferienwohnung",  price: 262, max: 5, meta: "120 m² · 2 Erw. + 3 Kinder · Küche",      img: IMG_BASE + "2020/01/Zimmer-FeWo-Preview-Hotel-Alpina.jpg" }
  };
  /* Real per-room photo galleries (scraped from the hotel site) */
  var GALLERIES = {
    ez: ["2020/01/Zimmer-EZ-Home-Hotel-Alpina.jpg", "2020/01/Zimmer-EZ-Bad-Alpina.jpg", "2020/01/Zimmer-EZ-Ausblick-Alpina.jpg"],
    dz: ["2020/01/Zimmer-DZ-Home-Hotel-Alpina.jpg", "2020/01/Zimmer-DZ1-Home-Hotel-Alpina.jpg", "2020/01/Zimmer-DZ-Bad-Alpina.jpg", "2020/01/Zimmer-DZ-Ausblick-Alpina.jpg"],
    drz: ["2023/05/Zimmer-DRZ-Home-Hotel-Alpina.jpg", "2023/05/Zimmer-DRZ1-Home-Hotel-Alpina.jpg", "2023/05/Zimmer-DRZ-Bad-Home-Hotel-Alpina.jpg", "2023/05/Zimmer-DRZ-Bad1-Home-Hotel-Alpina.jpg", "2020/01/Zimmer-DZ-Ausblick-Alpina.jpg"],
    fz: ["2020/01/Zimmer-FZ-Preview-Hotel-Alpina.jpg", "2020/01/Zimmer-FZ6-Hotel-Alpina.jpg", "2020/01/Zimmer-FZ11-Hotel-Alpina.jpg", "2020/01/Zimmer-FZ1-Hotel-Alpina.jpg", "2020/01/Zimmer-FZ4-Hotel-Alpina.jpg", "2020/01/Zimmer-DZ-Ausblick-Alpina.jpg"],
    fewo: ["2020/01/Zimmer-FeWo1-Hotel-Alpina.jpg", "2020/01/Zimmer-FeWo2-Hotel-Alpina.jpg", "2020/01/Zimmer-FeWo3-Hotel-Alpina.jpg", "2020/01/Zimmer-FeWo4-Hotel-Alpina.jpg", "2020/01/Zimmer-FeWo5-Hotel-Alpina.jpg", "2020/01/Zimmer-FeWo6-Hotel-Alpina.jpg"]
  };
  var HOTEL_MAIL = "info@hotelalpinagraechen.ch";

  var chf = function (n) {
    var s = n.toFixed(2);
    var parts = s.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return "CHF " + parts[0] + "." + parts[1];
  };
  var iso = function (d) { return d.toISOString().slice(0, 10); };
  var fmtDate = function (s) {
    if (!s) return "—";
    var p = s.split("-");
    return p[2] + "." + p[1] + "." + p[0];
  };
  var KEY2 = { einzelzimmer: "ez", doppelzimmer: "dz", dreibettzimmer: "drz", familienzimmer: "fz", ferienwohnung: "fewo" };
  var TT = function (k) { return (window.T ? window.T(k) : "") || ""; };
  var roomName = function (key) { return TT("room." + KEY2[key] + ".name") || ROOMS[key].name; };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^[+0-9][0-9 ()\/.\-]{5,}$/;
  var escapeHtml = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  /* per-field validation UI: expects <small class="field-err" id="<inputId>Err"> after the input */
  var setFieldError = function (input, message) {
    var err = $(input.id + "Err");
    var wrap = input.closest(".bm-field, .cf-field");
    if (message) {
      input.setAttribute("aria-invalid", "true");
      if (wrap) wrap.classList.add("invalid");
      if (err) { err.textContent = message; err.hidden = false; }
    } else {
      input.removeAttribute("aria-invalid");
      if (wrap) wrap.classList.remove("invalid");
      if (err) { err.textContent = ""; err.hidden = true; }
    }
    return !message;
  };

  /* ================================================================
     CINEMATIC PRELOADER
     ================================================================ */
  var preloader = $("preloader");
  var finishPreloader = function () {
    if (!preloader) { document.body.classList.add("loaded"); return; }
    preloader.classList.add("beam");
    setTimeout(function () {
      preloader.classList.add("open");
      document.body.classList.add("loaded");
    }, 800);
    setTimeout(function () { preloader.classList.add("gone", "done"); }, 1850);
  };
  if (preloader && !reduced) {
    var count = 0;
    var countEl = $("preCount"), barEl = $("preBar");
    var preDone = false;
    var tick = function () {
      if (preDone) return;
      count = Math.min(100, count + 2 + Math.random() * 7);
      var v = Math.floor(count);
      countEl.textContent = (v < 10 ? "0" : "") + v + "%";
      barEl.style.width = v + "%";
      if (count < 100) {
        setTimeout(tick, 55 + Math.random() * 95);
      } else {
        preDone = true;
        setTimeout(finishPreloader, 250);
      }
    };
    setTimeout(tick, 500);
    /* safety net: never trap visitors behind the preloader */
    setTimeout(function () {
      if (!preDone) {
        preDone = true;
        countEl.textContent = "100%";
        barEl.style.width = "100%";
        finishPreloader();
      }
    }, 4500);
  } else {
    if (preloader) preloader.classList.add("gone", "done");
    document.body.classList.add("loaded");
  }

  /* ================================================================
     ATMOSPHERIC SNOW (canvas, cursor- & scroll-reactive)
     ================================================================ */
  var snow = $("snowCanvas");
  if (snow && !reduced) {
    var ctx = snow.getContext("2d");
    var W, H, flakes = [];
    var mouseX = 0.5, scrollBoost = 0, lastY = window.scrollY;
    var resize = function () {
      W = snow.width = window.innerWidth;
      H = snow.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    var COUNT = W < 820 ? 42 : 90;
    for (var i = 0; i < COUNT; i++) {
      flakes.push({
        x: Math.random() * 1.2 - 0.1, y: Math.random(),
        r: 0.6 + Math.random() * 1.8,
        s: 0.00016 + Math.random() * 0.00042,
        drift: Math.random() * 0.0003 - 0.00015,
        o: 0.12 + Math.random() * 0.4,
        ph: Math.random() * Math.PI * 2
      });
    }
    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX / W;
    }, { passive: true });
    window.addEventListener("scroll", function () {
      scrollBoost = Math.min(3, Math.abs(window.scrollY - lastY) * 0.02);
      lastY = window.scrollY;
    }, { passive: true });
    var t = 0;
    var drawSnow = function () {
      t += 0.008;
      scrollBoost *= 0.94;
      ctx.clearRect(0, 0, W, H);
      var wind = (mouseX - 0.5) * 0.0006;
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.s * (1 + scrollBoost * 2);
        f.x += f.drift + wind + Math.sin(t + f.ph) * 0.00012;
        if (f.y > 1.02) { f.y = -0.02; f.x = Math.random() * 1.2 - 0.1; }
        if (f.x > 1.05) f.x = -0.05;
        if (f.x < -0.05) f.x = 1.05;
        ctx.beginPath();
        ctx.arc(f.x * W, f.y * H, f.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(244,245,247," + f.o + ")";
        ctx.fill();
      }
      requestAnimationFrame(drawSnow);
    };
    requestAnimationFrame(drawSnow);
  }

  /* ================================================================
     CUSTOM CURSOR + MAGNETIC BUTTONS
     ================================================================ */
  if (finePointer && !reduced) {
    document.body.classList.add("has-cursor");
    var dot = $("cursorDot"), ring = $("cursorRing");
    var cx = -100, cy = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) {
      cx = e.clientX; cy = e.clientY;
      document.body.classList.remove("cursor-hidden");
    });
    document.addEventListener("mouseleave", function () {
      document.body.classList.add("cursor-hidden");
    });
    var cursorLoop = function () {
      rx += (cx - rx) * 0.16;
      ry += (cy - ry) * 0.16;
      dot.style.transform = "translate(" + (cx - 3) + "px," + (cy - 3) + "px)";
      ring.style.transform = "translate(" + (rx - ring.offsetWidth / 2) + "px," + (ry - ring.offsetHeight / 2) + "px)";
      requestAnimationFrame(cursorLoop);
    };
    requestAnimationFrame(cursorLoop);

    /* hover states */
    var ctaSel = "a, button, select, input, textarea, label, .bm-room";
    var viewSel = ".room-media, .feature-media, .tip-card, .offer-card, .photo-main, .photo-float";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(".rm-track img, .bm-thumb, .rm-nav, .rm-dot, .bm-tnav, .lightbox")) {
        document.body.classList.add("cursor-photo");
        document.body.classList.remove("cursor-cta", "cursor-view");
      } else if (e.target.closest(ctaSel)) {
        document.body.classList.add("cursor-cta");
        document.body.classList.remove("cursor-view", "cursor-photo");
      } else if (e.target.closest(viewSel)) {
        document.body.classList.add("cursor-view");
        document.body.classList.remove("cursor-cta", "cursor-photo");
      } else {
        document.body.classList.remove("cursor-cta", "cursor-view", "cursor-photo");
      }
    });

    /* magnetic pull */
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var strength = 0.34;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + dx * strength + "px," + dy * strength + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
        el.style.transform = "";
        setTimeout(function () { el.style.transition = ""; }, 600);
      });
    });
  }

  /* ================================================================
     HEADER / MENU
     ================================================================ */
  var header = $("siteHeader");
  var onScroll = function () {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = $("navToggle");
  var overlay = $("menuOverlay");
  var setMenu = function (open) {
    toggle.classList.toggle("open", open);
    overlay.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    overlay.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", function () {
    setMenu(!overlay.classList.contains("open"));
  });
  overlay.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  /* ================================================================
     SPLIT-LINE TEXT REVEAL (headlines) + standard reveals
     ================================================================ */
  var splitLines = function (el) {
    /* wrap each visual line of the h2 into an overflow-hidden band */
    var html = el.innerHTML;
    var parts = html.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map(function (p) {
      return '<span class="split-line"><span>' + p + "</span></span>";
    }).join("");
    el.classList.add("split-ready");
  };
  if (!reduced) {
    document.querySelectorAll(".section h2.reveal").forEach(splitLines);
  }

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ================================================================
     KINETIC MANIFESTO (scroll-bound giant text)
     ================================================================ */
  var kinSection = document.querySelector(".kinetic");
  var kinLines = document.querySelectorAll(".kin-line");
  if (kinSection && kinLines.length && !reduced) {
    var kinTick = function () {
      var r = kinSection.getBoundingClientRect();
      var vh = window.innerHeight;
      if (r.bottom > 0 && r.top < vh) {
        var p = 1 - (r.top + r.height) / (vh + r.height); /* 0..1 through section */
        kinLines.forEach(function (line, i) {
          var dir = parseFloat(line.getAttribute("data-dir")) || 1;
          var span = Math.max(0, line.scrollWidth - window.innerWidth);
          var x = dir === 1 ? -p * span : -(1 - p) * span;
          line.style.transform = "translateX(" + x + "px)";
          var lr = line.getBoundingClientRect();
          var mid = lr.top + lr.height / 2;
          line.classList.toggle("lit", mid > vh * 0.18 && mid < vh * 0.82);
        });
      }
      requestAnimationFrame(kinTick);
    };
    requestAnimationFrame(kinTick);
  } else {
    kinLines.forEach(function (l) { l.classList.add("lit"); });
  }

  /* ================================================================
     STAT COUNTERS
     ================================================================ */
  var counters = document.querySelectorAll(".stat-num");
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
    var dur = 1500;
    var start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = decimals
        ? val.toFixed(decimals).replace(".", ",")
        : Math.round(val).toString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ================================================================
     ROOM PHOTO ALBUMS (per-card carousel, real hotel galleries)
     ================================================================ */
  document.querySelectorAll(".room-media[data-gallery]").forEach(function (media) {
    var key = media.getAttribute("data-gallery");
    var pics = GALLERIES[key];
    if (!pics || pics.length < 2) return;
    var tag = media.querySelector(".room-tag");
    var srcImg = media.querySelector("img");
    var alt = srcImg ? srcImg.alt : "";
    var altKey = srcImg ? srcImg.getAttribute("data-i18n-alt") : null;
    var altAttr = altKey ? ' data-i18n-alt="' + altKey + '"' : "";
    var track = document.createElement("div");
    track.className = "rm-track";
    track.innerHTML = pics.map(function (p, i) {
      return '<img src="' + IMG_BASE + p + '" alt="' + alt + '"' + altAttr + (i ? ' loading="lazy"' : "") + ">";
    }).join("");
    media.innerHTML = "";
    media.appendChild(track);
    var prev = document.createElement("button");
    prev.type = "button"; prev.className = "rm-nav rm-prev"; prev.innerHTML = "‹";
    prev.setAttribute("aria-label", "Vorheriges Foto");
    var next = document.createElement("button");
    next.type = "button"; next.className = "rm-nav rm-next"; next.innerHTML = "›";
    next.setAttribute("aria-label", "Nächstes Foto");
    var dots = document.createElement("div");
    dots.className = "rm-dots";
    pics.forEach(function (_, i) {
      var d = document.createElement("button");
      d.type = "button"; d.className = "rm-dot" + (i === 0 ? " on" : "");
      d.setAttribute("aria-label", "Foto " + (i + 1));
      d.addEventListener("click", function (e) { e.stopPropagation(); go(i); });
      dots.appendChild(d);
    });
    media.appendChild(prev);
    media.appendChild(next);
    media.appendChild(dots);
    if (tag) media.appendChild(tag);
    var idx = 0;
    var go = function (i) {
      idx = (i + pics.length) % pics.length;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      dots.querySelectorAll(".rm-dot").forEach(function (d, j) {
        d.classList.toggle("on", j === idx);
      });
    };
    prev.addEventListener("click", function (e) { e.stopPropagation(); go(idx - 1); });
    next.addEventListener("click", function (e) { e.stopPropagation(); go(idx + 1); });
    /* touch swipe */
    var sx = null;
    media.addEventListener("pointerdown", function (e) { sx = e.clientX; }, { passive: true });
    media.addEventListener("pointerup", function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 42) { go(idx + (dx < 0 ? 1 : -1)); window.__albumSwiped = Date.now(); }
      sx = null;
    }, { passive: true });
  });

  /* ================================================================
     LIGHTBOX — click any room photo to enlarge
     ================================================================ */
  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML =
    '<button type="button" class="lb-close" aria-label="Schliessen">✕</button>' +
    '<span class="lb-counter">1 / 1</span>' +
    '<button type="button" class="lb-nav lb-prev" aria-label="Vorheriges Foto">‹</button>' +
    '<img class="lb-img" alt="">' +
    '<button type="button" class="lb-nav lb-next" aria-label="Nächstes Foto">›</button>';
  document.body.appendChild(lightbox);
  var lbImg = lightbox.querySelector(".lb-img");
  var lbCounter = lightbox.querySelector(".lb-counter");
  var lbPics = [], lbIdx = 0;
  var lbShow = function (i) {
    lbIdx = (i + lbPics.length) % lbPics.length;
    lbImg.classList.remove("in");
    lbImg.src = IMG_BASE + lbPics[lbIdx];
    lbCounter.textContent = (lbIdx + 1) + " / " + lbPics.length;
    requestAnimationFrame(function () { requestAnimationFrame(function () { lbImg.classList.add("in"); }); });
    /* preload neighbours */
    [lbIdx + 1, lbIdx - 1].forEach(function (n) {
      var p = new Image();
      p.src = IMG_BASE + lbPics[(n + lbPics.length) % lbPics.length];
    });
  };
  var openLightbox = function (key, i) {
    lbPics = GALLERIES[key] || [];
    if (!lbPics.length) return;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lbShow(i || 0);
  };
  var closeLightbox = function () {
    lightbox.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = modal.classList.contains("open") ? "hidden" : "";
  };
  lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lb-prev").addEventListener("click", function () { lbShow(lbIdx - 1); });
  lightbox.querySelector(".lb-next").addEventListener("click", function () { lbShow(lbIdx + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") { e.stopImmediatePropagation(); closeLightbox(); }
    if (e.key === "ArrowLeft") lbShow(lbIdx - 1);
    if (e.key === "ArrowRight") lbShow(lbIdx + 1);
  });
  /* swipe inside lightbox */
  var lbSx = null;
  lightbox.addEventListener("pointerdown", function (e) { lbSx = e.clientX; }, { passive: true });
  lightbox.addEventListener("pointerup", function (e) {
    if (lbSx === null) return;
    var dx = e.clientX - lbSx;
    if (Math.abs(dx) > 42) lbShow(lbIdx + (dx < 0 ? 1 : -1));
    lbSx = null;
  }, { passive: true });
  /* capture-phase so a photo click never toggles room selection */
  document.addEventListener("click", function (e) {
    var img = e.target.closest(".rm-track img, .bm-thumb-track img");
    if (!img) return;
    if (window.__albumSwiped && Date.now() - window.__albumSwiped < 350) return;
    var cardMedia = img.closest(".room-media[data-gallery]");
    var bmRoom = img.closest(".bm-room");
    var key = cardMedia ? cardMedia.getAttribute("data-gallery")
      : bmRoom ? KEY2[bmRoom.getAttribute("data-key")] : null;
    if (!key || !GALLERIES[key]) return;
    e.stopPropagation();
    var idx = Array.prototype.indexOf.call(img.parentElement.children, img);
    openLightbox(key, idx);
  }, true);

  /* ================================================================
     HERO PARALLAX + IMAGE PAN
     ================================================================ */
  var heroImg = $("heroImg");
  if (heroImg && !reduced) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = "scale(1.02) translateY(" + y * 0.16 + "px)";
      }
    }, { passive: true });
  }
  if (finePointer && !reduced) {
    document.querySelectorAll(".room-media").forEach(function (m) {
      m.addEventListener("mousemove", function (e) {
        var r = m.getBoundingClientRect();
        m.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5) * -12 + "px");
        m.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5) * -12 + "px");
      });
    });
  }

  /* ================================================================
     BOOKING DOCK (fixed bottom)
     ================================================================ */
  var dock = $("bookDock");
  if (dock) {
    var dockTick = function () {
      var past = window.scrollY > window.innerHeight * 1.1;
      var modalOpen = modal && modal.classList.contains("open");
      var nearEnd = window.scrollY + window.innerHeight > document.body.scrollHeight - 300;
      dock.classList.toggle("show", past && !modalOpen && !nearEnd);
    };
    window.addEventListener("scroll", dockTick, { passive: true });
  }

  /* ================================================================
     BOOKING CHECKOUT
     ================================================================ */
  var state = { room: null };
  var modal = $("bookModal");
  var bmIn = $("bmIn"), bmOut = $("bmOut"), bmGuests = $("bmGuests");
  var bmRooms = $("bmRooms"), bmSummary = $("bmSummary");
  var bmNext1 = $("bmNext1"), bmNext2 = $("bmNext2");
  var bmName = $("bmName"), bmMail = $("bmMail"), bmPhone = $("bmPhone"), bmNote = $("bmNote");
  var payNote = $("payNote");

  var bbIn = $("bbIn"), bbOut = $("bbOut"), bbGuests = $("bbGuests");
  if (bmGuests) bmGuests.addEventListener("change", refresh);

  /* ================================================================
     CUSTOM RANGE CALENDAR (German, dark luxury)
     Hidden inputs (bbIn/bbOut/bmIn/bmOut) carry ISO dates — the rest
     of the checkout logic reads them unchanged.
     ================================================================ */
  var Tsplit = function (key, fallback) {
    var v = window.T ? window.T(key) : "";
    return (v || fallback).split("|");
  };
  var MONTHS = function () { return Tsplit("cal.months", "Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember"); };
  var MONTHS_S = function () { return Tsplit("cal.monthsShort", "Jan.|Feb.|März|Apr.|Mai|Juni|Juli|Aug.|Sept.|Okt.|Nov.|Dez."); };
  var WD_S = function () { return Tsplit("cal.wdShort", "So.|Mo.|Di.|Mi.|Do.|Fr.|Sa."); };
  var today0 = new Date(); today0.setHours(0, 0, 0, 0);

  var SCOPES = {
    bb: { inEl: bbIn, outEl: bbOut, inBtn: $("bbInBtn"), outBtn: $("bbOutBtn") },
    bm: { inEl: bmIn, outEl: bmOut, inBtn: $("bmInBtn"), outBtn: $("bmOutBtn") }
  };
  var parseISO = function (s) {
    if (!s) return null;
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  };
  var fmtTrig = function (d) {
    return WD_S()[d.getDay()] + " " + d.getDate() + ". " + MONTHS_S()[d.getMonth()] + " " + d.getFullYear();
  };
  var syncLabels = function (scope) {
    var s = SCOPES[scope];
    if (!s || !s.inBtn) return;
    var di = parseISO(s.inEl.value), doo = parseISO(s.outEl.value);
    var ph = TT("cal.pickDate") || "Datum wählen";
    s.inBtn.querySelector(".dt-text").textContent = di ? fmtTrig(di) : ph;
    s.inBtn.classList.toggle("empty", !di);
    s.outBtn.querySelector(".dt-text").textContent = doo ? fmtTrig(doo) : ph;
    s.outBtn.classList.toggle("empty", !doo);
  };
  syncLabels("bb"); syncLabels("bm");

  /* popover */
  var pop = document.createElement("div");
  pop.className = "calpop";
  pop.innerHTML =
    '<div class="cal-head">' +
      '<button type="button" class="cal-nav" data-nav="-1" aria-label="Vorheriger Monat">←</button>' +
      '<span class="cal-title" id="calTitle"></span>' +
      '<button type="button" class="cal-nav" data-nav="1" aria-label="Nächster Monat">→</button>' +
    "</div>" +
    '<div class="cal-grid" id="calDows"></div>' +
    '<div class="cal-grid" id="calDays"></div>' +
    '<div class="cal-foot"><span class="cal-hint" id="calHint"></span>' +
    '<button type="button" class="cal-clear" id="calClear" data-i18n="cal.clear">Löschen</button></div>';
  document.body.appendChild(pop);
  var calDows = pop.querySelector("#calDows");
  var rebuildDows = function () {
    calDows.innerHTML = "";
    Tsplit("cal.dows", "Mo|Di|Mi|Do|Fr|Sa|So").forEach(function (d) {
      var s = document.createElement("span");
      s.className = "cal-dow"; s.textContent = d;
      calDows.appendChild(s);
    });
  };
  rebuildDows();
  pop.querySelector("#calClear").textContent = TT("cal.clear") || "Löschen";
  var calDays = pop.querySelector("#calDays");
  var calTitle = pop.querySelector("#calTitle");
  var calHint = pop.querySelector("#calHint");

  var calScope = null, calAnchor = null;
  var viewY = today0.getFullYear(), viewM = today0.getMonth();

  var renderCal = function () {
    var s = SCOPES[calScope];
    var selIn = parseISO(s.inEl.value), selOut = parseISO(s.outEl.value);
    calTitle.textContent = MONTHS()[viewM] + " " + viewY;
    pop.querySelector('[data-nav="-1"]').disabled =
      viewY === today0.getFullYear() && viewM === today0.getMonth();
    calDays.innerHTML = "";
    var first = new Date(viewY, viewM, 1);
    var lead = (first.getDay() + 6) % 7; /* Monday first */
    var count = new Date(viewY, viewM + 1, 0).getDate();
    for (var b = 0; b < lead; b++) {
      var blank = document.createElement("span");
      blank.className = "cal-day blank";
      calDays.appendChild(blank);
    }
    for (var d = 1; d <= count; d++) {
      (function (d) {
        var date = new Date(viewY, viewM, d);
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cal-day";
        btn.textContent = d;
        btn.setAttribute("aria-label", d + ". " + MONTHS()[viewM] + " " + viewY);
        if (date < today0) { btn.classList.add("disabled"); btn.disabled = true; }
        if (date.getTime() === today0.getTime()) btn.classList.add("today");
        if (selIn && date.getTime() === selIn.getTime()) {
          btn.classList.add("sel", "sel-in");
          if (selOut) btn.classList.add("has-range");
        }
        if (selOut && date.getTime() === selOut.getTime()) btn.classList.add("sel", "sel-out");
        if (selIn && selOut && date > selIn && date < selOut) btn.classList.add("in-range");
        btn.addEventListener("click", function () { pickDay(date); });
        calDays.appendChild(btn);
      })(d);
    }
    var n = selIn && selOut ? Math.round((selOut - selIn) / 86400000) : 0;
    calHint.textContent = !selIn ? (TT("cal.pickIn") || "Anreise wählen")
      : !selOut ? (TT("cal.pickOut") || "Abreise wählen")
      : n === 1 ? (TT("cal.nightSel") || "1 Nacht ausgewählt")
      : (TT("cal.nightsSel") || "{n} Nächte ausgewählt").replace("{n}", n);
  };

  var pickDay = function (date) {
    if (date < today0) return; /* never allow past dates */
    var s = SCOPES[calScope];
    var selIn = parseISO(s.inEl.value), selOut = parseISO(s.outEl.value);
    if (!selIn || selOut || date <= selIn) {
      s.inEl.value = iso(new Date(date.getTime() - date.getTimezoneOffset() * 60000));
      s.outEl.value = "";
    } else {
      s.outEl.value = iso(new Date(date.getTime() - date.getTimezoneOffset() * 60000));
    }
    syncLabels(calScope);
    refresh();
    renderCal();
    if (s.inEl.value && s.outEl.value) setTimeout(closeCal, 350);
  };

  var placeCal = function () {
    if (!calAnchor) return;
    var r = calAnchor.getBoundingClientRect();
    var pw = 316, ph = pop.offsetHeight || 380;
    var left = Math.min(Math.max(r.left, 10), window.innerWidth - pw - 10);
    var top = r.bottom + 12;
    if (top + ph > window.innerHeight - 10) top = Math.max(10, r.top - ph - 12);
    pop.style.left = left + "px";
    pop.style.top = top + "px";
  };
  var openCal = function (scope, anchor) {
    calScope = scope; calAnchor = anchor;
    var s = SCOPES[scope];
    var base = parseISO(s.inEl.value) || today0;
    viewY = base.getFullYear(); viewM = base.getMonth();
    renderCal();
    pop.classList.add("open");
    document.querySelectorAll(".date-trigger").forEach(function (t) { t.classList.remove("open"); });
    anchor.classList.add("open");
    placeCal();
  };
  var closeCal = function () {
    pop.classList.remove("open");
    if (calAnchor) calAnchor.classList.remove("open");
    calScope = null; calAnchor = null;
  };
  pop.querySelectorAll(".cal-nav").forEach(function (b) {
    b.addEventListener("click", function () {
      viewM += parseInt(b.getAttribute("data-nav"), 10);
      if (viewM < 0) { viewM = 11; viewY--; }
      if (viewM > 11) { viewM = 0; viewY++; }
      renderCal();
    });
  });
  pop.querySelector("#calClear").addEventListener("click", function () {
    var s = SCOPES[calScope];
    s.inEl.value = ""; s.outEl.value = "";
    syncLabels(calScope); refresh(); renderCal();
  });
  Object.keys(SCOPES).forEach(function (scope) {
    var s = SCOPES[scope];
    [s.inBtn, s.outBtn].forEach(function (btn) {
      if (!btn) return;
      btn.classList.add("empty");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (pop.classList.contains("open") && calAnchor === btn) { closeCal(); return; }
        openCal(scope, btn);
      });
    });
  });
  document.addEventListener("pointerdown", function (e) {
    if (pop.classList.contains("open") && !pop.contains(e.target) && !e.target.closest(".date-trigger")) closeCal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && pop.classList.contains("open")) {
      /* only close the calendar — never the booking modal behind it */
      e.stopImmediatePropagation();
      var anchor = calAnchor;
      closeCal();
      if (anchor) anchor.focus();
    }
  });
  window.addEventListener("resize", function () { if (pop.classList.contains("open")) placeCal(); });
  window.addEventListener("scroll", function () { if (pop.classList.contains("open")) placeCal(); }, { passive: true });

  var renderRooms = function () {
    if (!bmRooms) return;
    bmRooms.innerHTML = "";
    Object.keys(ROOMS).forEach(function (key) {
      var r = ROOMS[key];
      var pics = GALLERIES[KEY2[key]] || [];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bm-room";
      btn.setAttribute("data-key", key);
      var thumb = pics.length > 1
        ? '<span class="bm-thumb">' +
            '<span class="bm-thumb-track">' +
            pics.map(function (p, i) {
              return '<img src="' + IMG_BASE + p + '" alt=""' + (i ? ' loading="lazy"' : "") + ">";
            }).join("") +
            "</span>" +
            '<span class="bm-tnav bm-tprev" aria-hidden="true">‹</span>' +
            '<span class="bm-tnav bm-tnext" aria-hidden="true">›</span>' +
            '<span class="bm-tdots">' +
            pics.map(function (_, i) {
              return '<i' + (i === 0 ? ' class="on"' : "") + "></i>";
            }).join("") +
            "</span>" +
          "</span>"
        : '<img class="bm-room-img" src="' + r.img + '" alt="" loading="lazy">';
      btn.innerHTML =
        thumb +
        '<span class="bm-room-txt"><span class="bm-room-name">' + roomName(key) + '</span>' +
        '<div class="bm-room-meta">' + (TT("meta." + KEY2[key]) || r.meta) + '</div>' +
        '<div class="bm-room-max" hidden></div></span>' +
        '<span class="bm-room-price">' + chf(r.price).replace(".00", ".–") + " <small>" + (TT("rooms.perNight") || "/ Nacht") + "</small></span>";
      btn.addEventListener("click", function () {
        state.room = key;
        refresh();
      });
      /* mini album navigation — photo browsing must not toggle selection */
      var track = btn.querySelector(".bm-thumb-track");
      if (track) {
        var idx = 0;
        var dots = btn.querySelectorAll(".bm-tdots i");
        var go = function (i, ev) {
          if (ev) ev.stopPropagation();
          idx = (i + pics.length) % pics.length;
          track.style.transform = "translateX(-" + idx * 100 + "%)";
          dots.forEach(function (d, j) { d.classList.toggle("on", j === idx); });
        };
        btn.querySelector(".bm-tprev").addEventListener("click", function (ev) { go(idx - 1, ev); });
        btn.querySelector(".bm-tnext").addEventListener("click", function (ev) { go(idx + 1, ev); });
      }
      bmRooms.appendChild(btn);
    });
  };
  renderRooms();

  /* Illustrative per-room availability grid (bm-avail) — NOT live data,
     no feed from the hotel's real booking system is available; the grid
     exists to show the concept, with a visible "demo data" badge. */
  var bmAvailTable = $("bmAvailTable");
  var availHash = function (key, day) {
    var s = key + "-" + day;
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 97;
    return h;
  };
  var renderAvailability = function () {
    if (!bmAvailTable) return;
    var days = [];
    var d0 = new Date(); d0.setHours(0, 0, 0, 0);
    for (var i = 0; i < 10; i++) {
      var d = new Date(d0); d.setDate(d0.getDate() + i);
      days.push(d);
    }
    var wd = WD_S(), ms = MONTHS_S();
    var head = "<tr><th></th>" + days.map(function (d) {
      return "<th>" + wd[d.getDay()] + "<br>" + d.getDate() + ". " + ms[d.getMonth()] + "</th>";
    }).join("") + "</tr>";
    var body = Object.keys(ROOMS).map(function (key) {
      var cells = days.map(function (d) {
        var ok = availHash(key, iso(d)) % 5 > 1; /* ~60% available */
        return '<td class="avail-cell ' + (ok ? "ok" : "no") + '" aria-label="' +
          (ok ? (TT("avail.ok") || "Verfügbar") : (TT("avail.no") || "Nicht verfügbar")) + '">' +
          (ok ? "✓" : "✕") + "</td>";
      }).join("");
      return "<tr><td>" + roomName(key) + "</td>" + cells + "</tr>";
    }).join("");
    bmAvailTable.innerHTML = "<thead>" + head + "</thead><tbody>" + body + "</tbody>";
  };
  renderAvailability();

  var nights = function () {
    if (!bmIn.value || !bmOut.value) return 0;
    var n = Math.round((new Date(bmOut.value) - new Date(bmIn.value)) / 86400000);
    return n > 0 ? n : 0;
  };

  var totals = function () {
    var r = ROOMS[state.room];
    var n = nights();
    var base = r ? r.price * n : 0;
    return { base: base, total: base, nights: n };
  };

  function refresh() {
    if (!bmRooms) return;
    var g = parseInt(bmGuests.value, 10);
    bmRooms.querySelectorAll(".bm-room").forEach(function (el) {
      var key = el.getAttribute("data-key");
      var max = ROOMS[key].max;
      var fits = max >= g;
      el.classList.toggle("disabled", !fits);
      el.setAttribute("aria-disabled", String(!fits));
      var note = el.querySelector(".bm-room-max");
      if (note) {
        note.hidden = fits;
        if (!fits) {
          note.textContent = (max === 1
            ? (TT("room.maxGuest1") || "Nur für 1 Gast")
            : (TT("room.maxGuests") || "Max. {n} Gäste").replace("{n}", max));
        }
      }
      if (!fits && state.room === key) state.room = null;
      el.classList.toggle("selected", state.room === key);
    });
    var t = totals();
    var valid = !!(state.room && t.nights > 0);
    bmSummary.hidden = !valid;
    if (valid) {
      $("sumNights").textContent = roomName(state.room) + " × " + t.nights + " " +
        (t.nights === 1 ? (TT("u.night") || "Nacht") : (TT("u.nights") || "Nächte"));
      $("sumBase").textContent = chf(t.base);
      $("sumTotal").textContent = chf(t.total);
    }
    bmNext1.disabled = !valid;
  }

  var gotoStep = function (n) {
    modal.querySelectorAll(".bm-pane").forEach(function (p) {
      p.classList.toggle("active", p.getAttribute("data-pane") === String(n));
    });
    modal.querySelectorAll(".bm-step-dot").forEach(function (d) {
      var i = parseInt(d.getAttribute("data-dot"), 10);
      d.classList.toggle("active", i === n);
      d.classList.toggle("done", i < n);
    });
    if (n === 3) renderRecap();
    payNote.textContent = "";
    payNote.classList.remove("ok");
  };
  bmNext1.addEventListener("click", function () { gotoStep(2); checkStep2(); bmName.focus(); });
  bmNext2.addEventListener("click", function () {
    if (validateStep2(true)) gotoStep(3);
  });
  modal.querySelectorAll("[data-back]").forEach(function (b) {
    b.addEventListener("click", function () {
      gotoStep(parseInt(b.getAttribute("data-back"), 10));
    });
  });

  /* live gate: button enables as soon as the required fields are plausible */
  var step2Valid = function () {
    return !!bmName.value.trim() && EMAIL_RE.test(bmMail.value.trim()) &&
      (!bmPhone.value.trim() || PHONE_RE.test(bmPhone.value.trim()));
  };
  var checkStep2 = function () { bmNext2.disabled = !step2Valid(); };
  var bmCheck = function (el) {
    if (el === bmName) return !!bmName.value.trim() ? "" : (TT("form.errName") || "Bitte geben Sie Ihren Namen ein.");
    if (el === bmMail) return EMAIL_RE.test(bmMail.value.trim()) ? "" : (TT("form.errMail") || "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    return (!bmPhone.value.trim() || PHONE_RE.test(bmPhone.value.trim())) ? "" : (TT("form.errPhone") || "Bitte prüfen Sie die Telefonnummer.");
  };
  /* on submit: explain what is wrong, field by field */
  var validateStep2 = function (show) {
    var ok = true;
    [bmName, bmMail, bmPhone].forEach(function (el) {
      var msg = bmCheck(el);
      if (msg) ok = false;
      if (show) setFieldError(el, msg);
    });
    if (show && !ok) {
      var firstInvalid = modal.querySelector('.bm-form [aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
    return ok;
  };
  [bmName, bmMail, bmPhone].forEach(function (el) {
    el.addEventListener("input", function () { setFieldError(el, ""); checkStep2(); });
    el.addEventListener("change", checkStep2);
    el.addEventListener("blur", function () {
      /* only flag the field the visitor just left, and only if touched */
      if (el.value.trim()) setFieldError(el, bmCheck(el));
    });
  });
  /* Enter in a step-2 field continues to payment when everything is valid */
  [bmName, bmMail, bmPhone].forEach(function (el) {
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (validateStep2(true)) { gotoStep(3); }
      }
    });
  });

  var renderRecap = function () {
    var t = totals();
    var g = parseInt(bmGuests.value, 10);
    $("bmRecap").innerHTML =
      "<strong>" + roomName(state.room) + "</strong> · " + fmtDate(bmIn.value) + " → " + fmtDate(bmOut.value) +
      " · " + g + " " + (g === 1 ? (TT("u.guest") || "Gast") : (TT("u.guests") || "Gäste")) +
      "<br>" + t.nights + " " + (t.nights === 1 ? (TT("u.night") || "Nacht") : (TT("u.nights") || "Nächte")) +
      " · " + escapeHtml(bmName.value.trim()) +
      '<div class="bm-recap-total">' + (TT("u.from") || "ab") + " " + chf(t.total) +
      ' <small style="font-size:12px;color:rgba(244,245,247,.4);">' +
      (TT("recap.incl") || "inkl. Frühstück · günstigste Rate") + "</small></div>";
  };

  var lastFocus = null;
  var openModal = function (roomKey) {
    lastFocus = document.activeElement;
    if (bbIn && bbIn.value) bmIn.value = bbIn.value;
    if (bbOut && bbOut.value) bmOut.value = bbOut.value;
    if (bbGuests) {
      /* options carry numeric values; the regex is a fallback for old markup */
      var g = (String(bbGuests.value).match(/\d+/) || ["2"])[0];
      bmGuests.value = String(Math.min(Math.max(parseInt(g, 10) || 2, 1), 5));
    }
    if (roomKey && ROOMS[roomKey]) state.room = roomKey;
    syncLabels("bm");
    gotoStep(1);
    refresh();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (dock) dock.classList.remove("show");
    $("bmInBtn").focus();
  };
  var closeModal = function () {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  modal.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  /* keep Tab inside whichever dialog is on top (checkout, mail sheet, payment frame) */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var top = document.querySelector(".payframe.open") ||
              document.querySelector(".mailsheet.open .ms-card") ||
              (modal.classList.contains("open") ? modal.querySelector(".bmodal-card") : null);
    if (!top) return;
    var focusables = top.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
    );
    var visible = Array.prototype.filter.call(focusables, function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
    if (!visible.length) return;
    var first = visible[0], last = visible[visible.length - 1];
    if (e.shiftKey && (document.activeElement === first || !top.contains(document.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !top.contains(document.activeElement))) {
      e.preventDefault(); first.focus();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open") && !document.querySelector(".calpop.open") && !document.querySelector(".payframe.open") && !document.querySelector(".lightbox.open") && !document.querySelector(".mailsheet.open")) closeModal();
  });

  var bookingForm = $("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      openModal(null);
    });
  }
  var dockBtn = $("dockBtn");
  if (dockBtn) dockBtn.addEventListener("click", function () { openModal(null); });

  document.querySelectorAll(".room-link[data-room]").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      openModal(a.getAttribute("data-room"));
    });
  });

  /* Angebote → E-Mail-Anfrage mit Betreff */
  document.querySelectorAll(".room-link[data-offer]").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      var offer = a.getAttribute("data-offer");
      openMailSheet(
        (TT("mail.offerSubject") || "Anfrage: {offer}").replace("{offer}", offer),
        (TT("mail.offerBody") ||
          "Guten Tag\n\nIch interessiere mich für das Angebot «{offer}». Bitte senden Sie mir weitere Informationen.\n\nFreundliche Grüsse").replace("{offer}", offer)
      );
    });
  });

  /* JS-driven anchor scrolling — robust in every environment */
  document.querySelectorAll('a[href^="#"]:not([data-room]):not([data-offer])').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href").slice(1);
      var el = id ? document.getElementById(id) : null;
      if (el) {
        ev.preventDefault();
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
    });
  });

  /* re-render dynamic pieces when the language changes */
  document.addEventListener("alpina:lang", function () {
    rebuildDows();
    renderRooms();
    renderAvailability();
    syncLabels("bb");
    syncLabels("bm");
    refresh();
    if (pop.classList.contains("open")) renderCal();
  });

  /* ================================================================
     MAIL SHEET — reliable inquiry fallback (works without mail app)
     ================================================================ */
  var mailsheet = document.createElement("div");
  mailsheet.className = "mailsheet";
  mailsheet.innerHTML =
    '<div class="ms-backdrop"></div>' +
    '<div class="ms-card" role="dialog" aria-modal="true">' +
      '<button type="button" class="ms-close" aria-label="Schliessen">✕</button>' +
      '<h3 class="ms-title"></h3>' +
      '<p class="ms-to"><span class="ms-to-label"></span>: <a href="mailto:' + HOTEL_MAIL + '">' + HOTEL_MAIL + "</a></p>" +
      '<textarea class="ms-body" rows="9"></textarea>' +
      '<div class="ms-actions">' +
        '<a class="btn btn-gold btn-sm ms-mailto"></a>' +
        '<button type="button" class="btn btn-outline-dark btn-sm ms-copy"></button>' +
      "</div>" +
      '<p class="ms-note"><span class="ms-or"></span> <a href="tel:+41279552600">+41 27 955 26 00</a></p>' +
    "</div>";
  document.body.appendChild(mailsheet);
  var msTitle = mailsheet.querySelector(".ms-title");
  var msBody = mailsheet.querySelector(".ms-body");
  var msMailto = mailsheet.querySelector(".ms-mailto");
  var msCopy = mailsheet.querySelector(".ms-copy");
  var msLastFocus = null;
  var closeMailSheet = function () {
    mailsheet.classList.remove("open");
    document.body.style.overflow = modal.classList.contains("open") ? "hidden" : "";
    if (msLastFocus && msLastFocus.focus) msLastFocus.focus();
    msLastFocus = null;
  };
  var openMailSheet = function (subject, body) {
    msLastFocus = document.activeElement;
    msTitle.textContent = subject;
    msBody.value = body;
    mailsheet.querySelector(".ms-to-label").textContent = TT("ms.to") || "An";
    msMailto.textContent = TT("ms.open") || "E-Mail-Programm öffnen";
    msCopy.textContent = TT("ms.copy") || "Nachricht kopieren";
    mailsheet.querySelector(".ms-or").textContent = TT("ms.or") || "Oder direkt:";
    msMailto.href = "mailto:" + HOTEL_MAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    mailsheet.classList.add("open");
    document.body.style.overflow = "hidden";
    var mailBtn = mailsheet.querySelector(".ms-mailto");
    if (mailBtn) mailBtn.focus();
  };
  mailsheet.querySelector(".ms-close").addEventListener("click", closeMailSheet);
  mailsheet.querySelector(".ms-backdrop").addEventListener("click", closeMailSheet);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mailsheet.classList.contains("open")) {
      e.stopImmediatePropagation();
      closeMailSheet();
    }
  });
  msCopy.addEventListener("click", function () {
    var text = TT("ms.to") + ": " + HOTEL_MAIL + "\n" + msTitle.textContent + "\n\n" + msBody.value;
    var done = function () {
      msCopy.textContent = TT("ms.copied") || "Kopiert!";
      setTimeout(function () { msCopy.textContent = TT("ms.copy") || "Nachricht kopieren"; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        msBody.select(); document.execCommand("copy"); done();
      });
    } else {
      msBody.select(); document.execCommand("copy"); done();
    }
  });

  /* ---------- Payment actions ---------- */
  var mailBody = function () {
    var t = totals();
    var tpl = TT("mail.bookBody") ||
      "Guten Tag\n\nIch möchte gerne verbindlich anfragen:\n\nZimmer:  {room}\nAnreise: {in}\nAbreise: {out}\nGäste:   {guests}\nTotal:   ab {total} ({n} Nächte, inkl. Frühstück)\n\nName:    {name}\nE-Mail:  {mail}\n{phone}{note}\nFreundliche Grüsse\n{name}";
    var phoneLine = bmPhone.value.trim()
      ? (TT("mail.phoneLine") || "Telefon: {phone}\n").replace("{phone}", bmPhone.value.trim()) : "";
    var noteLine = bmNote.value.trim()
      ? (TT("mail.noteLine") || "\nWünsche: {note}\n").replace("{note}", bmNote.value.trim()) : "";
    return encodeURIComponent(
      tpl.replace(/\{room\}/g, roomName(state.room))
         .replace("{in}", fmtDate(bmIn.value))
         .replace("{out}", fmtDate(bmOut.value))
         .replace("{guests}", bmGuests.value)
         .replace("{total}", chf(totals().total))
         .replace("{n}", t.nights)
         .replace(/\{name\}/g, bmName.value.trim())
         .replace("{mail}", bmMail.value.trim())
         .replace("{phone}", phoneLine)
         .replace("{note}", noteLine)
    );
  };

  /* Deep-Link zum offiziellen Buchungssystem mit übernommenen Daten */
  var sbUrl = function () {
    var g = parseInt(bmGuests.value, 10) || 2;
    var r = ROOMS[state.room];
    var adults = Math.min(g, r ? r.max : g, 2);
    var kids = Math.max(0, g - adults);
    var guests = [];
    for (var i = 0; i < adults; i++) guests.push("A");
    for (var j = 0; j < kids; j++) guests.push("10");
    return "https://www.simplebooking.it/ibe2/hotel/" + SB_HOTEL_ID +
      "/?lang=" + (TT("sb.lang") || "DE") + "&cur=CHF&in=" + bmIn.value + "&out=" + bmOut.value +
      "&guests=" + guests.join("%2C");
  };

  $("payLater").addEventListener("click", function () {
    openMailSheet(
      (TT("mail.bookSubject") || "Buchungsanfrage {room} — Zahlung vor Ort").replace("{room}", roomName(state.room)),
      decodeURIComponent(mailBody())
    );
    payNote.textContent = TT("pay.noteLater") || "Ihr E-Mail-Programm öffnet sich mit der fertigen Anfrage. Wir bestätigen innert 24 h.";
    payNote.classList.add("ok");
  });

  /* Embedded official booking/payment engine (SimpleBooking allows framing) */
  var payframe = document.createElement("div");
  payframe.className = "payframe";
  payframe.innerHTML =
    '<div class="payframe-bar">' +
      '<span class="payframe-brand"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 72 L42 32 L56 54 L66 40 L82 72 Z" fill="none" stroke="#C5A059" stroke-width="6"/></svg>' +
      '<span data-i18n="pay.frameTitle">' + (TT("pay.frameTitle") || "Sicheres Buchungssystem — Hotel Alpina") + "</span></span>" +
      '<span class="payframe-actions">' +
      '<a class="payframe-ext" target="_blank" rel="noopener" data-i18n="pay.frameExt">' + (TT("pay.frameExt") || "In neuem Tab öffnen") + "</a>" +
      '<button type="button" class="payframe-close" aria-label="Schliessen">✕</button></span>' +
    "</div>" +
    '<iframe class="payframe-frame" title="Buchung" allow="payment *"></iframe>';
  document.body.appendChild(payframe);
  var pfFrame = payframe.querySelector(".payframe-frame");
  var pfExt = payframe.querySelector(".payframe-ext");
  var closePayframe = function () {
    payframe.classList.remove("open");
    document.body.classList.remove("pay-open");
    pfFrame.src = "about:blank";
    document.body.style.overflow = modal.classList.contains("open") ? "hidden" : "";
  };
  payframe.querySelector(".payframe-close").addEventListener("click", closePayframe);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && payframe.classList.contains("open")) { e.stopImmediatePropagation(); closePayframe(); }
  });

  $("payOnline").addEventListener("click", function () {
    var custom = PAYMENT_LINKS[state.room];
    if (custom) {
      /* external payment links (Stripe/Payrexx) forbid framing — open in new tab */
      var w = window.open(custom, "_blank", "noopener");
      if (!w) window.location.href = custom; /* popup blocked → same tab */
    } else {
      var link = sbUrl();
      pfFrame.src = link;
      pfExt.href = link;
      payframe.classList.add("open");
      document.body.classList.add("pay-open");
      document.body.style.overflow = "hidden";
      payframe.querySelector(".payframe-close").focus();
    }
    payNote.textContent = TT("pay.noteOnline") || "Das offizielle Buchungssystem ist geöffnet — Rate wählen und sicher online bezahlen, oder «Book now, pay later».";
    payNote.classList.add("ok");
  });

  /* ---------- Contact form ---------- */
  var contactForm = $("contactForm");
  var formNote = $("formNote");
  if (contactForm) {
    var cfName = $("cfName"), cfMail = $("cfMail"), cfMsg = $("cfMsg");
    var cfCheck = function (el) {
      if (el === cfName) return !!cfName.value.trim() ? "" : (TT("form.errName") || "Bitte geben Sie Ihren Namen ein.");
      if (el === cfMail) return EMAIL_RE.test(cfMail.value.trim()) ? "" : (TT("form.errMail") || "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return !!cfMsg.value.trim() ? "" : (TT("form.errMsg") || "Bitte schreiben Sie eine Nachricht.");
    };
    var validateContact = function (show) {
      var ok = true;
      [cfName, cfMail, cfMsg].forEach(function (el) {
        var msg = cfCheck(el);
        if (msg) ok = false;
        if (show) setFieldError(el, msg);
      });
      return ok;
    };
    [cfName, cfMail, cfMsg].forEach(function (el) {
      el.addEventListener("input", function () {
        setFieldError(el, "");
        formNote.textContent = "";
        formNote.classList.remove("err");
      });
      el.addEventListener("blur", function () {
        /* only flag the field the visitor just left, and only if touched */
        if (el.value.trim()) setFieldError(el, cfCheck(el));
      });
    });
    contactForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!validateContact(true)) {
        formNote.textContent = TT("form.err") || "Bitte füllen Sie alle Felder aus.";
        formNote.classList.add("err");
        var firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      var name = cfName.value.trim();
      openMailSheet(
        (TT("mail.contactSubject") || "Anfrage über die Website — {name}").replace("{name}", name),
        cfMsg.value.trim() + "\n\n" + name + "\n" + cfMail.value.trim()
      );
      formNote.classList.remove("err");
      formNote.textContent = (TT("form.ok") || "Vielen Dank, {name}! Ihr E-Mail-Programm öffnet sich.").replace("{name}", name);
    });
  }

  /* ---------- Drag to scroll (Grächen tips) ---------- */
  var scroller = $("tipScroller");
  if (scroller) {
    var isDown = false, startX = 0, startLeft = 0;
    scroller.addEventListener("pointerdown", function (e) {
      isDown = true;
      startX = e.clientX;
      startLeft = scroller.scrollLeft;
      scroller.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      scroller.scrollLeft = startLeft - (e.clientX - startX);
    });
    window.addEventListener("pointerup", function () {
      isDown = false;
      scroller.classList.remove("dragging");
    });
  }
})();
