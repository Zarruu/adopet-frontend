import { FaCircle } from 'react-icons/fa'
import Badge from '../common/Badge'
import './ActiveUsers.css'

export default function ActiveUsers({ users = [] }) {
  const formatTime = (d) => d ? new Date(d).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : '-'

  if (users.length === 0) {
    return <div className="empty-state"><p className="text-secondary">Tidak ada pengguna aktif saat ini.</p></div>
  }

  return (
    <div className="active-users-list">
      {users.map((u, i) => (
        <div key={u.user_id || i} className="active-user-item glass-card">
          <div className="active-user-info">
            <div className="active-user-avatar">
              {u.name?.charAt(0).toUpperCase() || '?'}
              <FaCircle className="online-dot" />
            </div>
            <div>
              <h4>{u.name || 'Pengguna'}</h4>
              <span className="text-sm text-secondary">@{u.username || '-'}</span>
            </div>
          </div>
          <div className="active-user-meta">
            <Badge status={u.role === 'admin' ? 'approved' : u.role === 'editor' ? 'info' : 'pending'} label={u.role} />
            <div className="active-user-details">
              <span className="text-xs text-muted">{u.ip_address || ''}</span>
              <span className="text-xs text-muted">Login: {formatTime(u.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
