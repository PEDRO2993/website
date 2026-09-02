# Ruflo — Claude Code Configuration

## Rules

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary — prefer editing existing files
- NEVER create documentation files unless explicitly requested
- NEVER save working files or tests to root — use `/src`, `/tests`, `/docs`, `/config`, `/scripts`
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- NEVER add a `Co-Authored-By` trailer to user commits unless this project's `.claude/settings.json` has `attribution.commit` set (#2078). The Claude Code Bash tool may suggest one in its default commit-message template — ignore it. `Co-Authored-By` is semantic authorship attribution under git/GitHub convention; the tool is the facilitator, not a co-author.
- Keep files under 500 lines
- Validate input at system boundaries

## Ruflo Capability Brain & Implementation Loop

Ruflo is the coordination ledger and policy decision point. Claude Code is the
executor: after a Ruflo coordination call, continue implementing the task.

When it is registered, call
`guidance_brain({ mode: "recommend", task: "..." })` before complex Ruflo
work. Use its live registry instead of guessing tool names. Treat
`registered`, `configured`, `reachable`, `healthy`, and `authorized`
as separate facts. If the brain is unavailable, continue with the compatible
`guidance_recommend` tool, CLI discovery, and repository instructions.

Follow the returned loop:

1. Recall memory and ADR constraints.
2. Inspect source, runtime, dependencies, policy, and health.
3. Route to the smallest capable topology, agents, skills, and tools.
4. Plan acceptance criteria, safety envelope, ownership, and validation.
5. Execute in isolated scopes; the coding agent performs the work.
6. Test focused, regression, and failure paths.
7. Validate types, security, policy, compatibility, and artifacts.
8. Benchmark a source-bound candidate against a source-bound baseline.
9. Optimize measured bottlenecks without weakening safety.
10. Bind claims and evidence to exact source/build receipts.
11. Reconcile concurrent handoffs and disclose limitations.
12. Publish only through a separately authorized release gate.

### Concurrency and authority

- Never allow two writers in one worktree; give each writing agent an isolated
  worktree and explicit file ownership.
- Read-only research may run concurrently and report findings to the owner.
- Only the integration owner edits shared manifests and lockfiles or reconciles
  overlapping changes.
- A child may drop capabilities but cannot add tools, network, secrets, spend,
  concurrency, namespaces, or delegation depth.
- A lease or claim coordinates ownership; it does not authorize a side effect.
- Darwin, Flywheel, MetaHarness, memory, and neural systems may propose or
  evaluate candidates but cannot self-promote or expand their SafetyEnvelope.
- Bind tests, benchmarks, policy decisions, and release evidence to an exact
  commit or immutable dirty-worktree snapshot.

## Agent Comms (SendMessage-First Coordination)

Named agents coordinate via `SendMessage`, not polling or shared state.

```
Lead (you) ←→ architect ←→ developer ←→ tester ←→ reviewer
              (named agents message each other directly)
```

### Spawning a Coordinated Team

```javascript
// ALL agents in ONE message, each knows WHO to message next
Agent({ prompt: "Research the codebase. SendMessage findings to 'architect'.",
  subagent_type: "researcher", name: "researcher", run_in_background: true })
Agent({ prompt: "Wait for 'researcher'. Design solution. SendMessage to 'coder'.",
  subagent_type: "system-architect", name: "architect", run_in_background: true })
Agent({ prompt: "Wait for 'architect'. Implement it. SendMessage to 'tester'.",
  subagent_type: "coder", name: "coder", run_in_background: true })
Agent({ prompt: "Wait for 'coder'. Write tests. SendMessage results to 'reviewer'.",
  subagent_type: "tester", name: "tester", run_in_background: true })
Agent({ prompt: "Wait for 'tester'. Review code quality and security.",
  subagent_type: "reviewer", name: "reviewer", run_in_background: true })

// Kick off the pipeline
SendMessage({ to: "researcher", summary: "Start", message: "[task context]" })
```

### Patterns

| Pattern | Flow | Use When |
|---------|------|----------|
| **Pipeline** | A → B → C → D | Sequential dependencies (feature dev) |
| **Fan-out** | Lead → A, B, C → Lead | Independent parallel work (research) |
| **Supervisor** | Lead ↔ workers | Ongoing coordination (complex refactor) |

### Rules

- ALWAYS name agents — `name: "role"` makes them addressable
- ALWAYS include comms instructions in prompts — who to message, what to send
- Spawn ALL agents in ONE message with `run_in_background: true`
- After spawning, continue independent local work; wait only when a dependency
  genuinely blocks progress
- Do not poll repeatedly — agents message back or complete automatically
- Give every writing agent an isolated worktree and a non-overlapping file scope

## Swarm & Routing

### Config
- **Topology**: mesh (anti-drift)
- **Max Agents**: 5
- **Memory**: memory
- **HNSW**: Disabled
- **Neural**: Disabled

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

### Agent Routing

| Task | Agents | Topology |
|------|--------|----------|
| Bug Fix | researcher, coder, tester | hierarchical |
| Feature | architect, coder, tester, reviewer | hierarchical |
| Refactor | architect, coder, reviewer | hierarchical |
| Performance | perf-engineer, coder | hierarchical |
| Security | security-architect, auditor | hierarchical |

### When to Swarm
- **YES**: 3+ files, new features, cross-module refactoring, API changes, security, performance
- **NO**: single file edits, 1-2 line fixes, docs updates, config changes, questions

### 3-Tier Model Routing

| Tier | Handler | Use Cases |
|------|---------|-----------|
| 1 | Agent Booster (WASM) | Simple transforms — skip LLM, use Edit directly |
| 2 | Haiku | Simple tasks, low complexity |
| 3 | Sonnet/Opus | Architecture, security, complex reasoning |

