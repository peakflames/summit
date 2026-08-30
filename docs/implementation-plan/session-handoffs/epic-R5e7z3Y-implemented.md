# Epic R5e7z3Y — PeakFlames Design System — Implemented

## What Was Built

Summit's visual language is now the PeakFlames Design System: a dark obsidian canvas, the
flame/ember/amber accent ramp, and the Archivo/IBM Plex Sans/JetBrains Mono brand type ramp,
replacing the prior hand-rolled, neutral-palette `src/styles/main.css`. Token CSS (11 files:
`styles.css` + 10 `tokens/*.css`) was vendored byte-identical from the design project
(`11ea476f-926c-40ea-8d34-91522c12d907`) into `src/styles/peakflames/`. `main.css` now imports
that layer as its first line and keeps only Summit-specific layout plus a small set of state
overrides. All six touched components (`AddHabitForm`, `FilterToggle`, `HabitCard`,
`StreakBadge`, `StreakHint`, `EmptyState`) add `.pf-*` classes alongside their existing class
names — no DOM element, attribute, or copy changed. The existing 7 test files (34 tests) pass
unmodified, the primary regression signal per CLAUDE.md.

Beyond the plan's literal scope, browser verification and interactive review surfaced and
fixed three real layout/requirement issues (see Spec Deviations): a "one hot element" TOR
violation with multiple undone habits, misaligned habit-card columns, and the add-habit
button dropping onto its own left-aligned line. The final mobile card layout (name on its own
row; streak/done/archive spread across the row beneath it via `justify-content: space-between`)
was refined interactively against live screenshots at the Pixel 10 (412px) and 375px
breakpoints.

## Key Files

| File | Purpose |
|---|---|
| `src/styles/peakflames/styles.css` + `tokens/*.css` (10 files) | Vendored PeakFlames Design System token CSS, byte-identical from the design project |
| `.prettierignore` | Added `src/styles/peakflames/` so `npm run lint` doesn't reformat vendored files |
| `src/styles/main.css` | Rewritten: imports the vendored layer; retains Summit-specific layout, fixed-width habit-card columns, mobile stacking/spread rules, done-state override, add-habit input/button row fix |
| `src/components/AddHabitForm.ts` | Added `pf-label` / `pf-input` / `pf-btn pf-btn--primary pf-btn--md` / `pf-error` |
| `src/components/FilterToggle.ts` | Added `pf-tabs` / `pf-tab`, toggles `pf-tab--active` alongside `is-selected` |
| `src/components/HabitCard.ts` | Added `pf-card` (card); `pf-btn pf-btn--secondary pf-btn--md` (done button — see Spec Deviations); `pf-btn pf-btn--secondary pf-btn--md` (archive button) |
| `src/components/StreakBadge.ts` | Added `pf-label` (streak label) |
| `src/components/StreakHint.ts` | Added `pf-hint` |
| `src/components/EmptyState.ts` | Added `pf-hint` |
| `index.html` | Added `<link rel="preconnect">` for `fonts.googleapis.com` / `fonts.gstatic.com` |
| `docs/architecture.md` | §2 Tech Stack styling row; §6 new "Stylesheets" subsection |
| `docs/design-notes.md` | New §14 (vendoring/additive-class/amber/layout-fix rationale); §11 updated with current sizing/color |
| `CHANGELOG.md` | `[0.2.0]` `### Changed` bullets |
| `CLAUDE.md` | Reference Materials now points at the design system + re-sync instructions |

## Spec Deviations

| TOR / Area | As-Written | As-Implemented | Reason |
|---|---|---|---|
| Epic spec Key Components table (not a TOR itself) | `HabitCard.ts` done button: `pf-btn pf-btn--primary pf-btn--md` | `pf-btn pf-btn--secondary pf-btn--md` | Literal implementation violated **TOR-05-G4eM1DW** ("exactly one flame-accented element per view"): with 2+ undone habits (the seeded demo data has this), every undone Done button plus the Add button all rendered the flame primary treatment simultaneously (confirmed via computed `background-color`: 3 elements at `rgb(225, 64, 13)`). The Add button is the one control guaranteed present regardless of habit count, so it is now the sole flame element; habit-card Done buttons use the secondary (outlined) treatment. Done/not-done states remain observably distinct (TOR-03-b2dynoV) via the existing desaturated-green `is-done` override. |
| Not a TOR — layout only | Original flex layout: `.habit-card__name` flex-grow, `.habit-card__streak`/`.habit-card__done-btn` content-sized | Fixed `min-width`s on `.habit-card__streak` and `.habit-card__done-btn`; mobile-specific rules forcing the name onto its own row and the streak/done/archive trio onto one shared, evenly-spread row | User caught two rendering bugs via live screenshots during browser verification: (1) streak/button columns started at a different x-position per row because digit count and button-label width varied; (2) at ≤480px, each card wrapped at a different point depending on habit-name length. Neither is TOR-anchored — pure visual-QA findings from interactive review, addressed the same session. |
| Not a TOR — layout only | `.add-habit-form input { flex: 1 1 auto }` (pre-epic) | `.add-habit-form input { flex: 1 1 0%; min-width: 0 }` | Adding `.pf-input` (which sets `width: 100%`) additively caused the input to claim its full flex-basis from that `width`, pushing the Add button onto its own left-aligned line below — a regression introduced by this epic's own additive class, caught via live screenshot and fixed same session. Input and button now share one row, button flush right. |

