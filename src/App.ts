import { renderAddHabitForm } from './components/AddHabitForm'
import { renderFilterToggle } from './components/FilterToggle'
import { renderFooter } from './components/Footer'
import { renderHabitList } from './components/HabitList'
import { renderStreakHint } from './components/StreakHint'
import type { Habit } from './models/Habit'
import {
  addHabit,
  archiveHabit,
  markDone,
  unarchiveHabit,
} from './state/habitActions'
import { createViewState } from './state/viewState'
import { loadHabits, saveHabits } from './storage/habitStore'
import {
  isDoneToday,
  recalculateAll,
  todayISO,
} from './storage/streakRecalculation'

let habits: Habit[] = []
let viewState = createViewState()

export function mountApp(root: HTMLElement): void {
  habits = recalculateAll(loadHabits(), todayISO())
  saveHabits(habits)
  viewState = createViewState()
  render(root)
}

function render(root: HTMLElement): void {
  root.replaceChildren()

  const main = document.createElement('main')
  main.className = 'app-shell'

  const title = document.createElement('h1')
  title.textContent = 'Summit'
  main.append(title)

  main.append(
    renderAddHabitForm({
      onAdd: (name) => {
        addHabit(habits, name)
        render(root)
      },
    }),
  )

  main.append(
    renderFilterToggle(viewState.getView(), (view) => {
      viewState.setView(view)
      render(root)
    }),
  )

  if (viewState.getView() === 'active') {
    main.append(renderStreakHint())
  }

  const today = todayISO()
  main.append(
    renderHabitList(
      habits,
      viewState.getView(),
      (habit) => isDoneToday(habit, today),
      {
        onMarkDone: (target) => {
          markDone(habits, target, today)
          render(root)
        },
        onArchive: (target) => {
          archiveHabit(habits, target)
          render(root)
        },
        onUnarchive: (target) => {
          unarchiveHabit(habits, target)
          render(root)
        },
      },
    ),
  )

  main.append(renderFooter())

  root.append(main)
}
