# Epic e3mj8uq — Streak Continuation Hint — Implemented

## What Was Built

Added a static, always-visible hint (`renderStreakHint()` in `StreakBadge.ts`) to every habit
card, explaining that marking done tomorrow continues the streak and a missed day resets it to
1. The hint is rendered unconditionally as the last child of each card and given
`flex-basis: 100%` so it wraps onto its own full-width line beneath the existing card row,
using the card's already-`display: flex; flex-wrap: wrap` layout. No popup, tooltip, or
dismissal behavior was added — the function takes no parameters, attaches no event listeners,
and sets no `title` or `hidden` attribute.

## Key Files

| File | Purpose |
|---|---|
| `src/components/StreakBadge.ts` | Added `renderStreakHint()` — returns a `<p class="habit-card__streak-hint">` with fixed copy, no params, no listeners |
| `src/components/HabitCard.ts` | Imports `renderStreakHint`; appends it as the last child of every card, unconditionally |
| `src/styles/main.css` | Added `.habit-card__streak-hint` rule (`flex-basis: 100%`, `margin: 0`, 0.75rem, muted color) after `.habit-card__streak-label` |
| `tests/dailyCheckinStreaks.test.ts` | Added two tests, one per TOR |

## Spec Deviations

| TOR ID | As-Written | As-Implemented | Reason |
|---|---|---|---|
| — | — | — | No deviations. Both TORs implemented exactly as specified in the epic spec's Given/When/Then. |

## TOR Coverage

- **TOR-03-2OgotAa** (static hint near streak count explaining continuation/reset) —
  **PASS**. Test: `tests/dailyCheckinStreaks.test.ts:207-232` — seeds two habits (one done
  today with streak 5, one never-done with streak 0), mounts the app, and asserts
  immediately (zero clicks or synthetic events) that every `.habit-card` contains a
  `.habit-card__streak-hint` whose `textContent` matches `/continue|resets/i` and that each
  card also has a `.habit-card__streak-value` sibling. Impl: `src/components/StreakBadge.ts:24-30`
  (`renderStreakHint`, fixed copy "Continue tomorrow to keep this streak — a missed day resets
  it to 1.") wired unconditionally at `src/components/HabitCard.ts:53` (`item.append(renderStreakHint())`
  as the last statement before `return item`, with no surrounding conditional). Browser
  verification: added "Drink water" via the UI — the hint paragraph rendered on first paint
  with no interaction (snapshot ref `e31`: `paragraph: Continue tomorrow to keep this streak —
  a missed day resets it to 1.`).
- **TOR-03-MvP98PX** (always-visible static text, not a dismissible popup/toast/hover overlay)
  — **PASS**. Test: `tests/dailyCheckinStreaks.test.ts:236-277` — asserts the hint has no
  `hidden` or `title` attribute, dispatches `mouseover`/`mouseout`/`click` on both the hint and
  the card as a negative control and confirms the text and absence of `hidden` are unchanged,
  then triggers a real re-render via the done button and confirms the hint (new DOM node)
  still carries identical text and no `hidden` attribute. Impl: `src/components/StreakBadge.ts:24-30`
  — `renderStreakHint()` registers zero event listeners and sets no `title`/`hidden` attribute,
  so there is no dismiss/hover code path to trigger. Browser verification: hovered the hint
  paragraph, then clicked "Done today" — the hint (snapshot ref `e50`) rendered unchanged after
  the re-render; switching to the Archived view (after archiving the habit) showed the hint
  again unchanged (snapshot ref `e80`) — present on every card regardless of view or state.

## Verification Results

| Gate | Result |
|---|---|
| `npm run lint` (eslint + prettier --check) | PASS (pre-existing `CONTRIBUTING.md` formatting warning, unrelated to this epic) |
| `npm run build` (tsc --noEmit + vite build) | PASS |
| `npm test` (vitest run) | PASS — 34/34 tests, 7 files (32 existing + 2 new) |
| Browser verification | PASS — driven with `playwright-cli` against `npm run dev`: hint present on first paint with no interaction, survived hover, survived mark-done, present in Archived view |
| Console errors during browser run | None from app code; one pre-existing/documented `/favicon.ico` 404 (`docs/design-notes.md` §12) — not a regression |
