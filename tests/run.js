// Corre o build e todos os testes (node tests/run.js). Requer: npm i (nesta pasta) e, sem Chromium do sistema, npx playwright install chromium.
const { spawnSync } = require('child_process');
const path = require('path');
const { ROOT } = require('./_env');
const run = (cmd, args, cwd) => spawnSync(cmd, args, { cwd, stdio: 'inherit' }).status === 0;
if (!run('node', ['build.js'], ROOT)) process.exit(1);
const tests = ['t_i18n_build.js', 't_trabalho.js', 't_blog_i18n.js', 't_new_sections.js', 't_contact_required.js', 't_form_state.js', 'overflow.js'];
let failed = 0;
for (const t of tests) { console.log('\n== ' + t); if (!run('node', [path.join(__dirname, t)], __dirname)) failed++; }
console.log(failed ? '\n' + failed + ' teste(s) falharam' : '\nTudo verde.');
process.exit(failed ? 1 : 0);
