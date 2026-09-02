# E-commerce Autopilot (RUFLO)

Orquestração: [ruflo](https://www.npmjs.com/package/ruflo) (ruvnet/claude-flow, v3.38.x).
Nota: `@ruflo/ruvector-memory`, `@ruflo/browser-automation`, `@mcp/analytics-api` não existem como pacotes; a memória vetorial é o `ruflo memory` (sql.js/HNSW), o browser é o Playwright e as métricas ficam a cargo do `autopilot/TASKS.md` até ligar uma API real.

## Arranque local (uma vez)
```bash
npx ruflo@latest init --minimal --no-global   # cria .claude/ (hooks), .claude-flow/, .mcp.json
npx ruflo memory init
npx ruflo autopilot config --max-iterations 50 --timeout 180 --task-sources swarm-tasks,file-checklist
npx ruflo memory import -i autopilot/memory/ecommerce.json   # carrega o contexto RESEARCH
node autopilot/sync-checklist.js                               # TASKS.md -> .claude-flow/data/checklist.json
npx ruflo autopilot enable
npx ruflo autopilot check                                      # CONTINUE: 7/8 tasks remaining
```
Estado atual (2026-09-02): autopilot ENABLED, iteração 1/50, 7/8 tarefas pendentes, próxima ação = PLAN.
Nota: `ruflo task create` não alimenta o autopilot (store separado); só `.claude-flow/data/checklist.json` e `.claude-flow/swarm-tasks.json` contam. Por isso `TASKS.md` é a fonte de verdade e `sync-checklist.js` faz a ponte. `ruflo memory export` devolve 0 entradas na v3.38.21, por isso `memory/ecommerce.json` é mantido à mão no mesmo schema.
O autopilot corre como stop-hook do Claude Code: enquanto houver `- [ ]` em `autopilot/TASKS.md` (ou tarefas no swarm), volta a acionar o agente.

Os ficheiros gerados por `init` (`.claude/`, `.claude-flow/`, `.mcp.json`) não estão versionados de propósito: instalam hooks que executam código a cada sessão. Cada máquina faz o seu `init`.

## MONITOR
Colocar CSV diários em `autopilot/metrics/` (cabeçalho em `_template.csv`) e correr `node autopilot/metrics/kpi.js`. Escreve `decisao.md` com ROAS, CPA, ações de corte e a decisão escalar/pivot ao dia 5.
