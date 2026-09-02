#!/usr/bin/env node
/* TASKS.md -> .claude-flow/data/checklist.json (fonte `file-checklist` do `ruflo autopilot`).
 * Uso: node autopilot/sync-checklist.js   (corre na raiz do projeto, depois de `ruflo init`) */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const md = fs.readFileSync(path.join(__dirname, 'TASKS.md'), 'utf8');
const items = md.split('\n').filter(l => /^- \[( |x)\] /.test(l)).map((l, i) => {
  const done = /^- \[x\]/.test(l);
  const text = l.replace(/^- \[( |x)\] /, '');
  return { id: `ap-${i + 1}`, subject: text, status: done ? 'completed' : 'pending' };
});
const out = path.join(root, '.claude-flow', 'data', 'checklist.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ items }, null, 2) + '\n');
console.log(`${items.length} items (${items.filter(i => i.status === 'completed').length} done) -> ${path.relative(root, out)}`);
