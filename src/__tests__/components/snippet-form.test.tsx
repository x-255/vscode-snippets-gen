import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  render,
  createMockSnippetData,
  createEmptySnippetData,
} from '../test-utils'
import SnippetForm from '../../components/snippet-form'

describe('SnippetForm', () => {
  const mockOnChange = vi.fn()
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup user-event after clearing mocks to avoid clipboard conflicts
    user = userEvent.setup()
  })

  it('should render all input fields correctly', () => {
    const data = createEmptySnippetData()
    render(<SnippetForm data={data} onChange={mockOnChange} />)

    // Check for all input fields
    expect(screen.getByPlaceholderText('片段名')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('触发词（多个用逗号分隔）')
    ).toBeInTheDocument()
    expect(
      screen.getByText('作用范围语言（为空表示所有语言）')
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('描述')).toBeInTheDocument()
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })

  it('should display initial data correctly', () => {
    const data = createMockSnippetData()
    render(<SnippetForm data={data} onChange={mockOnChange} />)

    expect(screen.getByDisplayValue('test-snippet')).toBeInTheDocument()
    expect(screen.getByDisplayValue('test')).toBeInTheDocument()
    expect(
      screen.getByDisplayValue('Test snippet description')
    ).toBeInTheDocument()
  })

  it('should call onChange when snippet name is updated', async () => {
    const data = createEmptySnippetData()
    render(<SnippetForm data={data} onChange={mockOnChange} />)

    const nameInput = screen.getByPlaceholderText('片段名')
    await user.clear(nameInput)
    await user.paste('new-snippet')

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...data,
        name: 'new-snippet',
      })
    })
  })

  it('should call onChange when prefix is updated with single value', async () => {
    const data = createEmptySnippetData()
    render(<SnippetForm data={data} onChange={mockOnChange} />)

    const prefixInput = screen.getByPlaceholderText('触发词（多个用逗号分隔）')
    await user.clear(prefixInput)
    await user.paste('single-prefix')

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...data,
        prefix: 'single-prefix',
      })
    })
  })

  it('should convert comma-separated prefix to array', async () => {
    const data = createEmptySnippetData()
    render(<SnippetForm data={data} onChange={mockOnChange} />)

    const prefixInput = screen.getByPlaceholderText('触发词（多个用逗号分隔）')
    await user.clear(prefixInput)
    await user.paste('prefix1, prefix2, prefix3')

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...data,
        prefix: ['prefix1', 'prefix2', 'prefix3'],
      })
    })
  })

  it('should handle prefix with extra spaces correctly', async () => {
    const data = createEmptySnippetData()
    render(<SnippetForm data={data} onChange={mockOnChange} />)

    const prefixInput = screen.getByPlaceholderText('触发词（多个用逗号分隔）')
    await user.clear(prefixInput)
    await user.paste(' prefix1 ,  prefix2  , prefix3 ')

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...data,
        prefix: ['prefix1', 'prefix2', 'prefix3'],
      })
    })
  })

  it('should call onChange when description is updated', async () => {
    const data = createEmptySnippetData()
    render(<SnippetForm data={data} onChange={mockOnChange} />)

    const descriptionInput = screen.getByPlaceholderText('描述')
    await user.clear(descriptionInput)
    await user.paste('New description')

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...data,
        description: 'New description',
      })
    })
  })

  it('should preserve existing data when updating single field', async () => {
    const data = createMockSnippetData()
    render(<SnippetForm data={data} onChange={mockOnChange} />)

    const nameInput = screen.getByDisplayValue('test-snippet')
    await user.tripleClick(nameInput)
    await user.paste('updated-snippet')

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...data,
        name: 'updated-snippet',
      })
    })
  })

  it('should handle empty scope array correctly', () => {
    const data = createMockSnippetData({ scope: [] })
    render(<SnippetForm data={data} onChange={mockOnChange} />)

    // Should render without errors
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })
})
