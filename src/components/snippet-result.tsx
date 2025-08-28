import { Button } from 'antd'
import type { SnippetData } from './snippet-form'
import { CheckOutlined } from '@ant-design/icons'
import { useState } from 'react'

interface SnippetResultProps {
  data: SnippetData
}

function snippetData2vscodeJson(data: SnippetData) {
  const { name, body, prefix, scope, description } = data
  return {
    [name]: {
      prefix,
      scope,
      body: body.split('\n'),
      description: description || name,
    },
  }
}

export default function SnippetResult({ data }: SnippetResultProps) {
  const formattedData = snippetData2vscodeJson(data)
  const outputData = JSON.stringify(formattedData, null, 2)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="p-4">
      <Button
        onClick={handleCopy}
        icon={copied ? <CheckOutlined /> : null}
        iconPosition="end"
      >
        {copied ? '已复制' : '复制'}
      </Button>
      <pre className="bg-gray-950 p-3 mt-3 overflow-x-auto">{outputData}</pre>
    </div>
  )
}