No TOR feature-file changes were made or needed — the deviations above are against the epic
spec's Key Components table and pre-existing CSS, not against any Given/When/Then.

## TOR Coverage

- **TOR-05-N8OUVWo** (dark obsidian canvas + brand type ramp) — PASS. Browser: `getComputedStyle(document.body).backgroundColor` = `rgb(6, 17, 27)` (`--obsidian-1000`); `h1` computed `font-family` = `Archivo, "Archivo Expanded", system-ui, sans-serif`; body computed `font-family` = `"IBM Plex Sans", system-ui, sans-serif`. `document.fonts` confirmed Archivo 700/800 and IBM Plex Sans/JetBrains Mono variants at `status: "loaded"` (not falling back to system-ui). Impl: `src/styles/peakflames/tokens/{colors,semantic,base,fonts}.css`, `index.html` preconnect.
- **TOR-05-G4eM1DW** (exactly one flame element per view) — PASS (after the deviation above). Browser: with the seeded demo dataset (2 undone habits + Add button present), exactly 1 element (`"Add"`) computed `background-color: rgb(225, 64, 13)` after the `pf-btn--secondary` fix; before the fix, 3 elements matched. Impl: `src/components/HabitCard.ts` (done button classes), `src/styles/peakflames/tokens/components.css` (`.pf-btn--primary` / `.pf-btn--secondary`).
- **TOR-05-3wxnhPe** (visible focus ring, persists) — PASS. Browser: real `Tab` keypresses through the add-habit input, Active, Archived, Archive, and Done today controls each showed `box-shadow: rgb(6, 17, 27) 0px 0px 0px 2px, rgb(225, 64, 13) 0px 0px 0px 4px` (`--ring-focus`) or the input's `--accent-soft` ring, persisting until the next Tab. Impl: `src/styles/peakflames/tokens/{base,elevation,components}.css` (`:focus-visible`, `--ring-focus`).
- **TOR-05-YsmGKT9** (ember gradient on selected filter) — PASS. Browser: clicking Archived moved `pf-tab--active` (and its `::after` `linear-gradient(90deg, rgb(172, 10, 7) 0%, rgb(225, 64, 13) ...)`) from Active to Archived; Active lost both `is-selected` and `pf-tab--active`. Impl: `src/components/FilterToggle.ts`, `src/styles/peakflames/tokens/components.css` (`.pf-tab--active::after`).

**Also verified not regressed:**
- **TOR-03-sX0EJEU** (streak heavier than name) — PASS. Browser: `.habit-card__streak-value` computed `font-weight: 800`, `font-size: 28px`, color `rgb(249, 199, 115)` (amber) vs. `.habit-card__name` `font-weight: 500`, `16px`.
- **TOR-03-b2dynoV** (done/not-done observably distinct) — PASS. Browser: done button `background-color: rgb(18, 41, 29)` / `color: rgb(78, 154, 107)` / `opacity: 1` vs. undone `background-color: rgba(0,0,0,0)` / `color: rgb(246, 243, 231)` — filled desaturated-green vs. outlined/transparent.
- **TOR-02-HJLw37V** (filter selection visible) — PASS, see TOR-05-YsmGKT9 above.
- **TOR-01-8FCo9h7** / **TOR-01-7ED8QkP** (functional at 375px / 1280px) — PASS. Screenshots taken at 375px and 793px/1280px; all controls visible, tappable, and non-overlapping at both. Card and add-habit-form layout bugs found during this pass were fixed same session (see Spec Deviations).

## Verification Results

| Gate | Result |
|---|---|
| `npm run lint` (eslint + prettier --check) | PASS — pre-existing `CONTRIBUTING.md` formatting warning is untouched by this epic, out of scope |
| `npm run build` (tsc --noEmit + vite build) | PASS — CSS bundle 21.43 kB (4.83 kB gzip); Google Fonts `@import` confirmed hoisted to the top of the built CSS |
| `npm test` (vitest run) | PASS — 34/34 tests, 7/7 files, unmodified |
| Browser verification (`playwright-cli` against `npm run dev`) | PASS — golden path, all 4 TORs, pre-existing TORs, 375px/412px/793px/1280px screenshots, keyboard focus, webfont-loaded check, localStorage persistence (verified against a non-demo-mode dev server; the port initially used was a pre-existing `vite --mode demo` instance that intentionally reseeds `localStorage` on every load, which briefly looked like a persistence bug before the cause was identified) |
| Console errors during browser run | None, aside from a benign `/favicon.ico` 404 (out of scope per plan) |

**Interactive refinement note:** after the initial implementation and verification pass, the
user reviewed live screenshots and requested three follow-up layout fixes (habit-card column
alignment, add-habit button row placement, and mobile row spread) — all addressed in this same
session, re-verified against lint/build/test/browser, and reflected in `docs/design-notes.md`
§14 and the Spec Deviations table above.
