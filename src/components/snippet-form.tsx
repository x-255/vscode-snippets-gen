import Editor from '@monaco-editor/react'
import { Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { scopeOptions } from '../data/scope-options'
import { handleEditorDidMount, handleEditWillMount } from '../lib/monaco'

export interface SnippetData {
  name: string
  prefix: string | string[]
  scope: string[]
  body: string
  description: string
}

interface SnippetFormProps {
  data: SnippetData
  onChange: (data: SnippetData) => void
}

export default function SnippetForm({ data, onChange }: SnippetFormProps) {
  const handleInputChange = (
    field: keyof SnippetData,
    value: string | string[]
  ) => {
    onChange({
      ...data,
      [field]: value,
    })
  }
  const [language, setLanguage] = useState('plaintext')

  useEffect(() => {
    const scope = data.scope
    if (scope.length === 0) {
      setLanguage('plaintext')
      return
    }

    const lang = scopeOptions.find((item) => item.value === scope[0])
    if (lang) {
      setLanguage(lang.monacoCode ?? lang.value)
    }
  }, [data.scope])

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Input
          placeholder="片段名"
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <Input
          placeholder="触发词（多个用逗号分隔）"
          onChange={(e) => {
            if (e.target.value.includes(',')) {
              handleInputChange(
                'prefix',
                e.target.value.split(',').map((item) => item.trim())
              )
            } else {
              handleInputChange('prefix', e.target.value)
            }
          }}
        />
      </div>
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="作用范围语言（为空表示所有语言）"
        onChange={(value) => handleInputChange('scope', value)}
        options={scopeOptions}
      />
      <Input
        placeholder="描述"
        onChange={(e) => handleInputChange('description', e.target.value)}
      />
      <Editor
        height="300px"
        theme="snippetCustomTheme"
        language={language}
        value={data.body}
        onChange={(value) => handleInputChange('body', value ?? '')}
        onMount={handleEditorDidMount}
        beforeMount={handleEditWillMount}
      />
    </div>
  )
}
