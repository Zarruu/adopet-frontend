import { useState, useEffect } from 'react'
import { FaBell, FaCheck, FaTimes, FaCheckCircle } from 'react-icons/fa'
import API from '../../api/axios'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './UserPages.css'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/notifications')
        if (res.data.success) setNotifications(res.data.data || [])
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetch()
  }, [])

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch { /* ignore */ }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifikasi</h1>
          <p className="page-subtitle">Pemberitahuan status adopsi Anda</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <FaBell className="empty-state-icon" />
          <h3 className="empty-state-title">Belum ada notifikasi</h3>
          <p className="empty-state-desc">Notifikasi akan muncul saat permohonan adopsi Anda diproses</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map(n => (
            <div key={n.id}
              className={`notification-item glass-card ${!n.is_read ? 'unread' : ''}`}
              onClick={() => !n.is_read && markAsRead(n.id)}>
              <div className={`notification-icon ${n.type}`}>
                {n.type === 'approved' ? <FaCheck /> : n.type === 'rejected' ? <FaTimes /> : <FaBell />}
              </div>
              <div className="notification-content">
                <div className="notification-header-row">
                  <h4>{n.title}</h4>
                  {!n.is_read && <span className="unread-dot" />}
                </div>
                <p className="text-sm text-secondary">{n.message}</p>
                {n.pet_name && <span className="text-xs text-primary">🐾 {n.pet_name}</span>}
                <span className="text-xs text-muted mt-1">{formatDate(n.created_at)}</span>
              </div>
              {!n.is_read && (
                <button className="btn btn-ghost btn-sm" title="Tandai sudah dibaca">
                  <FaCheckCircle />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
