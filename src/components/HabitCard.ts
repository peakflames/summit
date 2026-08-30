import type { Habit } from '../models/Habit'
import { renderStreakBadge } from './StreakBadge'

export type HabitCardHandlers = {
  onMarkDone: (habit: Habit) => void
  onArchive: (habit: Habit) => void
  onUnarchive: (habit: Habit) => void
}

export function renderHabitCard(
  habit: Habit,
  doneToday: boolean,
  handlers: HabitCardHandlers,
): HTMLElement {
  const item = document.createElement('li')
  item.className = 'habit-card pf-card'

  const name = document.createElement('span')
  name.className = 'habit-card__name'
  name.textContent = habit.name
  item.append(name)

  item.append(renderStreakBadge(habit))

  const doneButton = document.createElement('button')
  doneButton.type = 'button'
  doneButton.className =
    'habit-card__done-btn pf-btn pf-btn--secondary pf-btn--md'
  doneButton.classList.toggle('is-done', doneToday)
  if (doneToday) {
    doneButton.disabled = true
    doneButton.textContent = 'Done ✓'
    doneButton.setAttribute('aria-label', `${habit.name} is done today`)
  } else {
    doneButton.textContent = 'Done today'
    doneButton.setAttribute('aria-label', `Mark ${habit.name} done today`)
  }
  doneButton.addEventListener('click', () => handlers.onMarkDone(habit))
  item.append(doneButton)

  const archiveButton = document.createElement('button')
  archiveButton.type = 'button'
  archiveButton.className =
    'habit-card__archive-btn pf-btn pf-btn--secondary pf-btn--md'
  archiveButton.textContent = habit.archived ? 'Unarchive' : 'Archive'
  archiveButton.setAttribute(
    'aria-label',
    `${habit.archived ? 'Unarchive' : 'Archive'} ${habit.name}`,
  )
  archiveButton.addEventListener('click', () =>
    habit.archived ? handlers.onUnarchive(habit) : handlers.onArchive(habit),
  )
  item.append(archiveButton)

  return item
}
