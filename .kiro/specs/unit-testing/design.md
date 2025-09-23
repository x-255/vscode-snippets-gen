# 单元测试设计文档

## 概述

本设计文档描述了为 VSCode 代码段生成器项目实施全面单元测试的技术方案。该项目使用 React + TypeScript + Vite 技术栈，我们将使用 Vitest 作为测试运行器，配合 React Testing Library 进行组件测试，确保代码质量和功能稳定性。

## 架构

### 测试框架选择

- **测试运行器**: Vitest (已配置)
- **DOM 环境**: jsdom (推荐用于 React 组件测试，提供完整的 DOM API 支持)
- **组件测试**: React Testing Library + @testing-library/jest-dom
- **Mock 工具**: Vitest 内置 mocking 功能
- **覆盖率工具**: Vitest 内置覆盖率报告
- **断言库**: Vitest 内置 expect (兼容 Jest API)

**DOM 环境选择说明**:

- jsdom: 功能完整，与真实浏览器 DOM 行为最接近，适合复杂组件测试
- happy-dom: 更轻量快速，但功能相对简单
- 考虑到项目使用 Monaco 编辑器等复杂组件，选择 jsdom 确保兼容性

### 测试环境配置

```
测试环境架构:
├── 测试配置 (vitest.config.ts)
├── 测试工具设置 (test-setup.ts)
├── 组件测试 (__tests__/components/)
├── 工具函数测试 (__tests__/lib/)
├── 数据测试 (__tests__/data/)
└── 集成测试 (__tests__/integration/)
```

## 组件和接口

### 1. 测试基础设施组件

#### TestSetup 配置

- **目的**: 配置全局测试环境
- **功能**:
  - 配置 jsdom 作为 DOM 环境 (在 Node.js 中模拟浏览器 DOM API)
  - 设置 React Testing Library (用于渲染和测试 React 组件的专用库)
  - 配置 @testing-library/jest-dom (扩展 Vitest 断言，提供 DOM 相关匹配器如 toBeInTheDocument、toHaveClass 等)
  - 设置全局 mocks
  - 配置测试环境变量

**说明**:

- jsdom: 在 Node.js 环境中提供完整的 DOM API，让组件能正常渲染和交互
- React Testing Library: 提供 render、fireEvent、screen 等 API 来测试 React 组件
- @testing-library/jest-dom: 让测试断言更直观，专门用于 DOM 元素的验证

#### MockProviders

- **目的**: 提供测试所需的上下文和 providers
- **功能**:
  - ConfigProvider mock (Ant Design)
  - 剪贴板 API mock
  - Monaco Editor mock

### 2. 组件测试模块

#### SnippetForm 测试套件

- **测试文件**: `__tests__/components/snippet-form.test.tsx`
- **测试范围**:
  - 组件渲染测试
  - 用户交互测试
  - 数据变更回调测试
  - 语言切换功能测试

#### SnippetResult 测试套件

- **测试文件**: `__tests__/components/snippet-result.test.tsx`
- **测试范围**:
  - 数据格式化显示测试
  - 复制功能测试
  - 状态变更测试
  - 边界条件测试

#### App 集成测试套件

- **测试文件**: `__tests__/components/app.test.tsx`
- **测试范围**:
  - 应用初始化测试
  - 组件间数据流测试
  - 端到端用户流程测试

### 3. 工具函数测试模块

#### Monaco 配置测试

- **测试文件**: `__tests__/lib/monaco.test.ts`
- **测试范围**:
  - 编辑器配置函数测试
  - 主题设置测试
  - 语言注册测试
  - 代码补全提供器测试

#### 数据转换测试

- **测试文件**: `__tests__/lib/data-transform.test.ts`
- **测试范围**:
  - snippetData2vscodeJson 函数测试
  - 数据格式验证测试
  - 边界条件处理测试

### 4. 数据模块测试

#### 作用范围选项测试

- **测试文件**: `__tests__/data/scope-options.test.ts`
- **测试范围**:
  - 数据结构验证
  - Monaco 语言映射测试
  - 选项完整性测试

