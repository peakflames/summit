import { EMPTY_HABIT_NAME_ERROR } from '../state/habitActions'

export type AddHabitFormHandlers = {
  onAdd: (name: string) => void
}

export function renderAddHabitForm(
  handlers: AddHabitFormHandlers,
): HTMLElement {
  const form = document.createElement('form')
  form.className = 'add-habit-form'

  const label = document.createElement('label')
  label.htmlFor = 'add-habit-input'
  label.className = 'pf-label'
  label.textContent = 'Add a habit'

  const input = document.createElement('input')
  input.type = 'text'
  input.id = 'add-habit-input'
  input.name = 'habitName'
  input.className = 'pf-input'

  const submit = document.createElement('button')
  submit.type = 'submit'
  submit.className = 'pf-btn pf-btn--primary pf-btn--md'
  submit.textContent = 'Add'

  const error = document.createElement('p')
  error.className = 'add-habit-form__error pf-error'
  error.setAttribute('role', 'alert')
  error.hidden = true

  form.append(label, input, submit, error)

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const name = input.value.trim()

    if (!name) {
      error.textContent = EMPTY_HABIT_NAME_ERROR
      error.hidden = false
      console.warn('Rejected empty habit name submission')
      return
    }

    handlers.onAdd(name)
  })

  return form
}
