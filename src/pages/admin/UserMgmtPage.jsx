import { useState, useEffect } from 'react'
import { FaUsers, FaUserPlus, FaSearch } from 'react-icons/fa'
import API from '../../api/axios'
import UserTable from '../../components/admin/UserTable'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './AdminPages.css'

export default function UserMgmtPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', role: 'user' })
  const [formErrors, setFormErrors] = useState({})
  const [formLoading, setFormLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? `?role=${filter}` : ''
      const res = await API.get(`/admin/users${params}`)
      if (res.data.success) setUsers(res.data.data || [])
    } catch { setUsers([]) }
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [filter])

  const openCreate = () => {
    setEditUser(null)
    setFormData({ name: '', username: '', email: '', password: '', role: 'user' })
    setFormErrors({})
    setShowForm(true)
  }

  const openEdit = (u) => {
    setEditUser(u)
    setFormData({ name: u.name, username: u.username, email: u.email, password: '', role: u.role })
    setFormErrors({})
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Nama wajib diisi'
    if (!formData.username.trim()) errs.username = 'Username wajib diisi'
    if (!formData.email.trim()) errs.email = 'Email wajib diisi'
    if (!editUser && !formData.password) errs.password = 'Password wajib diisi'
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }

    setFormLoading(true)
    try {
      if (editUser) {
        const data = { name: formData.name, email: formData.email, role: formData.role, is_active: true }
        await API.put(`/admin/users/${editUser.id}`, data)
      } else {
        await API.post('/admin/users', formData)
      }
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      setFormErrors({ submit: err.response?.data?.message || 'Gagal menyimpan' })
    } finally { setFormLoading(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await API.delete(`/admin/users/${deleteId}`)
      fetchUsers()
    } catch { /* ignore */ }
    setDeleteId(null)
  }

  const handleToggleActive = async (id, active) => {
    try {
      const u = users.find(u => u.id === id)
      if (u) {
        await API.put(`/admin/users/${id}`, { name: u.name, email: u.email, role: u.role, is_active: active })
        fetchUsers()
      }
    } catch { /* ignore */ }
  }

  const filtered = search
    ? users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users

  const tabs = [
    { key: 'all', label: 'Semua' },
    { key: 'user', label: 'User' },
    { key: 'editor', label: 'Editor' },
    { key: 'admin', label: 'Admin' },
  ]

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kelola Pengguna</h1>
          <p className="page-subtitle">Tambah, edit, dan hapus pengguna platform</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><FaUserPlus /> Tambah Pengguna</button>
      </div>

      <div className="filter-bar mb-6">
        <div className="tabs" style={{ marginBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.key} className={`tab ${filter === t.key ? 'active' : ''}`}
              onClick={() => setFilter(t.key)}>{t.label}</button>
          ))}
        </div>
        <div className="search-input-sm">
          <FaSearch className="search-icon-sm" />
          <input type="text" placeholder="Cari pengguna..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field" style={{ paddingLeft: '36px' }} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><LoadingSpinner /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FaUsers className="empty-state-icon" />
          <h3 className="empty-state-title">Tidak ada pengguna ditemukan</h3>
        </div>
      ) : (
        <UserTable users={filtered} onEdit={openEdit} onDelete={setDeleteId} onToggleActive={handleToggleActive} />
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <Modal title={editUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="input-group">
              <label>Nama Lengkap *</label>
              <input type="text" className={`input-field ${formErrors.name ? 'error' : ''}`}
                value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              {formErrors.name && <span className="input-error">{formErrors.name}</span>}
            </div>
            {!editUser && (
              <div className="input-group">
                <label>Username *</label>
                <input type="text" className={`input-field ${formErrors.username ? 'error' : ''}`}
                  value={formData.username} onChange={e => setFormData(p => ({ ...p, username: e.target.value }))} />
                {formErrors.username && <span className="input-error">{formErrors.username}</span>}
              </div>
            )}
            <div className="input-group">
              <label>Email *</label>
              <input type="email" className={`input-field ${formErrors.email ? 'error' : ''}`}
                value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
              {formErrors.email && <span className="input-error">{formErrors.email}</span>}
            </div>
            {!editUser && (
              <div className="input-group">
                <label>Password *</label>
                <input type="password" className={`input-field ${formErrors.password ? 'error' : ''}`}
                  value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} />
                {formErrors.password && <span className="input-error">{formErrors.password}</span>}
              </div>
            )}
            <div className="input-group">
              <label>Role</label>
              <select className="input-field" value={formData.role}
                onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}>
                <option value="user">User</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            {formErrors.submit && <p className="input-error text-center">{formErrors.submit}</p>}
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading ? <LoadingSpinner size="small" /> : (editUser ? 'Perbarui' : 'Tambah')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog title="Hapus Pengguna?" message="Pengguna ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
          onConfirm={handleDelete} onCancel={() => setDeleteId(null)} confirmText="Hapus" variant="danger" />
      )}
    </div>
  )
}
