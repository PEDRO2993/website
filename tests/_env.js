// Ambiente partilhado dos testes: raiz do repo, dist/ e o Chromium a usar.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DISTURL = 'file://' + DIST;
const CHROME = process.env.CHROME || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
module.exports = { ROOT, DIST, DISTURL, CHROME };