## 数据模型

### 测试数据模型

```typescript
// 测试用例数据结构
interface TestCase<T = any> {
  description: string
  input: T
  expected: any
  setup?: () => void
  cleanup?: () => void
}

// 组件测试Props
interface ComponentTestProps {
  component: React.ComponentType<any>
  props: Record<string, any>
  expectedElements: string[]
  userInteractions?: UserInteraction[]
}

// 用户交互测试
interface UserInteraction {
  action: 'click' | 'type' | 'select' | 'change'
  target: string
  value?: any
  expectedResult: any
}
```

### Mock 数据结构

```typescript
// SnippetData测试数据
const mockSnippetData: SnippetData = {
  name: 'test-snippet',
  prefix: 'test',
  scope: ['javascript'],
  body: 'console.log("test")',
  description: 'Test snippet',
}

// Monaco Editor Mock
const mockMonacoEditor = {
  getModel: vi.fn(),
  deltaDecorations: vi.fn(),
  setTheme: vi.fn(),
}
```

## 错误处理

### 测试错误处理策略

1. **组件错误边界测试**

   - 测试组件在异常情况下的行为
   - 验证错误边界的正确触发
   - 确保错误信息的正确显示

2. **异步操作错误测试**

   - 剪贴板 API 失败处理
   - Monaco 编辑器加载失败处理
   - 网络请求失败模拟

3. **数据验证错误测试**
   - 无效输入数据处理
   - 空值和 undefined 处理
   - 类型错误处理

### 错误 Mock 策略

```typescript
// 剪贴板API错误模拟
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockRejectedValue(new Error('Clipboard access denied')),
  },
})

// Monaco编辑器错误模拟
vi.mock('@monaco-editor/react', () => ({
  default: vi.fn().mockImplementation(() => {
    throw new Error('Monaco failed to load')
  }),
}))
```

## 测试策略

### 1. 单元测试策略

**组件测试**:

- 使用 React Testing Library 的 render 函数
- 通过用户事件模拟真实交互
- 验证 DOM 结构和内容
- 测试 props 传递和回调函数

**工具函数测试**:

- 纯函数测试，关注输入输出
- 边界条件和异常情况测试
- 性能关键函数的基准测试

### 2. 集成测试策略

**组件间交互测试**:

- 测试 SnippetForm 和 SnippetResult 的数据同步
- 验证用户完整操作流程
- 测试状态管理的正确性

**第三方库集成测试**:

- Monaco 编辑器集成测试
- Ant Design 组件集成测试
- 剪贴板 API 集成测试

### 3. Mock 策略

**外部依赖 Mock**:

- Monaco 编辑器完全 mock，避免复杂的 DOM 操作
- 剪贴板 API mock，确保测试环境兼容性
- Ant Design 组件选择性 mock

**数据 Mock**:

- 创建标准测试数据集
- 边界条件数据准备
- 错误场景数据模拟

### 4. 覆盖率目标

- **语句覆盖率**: ≥ 90%
- **分支覆盖率**: ≥ 85%
- **函数覆盖率**: ≥ 95%
- **行覆盖率**: ≥ 90%

### 5. 测试组织结构

```
src/
├── __tests__/
│   ├── components/
│   │   ├── snippet-form.test.tsx
│   │   ├── snippet-result.test.tsx
│   │   └── app.test.tsx
│   ├── lib/
│   │   ├── monaco.test.ts
│   │   └── data-transform.test.ts
│   ├── data/
│   │   └── scope-options.test.ts
│   ├── integration/
│   │   └── user-workflow.test.tsx
│   └── __mocks__/
│       ├── monaco-editor.ts
│       └── clipboard.ts
├── test-setup.ts
└── vitest.config.ts (更新)
```

### 6. 持续集成考虑

- 测试应该在无头环境中运行
- 所有异步操作需要适当的等待机制
- 测试应该是确定性的，避免时间依赖
- 提供清晰的测试失败信息和调试信息
