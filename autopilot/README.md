# E-commerce Autopilot (RUFLO)

Orquestração: [ruflo](https://www.npmjs.com/package/ruflo) (ruvnet/claude-flow, v3.38.x).
Nota: `@ruflo/ruvector-memory`, `@ruflo/browser-automation`, `@mcp/analytics-api` não existem como pacotes; a memória vetorial é o `ruflo memory` (sql.js/HNSW), o browser é o Playwright e as métricas ficam a cargo do `autopilot/TASKS.md` até ligar uma API real.

## Arranque local (uma vez)
```bash
npx ruflo@latest init --minimal --no-global   # cria .claude/ (hooks), .claude-flow/, .mcp.json
npx ruflo memory init
npx ruflo autopilot config --max-iterations 50 --timeout 180 --task-sources swarm-tasks,file-checklist
npx ruflo autopilot enable
npx ruflo autopilot status
```
O autopilot corre como stop-hook do Claude Code: enquanto houver `- [ ]` em `autopilot/TASKS.md` (ou tarefas no swarm), volta a acionar o agente.

Os ficheiros gerados por `init` (`.claude/`, `.claude-flow/`, `.mcp.json`) não estão versionados de propósito: instalam hooks que executam código a cada sessão. Cada máquina faz o seu `init`.
