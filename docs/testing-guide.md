# 测试指南

## 概述

本项目使用 Vitest 作为测试框架，配合 React Testing Library 进行组件测试。测试覆盖了数据转换函数、作用范围配置和核心业务逻辑。

## 测试结构

```
src/
├── __tests__/
│   ├── components/          # 组件测试
│   ├── lib/                # 工具函数测试
│   ├── data/               # 数据模块测试
│   ├── __mocks__/          # Mock 文件
│   └── test-utils.tsx      # 测试工具函数
├── test-setup.ts           # 全局测试配置
└── vitest.config.ts        # Vitest 配置
```

## 运行测试

### 基本命令

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm vitest run src/__tests__/lib/data-transform.test.ts

# 监视模式（开发时使用）
pnpm vitest

# 生成覆盖率报告
pnpm coverage
```

### 测试模式

- **单次运行**: `pnpm vitest run` - 运行所有测试一次
- **监视模式**: `pnpm vitest` - 监视文件变化并自动重新运行测试
- **覆盖率模式**: `pnpm coverage` - 生成详细的覆盖率报告

## 测试分类

### 1. 数据转换测试 (`src/__tests__/lib/data-transform.test.ts`)

测试 `snippetData2vscodeJson` 函数的各种场景：

- 基本数据转换
- 多行代码处理
- 不同前缀格式（字符串/数组）
- 边界条件和错误处理

### 2. 作用范围数据测试 (`src/__tests__/data/scope-options.test.ts`)

验证编程语言配置数据：

- 数据结构完整性
- Monaco 编辑器语言映射
- 常见编程语言覆盖

### 3. 组件测试 (`src/__tests__/components/`)

测试 React 组件的渲染和交互：

- 组件正确渲染
- 用户交互处理
- 数据流和状态管理

## 测试工具和 Mock

### 测试工具函数 (`src/__tests__/test-utils.tsx`)

提供常用的测试数据工厂函数：

- `createMockSnippetData()` - 创建标准测试数据
- `createEmptySnippetData()` - 创建空数据
- `createMultiLineSnippetData()` - 创建多行代码数据
- `createArrayPrefixSnippetData()` - 创建数组前缀数据

### Mock 配置

项目中的 Mock 配置：

- **Monaco 编辑器**: 完全模拟，避免复杂的 DOM 操作
- **剪贴板 API**: 模拟浏览器剪贴板功能
- **Ant Design**: 使用真实组件，确保 UI 测试准确性

## 覆盖率目标

当前覆盖率目标：

- **语句覆盖率**: ≥ 75%
- **分支覆盖率**: ≥ 70%
- **函数覆盖率**: ≥ 80%
- **行覆盖率**: ≥ 75%

核心模块更高标准：

- **数据模块**: 100% 覆盖率
- **数据转换函数**: 100% 覆盖率

## 编写新测试

### 1. 测试文件命名

- 测试文件应与被测试文件同名，添加 `.test.ts` 或 `.test.tsx` 后缀
- 放置在 `src/__tests__/` 对应的子目录中

### 2. 测试结构模板

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { YourComponent } from '../path/to/component'

describe('YourComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    const mockCallback = vi.fn()
    render(<YourComponent onAction={mockCallback} />)

    // 模拟用户操作
    // 验证结果
  })
})
```

### 3. 最佳实践

- **描述性测试名称**: 使用 "should..." 格式描述测试预期
- **单一职责**: 每个测试只验证一个功能点
- **独立性**: 测试之间不应相互依赖
- **清理**: 在 `beforeEach` 中清理 mock 和状态

## 调试测试

### 1. 查看测试输出

```bash
# 详细输出模式
pnpm vitest --reporter=verbose

# 显示控制台日志
pnpm vitest --reporter=verbose --no-coverage
```

### 2. 调试特定测试

```bash
# 只运行匹配的测试
pnpm vitest run -t "should handle multi-line"

# 运行特定文件
pnpm vitest run data-transform.test.ts
```

### 3. 常见问题

**Monaco 编辑器相关错误**:

- 确保在 `test-setup.ts` 中正确配置了 Monaco mock
- 检查 `vite.config.ts` 中的别名配置

**剪贴板 API 错误**:

- 使用项目中已配置的剪贴板 mock
- 避免重复定义 `navigator.clipboard`

**组件渲染错误**:

- 确保使用 `test-utils.tsx` 中的自定义 render 函数
- 检查是否需要额外的 provider 包装

## CI/CD 集成

### GitHub Actions 示例

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm coverage
```

## 性能优化

### 测试运行优化

- 使用 `--run` 参数进行单次运行
- 利用 `--changed` 只运行变更相关的测试
- 配置合适的 `testTimeout` 避免长时间等待

### Mock 优化

- 尽量使用轻量级 mock
- 避免过度 mock，保持测试的真实性
- 合理使用 `vi.hoisted()` 提升 mock 性能

## 维护指南

### 定期维护任务

1. **更新测试依赖**: 定期更新 Vitest 和相关测试库
2. **覆盖率检查**: 监控覆盖率变化，确保不低于目标值
3. **测试清理**: 删除过时的测试，重构重复的测试逻辑
4. **性能监控**: 关注测试运行时间，优化慢速测试

### 添加新功能时

1. **先写测试**: 采用 TDD 方法，先编写测试用例
2. **更新覆盖率**: 确保新功能有足够的测试覆盖
3. **文档更新**: 更新相关的测试文档和示例

### 重构时的注意事项

1. **保持测试通过**: 重构过程中确保所有测试继续通过
2. **更新测试**: 如果 API 发生变化，相应更新测试用例
3. **验证覆盖率**: 重构后验证覆盖率没有下降
