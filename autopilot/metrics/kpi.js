#!/usr/bin/env node
/* MONITOR/OPTIMIZE — lê autopilot/metrics/*.csv (um por dia ou um acumulado) e escreve decisao.md.
 * CSV: data,canal,gasto,impressoes,cliques,add_to_cart,compras,receita,compras_abo
 * Regras (autopilot/deploy/campanha.md): PRICE 44; CPA máx 40% = 17.60; dia 5: ROAS>=2.0 escala, <2.0 pivot. */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname, PRICE = 44, CPA_MAX = PRICE * 0.4, ROAS_MIN = 2.0, DAY_DECISION = 5;
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.csv') && !f.startsWith('_'));
if (!files.length) { console.log('Sem CSV em autopilot/metrics/. Template: _template.csv'); process.exit(0); }
const rows = [];
for (const f of files) {
  const [h, ...ls] = fs.readFileSync(path.join(DIR, f), 'utf8').trim().split(/\r?\n/);
  const cols = h.split(',').map(s => s.trim());
  for (const l of ls) { if (!l.trim()) continue; const v = l.split(','); const o = {}; cols.forEach((c, i) => o[c] = isNaN(v[i]) ? v[i].trim() : Number(v[i])); rows.push(o); }
}
const sum = (arr, k) => arr.reduce((a, r) => a + (Number(r[k]) || 0), 0);
const agg = arr => { const g = sum(arr, 'gasto'), c = sum(arr, 'compras'), r = sum(arr, 'receita'), cl = sum(arr, 'cliques'), im = sum(arr, 'impressoes'), ab = sum(arr, 'compras_abo');
  return { gasto: g, compras: c, receita: r, roas: g ? r / g : 0, cpa: c ? g / c : Infinity, ctr: im ? cl / im : 0, cr: cl ? c / cl : 0, abo: c ? ab / c : 0 }; };
const days = [...new Set(rows.map(r => r.data))].sort();
const total = agg(rows), byChannel = {};
for (const ch of new Set(rows.map(r => r.canal))) byChannel[ch] = agg(rows.filter(r => r.canal === ch));
const f2 = n => (n === Infinity ? '—' : n.toFixed(2)), pct = n => (n * 100).toFixed(1) + ' %';
const actions = [];
for (const [ch, a] of Object.entries(byChannel)) {
  if (a.gasto >= 30 && a.ctr < 0.008) actions.push(`${ch}: CTR ${pct(a.ctr)} < 0.8 % após CHF ${f2(a.gasto)} → desligar criativos fracos`);
  if (a.gasto >= 80 && a.cpa > CPA_MAX) actions.push(`${ch}: CPA CHF ${f2(a.cpa)} > ${f2(CPA_MAX)} → reduzir orçamento 50 %`);
}
let decision = `Dia ${days.length}/${DAY_DECISION}: continuar teste, sem decisão de escala ainda.`;
if (days.length >= DAY_DECISION) decision = total.roas >= ROAS_MIN
  ? `ROAS ${f2(total.roas)} ≥ ${ROAS_MIN} → OPTIMIZE: escalar +30 %/dia no canal vencedor (${Object.entries(byChannel).sort((a, b) => b[1].roas - a[1].roas)[0][0]}).`
  : `ROAS ${f2(total.roas)} < ${ROAS_MIN} → PIVOT: parar ads, reabrir PLAN com skincare (research #2).`;
const md = `# Decisão MONITOR · ${new Date().toISOString().slice(0, 10)}

| Métrica | Total |
|---|---|
| Gasto | CHF ${f2(total.gasto)} |
| Compras | ${total.compras} (abo ${pct(total.abo)}) |
| Receita | CHF ${f2(total.receita)} |
| ROAS | ${f2(total.roas)} |
| CPA | CHF ${f2(total.cpa)} (máx ${f2(CPA_MAX)}) |
| CTR / CR | ${pct(total.ctr)} / ${pct(total.cr)} |

## Por canal
${Object.entries(byChannel).map(([c, a]) => `- **${c}**: gasto ${f2(a.gasto)}, ROAS ${f2(a.roas)}, CPA ${f2(a.cpa)}, CTR ${pct(a.ctr)}`).join('\n')}

## Ações imediatas
${actions.length ? actions.map(a => '- ' + a).join('\n') : '- Nenhuma regra de corte disparada.'}

## Decisão
${decision}
`;
fs.writeFileSync(path.join(DIR, 'decisao.md'), md);
console.log(md);
