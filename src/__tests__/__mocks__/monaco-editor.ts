import { vi, type MockedFunction } from 'vitest'

// Mock Monaco Editor
export const mockEditor: {
  getModel: MockedFunction<
    () => { getAllDecorations: MockedFunction<() => unknown[]> }
  >
  deltaDecorations: MockedFunction<() => void>
  setTheme: MockedFunction<() => void>
  getValue: MockedFunction<() => string>
  setValue: MockedFunction<() => void>
  focus: MockedFunction<() => void>
  dispose: MockedFunction<() => void>
} = {
  getModel: vi.fn().mockReturnValue({
    getAllDecorations: vi.fn().mockReturnValue([]),
  }),
  deltaDecorations: vi.fn(),
  setTheme: vi.fn(),
  getValue: vi.fn().mockReturnValue(''),
  setValue: vi.fn(),
  focus: vi.fn(),
  dispose: vi.fn(),
}

export const mockMonaco: {
  editor: {
    create: MockedFunction<() => typeof mockEditor>
    setTheme: MockedFunction<() => void>
    defineTheme: MockedFunction<() => void>
    getThemes: MockedFunction<() => unknown[]>
  }
  languages: {
    typescript: {
      typescriptDefaults: {
        setDiagnosticsOptions: MockedFunction<() => void>
        setCompilerOptions: MockedFunction<() => void>
      }
      javascriptDefaults: {
        setDiagnosticsOptions: MockedFunction<() => void>
        setCompilerOptions: MockedFunction<() => void>
      }
      JsxEmit: { React: number }
      ScriptTarget: { ES2020: number }
      ModuleKind: { ESNext: number }
    }
    setTokensProvider: MockedFunction<() => void>
    registerCompletionItemProvider: MockedFunction<() => void>
    CompletionItemKind: {
      Snippet: number
      Variable: number
      Function: number
    }
  }
} = {
  editor: {
    create: vi.fn().mockReturnValue(mockEditor),
    setTheme: vi.fn(),
    defineTheme: vi.fn(),
    getThemes: vi.fn().mockReturnValue([]),
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
      JsxEmit: {
        React: 1,
      },
      ScriptTarget: {
        ES2020: 7,
      },
      ModuleKind: {
        ESNext: 99,
      },
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

// Mock @monaco-editor/react
const mockMonacoEditor: MockedFunction<
  (props: {
    onChange?: (value: string) => void
    onMount?: (editor: typeof mockEditor, monaco: typeof mockMonaco) => void
    beforeMount?: (monaco: typeof mockMonaco) => void
    value?: string
  }) => { type: string; props: { 'data-testid': string; className: string } }
> = vi.fn().mockImplementation(({ onMount, beforeMount }) => {
  // Simulate editor mount
  if (beforeMount) {
    beforeMount(mockMonaco)
  }
  if (onMount) {
    onMount(mockEditor, mockMonaco)
  }

  return {
    type: 'div',
    props: {
      'data-testid': 'monaco-editor',
      className: 'monaco-editor',
    },
  }
})

export default mockMonacoEditor
