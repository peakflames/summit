import type { Habit } from '../models/Habit'

export type HabitCardHandlers = {
  onToggleDone: (habit: Habit) => void
  onToggleArchived: (habit: Habit) => void
}

export function renderHabitCard(
  habit: Habit,
  doneToday: boolean,
  handlers: HabitCardHandlers,
): HTMLElement {
  const item = document.createElement('li')
  item.className = 'habit-card'

  const name = document.createElement('span')
  name.className = 'habit-card__name'
  name.textContent = habit.name
  item.append(name)

  const streak = document.createElement('span')
  streak.className = 'habit-card__streak'
  streak.textContent = `Streak: ${habit.streak}`
  item.append(streak)

  const doneButton = document.createElement('button')
  doneButton.type = 'button'
  doneButton.className = 'habit-card__done-btn'
  doneButton.classList.toggle('is-done', doneToday)
  doneButton.textContent = 'Done today'
  doneButton.addEventListener('click', () => handlers.onToggleDone(habit))
  item.append(doneButton)

  const archiveButton = document.createElement('button')
  archiveButton.type = 'button'
  archiveButton.className = 'habit-card__archive-btn'
  archiveButton.textContent = habit.archived ? 'Unarchive' : 'Archive'
  archiveButton.addEventListener('click', () =>
    handlers.onToggleArchived(habit),
  )
  item.append(archiveButton)

  return item
}
