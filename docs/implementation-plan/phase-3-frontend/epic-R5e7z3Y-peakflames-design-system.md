# Epic R5e7z3Y: PeakFlames Design System

**Phase:** 3 — Frontend
**Status:** Complete — 2026-08-30
**Dependencies:** Epic U4nHItd (App Shell & Diagnostics), Epic Yz4JE9Z (Habit Management), Epic WKhBuVK (Daily Check-In & Streaks), Epic e3mj8uq (Streak Continuation Hint) — this epic restyles the components those epics built and must not regress their behavior or DOM structure

> **Brand:** Vendor the PeakFlames Design System's token CSS (design project `11ea476f-926c-40ea-8d34-91522c12d907`) via `DesignSync` and apply its `.pf-*` component classes across the UI.

---

## Description

This epic makes Summit visibly a PeakFlames product by adopting the PeakFlames Design System's
real tokens and component classes — a dark-first obsidian canvas, flame/ember accent, and the
brand type ramp (Archivo / IBM Plex Sans / JetBrains Mono) — replacing the current hand-rolled,
neutral-palette `src/styles/main.css`. It exists because `docs/product-vision-planning/product-vision.md`
§9 was amended (2026-08-30) to specify PeakFlames Design System adoption as Summit's visual
direction, and `docs/requirements/05-visual-design.feature.md` was authored to formalize that
direction as TOR requirements.

The change is **strictly additive and visual**: token CSS is vendored byte-identical into
`src/styles/peakflames/`, `main.css` is rewritten to layer Summit-specific layout on top of it,
and `.pf-*` classes are added alongside every existing class name in the six touched component
files. No DOM element, attribute, or copy changes — the existing test suite (which queries by
CSS class and exact `textContent` across four test files) must pass unmodified, which is the
epic's primary regression signal per `CLAUDE.md`'s Verification Before Commit rule.

## Requirements Anchors

> The TOR requirement IDs listed below are the acceptance criteria and verification baseline for
> this epic. Each ID maps to a Gherkin scenario in the referenced feature file.
> `/peak-workflow:start-epic` reads each TOR's Given/When/Then to drive implementation and tests.
> `/peak-workflow:wrapup-epic` independently verifies each TOR's Given/When/Then is satisfied.
> If a feature file has been updated since this spec was written and a scenario no longer matches
> its cited TOR ID, stop and surface the discrepancy to the user before proceeding — do not
> silently implement against stale requirements.

| TOR ID | Feature File | Scenario Title |
|--------|--------------|----------------|
| TOR-05-N8OUVWo | `docs/requirements/05-visual-design.feature.md` | The web application shall render its interface on a dark, obsidian-toned canvas using the PeakFlames Design System's brand type ramp |
| TOR-05-G4eM1DW | `docs/requirements/05-visual-design.feature.md` | The web application shall render exactly one flame-accented "hot" element per view, reserved for the primary action |
| TOR-05-3wxnhPe | `docs/requirements/05-visual-design.feature.md` | The web application shall display a visible focus ring on any interactive control when it receives keyboard focus |
| TOR-05-YsmGKT9 | `docs/requirements/05-visual-design.feature.md` | The web application shall indicate the currently selected Active/Archived filter using the PeakFlames Design System's ember gradient treatment |

**Also must keep passing unchanged** (pre-existing TORs this restyle must not regress):
`TOR-03-sX0EJEU` (streak count visually heavier than habit name), `TOR-03-b2dynoV` (done/not-done
states observably distinct), `TOR-02-HJLw37V` (filter selection visible), `TOR-01-8FCo9h7` /
`TOR-01-7ED8QkP` (functional at 375px / 1280px).

## Key Components

### Frontend

- `src/styles/peakflames/styles.css` and `src/styles/peakflames/tokens/*.css` (fonts, colors,
  typography, spacing, radius, elevation, motion, semantic, base, components) — 11 files vendored
  byte-identical from the design project via `DesignSync` `get_file`, new
- `.prettierignore` — add `src/styles/peakflames/` so `npm run lint` (`prettier --check .`)
  doesn't reformat the vendored files and break byte-identity with upstream
- `src/styles/main.css` — `@import './peakflames/styles.css'` as line 1; remove the nine
  `--color-*` custom properties, `color-scheme: light`, the `*` box-sizing reset, and the `body`
  rule (now owned by `tokens/base.css`); retokenize `.app-shell`, `.add-habit-form`,
  `.filter-control`, `.habit-list`, `.habit-card`, `.habit-card__streak-value` (amber, not
  flame — see design-notes.md), `.habit-card__done-btn.is-done`, `.filter-control
  button.is-selected`, `.empty-state`, `.app-footer`, and the `@media (min-width: 768px)` block
- `src/components/AddHabitForm.ts` — add `pf-label` (label), `pf-input` (input), `pf-btn
  pf-btn--primary pf-btn--md` (submit button), `pf-error` (error paragraph, keeping the
  `hidden` attribute mechanism)
- `src/components/FilterToggle.ts` — add `pf-tabs` (container), `pf-tab` (both buttons), and
  toggle `pf-tab--active` alongside the existing `is-selected` toggle (never replacing it)
- `src/components/HabitCard.ts` — add `pf-card` (list item), `pf-btn pf-btn--primary
  pf-btn--md` (done button), `pf-btn pf-btn--secondary pf-btn--md` (archive button)
- `src/components/StreakBadge.ts` — add `pf-label` (streak label span)
- `src/components/StreakHint.ts` — add `pf-hint` (hint paragraph)
- `src/components/EmptyState.ts` — add `pf-hint` (empty-state paragraph)
- `index.html` — optionally add `<link rel="preconnect">` for `fonts.googleapis.com` /
  `fonts.gstatic.com`
- `docs/architecture.md`, `docs/design-notes.md`, `CHANGELOG.md`, `CLAUDE.md` (Reference
  Materials) — documentation updates per the plan (CSS architecture decision, tech stack row,
  changelog bullets, reference pointer)
