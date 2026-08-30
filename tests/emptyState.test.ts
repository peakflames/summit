import { describe, expect, it, beforeEach } from 'vitest'
import { mountApp } from '../src/App'

describe('empty states', () => {
  let root: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    root = document.createElement('div')
    document.body.append(root)
    mountApp(root)
  })

  it('active empty state shows guidance and the add-habit input', () => {
    expect(root.textContent).toContain('No habits yet.')

    const input = root.querySelector('input[type="text"]')
    const submit = root.querySelector('button[type="submit"]')
    expect(input).not.toBeNull()
    expect(submit).not.toBeNull()
  })

  it('archived empty state shows guidance', () => {
    const archivedButton = Array.from(root.querySelectorAll('button')).find(
      (button) => button.textContent === 'Archived',
    )
    archivedButton?.click()

    expect(root.textContent).toContain('No archived habits yet.')
  })
})
