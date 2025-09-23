import React, { ReactElement } from 'react'
import {
  render as rtlRender,
  RenderOptions,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import { ConfigProvider, theme } from 'antd'
import type { SnippetData } from '../components/snippet-form'

// Custom render function with providers
// eslint-disable-next-line react-refresh/only-export-components
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): ReturnType<typeof rtlRender> =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options })

// Re-export specific functions instead of using export *
export { screen, fireEvent, waitFor }
export { customRender as render }

// Test data factories
export const createMockSnippetData = (
  overrides?: Partial<SnippetData>
): SnippetData => ({
  name: 'test-snippet',
  prefix: 'test',
  scope: ['javascript'],
  body: 'console.log("test")',
  description: 'Test snippet description',
  ...overrides,
})

export const createEmptySnippetData = (): SnippetData => ({
  name: '',
  prefix: '',
  scope: [],
  body: '',
  description: '',
})

export const createMultiLineSnippetData = (): SnippetData => ({
  name: 'multi-line-snippet',
  prefix: 'multi',
  scope: ['typescript'],
  body: 'function test() {\n  console.log("line 1");\n  console.log("line 2");\n}',
  description: 'Multi-line test snippet',
})

export const createArrayPrefixSnippetData = (): SnippetData => ({
  name: 'array-prefix-snippet',
  prefix: ['prefix1', 'prefix2', 'prefix3'],
  scope: ['javascript', 'typescript'],
  body: 'const test = "array prefix";',
  description: 'Array prefix test snippet',
})

// Wait utilities for async operations
export const waitForClipboard = () =>
  new Promise((resolve) => setTimeout(resolve, 100))
export const waitForStateUpdate = () =>
  new Promise((resolve) => setTimeout(resolve, 0))
