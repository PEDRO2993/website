#!/usr/bin/env node
/* audit.js — pontua a fraqueza do site de um prospeto (0–100; mais alto = melhor alvo para a PR Studio).
 * Uso: node audit.js <url|none> [tipo]   ou   require('./audit').audit(url, tipo)
 * Sem dependências. Node 18+. */
'use strict';
const SOCIAL = /facebook\.com|instagram\.com|booking\.com|business\.site|linktr\.ee|tripadvisor|google\.com\/maps|search\.ch|local\.ch/i;
const BUILDERS = /wix\.com|wixstatic|jimdo|webnode|weebly|one\.com|site123|strikingly|squarespace|godaddy|ionos|localsearch|swissonline|webflow\.io/i;
const BOOKING = /seekda|hotelspider|cubilis|sitemsp|simplebooking|bookingbutton|onepagebooking|d-edge|synxis|smoobu|lodgify|beds24|guestline|mews|cloudbeds|sirvoy|reservation-engine|booking-engine|resengine|book-now|jetzt buchen|direkt buchen|réserver en ligne|prenota|verfügbarkeit prüfen|thefork|opentable|resmio|quandoo|zenchef|tableo/i;
const LANGS = /hreflang=|\/de\/|\/fr\/|\/it\/|\/en\/|lang=(de|fr|it|en)|>\s*(DE|FR|IT|EN)\s*</;

async function fetchSite(url) {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 12000);
  const t0 = Date.now();
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (PRStudio-audit; +https://prstudio.ch)' } });
    const html = (await r.text()).slice(0, 600000);
    return { ok: r.ok, status: r.status, finalUrl: r.url, html, ms: Date.now() - t0, bytes: html.length };
  } catch (e) { return { ok: false, status: 0, error: e.name === 'AbortError' ? 'timeout' : e.message, ms: Date.now() - t0 }; }
  finally { clearTimeout(t); }
}

async function audit(url, tipo = 'hotel') {
  const flags = []; let score = 0;
  if (!url || /^none$|^-$/i.test(url)) return { url: 'none', score: 60, flags: ['sem site'], reachable: false };
  if (SOCIAL.test(url)) return { url, score: 50, flags: ['só rede social / diretório'], reachable: true };
  let u = url.trim(); if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  let res = await fetchSite(u);
  if (!res.ok && /^https:/.test(u)) { const r2 = await fetchSite(u.replace(/^https:/, 'http:')); if (r2.ok) { res = r2; flags.push('sem HTTPS'); score += 15; } }
  if (!res.ok) { flags.push(res.error ? `inacessível (${res.error})` : `erro HTTP ${res.status}`); return { url: u, score: 20 + score, flags, reachable: false }; }
  const h = res.html, low = h.toLowerCase();
  if (/^http:/.test(res.finalUrl)) { flags.push('sem HTTPS'); score += 15; }
  if (!/<meta[^>]+name=["']viewport["']/i.test(h)) { flags.push('não mobile (sem viewport)'); score += 15; }
  if (!LANGS.test(h)) { flags.push('uma só língua'); score += 10; }
  if (/hotel|pension|b&b|garni|gîte|chambre|auberge/i.test(tipo) && !BOOKING.test(low)) { flags.push('sem reserva direta'); score += 15; }
  if (/restaurant|café|cave|bar|pizzeria|bergrestaurant/i.test(tipo) && !BOOKING.test(low)) { flags.push('sem reserva online'); score += 10; }
  const yr = [...h.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(20\d{2})/gi)].map(m => +m[1]).sort().pop();
  if (yr && yr < 2022) { flags.push(`copyright ${yr}`); score += 10; }
  if (BUILDERS.test(low)) { flags.push('construtor barato'); score += 8; }
  const gen = h.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i); if (gen && /wordpress [1-5]\.|joomla 1|typo3 [4-8]|frontpage|dreamweaver/i.test(gen[1])) { flags.push(`CMS antigo: ${gen[1].slice(0, 30)}`); score += 10; }
  if (/<frameset|<font |<table[^>]+bgcolor|\.swf\b/i.test(h)) { flags.push('HTML anos 2000'); score += 15; }
  if (res.ms > 5000) { flags.push(`lento (${(res.ms / 1000).toFixed(1)} s)`); score += 5; }
  if (!/<title>[^<]{5,}/i.test(h)) { flags.push('sem título'); score += 5; }
  if (!/<meta[^>]+name=["']description["']/i.test(h)) { flags.push('sem meta description'); score += 5; }
  return { url: res.finalUrl, score: Math.min(100, score), flags: flags.length ? flags : ['site razoável'], reachable: true, ms: res.ms };
}
module.exports = { audit };
if (require.main === module) { audit(process.argv[2], process.argv[3]).then(r => console.log(JSON.stringify(r, null, 1))); }
