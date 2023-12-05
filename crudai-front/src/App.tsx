import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { UserTable } from './components/user-table'
import { AITerminal } from './components/ai-terminal'

function App() {

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <UserTable/>
        <AITerminal />
      </div>
    </QueryClientProvider>
  )
}

export default App
