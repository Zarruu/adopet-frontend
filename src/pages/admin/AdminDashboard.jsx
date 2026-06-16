import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaPaw, FaHeart, FaWifi, FaUserPlus, FaClipboardList, FaCog } from 'react-icons/fa'
import API from '../../api/axios'
import StatsCard from '../../components/admin/StatsCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './AdminPages.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_pets: 0, total_adoptions: 0, active_sessions: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/admin/dashboard')
        if (res.data.success) setStats(res.data.data)
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Admin</h1>
          <p className="page-subtitle">Pantau dan kelola seluruh platform Adopet</p>
        </div>
      </div>

      <div className="admin-stats-grid mb-8">
        <StatsCard icon={<FaUsers />} label="Total Pengguna" value={stats.total_users} color="info" />
        <StatsCard icon={<FaPaw />} label="Total Hewan" value={stats.total_pets} color="primary" />
        <StatsCard icon={<FaHeart />} label="Total Adopsi" value={stats.total_adoptions} color="accent" />
        <StatsCard icon={<FaWifi />} label="Pengguna Aktif" value={stats.active_sessions} color="success" />
      </div>

      <div className="section">
        <h2 className="section-title"><FaCog /> Menu Admin</h2>
        <div className="admin-menu-grid">
          <Link to="/admin/users" className="admin-menu-card glass-card">
            <div className="admin-menu-icon" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--color-info)' }}>
              <FaUsers />
            </div>
            <div>
              <h3>Kelola Pengguna</h3>
              <p className="text-sm text-secondary">Tambah, edit, atau hapus pengguna dan editor</p>
            </div>
          </Link>
          <Link to="/admin/active-users" className="admin-menu-card glass-card">
            <div className="admin-menu-icon" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--color-success)' }}>
              <FaWifi />
            </div>
            <div>
              <h3>Pengguna Aktif</h3>
              <p className="text-sm text-secondary">Monitor pengguna yang sedang online</p>
            </div>
          </Link>
          <Link to="/editor/pets/new" className="admin-menu-card glass-card">
            <div className="admin-menu-icon" style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--color-primary)' }}>
              <FaUserPlus />
            </div>
            <div>
              <h3>Tambah Hewan</h3>
              <p className="text-sm text-secondary">Tambahkan hewan baru ke katalog</p>
            </div>
          </Link>
          <Link to="/editor/adoptions" className="admin-menu-card glass-card">
            <div className="admin-menu-icon" style={{ background: 'rgba(234,179,8,0.15)', color: 'var(--color-warning)' }}>
              <FaClipboardList />
            </div>
            <div>
              <h3>Kelola Adopsi</h3>
              <p className="text-sm text-secondary">Setujui atau tolak permohonan adopsi</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
