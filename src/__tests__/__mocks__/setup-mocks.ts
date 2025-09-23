import React from 'react'
import { vi } from 'vitest'

// Mock @monaco-editor/react
vi.mock('@monaco-editor/react', () => {
  return {
    default: vi
      .fn()
      .mockImplementation(({ onChange, onMount, beforeMount, value }) => {
        const mockEditor = {
          getModel: vi.fn().mockReturnValue({
            getAllDecorations: vi.fn().mockReturnValue([]),
          }),
          deltaDecorations: vi.fn(),
          setTheme: vi.fn(),
          getValue: vi.fn().mockReturnValue(value || ''),
          setValue: vi.fn(),
          focus: vi.fn(),
          dispose: vi.fn(),
        }

        const mockMonaco = {
          editor: {
            create: vi.fn().mockReturnValue(mockEditor),
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
        }

        // Simulate lifecycle calls
        if (beforeMount) {
          beforeMount(mockMonaco)
        }
        if (onMount) {
          onMount(mockEditor, mockMonaco)
        }

        return React.createElement('div', {
          'data-testid': 'monaco-editor',
          className: 'monaco-editor',
          onChange: onChange ? () => onChange(value || '') : undefined,
        })
      }),
  }
})

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
    },
  },
}))

// Mock Ant Design components that might cause issues in tests
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    // Keep most components as-is, but mock problematic ones if needed
  }
})
