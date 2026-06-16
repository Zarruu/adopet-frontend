import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import './Layout.css'

export default function Layout() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isEditor = user?.role === 'editor' || user?.role === 'admin'

  return (
    <div className="layout">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="layout-body">
        {isEditor && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <main className={`layout-content ${isEditor ? 'with-sidebar' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
