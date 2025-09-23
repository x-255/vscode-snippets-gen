# VSCode 代码段生成器

一个用于生成 VSCode 代码段配置的 React 应用程序。

## 功能特性

- 🎯 直观的表单界面，轻松创建代码段
- 🎨 Monaco 编辑器支持，提供语法高亮
- 📋 一键复制生成的 VSCode 代码段配置
- 🌍 支持多种编程语言作用范围
- ⚡ 实时预览生成的 JSON 格式

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 测试

项目使用 Vitest 和 React Testing Library 进行测试。

### 运行测试

```bash
# 运行所有测试
pnpm test

# 监视模式
pnpm vitest

# 生成覆盖率报告
pnpm coverage
```

### 测试覆盖率

当前测试覆盖了：

- ✅ 数据转换函数 (100% 覆盖率)
- ✅ 作用范围配置数据 (100% 覆盖率)
- ✅ 核心业务逻辑测试

详细的测试指南请参考 [docs/testing-guide.md](docs/testing-guide.md)。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI 组件**: Ant Design
- **代码编辑器**: Monaco Editor
- **样式**: Tailwind CSS
- **测试**: Vitest + React Testing Library

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
