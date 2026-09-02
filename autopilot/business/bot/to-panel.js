#!/usr/bin/env node
/* to-panel.js — converte out/prospects.json (do prospector) em documentos para o painel de alvos.
 * Uso: node to-panel.js [--min 40]  → escreve out/panel/<id>.json (um por alvo, só score ≥ min e não repetidos)
 * Depois: cola aqui na sessão "importa out/panel para o painel" e eu carrego-os na base de dados do painel. */
'use strict';
const fs = require('fs'), path = require('path');
const min = +(process.argv[process.argv.indexOf('--min') + 1] || 40);
const src = path.join(__dirname, 'out', 'prospects.json');
if (!fs.existsSync(src)) { console.error('Corre primeiro prospector.js'); process.exit(1); }
const slug = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const out = path.join(__dirname, 'out', 'panel'); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
let n = 0;
for (const p of JSON.parse(fs.readFileSync(src, 'utf8'))) {
  if (p.score < min || p.ja_no_pipeline) continue;
  const lang = /sion|sierre|martigny|monthey|verbier|nendaz|anz|cran|zinal|grimentz|vissoie|champ|ovronnaz|salgesch|fully|chamoson|leytron/i.test(p.localidade) ? 'FR' : 'DE';
  const d = { nome: p.nome, localidade: p.localidade, tipo: p.tipo, site: p.site || 'none', fraqueza: p.flags || '', contacto: p.telefone || '', idioma: lang, estado: 'novo', score: p.score, notas: p.rating ? `Google ${p.rating} (${p.reviews} avaliações) · ${p.morada || ''}` : (p.morada || ''), origem: 'bot ' + new Date().toISOString().slice(0, 10), criado: new Date().toISOString().slice(0, 10), maps: p.maps || '' };
  fs.writeFileSync(path.join(out, slug(p.nome) + '.json'), JSON.stringify(d)); n++;
}
console.log(`${n} alvos prontos em out/panel/ (score ≥ ${min})`);
