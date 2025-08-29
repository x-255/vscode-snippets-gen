import type { TextAreaRef } from 'antd/es/input/TextArea'
import { useRef } from 'react'

export function useTextareaInsert(setText: (text: string) => void) {
  const textRef = useRef<TextAreaRef>(null)

  const insertTextAtCursor = (text: string) => {
    const textarea = textRef.current?.resizableTextArea?.textArea
    if (!textarea) return

    const { selectionStart, selectionEnd, value } = textarea
    const newIdx = selectionStart + text.length
    const newValue = `${value.slice(0, selectionStart)}${text}${value.slice(
      selectionEnd
    )}`

    setText(newValue)
    setTimeout(() => {
      textarea.setSelectionRange(newIdx, newIdx)
      textarea.focus()
    }, 0)
  }

  return {
    textRef,
    insertTextAtCursor,
  }
}
