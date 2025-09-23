import { describe, it, expect } from 'vitest'
import { scopeOptions } from '../../data/scope-options'

describe('scopeOptions', () => {
  it('should have valid data structure for all options', () => {
    scopeOptions.forEach((option) => {
      expect(option).toHaveProperty('label')
      expect(option).toHaveProperty('value')
      expect(typeof option.label).toBe('string')
      expect(typeof option.value).toBe('string')
      expect(option.label.length).toBeGreaterThan(0)
      expect(option.value.length).toBeGreaterThan(0)
    })
  })

  it('should have unique values for all options', () => {
    const values = scopeOptions.map((option) => option.value)
    const uniqueValues = new Set(values)
    expect(uniqueValues.size).toBe(values.length)
  })

  it('should have unique labels for all options', () => {
    const labels = scopeOptions.map((option) => option.label)
    const uniqueLabels = new Set(labels)
    expect(uniqueLabels.size).toBe(labels.length)
  })

  it('should contain expected common programming languages', () => {
    const values = scopeOptions.map((option) => option.value)
    const expectedLanguages = [
      'javascript',
      'typescript',
      'python',
      'java',
      'cpp',
      'csharp',
      'html',
      'css',
      'json',
      'markdown',
      'sql',
      'go',
      'rust',
      'php',
    ]

    expectedLanguages.forEach((lang) => {
      expect(values).toContain(lang)
    })
  })

  it('should have correct Monaco language code mappings', () => {
    const optionsWithMonacoCode = scopeOptions.filter(
      (option) => option.monacoCode
    )

    optionsWithMonacoCode.forEach((option) => {
      expect(typeof option.monacoCode).toBe('string')
      expect(option.monacoCode!.length).toBeGreaterThan(0)
    })

    // Test specific mappings
    const bibtexOption = scopeOptions.find(
      (option) => option.value === 'bibtex'
    )
    expect(bibtexOption?.monacoCode).toBe('plaintext')

    const dockerComposeOption = scopeOptions.find(
      (option) => option.value === 'dockercompose'
    )
    expect(dockerComposeOption?.monacoCode).toBe('dockerfile')

    const jsxOption = scopeOptions.find(
      (option) => option.value === 'javascriptreact'
    )
    expect(jsxOption?.monacoCode).toBe('javascript')

    const tsxOption = scopeOptions.find(
      (option) => option.value === 'typescriptreact'
    )
    expect(tsxOption?.monacoCode).toBe('typescript')
  })

  it('should have options without monacoCode use value as language', () => {
    const optionsWithoutMonacoCode = scopeOptions.filter(
      (option) => !option.monacoCode
    )

    // These should use their value directly as Monaco language
    const directMappings = [
      'javascript',
      'typescript',
      'python',
      'java',
      'html',
      'css',
    ]

    directMappings.forEach((lang) => {
      const option = optionsWithoutMonacoCode.find((opt) => opt.value === lang)
      expect(option).toBeDefined()
      expect(option?.monacoCode).toBeUndefined()
    })
  })

  it('should handle special language cases correctly', () => {
    // Test Pug (formerly Jade)
    const pugOption = scopeOptions.find(
      (option) => option.value === 'jade, pug'
    )
    expect(pugOption?.monacoCode).toBe('pug')

    // Test Shell Script
    const shellOption = scopeOptions.find(
      (option) => option.value === 'shellscript'
    )
    expect(shellOption?.monacoCode).toBe('shell')

    // Test Vue HTML
    const vueHtmlOption = scopeOptions.find(
      (option) => option.value === 'vue-html'
    )
    expect(vueHtmlOption?.monacoCode).toBe('html')
  })

  it('should have reasonable number of language options', () => {
    expect(scopeOptions.length).toBeGreaterThan(50)
    expect(scopeOptions.length).toBeLessThan(100)
  })

  it('should have consistent label formatting', () => {
    scopeOptions.forEach((option) => {
      // Labels should not be empty or just whitespace
      expect(option.label.trim()).toBe(option.label)
      expect(option.label.length).toBeGreaterThan(0)
    })
  })

  it('should have consistent value formatting', () => {
    scopeOptions.forEach((option) => {
      // Values should not contain spaces (except for special cases like "jade, pug")
      if (option.value !== 'jade, pug') {
        expect(option.value).not.toMatch(/\s/)
      }
      // Values should be lowercase
      expect(option.value).toBe(option.value.toLowerCase())
    })
  })

  it('should include React-specific language options', () => {
    const reactLanguages = scopeOptions.filter(
      (option) => option.value.includes('react') || option.label.includes('JSX')
    )

    expect(reactLanguages.length).toBeGreaterThanOrEqual(2)

    const jsxOption = scopeOptions.find(
      (option) => option.value === 'javascriptreact'
    )
    const tsxOption = scopeOptions.find(
      (option) => option.value === 'typescriptreact'
    )

    expect(jsxOption).toBeDefined()
    expect(tsxOption).toBeDefined()
    expect(jsxOption?.label).toContain('JSX')
    expect(tsxOption?.label).toContain('JSX')
  })
})
