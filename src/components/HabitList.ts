import type { Habit } from '../models/Habit'
import type { FilterView } from '../state/viewState'
import { filterHabits } from '../state/viewState'
import { renderEmptyState } from './EmptyState'
import { renderHabitCard } from './HabitCard'
import type { HabitCardHandlers } from './HabitCard'

export function renderHabitList(
  habits: Habit[],
  view: FilterView,
  isDoneToday: (habit: Habit) => boolean,
  handlers: HabitCardHandlers,
): HTMLElement {
  const filtered = filterHabits(habits, view)

  if (filtered.length === 0) {
    return renderEmptyState(view)
  }

  const list = document.createElement('ul')
  list.className = 'habit-list'

  for (const habit of filtered) {
    list.append(renderHabitCard(habit, isDoneToday(habit), handlers))
  }

  return list
}
