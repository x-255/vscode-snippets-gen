/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    alias: {
      'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api.js',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        'src/__tests__/**',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'src/main.tsx', // Entry point, hard to test
        'src/lib/monaco.ts', // Complex Monaco integration, mocked in tests
      ],
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        global: {
          branches: 70,
          functions: 80,
          lines: 75,
          statements: 75,
        },
        'src/data/': {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
        'src/lib/data-transform.ts': {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    },
  },
})
