import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import Badge from '../common/Badge'
import './UserTable.css'

export default function UserTable({ users, onEdit, onDelete, onToggleActive }) {
  const getRoleBadge = (role) => {
    const map = { admin: 'approved', editor: 'info', user: 'pending' }
    return <Badge status={map[role] || 'pending'} label={role.charAt(0).toUpperCase() + role.slice(1)} />
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

  if (!users || users.length === 0) {
    return <div className="empty-state"><p className="text-secondary">Tidak ada pengguna ditemukan.</p></div>
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="user-table-wrapper hide-mobile-tablet">
        <table className="user-table">
          <thead>
            <tr>
              <th>Pengguna</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Bergabung</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">{u.name?.charAt(0).toUpperCase() || '?'}</div>
                    <span>{u.name}</span>
                  </div>
                </td>
                <td className="text-secondary">@{u.username}</td>
                <td className="text-secondary">{u.email}</td>
                <td>{getRoleBadge(u.role)}</td>
                <td>
                  <button className="toggle-btn" onClick={() => onToggleActive?.(u.id, !u.is_active)}>
                    {u.is_active ? <FaToggleOn className="text-success" size={22} /> : <FaToggleOff className="text-muted" size={22} />}
                    <span className={u.is_active ? 'text-success' : 'text-muted'}>{u.is_active ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                </td>
                <td className="text-muted text-sm">{formatDate(u.created_at)}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-ghost btn-sm" onClick={() => onEdit?.(u)} title="Edit"><FaEdit /></button>
                    {u.role !== 'admin' && (
                      <button className="btn btn-ghost btn-sm text-danger" onClick={() => onDelete?.(u.id)} title="Hapus"><FaTrash /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="user-cards show-mobile-only">
        {users.map(u => (
          <div key={u.id} className="user-card glass-card">
            <div className="user-card-header">
              <div className="user-cell">
                <div className="user-avatar">{u.name?.charAt(0).toUpperCase() || '?'}</div>
                <div>
                  <h4>{u.name}</h4>
                  <span className="text-sm text-secondary">@{u.username}</span>
                </div>
              </div>
              {getRoleBadge(u.role)}
            </div>
            <div className="user-card-body">
              <p className="text-sm text-secondary">{u.email}</p>
              <p className="text-xs text-muted">Bergabung: {formatDate(u.created_at)}</p>
            </div>
            <div className="user-card-actions">
              <button className="toggle-btn" onClick={() => onToggleActive?.(u.id, !u.is_active)}>
                {u.is_active ? <FaToggleOn className="text-success" size={20} /> : <FaToggleOff className="text-muted" size={20} />}
              </button>
              <div className="action-btns">
                <button className="btn btn-ghost btn-sm" onClick={() => onEdit?.(u)}><FaEdit /></button>
                {u.role !== 'admin' && <button className="btn btn-ghost btn-sm text-danger" onClick={() => onDelete?.(u.id)}><FaTrash /></button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
