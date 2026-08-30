# Summit

> A single-page habit tracker — add a habit, mark it done for today, track your streak, and
> filter by active/archived habits. Built as the public reference example for the
> `peak-workflow` plugin.

## Install

```bash
npm install
```

## Quick Start

```bash
npm run dev
```

Open the printed local URL in your browser. Add a habit, mark it done, and watch the streak
count update. All data persists to your browser's `localStorage` — no backend or account
required.

To explore the app pre-populated with sample habits instead of starting from empty, run:

```bash
npm run demo
```

## Documentation

- [Architecture](docs/architecture.md)
- [Design Notes](docs/design-notes.md)
- [Requirements](docs/requirements/) — TOR requirements baseline
- [Implementation Plan](docs/implementation-plan/) — epic registry; run `/peak-workflow:status` for the dashboard

## Development

See [CLAUDE.md](CLAUDE.md) for the project's development workflow conventions, and
[CONTRIBUTING.md](CONTRIBUTING.md) for available scripts and contribution guidelines.

## Built with Peak-Workflow

Summit is the public reference example for [`peak-workflow`](https://github.com/peakflames/claude-plugins-peakflames),
built end-to-end using the plugin's requirements-driven lifecycle. The token spend below covers
more than application code — it includes generating and maintaining the full set of SLCD
(Software Life Cycle Data) artifacts and requirements-to-code traceability, produced to a rigor
sufficient for a DO-330 TQL-5 engineering tool. Below is a one-day snapshot of Claude Code usage
while building Summit v0.3.0 with peak-workflow v1.5.0:

| Model | Cost | Tokens |
|-------|------|--------|
| claude-sonnet-5 | $48.88 | 642K tok |
| claude-opus-5 | $12.26 | 99K tok |
| claude-haiku-4-5-20251001 | $1.43 | 56K tok |

- Claude Code CLI version 2.1.251
- Cache hit at 99% — most prompts reuse cache
- 84% one-shot — edits landing first try

## License

See [LICENSE](LICENSE).
