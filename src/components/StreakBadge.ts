import type { Habit } from '../models/Habit'

export function renderStreakBadge(habit: Habit): HTMLElement {
  const wrapper = document.createElement('span')
  wrapper.className = 'habit-card__streak'
  wrapper.setAttribute(
    'aria-label',
    `Streak: ${habit.streak} day${habit.streak === 1 ? '' : 's'}`,
  )

  const value = document.createElement('span')
  value.className = 'habit-card__streak-value'
  value.textContent = String(habit.streak)
  wrapper.append(value)

  const label = document.createElement('span')
  label.className = 'habit-card__streak-label'
  label.textContent = 'day streak'
  wrapper.append(label)

  return wrapper
}
