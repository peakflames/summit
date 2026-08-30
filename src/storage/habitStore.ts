import type { Habit } from '../models/Habit'

export const STORAGE_KEY = 'summit.habits'

function isHabit(value: unknown): value is Habit {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.streak === 'number' &&
    (typeof candidate.lastCompletedDate === 'string' ||
      candidate.lastCompletedDate === null) &&
    typeof candidate.archived === 'boolean'
  )
}

export function loadHabits(): Habit[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }

  if (!Array.isArray(parsed) || !parsed.every(isHabit)) return []

  return parsed
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
}
