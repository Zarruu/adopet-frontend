import { useState } from 'react'
import { FaUser, FaSave, FaLock, FaCamera } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import API from '../../api/axios'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Badge from '../../components/common/Badge'
import './UserPages.css'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url || '')
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [passMsg, setPassMsg] = useState('')
  const [passErr, setPassErr] = useState('')

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true); setMsg('')
    try {
      const result = await updateProfile({ name, photo_url: photoUrl })
      if (result.success) setMsg('Profil berhasil diperbarui!')
      else setMsg(result.message || 'Gagal memperbarui profil')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Terjadi kesalahan')
    } finally { setLoading(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPass.length < 6) { setPassErr('Password baru minimal 6 karakter'); return }
    if (newPass !== confirmPass) { setPassErr('Password baru tidak cocok'); return }
    setPassLoading(true); setPassErr(''); setPassMsg('')
    try {
      const res = await API.put('/auth/password', { old_password: oldPass, new_password: newPass })
      if (res.data.success) {
        setPassMsg('Password berhasil diubah!')
        setOldPass(''); setNewPass(''); setConfirmPass('')
      } else { setPassErr(res.data.message) }
    } catch (err) {
      setPassErr(err.response?.data?.message || 'Gagal mengubah password')
    } finally { setPassLoading(false) }
  }

  const getRoleBadge = (role) => {
    const map = { admin: 'approved', editor: 'info', user: 'pending' }
    return <Badge status={map[role]} label={role.charAt(0).toUpperCase() + role.slice(1)} />
  }

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profil Saya</h1>
          <p className="page-subtitle">Kelola informasi akun Anda</p>
        </div>
      </div>

      <div className="profile-layout">
        {/* Profile Card */}
        <div className="profile-card glass-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-lg">
              {user?.photo_url ? (
                <img src={user.photo_url} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || '?'}</span>
              )}
              <div className="avatar-overlay"><FaCamera /></div>
            </div>
            <h2>{user?.name}</h2>
            <p className="text-secondary text-sm">@{user?.username}</p>
            <div className="mt-2">{getRoleBadge(user?.role)}</div>
          </div>
          <div className="profile-info-list">
            <div className="profile-info-item">
              <span className="text-muted text-sm">Email</span>
              <span>{user?.email}</span>
            </div>
            <div className="profile-info-item">
              <span className="text-muted text-sm">Bergabung</span>
              <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
            </div>
          </div>
        </div>

        {/* Edit Forms */}
        <div className="profile-forms">
          <form onSubmit={handleProfileUpdate} className="profile-form glass-card">
            <h3><FaUser /> Edit Profil</h3>
            <div className="input-group">
              <label>Nama Lengkap</label>
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="input-group">
              <label>URL Foto Profil</label>
              <input type="url" className="input-field" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)}
                placeholder="https://..." />
            </div>
            {msg && <p className={`text-sm ${msg.includes('berhasil') ? 'text-success' : 'text-danger'}`}>{msg}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : <><FaSave /> Simpan</>}
            </button>
          </form>

          <form onSubmit={handlePasswordChange} className="profile-form glass-card">
            <h3><FaLock /> Ubah Password</h3>
            <div className="input-group">
              <label>Password Lama</label>
              <input type="password" className="input-field" value={oldPass} onChange={e => setOldPass(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Password Baru</label>
              <input type="password" className="input-field" value={newPass} onChange={e => setNewPass(e.target.value)}
                placeholder="Min. 6 karakter" />
            </div>
            <div className="input-group">
              <label>Konfirmasi Password Baru</label>
              <input type="password" className="input-field" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
            </div>
            {passErr && <p className="text-sm text-danger">{passErr}</p>}
            {passMsg && <p className="text-sm text-success">{passMsg}</p>}
            <button type="submit" className="btn btn-primary" disabled={passLoading}>
              {passLoading ? <LoadingSpinner size="small" /> : <><FaLock /> Ubah Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
