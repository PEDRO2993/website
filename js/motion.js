/* ==================================================================
   PR STUDIO — motor de movimento partilhado das páginas de documento.
   Mesmo mecanismo do index.html (palavras em .w > span, reveal por
   IntersectionObserver), aplicado aos alvos genéricos destas páginas:
   main h1/h2, .cta, .lg-tbl-wrap, blockquote, .blog-card, .lg-share,
   .more/.lg-more. Nada aqui depende de dicionários i18n — os 5 blocos
   .i18n-doc já existem todos no DOM; os escondidos (display:none) não
   intersectam, por isso animá-los é inofensivo.
   ================================================================== */
(function () {
  "use strict";
  var html = document.documentElement;
  html.classList.add("js");
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function splitWords(el) {
    if (!el || el.getAttribute("data-split")) return;
    el.setAttribute("data-split", "1");
    var i = 0;
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var w = document.createElement("span"); w.className = "w"; w.style.setProperty("--i", i++);
        var s = document.createElement("span"); s.textContent = p; w.appendChild(s); frag.appendChild(w);
      });
      n.parentNode.replaceChild(frag, n);
    });
  }

  if (!REDUCED) {
    document.querySelectorAll("main h1").forEach(splitWords);
    document.querySelectorAll("main h2").forEach(splitWords);
  }

  ["main h2", ".cta", ".lg-tbl-wrap", "main blockquote", ".lg-share", ".more", ".lg-more"].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add("reveal"); });
  });
  document.querySelectorAll(".blog-list").forEach(function (grid) {
    Array.prototype.forEach.call(grid.children, function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i * 60) + "ms";
    });
  });

  if ("IntersectionObserver" in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
          setTimeout(function () { en.target.style.transitionDelay = ""; }, 1200);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); el.style.transitionDelay = ""; });
  }

  /* botões da faixa de contacto seguem o rato — o mesmo `.magnetic` do hero
     da homepage, só que aqui é o motor partilhado que o liga; só em ecrãs
     com rato fino, nunca em toque (não há "pointerleave" real num dedo). */
  var FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (FINE && !REDUCED) {
    document.querySelectorAll(".cta .btn").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.14;
        var dy = (e.clientY - r.top - r.height / 2) * 0.22;
        btn.style.transform = "translate(" + dx + "px," + dy + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  if (!REDUCED) requestAnimationFrame(function () { requestAnimationFrame(function () { html.classList.add("page-go"); }); });
  else html.classList.add("page-go");
})();
