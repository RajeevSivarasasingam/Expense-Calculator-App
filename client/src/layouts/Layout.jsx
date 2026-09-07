import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Wallet, 
  PieChart, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut,
  Moon,
  Sun
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Budgets', href: '/budgets', icon: Wallet },
    { name: 'Analytics', href: '/analytics', icon: PieChart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary-600">SpendWise</h1>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expense Tracker</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center ${isDarkMode ? 'bg-primary-900/30' : ''}`}>
                <span className={`font-semibold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{user?.name}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-red-900/30 hover:text-red-400' 
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
