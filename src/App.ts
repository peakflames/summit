import { renderFooter } from './components/Footer'
import { renderEmptyState } from './components/EmptyState'
import { renderHabitCard } from './components/HabitCard'
import type { Habit } from './models/Habit'
import { loadHabits, saveHabits } from './storage/habitStore'
import {
  isDoneToday,
  recalculateAll,
  todayISO,
} from './storage/streakRecalculation'

let habits: Habit[] = []
let filter: 'active' | 'archived' = 'active'

export function mountApp(root: HTMLElement): void {
  habits = recalculateAll(loadHabits(), todayISO())
  saveHabits(habits)
  filter = 'active'
  render(root)
}

function render(root: HTMLElement): void {
  root.replaceChildren()

  const main = document.createElement('main')
  main.className = 'app-shell'

  const title = document.createElement('h1')
  title.textContent = 'Summit'
  main.append(title)

  main.append(renderAddHabitForm(root))
  main.append(renderFilterControl(root))
  main.append(renderHabitList(root))
  main.append(renderFooter())

  root.append(main)
}

function renderAddHabitForm(root: HTMLElement): HTMLElement {
  const form = document.createElement('form')
  form.className = 'add-habit-form'

  const label = document.createElement('label')
  label.htmlFor = 'add-habit-input'
  label.textContent = 'Add a habit'

  const input = document.createElement('input')
  input.type = 'text'
  input.id = 'add-habit-input'
  input.name = 'habitName'

  const submit = document.createElement('button')
  submit.type = 'submit'
  submit.textContent = 'Add'

  form.append(label, input, submit)

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const name = input.value.trim()
    if (!name) return
    habits.push({ name, streak: 0, lastCompletedDate: null, archived: false })
    saveHabits(habits)
    render(root)
  })

  return form
}

function renderFilterControl(root: HTMLElement): HTMLElement {
  const nav = document.createElement('div')
  nav.className = 'filter-control'

  const activeButton = document.createElement('button')
  activeButton.type = 'button'
  activeButton.textContent = 'Active'
  activeButton.classList.toggle('is-selected', filter === 'active')
  activeButton.addEventListener('click', () => {
    filter = 'active'
    render(root)
  })

  const archivedButton = document.createElement('button')
  archivedButton.type = 'button'
  archivedButton.textContent = 'Archived'
  archivedButton.classList.toggle('is-selected', filter === 'archived')
  archivedButton.addEventListener('click', () => {
    filter = 'archived'
    render(root)
  })

  nav.append(activeButton, archivedButton)
  return nav
}

function renderHabitList(root: HTMLElement): HTMLElement {
  const filtered = habits.filter((habit) =>
    filter === 'archived' ? habit.archived : !habit.archived,
  )

  if (filtered.length === 0) {
    return renderEmptyState(filter)
  }

  const today = todayISO()
  const list = document.createElement('ul')
  list.className = 'habit-list'

  for (const habit of filtered) {
    list.append(
      renderHabitCard(habit, isDoneToday(habit, today), {
        onToggleDone: (target) => {
          target.lastCompletedDate = isDoneToday(target, today) ? null : today
          saveHabits(habits)
          render(root)
        },
        onToggleArchived: (target) => {
          target.archived = !target.archived
          saveHabits(habits)
          render(root)
        },
      }),
    )
  }

  return list
}
