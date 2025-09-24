import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  render,
  createMockSnippetData,
  createEmptySnippetData,
  createMultiLineSnippetData,
  createArrayPrefixSnippetData,
} from '../test-utils'
import { setupClipboardMock, setupClipboardError } from '../__mocks__/clipboard'
import SnippetResult from '../../components/snippet-result'

describe('SnippetResult', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    // 使用统一的剪贴板 Mock 设置
    setupClipboardMock()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should render copy button and formatted JSON output', () => {
    const data = createMockSnippetData()
    render(<SnippetResult data={data} />)

    expect(screen.getByRole('button', { name: /复.*制/i })).toBeInTheDocument()
    expect(screen.getByText(/"test-snippet":/)).toBeInTheDocument()
  })

  it('should display correctly formatted VSCode snippet JSON', () => {
    const data = createMockSnippetData()
    render(<SnippetResult data={data} />)

    // Check for key parts of the JSON structure
    expect(screen.getByText(/"test-snippet":/)).toBeInTheDocument()
    expect(screen.getByText(/"prefix": "test"/)).toBeInTheDocument()
    expect(screen.getByText(/"scope": "javascript"/)).toBeInTheDocument()
    expect(
      screen.getByText(/"description": "Test snippet description"/)
    ).toBeInTheDocument()
  })

  it('should handle multi-line body correctly', () => {
    const data = createMultiLineSnippetData()
    render(<SnippetResult data={data} />)

    // Should show array format for multi-line body
    expect(screen.getByText(/"body": \[/)).toBeInTheDocument()
    expect(screen.getByText(/"function test\(\) \{"/)).toBeInTheDocument()
  })

  it('should handle array prefix correctly', () => {
    const data = createArrayPrefixSnippetData()
    render(<SnippetResult data={data} />)

    // Should show array format for prefix
    expect(screen.getByText(/"prefix": \[/)).toBeInTheDocument()
    expect(screen.getByText(/"prefix1"/)).toBeInTheDocument()
    expect(screen.getByText(/"prefix2"/)).toBeInTheDocument()
  })

  it('should handle empty data gracefully', () => {
    const data = createEmptySnippetData()
    render(<SnippetResult data={data} />)

    // Should still render without errors
    expect(screen.getByRole('button', { name: /复.*制/i })).toBeInTheDocument()
    expect(screen.getByText(/"": \{/)).toBeInTheDocument()
  })

  it('should copy formatted JSON to clipboard when copy button is clicked', async () => {
    const data = createMockSnippetData()
    render(<SnippetResult data={data} />)

    const copyButton = screen.getByRole('button', { name: /复.*制/i })
    await user.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
    })

    const expectedJson = `"test-snippet": {
    "prefix": "test",
    "scope": "javascript",
    "body": [
      "console.log(\\"test\\")"
    ],
    "description": "Test snippet description"
  }`

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedJson)
  })

  it('should show "已复制" state after successful copy', async () => {
    const data = createMockSnippetData()
    render(<SnippetResult data={data} />)

    const copyButton = screen.getByRole('button', { name: /复.*制/i })
    await user.click(copyButton)

    // Wait for the copy operation to complete and state to change
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /已复制/i })
      ).toBeInTheDocument()
    })
  })

  it('should handle clipboard write failure gracefully', async () => {
    // 使用统一的剪贴板错误 Mock
    setupClipboardError('Clipboard access denied')

    const data = createMockSnippetData()
    render(<SnippetResult data={data} />)

    const copyButton = screen.getByRole('button', { name: /复.*制/i })

    // Click the button
    await user.click(copyButton)

    // Wait a bit for any async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should not show "已复制" state on failure
    expect(screen.getByRole('button', { name: /复.*制/i })).toBeInTheDocument()
  })

  it('should use snippet name as description when description is empty', () => {
    const data = createMockSnippetData({ description: '' })
    render(<SnippetResult data={data} />)

    expect(
      screen.getByText(/"description": "test-snippet"/)
    ).toBeInTheDocument()
  })

  it('should handle multiple scopes correctly', () => {
    const data = createMockSnippetData({
      scope: ['javascript', 'typescript', 'javascriptreact'],
    })
    render(<SnippetResult data={data} />)

    expect(
      screen.getByText(/"scope": "javascript,typescript,javascriptreact"/)
    ).toBeInTheDocument()
  })

  it('should handle empty scope array', () => {
    const data = createMockSnippetData({ scope: [] })
    render(<SnippetResult data={data} />)

    expect(screen.getByText(/"scope": ""/)).toBeInTheDocument()
  })

  it('should update output when data changes', () => {
    const initialData = createMockSnippetData()
    const { rerender } = render(<SnippetResult data={initialData} />)

    expect(screen.getByText(/"test-snippet":/)).toBeInTheDocument()

    const updatedData = createMockSnippetData({ name: 'updated-snippet' })
    rerender(<SnippetResult data={updatedData} />)

    expect(screen.getByText(/"updated-snippet":/)).toBeInTheDocument()
    expect(screen.queryByText(/"test-snippet":/)).not.toBeInTheDocument()
  })
})
