import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaPaw } from 'react-icons/fa'
import { FiBell, FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiSettings, FiHeart, FiHome } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import './Navbar.css'

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, isAuthenticated, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifCount] = useState(0)
  const dropdownRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isEditor = user?.role === 'editor' || user?.role === 'admin'

  const userLinks = [
    { path: '/pets', label: 'Hewan', icon: <FiHome /> },
    { path: '/adoptions', label: 'Adopsi Saya', icon: <FiHeart /> },
  ]

  const editorLinks = [
    { path: '/editor', label: 'Dashboard', icon: <FiHome /> },
    { path: '/pets', label: 'Lihat Hewan', icon: <FaPaw /> },
  ]

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: <FiHome /> },
    { path: '/pets', label: 'Lihat Hewan', icon: <FaPaw /> },
  ]

  const navLinks = user?.role === 'admin' ? adminLinks : isEditor ? editorLinks : userLinks

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <nav className="navbar glass">
      <div className="navbar-inner">
        <div className="navbar-left">
          {isAuthenticated && isEditor && (
            <button className="navbar-toggle show-mobile-only" onClick={onToggleSidebar}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
          )}
          <Link to={isAuthenticated ? '/pets' : '/login'} className="navbar-brand">
            <FaPaw className="navbar-brand-icon" />
            <span className="navbar-brand-text gradient-text">Adopet</span>
          </Link>
        </div>

        {isAuthenticated && (
          <>
            <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  <span className="navbar-link-icon show-mobile-only">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="navbar-right">
              {user?.role === 'user' && (
                <Link to="/notifications" className="navbar-icon-btn">
                  <FiBell />
                  {notifCount > 0 && <span className="navbar-badge">{notifCount}</span>}
                </Link>
              )}

              <div className="navbar-user" ref={dropdownRef}>
                <button className="navbar-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="navbar-avatar">
                    {user?.photo_url ? (
                      <img src={user.photo_url} alt={user.name} />
                    ) : (
                      <span>{getInitials(user?.name)}</span>
                    )}
                  </div>
                  <span className="navbar-username hide-mobile-tablet">{user?.name}</span>
                  <FiChevronDown className={`navbar-chevron ${dropdownOpen ? 'rotated' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-header">
                      <p className="navbar-dropdown-name">{user?.name}</p>
                      <p className="navbar-dropdown-email">{user?.email}</p>
                    </div>
                    <div className="navbar-dropdown-divider" />
                    <Link to="/profile" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiUser /> Profil Saya
                    </Link>
                    {user?.role === 'admin' && (
                    <Link to="/admin" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <FiSettings /> Admin Panel
                      </Link>
                    )}
                    <div className="navbar-dropdown-divider" />
                    <button className="navbar-dropdown-item navbar-dropdown-logout" onClick={handleLogout}>
                      <FiLogOut /> Keluar
                    </button>
                  </div>
                )}
              </div>

              <button className="navbar-toggle hide-mobile-tablet show-mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </>
        )}
      </div>

      {mobileMenuOpen && <div className="navbar-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}
    </nav>
  )
}
