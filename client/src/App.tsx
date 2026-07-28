import { Outlet } from 'react-router'
import AppBar from './components/AppBar'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppBar isLoggedIn={true} />

      <main className="max-w-7xl w-full mx-auto flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default App
