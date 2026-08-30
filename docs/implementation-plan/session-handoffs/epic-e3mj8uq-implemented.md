# Epic e3mj8uq — Streak Continuation Hint — Implemented

## What Was Built

Added a static, always-visible hint (`renderStreakHint()` in `StreakHint.ts`) explaining that
marking done tomorrow continues a streak and a missed day resets it to 1. The hint is rendered
exactly once per page — between the Active/Archived filter toggle and the habit list, shown
only for the Active view — rather than repeated on every habit card.

**Revision note:** this epic was implemented twice in the same session. The first pass
rendered the hint inside every habit card, satisfying the TORs as originally written. A
post-implementation review found that redundant for a list of any size, so the product vision,
ConOps, and both TORs (same IDs, revised Given/When/Then) were updated to specify a single
shared hint location, and the implementation below reflects the second, final pass. See
`docs/design-notes.md` §13 for the full rationale.

## Key Files

| File | Purpose |
|---|---|
| `src/components/StreakHint.ts` | `renderStreakHint()` — returns a `<p class="streak-hint">` with fixed copy, no params, no listeners |
| `src/App.ts` | Imports `renderStreakHint`; appends it once, between the filter toggle and the habit list, only when `viewState.getView() === 'active'` |
| `src/components/StreakBadge.ts` | Reverted to its pre-epic state (per-card `renderStreakHint` removed) |
| `src/components/HabitCard.ts` | Reverted to its pre-epic state (per-card hint append removed) |
| `src/styles/main.css` | Added `.streak-hint` (shared-location styling); removed `.habit-card__streak-hint` (per-card styling from the first pass) |
| `tests/dailyCheckinStreaks.test.ts` | Two tests rewritten to assert exactly one `.streak-hint` element in the DOM, not one per card |
| `docs/product-vision-planning/product-vision.md` | §6, §9 revised to specify a single shared hint location |
| `docs/product-vision-planning/concept-of-operations.md` | Scenario 2 step 7, §7 table, §9 glossary revised to match |
| `docs/requirements/03-daily-checkin-streaks.feature.md` | TOR-03-2OgotAa, TOR-03-MvP98PX scenarios rewritten (same IDs) |
| `docs/requirements/03-daily-checkin-streaks.feature.tracing.json` | Paraphrases for both TORs updated to match revised scenarios |

## Spec Deviations

| TOR ID | As-Written | As-Implemented | Reason |
|---|---|---|---|
| — | — | — | No deviations against the final (revised) Given/When/Then for either TOR. The TOR text itself was revised mid-epic via a requirements-change pass (`/peak-workflow:capture-requirements`) before this implementation was written — see Revision note above. |

## TOR Coverage

- **TOR-03-2OgotAa** (single static hint in a shared location for the habit list) — **PASS**.
  Test: `tests/dailyCheckinStreaks.test.ts:207-234` — seeds two habits, mounts the app, and
  asserts `root.querySelectorAll('.streak-hint')` has length 1 with text matching
  `/continue|resets/i`, that no `.habit-card__streak-hint` exists anywhere in the DOM, and
  that the hint element is not contained within either habit card. Impl:
  `src/components/StreakHint.ts:1-7` (fixed copy, no params) wired at `src/App.ts:57-59`
  (appended once, guarded on the Active view). Browser verification: seeded "Drink water" and
  "Read 20 minutes" via the UI — exactly one hint paragraph rendered above the list on first
  paint (screenshot: `/tmp/summit-hint2.png`), with no interaction required.
- **TOR-03-MvP98PX** (always-visible static text, not a dismissible popup/toast/hover overlay)
  — **PASS**. Test: `tests/dailyCheckinStreaks.test.ts:239-274` — asserts the hint has no
  `hidden` or `title` attribute, dispatches `mouseover`/`mouseout`/`click` on both the hint and
  a habit card as a negative control and confirms the text and absence of `hidden` are
  unchanged, then triggers a real re-render via the done button and confirms the hint (fetched
  fresh from `root`) still carries identical text and no `hidden` attribute. Impl:
  `src/components/StreakHint.ts:1-7` — registers zero event listeners and sets no
  `title`/`hidden` attribute, so there is no dismiss/hover code path to trigger. Browser
  verification: hovered the hint, then clicked "Done today" on "Drink water" — the hint
  (snapshot ref `e69`) rendered unchanged after the re-render; switching to the Archived view
  correctly showed no hint at all (by product-vision design, the hint belongs to the "Habit
  List View" / Active section only — see `docs/design-notes.md` §13), confirming the hint's
  presence and absence are driven only by view state, never by hover/click/dismissal.

## Verification Results

| Gate | Result |
|---|---|
| `npm run lint` (eslint + prettier --check) | PASS (pre-existing `CONTRIBUTING.md` formatting warning, unrelated to this epic) |
| `npm run build` (tsc --noEmit + vite build) | PASS |
| `npm test` (vitest run) | PASS — 34/34 tests, 7 files (32 pre-existing + 2 rewritten) |
| Browser verification | PASS — driven with `playwright-cli` against `npm run dev`: single hint above the list on first paint, survived hover, survived mark-done/re-render, correctly absent from the Archived view |
| Console errors during browser run | None from app code; one pre-existing/documented `/favicon.ico` 404 (`docs/design-notes.md` §12) — not a regression |
