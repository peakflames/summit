import type { FilterView } from '../state/viewState'

export function renderFilterToggle(
  view: FilterView,
  onSelect: (view: FilterView) => void,
): HTMLElement {
  const nav = document.createElement('div')
  nav.className = 'filter-control'

  const activeButton = document.createElement('button')
  activeButton.type = 'button'
  activeButton.textContent = 'Active'
  activeButton.classList.toggle('is-selected', view === 'active')
  activeButton.setAttribute('aria-pressed', String(view === 'active'))
  activeButton.addEventListener('click', () => onSelect('active'))

  const archivedButton = document.createElement('button')
  archivedButton.type = 'button'
  archivedButton.textContent = 'Archived'
  archivedButton.classList.toggle('is-selected', view === 'archived')
  archivedButton.setAttribute('aria-pressed', String(view === 'archived'))
  archivedButton.addEventListener('click', () => onSelect('archived'))

  nav.append(activeButton, archivedButton)
  return nav
}
