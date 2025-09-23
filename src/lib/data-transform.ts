import type { SnippetData } from '../components/snippet-form'

export function snippetData2vscodeJson(data: SnippetData) {
  const { name, body, prefix, scope, description } = data
  return {
    [name]: {
      prefix,
      scope: scope.join(','),
      body: body.split(/\r?\n|\r/g),
      description: description || name,
    },
  }
}
