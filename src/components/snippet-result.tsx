import type { SnippetData } from './snippet-form'

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

  return (
    <div className="p-4">
      <pre className="bg-gray-950 p-3">{outputData}</pre>
    </div>
  )
}
