import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { renderFooter } from '../src/components/Footer'

describe('footer displays name and version matching package.json', () => {
  it('matches the semantic version pattern and equals package.json', () => {
    const footer = renderFooter()
    const text = footer.textContent ?? ''

    const match = text.match(/^Summit v(\d+\.\d+\.\d+)$/)
    expect(match).not.toBeNull()

    const pkg = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'),
    )
    expect(match?.[1]).toBe(pkg.version)
  })
})
