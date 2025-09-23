import { describe, it, expect } from 'vitest'
import { snippetData2vscodeJson } from '../../lib/data-transform'
import {
  createMockSnippetData,
  createEmptySnippetData,
  createMultiLineSnippetData,
  createArrayPrefixSnippetData,
} from '../test-utils'

describe('snippetData2vscodeJson', () => {
  it('should correctly convert basic SnippetData to VSCode JSON format', () => {
    const input = createMockSnippetData()
    const result = snippetData2vscodeJson(input)

    expect(result).toEqual({
      'test-snippet': {
        prefix: 'test',
        scope: 'javascript',
        body: ['console.log("test")'],
        description: 'Test snippet description',
      },
    })
  })

  it('should handle multi-line code by splitting into array', () => {
    const input = createMultiLineSnippetData()
    const result = snippetData2vscodeJson(input)

    expect(result).toEqual({
      'multi-line-snippet': {
        prefix: 'multi',
        scope: 'typescript',
        body: [
          'function test() {',
          '  console.log("line 1");',
          '  console.log("line 2");',
          '}',
        ],
        description: 'Multi-line test snippet',
      },
    })
  })

  it('should preserve array format for prefix when input is array', () => {
    const input = createArrayPrefixSnippetData()
    const result = snippetData2vscodeJson(input)

    expect(result).toEqual({
      'array-prefix-snippet': {
        prefix: ['prefix1', 'prefix2', 'prefix3'],
        scope: 'javascript,typescript',
        body: ['const test = "array prefix";'],
        description: 'Array prefix test snippet',
      },
    })
  })

  it('should preserve string format for prefix when input is string', () => {
    const input = createMockSnippetData({ prefix: 'single-prefix' })
    const result = snippetData2vscodeJson(input)

    expect(result['test-snippet'].prefix).toBe('single-prefix')
  })

  it('should generate empty scope string when scope array is empty', () => {
    const input = createMockSnippetData({ scope: [] })
    const result = snippetData2vscodeJson(input)

    expect(result['test-snippet'].scope).toBe('')
  })

  it('should use name as description when description is empty', () => {
    const input = createMockSnippetData({ description: '' })
    const result = snippetData2vscodeJson(input)

    expect(result['test-snippet'].description).toBe('test-snippet')
  })

  it('should handle empty data gracefully', () => {
    const input = createEmptySnippetData()
    const result = snippetData2vscodeJson(input)

    expect(result).toEqual({
      '': {
        prefix: '',
        scope: '',
        body: [''],
        description: '',
      },
    })
  })

  it('should handle different line ending formats', () => {
    const testCases = [
      { body: 'line1\nline2', expected: ['line1', 'line2'] },
      { body: 'line1\r\nline2', expected: ['line1', 'line2'] },
      { body: 'line1\rline2', expected: ['line1', 'line2'] },
      { body: 'line1\n\nline2', expected: ['line1', '', 'line2'] },
    ]

    testCases.forEach(({ body, expected }) => {
      const input = createMockSnippetData({ body })
      const result = snippetData2vscodeJson(input)
      expect(result['test-snippet'].body).toEqual(expected)
    })
  })

  it('should handle special characters in snippet name', () => {
    const input = createMockSnippetData({
      name: 'test-snippet-with-special-chars_123',
    })
    const result = snippetData2vscodeJson(input)

    expect(result).toHaveProperty('test-snippet-with-special-chars_123')
  })

  it('should handle multiple scopes correctly', () => {
    const input = createMockSnippetData({
      scope: ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
    })
    const result = snippetData2vscodeJson(input)

    expect(result['test-snippet'].scope).toBe(
      'javascript,typescript,javascriptreact,typescriptreact'
    )
  })

  it('should handle empty body string', () => {
    const input = createMockSnippetData({ body: '' })
    const result = snippetData2vscodeJson(input)

    expect(result['test-snippet'].body).toEqual([''])
  })

  it('should handle body with only whitespace', () => {
    const input = createMockSnippetData({ body: '   \n   \n   ' })
    const result = snippetData2vscodeJson(input)

    expect(result['test-snippet'].body).toEqual(['   ', '   ', '   '])
  })
})
