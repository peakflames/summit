// Node 22+'s native experimental `localStorage` global shadows jsdom's
// working implementation (vitest's jsdom environment allowlist predates
// Node's native global), leaving `localStorage` non-functional in tests.
// Force a real Storage-compatible implementation onto globalThis.
class MemoryStorage implements Storage {
  #data = new Map<string, string>()

  get length(): number {
    return this.#data.size
  }

  clear(): void {
    this.#data.clear()
  }

  getItem(key: string): string | null {
    return this.#data.has(key) ? this.#data.get(key)! : null
  }

  key(index: number): string | null {
    return Array.from(this.#data.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.#data.delete(key)
  }

  setItem(key: string, value: string): void {
    this.#data.set(key, String(value))
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
})
