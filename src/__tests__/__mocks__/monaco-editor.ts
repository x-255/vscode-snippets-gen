import { vi } from 'vitest'

// 这个文件提供可控的 Monaco Editor Mock 工具
// 用于需要特殊 Monaco Editor 行为的测试

// 定义编辑器 Mock 的类型
interface MockEditor {
  getModel: ReturnType<typeof vi.fn>
  deltaDecorations: ReturnType<typeof vi.fn>
  setTheme: ReturnType<typeof vi.fn>
  getValue: ReturnType<typeof vi.fn>
  setValue: ReturnType<typeof vi.fn>
  focus: ReturnType<typeof vi.fn>
  dispose: ReturnType<typeof vi.fn>
}

// 创建默认的编辑器 Mock
const createDefaultEditor = (): MockEditor => ({
  getModel: vi.fn().mockReturnValue({
    getAllDecorations: vi.fn().mockReturnValue([]),
  }),
  deltaDecorations: vi.fn(),
  setTheme: vi.fn(),
  getValue: vi.fn().mockReturnValue(''),
  setValue: vi.fn(),
  focus: vi.fn(),
  dispose: vi.fn(),
})

// 创建可自定义的编辑器 Mock
export const createMockEditor = (
  customBehavior?: Partial<MockEditor>
): MockEditor => {
  const defaultEditor = createDefaultEditor()
  return { ...defaultEditor, ...customBehavior }
}

// 默认的编辑器 Mock 实例
export const mockEditor = createDefaultEditor()

// 用于测试编辑器内容变化的工具函数
export const simulateEditorChange = (newValue: string) => {
  mockEditor.getValue.mockReturnValue(newValue)
}

// 用于测试编辑器错误的工具函数
export const simulateEditorError = (errorMessage: string) => {
  mockEditor.getValue.mockImplementation(() => {
    throw new Error(errorMessage)
  })
}

// 重置所有 Mock 状态
export const resetEditorMocks = () => {
  vi.clearAllMocks()
  mockEditor.getValue.mockReturnValue('')
}
