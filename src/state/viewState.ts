import type { Habit } from '../models/Habit'

export type FilterView = 'active' | 'archived'

export function createViewState(): {
  getView(): FilterView
  setView(view: FilterView): void
} {
  let view: FilterView = 'active'
  return {
    getView: () => view,
    setView: (next) => {
      view = next
    },
  }
}

export function filterHabits(habits: Habit[], view: FilterView): Habit[] {
  return habits.filter((habit) =>
    view === 'archived' ? habit.archived : !habit.archived,
  )
}
