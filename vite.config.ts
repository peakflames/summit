import { readFileSync } from 'node:fs'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
)

// Injects scripts/seed-demo-data.js as a head-prepended inline script so it runs before
// src/main.ts mounts the app, pre-populating localStorage for `npm run demo`.
function demoSeedPlugin(): Plugin {
  const seedScript = readFileSync(
    new URL('./scripts/seed-demo-data.js', import.meta.url),
    'utf-8',
  )
  return {
    name: 'demo-seed',
    transformIndexHtml() {
      return [{ tag: 'script', injectTo: 'head-prepend', children: seedScript }]
    },
  }
}

export default defineConfig(({ mode }) => ({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: mode === 'demo' ? [demoSeedPlugin()] : [],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
}))
