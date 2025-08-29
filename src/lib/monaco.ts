import type { BeforeMount, Monaco, OnMount } from '@monaco-editor/react'
import { scopeOptions } from '../data/scope-options'

export const handleEditWillMount: BeforeMount = (monaco) => {
  setDiagnosticsOptions(monaco)
  setCompilerOptions(monaco)
  setSuggestions(monaco)
}

export const handleEditorDidMount: OnMount = (editor) => {
  // 清除现有的所有错误标记
  const model = editor.getModel()
  if (model) {
    editor.deltaDecorations(
      editor
        .getModel()
        ?.getAllDecorations()
        .map((d) => d.id) || [],
      []
    )
  }
}

function setDiagnosticsOptions(monaco: Monaco) {
  const diaOpts = {
    noSemanticValidation: false,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: true,
  }
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(diaOpts)
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(diaOpts)
}

function setCompilerOptions(monaco: Monaco) {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowJs: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    module: monaco.languages.typescript.ModuleKind.ESNext,
  })
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.React,
  })
}

function setSuggestions(monaco: Monaco) {
  const registeredLang = new Set<string>()
  scopeOptions
    .filter((o) => o.monacoCode !== 'plaintext')
    .forEach((o) => {
      const lang = o.monacoCode ?? o.value
      if (registeredLang.has(lang)) return
      registeredLang.add(lang)

      monaco.languages.registerCompletionItemProvider(lang, {
        triggerCharacters: ['$'],
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn - 1,
            endColumn: word.endColumn,
          }

          const suggestions = [
            {
              label: '$1',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '$1',
              detail: '第一个占位符位置', // 使用 detail 而不是 documentation
              range: range,
            },
            {
              label: '$2',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '$2',
              detail: '第二个占位符位置',
              range: range,
            },
            {
              label: '$0',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '$0',
              detail: '最终光标位置',
              range: range,
            },
            {
              label: '${1:placeholder}',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '${1:placeholder}',
              detail: '带默认值的占位符',
              range: range,
            },
            {
              label: '${1|one,two,three|}',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '${1|one,two,three|}',
              detail: '带选项的占位符',
              range: range,
            },
            {
              label: '$TM_SELECTED_TEXT',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$TM_SELECTED_TEXT',
              detail: '当前选中的文本',
              range: range,
            },
            {
              label: '$TM_CURRENT_LINE',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$TM_CURRENT_LINE',
              detail: '当前行的内容',
              range: range,
            },
            {
              label: '$TM_CURRENT_WORD',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$TM_CURRENT_WORD',
              detail: '当前单词',
              range: range,
            },
            {
              label: '$TM_LINE_INDEX',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$TM_LINE_INDEX',
              detail: '行号（从0开始）',
              range: range,
            },
            {
              label: '$TM_LINE_NUMBER',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$TM_LINE_NUMBER',
              detail: '行号（从1开始）',
              range: range,
            },
            {
              label: '$TM_FILENAME',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$TM_FILENAME',
              detail: '当前文件名',
              range: range,
            },
            {
              label: '$TM_FILENAME_BASE',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$TM_FILENAME_BASE',
              detail: '当前文件名（不含扩展名）',
              range: range,
            },
            {
              label: '$TM_DIRECTORY',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$TM_DIRECTORY',
              detail: '当前文件的目录名',
              range: range,
            },
            {
              label: '$TM_FILEPATH',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$TM_FILEPATH',
              detail: '当前文件的完整路径',
              range: range,
            },
            {
              label: '$CLIPBOARD',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$CLIPBOARD',
              detail: '剪贴板内容',
              range: range,
            },
            {
              label: '$WORKSPACE_NAME',
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: '$WORKSPACE_NAME',
              detail: '工作区名称',
              range: range,
            },
          ]

          return { suggestions }
        },
      })
    })
}
