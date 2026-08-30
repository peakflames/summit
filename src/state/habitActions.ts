import type { Habit } from '../models/Habit'
import { saveHabits } from '../storage/habitStore'

export const EMPTY_HABIT_NAME_ERROR =
  'Habit name cannot be empty. Enter a name to add this habit.'

export function addHabit(habits: Habit[], name: string): Habit[] {
  habits.push({ name, streak: 0, lastCompletedDate: null, archived: false })
  saveHabits(habits)
  return habits
}

export function archiveHabit(habits: Habit[], target: Habit): void {
  target.archived = true
  saveHabits(habits)
}

export function unarchiveHabit(habits: Habit[], target: Habit): void {
  target.archived = false
  saveHabits(habits)
}
