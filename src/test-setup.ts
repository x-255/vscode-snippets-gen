import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock monaco-editor
vi.mock('monaco-editor', () => ({
  editor: {
    setTheme: vi.fn(),
    defineTheme: vi.fn(),
  },
  languages: {
    typescript: {
      typescriptDefaults: {
        setDiagnosticsOptions: vi.fn(),
        setCompilerOptions: vi.fn(),
      },
      javascriptDefaults: {
        setDiagnosticsOptions: vi.fn(),
        setCompilerOptions: vi.fn(),
      },
      JsxEmit: { React: 1 },
      ScriptTarget: { ES2020: 7 },
      ModuleKind: { ESNext: 99 },
    },
    setTokensProvider: vi.fn(),
    registerCompletionItemProvider: vi.fn(),
    CompletionItemKind: {
      Snippet: 27,
      Variable: 6,
      Function: 3,
    },
  },
}))

// Mock @monaco-editor/react
vi.mock('@monaco-editor/react', () => ({
  default: vi
    .fn()
    .mockImplementation(({ onChange, onMount, beforeMount, value }) => {
      const mockEditor = {
        getModel: vi.fn().mockReturnValue({
          getAllDecorations: vi.fn().mockReturnValue([]),
        }),
        deltaDecorations: vi.fn(),
      }

      const mockMonaco = {
        editor: { setTheme: vi.fn(), defineTheme: vi.fn() },
        languages: {
          typescript: {
            typescriptDefaults: {
              setDiagnosticsOptions: vi.fn(),
              setCompilerOptions: vi.fn(),
            },
            javascriptDefaults: {
              setDiagnosticsOptions: vi.fn(),
              setCompilerOptions: vi.fn(),
            },
            JsxEmit: { React: 1 },
            ScriptTarget: { ES2020: 7 },
            ModuleKind: { ESNext: 99 },
          },
          setTokensProvider: vi.fn(),
          registerCompletionItemProvider: vi.fn(),
        },
      }

      // Simulate lifecycle calls
      if (beforeMount) beforeMount(mockMonaco)
      if (onMount) onMount(mockEditor, mockMonaco)

      return React.createElement('div', {
        'data-testid': 'monaco-editor',
        className: 'monaco-editor',
        onClick: () => onChange && onChange(value || ''),
      })
    }),
}))

// Mock navigator.clipboard - 使用 __mocks__/clipboard.ts 中的设置
// 这里不再重复定义，让各个测试文件自己控制剪贴板行为

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
Object.defineProperty(globalThis, 'ResizeObserver', {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
  writable: true,
})

// Mock IntersectionObserver
Object.defineProperty(globalThis, 'IntersectionObserver', {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
  writable: true,
})

// Suppress console warnings in tests
const originalConsoleWarn = console.warn
console.warn = (...args: unknown[]) => {
  // Suppress specific warnings that are expected in test environment
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React Router') ||
      args[0].includes('Warning: ReactDOM.render'))
  ) {
    return
  }
  originalConsoleWarn(...args)
}
