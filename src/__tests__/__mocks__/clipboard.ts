import { vi, type MockedFunction } from 'vitest'

export const mockClipboard: {
  writeText: MockedFunction<(text: string) => Promise<void>>
  readText: MockedFunction<() => Promise<string>>
} = {
  writeText: vi.fn().mockResolvedValue(undefined),
  readText: vi.fn().mockResolvedValue(''),
}

export const setupClipboardMock = () => {
  Object.defineProperty(navigator, 'clipboard', {
    value: mockClipboard,
    writable: true,
  })
}

export const setupClipboardError = (
  errorMessage = 'Clipboard access denied'
) => {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockRejectedValue(new Error(errorMessage)),
      readText: vi.fn().mockRejectedValue(new Error(errorMessage)),
    },
    writable: true,
  })
}
