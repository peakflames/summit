# Contributing to Summit

Summit is a client-only SPA (TypeScript + Vite, `localStorage` persistence, no backend). This
guide covers local setup and the day-to-day workflow. Project-wide conventions (branching,
commit style, quality gates, release protocol) live in `CLAUDE.md` — this file complements it.

## Prerequisites

- Node.js 18+ and npm

## Getting Started

```bash
git clone <repo-url> && cd summit
npm install
npm run dev      # http://localhost:5173, empty state
npm run demo     # same, pre-seeded with sample habits
```

## Available Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run demo` | Start the dev server pre-seeded with demo habit data |
| `npm run build` | Type-check (`tsc --noEmit`) and build for production |
| `npm run lint` | ESLint + `prettier --check` |
| `npm run format` | Auto-format with Prettier |
| `npm test` | Run the Vitest suite |

## Before You Commit

Run in order: `npm run lint` → `npm run build` → `npm test` → verify manually in a browser
(`npm run dev` or `npm run demo`). Only commit after all four pass — see CLAUDE.md's
**Verification Before Commit Rule** for the full rationale.

## Branching

`develop` is the active-work branch, `main` is releases. Feature work happens on
`feature/epic-<id>-<name>` or `hotfix/<slug>` branches — see CLAUDE.md's **Git Workflow**
section for the full branch and merge conventions.

## Using Peak Workflow

This project's requirements, planning, and epic lifecycle are managed by the
[`peak-workflow`](https://github.com/peakflames/claude-plugins-peakflames) Claude Code plugin.
Requirements live in `docs/requirements/*.feature.md` (Gherkin `TOR-NN-XXXXXXX` IDs) and the
implementation plan lives in `docs/implementation-plan/`.

**Install:**

From a terminal, run the following commands individually:

```
claude plugin marketplace add peakflames/claude-plugins-peakflames
claude plugin install peak-workflow@peakflames-plugins
```

**Common commands** (invoke as `/peak-workflow:<name>` inside Claude Code):

| Command | Example | What it does |
|---|---|---|
| `status` | `/peak-workflow:status` | Read-only dashboard — epic progress, requirements coverage, next actions |
| `triage` | `/peak-workflow:triage "add CSV export"` | Sizes an incoming request as HEAVY / EPIC / TRIVIAL |
| `add` | `/peak-workflow:add "sort habits by streak length"` | Adds a new epic against existing TOR IDs |
| `start-epic` | `/peak-workflow:start-epic a3f2K7p` | Implements an epic against its TOR requirements |
| `wrapup-epic` | `/peak-workflow:wrapup-epic a3f2K7p` | Independently verifies and closes out a completed epic |
| `pause` | `/peak-workflow:pause` | Saves progress and stops mid-epic |
| `quick-fix` | `/peak-workflow:quick-fix "empty input shows wrong error text"` | Lightweight path for trivial bugs (~2 hours or less) |
| `refresh-docs` | `/peak-workflow:refresh-docs` | Syncs `architecture.md` / `design-notes.md` to the as-built code |

For first-time project setup (`discover`, `capture-requirements`, `plan-project`) or migration
commands, see the plugin's own README.
