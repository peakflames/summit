export function renderStreakHint(): HTMLElement {
  const hint = document.createElement('p')
  hint.className = 'streak-hint'
  hint.textContent =
    'Mark done tomorrow to continue a streak — a missed day resets it to 1.'
  return hint
}
