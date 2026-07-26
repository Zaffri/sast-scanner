import { Outlet } from 'react-router'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-8">
          <span className="text-xl font-bold text-gray-900">SAST Scan</span>

          <nav>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Uploads</a>
          </nav>
        </div>

        <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors">
          Logout
        </button>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}

export default App
