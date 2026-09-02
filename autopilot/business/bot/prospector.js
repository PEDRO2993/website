#!/usr/bin/env node
/* prospector.js — encontra empresas no Valais por localidade × categoria (Google Places API New),
 * audita o site de cada uma e escreve prospects.json + prospects.csv ordenados por pontuação.
 * Uso: GOOGLE_PLACES_KEY=... node prospector.js [--towns "Grächen,Saas-Fee"] [--types "hotel,restaurant"] [--max 20]
 * Custo: Text Search (Pro) — o Google dá crédito mensal gratuito; ~1 chamada por localidade×categoria×página.
 * Sem dependências. Node 18+. */
'use strict';
const fs = require('fs'), path = require('path');
const { audit } = require('./audit');
const KEY = process.env.GOOGLE_PLACES_KEY;
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : d; };
const TOWNS = arg('--towns', 'Grächen,Saas-Fee,Saas-Grund,Zermatt,Leukerbad,Crans-Montana,Verbier,Nendaz,Anzère,Sion,Sierre,Visp,Brig,Fiesch,Bettmeralp,Riederalp,Champéry,Ovronnaz,Zinal,Grimentz,Martigny,Monthey,Salgesch').split(',').map(s => s.trim());
const TYPES = arg('--types', 'hotel,pension,restaurant,bergrestaurant,cave à vin').split(',').map(s => s.trim());
const MAX = +arg('--max', 20);
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const existing = new Set();
try { for (const l of fs.readFileSync(path.join(__dirname, '..', 'pipeline.csv'), 'utf8').split('\n').slice(1)) existing.add(l.split(',')[0].trim().toLowerCase()); } catch {}

async function searchText(q, pageToken) {
  const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.websiteUri,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.types,places.googleMapsUri,places.businessStatus,nextPageToken' },
    body: JSON.stringify({ textQuery: q, languageCode: 'de', regionCode: 'CH', pageSize: 20, pageToken })
  });
  if (!r.ok) throw new Error(`Places ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

(async () => {
  if (!KEY) { console.error('Falta GOOGLE_PLACES_KEY (ver README.md).'); process.exit(1); }
  const seen = new Map();
  for (const town of TOWNS) for (const type of TYPES) {
    let token, n = 0;
    do {
      const data = await searchText(`${type} in ${town}, Wallis`, token).catch(e => { console.error(e.message); return {}; });
      for (const p of data.places || []) {
        if (p.businessStatus && p.businessStatus !== 'OPERATIONAL') continue;
        if (seen.has(p.id)) continue;
        seen.set(p.id, { id: p.id, nome: p.displayName?.text, tipo: type, localidade: town, morada: p.formattedAddress, telefone: p.nationalPhoneNumber || '', site: p.websiteUri || 'none', rating: p.rating || '', reviews: p.userRatingCount || 0, maps: p.googleMapsUri, ja_no_pipeline: existing.has((p.displayName?.text || '').toLowerCase()) });
      }
      token = data.nextPageToken; n++;
    } while (token && n < Math.ceil(MAX / 20));
    process.stderr.write(`${town} · ${type}: ${seen.size} acumulados\n`);
  }
  const list = [...seen.values()];
  for (let i = 0; i < list.length; i += 8) {
    await Promise.all(list.slice(i, i + 8).map(async p => { const a = await audit(p.site, p.tipo); p.score = a.score; p.flags = a.flags.join(' · '); p.site_final = a.url; }));
    process.stderr.write(`auditados ${Math.min(i + 8, list.length)}/${list.length}\n`);
  }
  list.sort((a, b) => b.score - a.score || b.reviews - a.reviews);
  fs.writeFileSync(path.join(OUT, 'prospects.json'), JSON.stringify(list, null, 1));
  const cols = ['nome', 'localidade', 'tipo', 'site', 'score', 'flags', 'telefone', 'rating', 'reviews', 'morada', 'maps', 'ja_no_pipeline'];
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  fs.writeFileSync(path.join(OUT, 'prospects.csv'), cols.join(',') + '\n' + list.map(p => cols.map(c => esc(p[c])).join(',')).join('\n') + '\n');
  console.log(`${list.length} empresas · ${list.filter(p => p.score >= 40).length} com score ≥ 40 → ${path.relative(process.cwd(), OUT)}/prospects.csv`);
})();
