import { ConfigProvider, Splitter, theme } from 'antd'
import SnippetForm, { type SnippetData } from './components/snippet-form'
import { useState } from 'react'
import SnippetResult from './components/snippet-result'

function App() {
  const [snippetData, setSnippetData] = useState<SnippetData>({
    name: '',
    prefix: '',
    scope: '',
    body: '',
    description: '',
  })

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div className="container mx-auto h-screen">
        <Splitter className="shadow-xl">
          <Splitter.Panel defaultSize="50%" min="20%" max="70%">
            <SnippetForm data={snippetData} onChange={setSnippetData} />
          </Splitter.Panel>
          <Splitter.Panel>
            <SnippetResult data={snippetData} />
          </Splitter.Panel>
        </Splitter>
      </div>
    </ConfigProvider>
  )
}

export default App
