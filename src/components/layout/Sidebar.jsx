import { NavLink } from 'react-router-dom'
import { FiGrid, FiHeart, FiUsers, FiActivity, FiChevronLeft } from 'react-icons/fi'
import { FaPaw } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import './Sidebar.css'

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const editorLinks = [
    { path: '/editor', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/pets', label: 'Kelola Hewan', icon: <FaPaw /> },
    { path: '/editor/pets/new', label: 'Tambah Hewan', icon: <FaPaw /> },
    { path: '/editor/adoptions', label: 'Permintaan Adopsi', icon: <FiHeart /> },
  ]

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/pets', label: 'Kelola Hewan', icon: <FaPaw /> },
    { path: '/editor/pets/new', label: 'Tambah Hewan', icon: <FaPaw /> },
    { path: '/editor/adoptions', label: 'Permintaan Adopsi', icon: <FiHeart /> },
    { path: '/admin/users', label: 'Kelola Pengguna', icon: <FiUsers /> },
    { path: '/admin/active-users', label: 'Pengguna Aktif', icon: <FiActivity /> },
  ]

  const links = isAdmin ? adminLinks : editorLinks

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Menu</span>
          <button className="sidebar-close show-mobile-only" onClick={onClose}>
            <FiChevronLeft />
          </button>
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              <span className="sidebar-link-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">Adopet v1.0</p>
        </div>
      </aside>
    </>
  )
}
