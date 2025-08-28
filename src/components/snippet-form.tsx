import { Input, Select } from 'antd'
import { scopeOptions } from '../data/scope-options'
import TextArea from 'antd/es/input/TextArea'

export interface SnippetData {
  name: string
  prefix: string | string[]
  scope: string
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
        onChange={(value) => handleInputChange('scope', value.join(','))}
        options={scopeOptions}
      />
      <Input
        placeholder="描述"
        onChange={(e) => handleInputChange('description', e.target.value)}
      />
      <TextArea
        autoSize={{
          minRows: 6,
          maxRows: 12,
        }}
        value={data.body}
        placeholder="代码段(body)"
        onChange={(e) => handleInputChange('body', e.target.value)}
      />
    </div>
  )
}
