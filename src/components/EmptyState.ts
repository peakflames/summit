export function renderEmptyState(view: 'active' | 'archived'): HTMLElement {
  const empty = document.createElement('p')
  empty.className = 'empty-state'
  empty.textContent =
    view === 'active'
      ? 'No habits yet. Add your first habit above to start your streak.'
      : 'No archived habits yet. Habits you archive will appear here.'
  return empty
}