## Build & Test

- ALWAYS run tests after code changes
- ALWAYS verify build succeeds before committing

```bash
npm run build && npm test
```

## CLI Quick Reference

```bash
npx @claude-flow/cli@latest init --wizard           # Setup
npx @claude-flow/cli@latest swarm init --v3-mode     # Start swarm
npx @claude-flow/cli@latest memory search --query "" # Vector search
npx @claude-flow/cli@latest hooks route --task ""    # Route to agent
npx @claude-flow/cli@latest doctor --fix             # Diagnostics
npx @claude-flow/cli@latest security scan            # Security scan
npx @claude-flow/cli@latest performance benchmark    # Benchmarks
```

26 commands, 140+ subcommands. Use `--help` on any command for details.

## Setup

```bash
claude mcp add claude-flow -- npx -y ruflo@latest mcp start
npx ruflo@latest doctor --fix
```

> The background `daemon` is optional. It runs interval workers that each spawn
> a headless `claude` session, so it consumes tokens continuously. Start it only
> if you want those sweeps: `npx ruflo@latest daemon start` (self-stops after 12h
> by default; `--ttl 0` to disable, `daemon status --all` to audit running daemons).

**Agent tool** handles execution (agents, files, code, git). **MCP tools** handle coordination (swarm, memory, hooks). **CLI** is the same via Bash.


# Regras de economia de tokens

Estas regras têm prioridade sobre o estilo por omissão. O objetivo é fazer o
mesmo trabalho com o mínimo de tokens de entrada e de saída.

## Resposta

- Uma a três linhas. Sem saudação, sem agradecimento, sem repetir o pedido,
  sem "aqui está", sem resumo final do que já se vê nas ferramentas.
- Sem código no chat. As alterações fazem-se com `Edit`/`Write`; depois,
  uma linha: `ficheiro:linha — o que mudou`.
- Sem listas de opções que não vais seguir. Decide e faz.
- Erro ou bloqueio: uma linha com a causa e o que precisas.

## Leitura

- `Grep` primeiro. `Read` só do troço que interessa, com `offset` e `limit`.
- Nunca `Read` de um ficheiro que já esteja no contexto desta sessão. Se
  duvidas se mudou, `Grep` pela linha que precisas.
- Nunca ler `node_modules/`, `dist/`, `*.lock`, `package-lock.json`,
  `*.min.js`, imagens, ou qualquer ficheiro > 200 linhas inteiro.
- `ls -R`, `find` sem filtro e `cat` de ficheiros grandes estão proibidos.

## Bash

- Qualquer comando que possa devolver mais de ~80 linhas leva `2>&1 | tail -n 80`
  ou `| grep <padrão>`. Testes, builds, installs, `git log`, `git diff`: sempre.
- Prefere `--quiet`, `--silent`, `-q` quando existem.
- Não corras o mesmo comando duas vezes para "confirmar".

## Delegação por tipo de tarefa

| Tarefa | Delega em |
|---|---|
| localizar ficheiros, ler, listar, pesquisar | `scout` |
| formatar, lint, ler logs, renomear, mover | `formatter` |
| implementar algo já especificado | `builder` |
| arquitetura, refactoring grande, decisões | `architect` |

A sessão principal coordena. Não faz pesquisa nem formatação ela própria.

## Memória (ruflo)

- Guardar sempre com `--namespace` explícito. Nunca em `default`.
- Namespaces: `webdev-<projeto>`, `bots-<nome>`, `ops`.
- Antes de começar uma tarefa: `memory search` no namespace do projeto.
- No fim de uma tarefa: um resumo de ≤ 3 linhas em `memory store`. Não guardar
  logs, diffs ou ficheiros inteiros — só a decisão e o porquê.
- Output longo de ferramentas (logs, testes) não fica no contexto: extrai o
  que interessa, guarda o resumo, segue.

## Contexto

- A cada 12 turnos, ou quando mais de metade do contexto for de ficheiros já
  processados, propõe `/compact` numa linha.
- Não peças confirmação para coisas reversíveis. Faz.


## Projeto prstudio.ch

- Fonte de verdade: `index.html` (PT + dicionários I18N), `build.js` gera `dist/` por idioma. Nunca editar `dist/`.
- Nunca inventar clientes, testemunhos, estatísticas ou preços. Preços reais só os do site.
- `SUPABASE_SERVICE_ROLE_KEY` só em `netlify/functions/`. Build hook só no Vault/env.
- Antes de tocar em traduções: manter registo (DE Sie, FR vous, IT tu, PT tu).
- Testes: `cd tests && npm i && npm test` (build + Playwright, locale pt-PT). Chromium do sistema em /opt/pw-browsers ou `npx playwright install chromium`.

- Secção "Trabalho recente" (Fluhalp/Channa): só factos neutros. Nunca afirmar se foi encomendado, oferecido ou pago — o Pedro corrigiu isto a 2026-09-02.

- Artigo novo (estático): clonar a estrutura de `google-business-valais.html` (5 blocos `.i18n-doc`, `TITLES`, JSON-LD Article), adicionar a `DOC_PAGES` em build.js, cartão por idioma em `blog.html` e o bloco `.lg-more` nos outros artigos. O build gera breadcrumb, CTA, tempo de leitura, feed e sitemap.
- Tipografia FR: espaço insecável real (U+00A0) antes de `: ; ? !` e dentro de `« »` — nunca `&nbsp;` (entra no JSON-LD).
- `<body>`: o skip-link é o primeiro elemento; a dica de idioma corre num script inline logo a seguir (antes do header) para não causar CLS.
- CSS dos artigos/blog/posts da BD: bloco "v3" no fim de cada `<style>` e da `CSS` em posts.js — manter os 5 sincronizados.
