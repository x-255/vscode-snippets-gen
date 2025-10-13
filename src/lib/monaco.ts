import { BeforeMount, Monaco, OnMount, loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { scopeOptions } from '../data/scope-options'

loader.config({ monaco })

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

  // 在编辑器初始化后应用主题
  monaco.editor.setTheme('snippetCustomTheme')
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

      // 为每种语言注册代码片段语法高亮
      registerSnippetHighlighting(monaco, lang)

      monaco.languages.registerCompletionItemProvider(lang, {
        triggerCharacters: ['$'],
        provideCompletionItems: (model, position) => {
          // 检查触发字符是否为 $
          const lineContent = model.getLineContent(position.lineNumber)
          const charBeforePosition =
            position.column > 1 ? lineContent.charAt(position.column - 2) : null

          // 只有当前一个字符是 $ 时才提供补全
          if (charBeforePosition === '$') {
            // 创建一个正确的范围，只包含触发字符 $
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column - 1, // $ 的位置
              endColumn: position.column, // 当前光标位置
            }

            const suggestions = [
              {
                label: '$1',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: '$1',
                detail: '第一个占位符位置',
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
              {
                label: '${1:/pascalcase}',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: '${1:/pascalcase}',
                detail: '将文本转换为大驼峰',
                range: range,
              },
              {
                label: '${1:/camelcase}',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: '${1:/camelcase}',
                detail: '将文本转换为小驼峰',
                range: range,
              },
              {
                label: '${1:/upcase}',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: '${1:/upcase}',
                detail: '将文本转换为大写',
                range: range,
              },
              {
                label: '${1:/downcase}',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: '${1:/downcase}',
                detail: '将文本转换为小写',
                range: range,
              },
              {
                label: 'capitalize',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: '${1:/capitalize}',
                detail: '将文本转换为首字母大写',
                range: range,
              },
            ]

            // 更新每个建议项的范围
            suggestions.forEach((suggestion) => {
              suggestion.range = range
            })

            return { suggestions }
          }

          return { suggestions: [] }
        },
      })
    })
}

// 在文件顶部添加一个标志变量
let isSnippetThemeDefined = false

function registerSnippetHighlighting(monaco: Monaco, language: string) {
  // 注册自定义标记提供器
  monaco.languages.setTokensProvider(language, {
    getInitialState: () => new SnippetState(),
    tokenize: (line, state) => {
      return tokenizeSnippetSyntax(line, state as SnippetState)
    },
  })

  // 使用标志变量而不是getThemes()
  if (!isSnippetThemeDefined) {
    // 只定义一次主题
    monaco.editor.defineTheme('snippetCustomTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'snippet.tabstop', foreground: 'ff0000', fontStyle: 'bold' }, // 红色
        {
          token: 'snippet.placeholder',
          foreground: '00ff00',
          fontStyle: 'italic',
        }, // 绿色
        { token: 'snippet.choice', foreground: '0000ff' }, // 蓝色
        { token: 'snippet.variable', foreground: 'ffff00' }, // 黄色
        { token: 'snippet.transform', foreground: 'ff00ff' }, // 紫色
      ],
      colors: {},
    })

    // 设置标志为true，表示主题已定义
    isSnippetThemeDefined = true
  }

  // 应用主题（确保在编辑器初始化后）
  monaco.editor.setTheme('snippetCustomTheme')
}

// 片段语法标记状态
class SnippetState implements monaco.languages.IState {
  constructor() {
    /* 初始状态 */
  }
  clone() {
    return new SnippetState()
  }

  public equals(other: monaco.languages.IState): boolean {
    // 如果是同一个对象，肯定相等
    if (this === other) {
      return true
    }

    // 确保 other 也是 SnippetState 类型
    if (!(other instanceof SnippetState)) {
      return false
    }

    // 比较两个状态的相关属性
    // 示例 (根据你的 SnippetState 类实际结构调整):
    // return this.inSnippet === (other as SnippetState).inSnippet;

    // 如果没有需要比较的状态属性，可以简单返回 true
    return true
  }
}

// 片段语法标记化函数
// 修改片段语法标记化函数
function tokenizeSnippetSyntax(line: string, state: SnippetState) {
  // 创建所有匹配项的列表，记录开始索引、长度和类型
  const allMatches: { index: number; length: number; scope: string }[] = []

  // 收集所有匹配
  collectMatches(line, /\$\d+/g, 'snippet.tabstop', allMatches) // $1, $2, $0
  collectMatches(
    line,
    /\$\{\d+:([^}|/]+)\}/g, // 斜杠不需要转义
    'snippet.placeholder',
    allMatches
  ) // ${1:placeholder}
  collectMatches(line, /\$\{\d+\|[^}]+\|}/g, 'snippet.choice', allMatches) // ${1|one,two,three|}
  collectMatches(line, /\$[A-Z_]+/g, 'snippet.variable', allMatches) // $TM_FILENAME 等
  collectMatches(
    line,
    /\$\{\d+:?[^}]*\/[a-z]+\}/g, // 这里的斜杠需要转义，但会有警告
    'snippet.transform',
    allMatches
  ) // ${1:/pascalcase} 等

  // 按开始位置排序
  allMatches.sort((a, b) => a.index - b.index)

  // 创建最终的标记数组
  const tokens: { startIndex: number; scopes: string }[] = []
  let lastEndIndex = 0

  // 处理每一个匹配项
  for (const match of allMatches) {
    // 如果匹配项之前有未标记的文本，添加默认标记
    if (match.index > lastEndIndex) {
      tokens.push({
        startIndex: lastEndIndex,
        scopes: 'text',
      })
    }

    // 添加匹配项的标记
    tokens.push({
      startIndex: match.index,
      scopes: match.scope,
    })

    lastEndIndex = match.index + match.length
  }

  // 处理最后一部分未标记的文本
  if (lastEndIndex < line.length) {
    tokens.push({
      startIndex: lastEndIndex,
      scopes: 'text',
    })
  }

  // 如果没有任何标记，添加默认标记
  if (tokens.length === 0) {
    tokens.push({
      startIndex: 0,
      scopes: 'text',
    })
  }

  return { tokens, endState: state }
}

// 辅助函数：收集所有匹配项
function collectMatches(
  line: string,
  regex: RegExp,
  scope: string,
  matches: { index: number; length: number; scope: string }[]
) {
  let match
  // 重置正则表达式以确保从头开始匹配
  regex.lastIndex = 0

  while ((match = regex.exec(line)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      scope: scope,
    })
  }
}
