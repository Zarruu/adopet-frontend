import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FaPaw, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaIdCard } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './Auth.css'

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (isAuthenticated) return <Navigate to="/pets" replace />

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Nama lengkap wajib diisi'
    if (!formData.username.trim()) errs.username = 'Username wajib diisi'
    else if (formData.username.length < 3) errs.username = 'Username minimal 3 karakter'
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) errs.username = 'Username hanya boleh huruf, angka, dan underscore'
    if (!formData.email.trim()) errs.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Format email tidak valid'
    if (!formData.password) errs.password = 'Password wajib diisi'
    else if (formData.password.length < 6) errs.password = 'Password minimal 6 karakter'
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Password tidak cocok'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const result = await register(formData.name, formData.username, formData.email, formData.password)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setErrors({ submit: result.message || 'Pendaftaran gagal' })
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Terjadi kesalahan saat mendaftar' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  if (success) {
    return (
      <div className="auth-bg">
        <div className="auth-success-container animate-bounceIn">
          <div className="auth-logo-large"><FaPaw /></div>
          <h2>Pendaftaran Berhasil! 🎉</h2>
          <p className="text-secondary">Akun Anda telah dibuat. Mengalihkan ke halaman login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="auth-branding animate-fadeIn">
          <div className="auth-logo-large"><FaPaw /></div>
          <h1 className="auth-brand-title"><span className="gradient-text">Adopet</span></h1>
          <p className="auth-brand-desc">Bergabunglah dengan komunitas pencinta hewan terbesar. Mulai perjalanan Anda hari ini! 🐾</p>
        </div>

        <div className="auth-form-card animate-slideUp">
          <div className="auth-form-header">
            <div className="auth-logo-small"><FaPaw /></div>
            <h2>Buat Akun Baru</h2>
            <p className="text-secondary">Daftar untuk mulai mengadopsi</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Nama Lengkap</label>
              <div className="input-with-icon">
                <FaIdCard className="input-icon" />
                <input type="text" className={`input-field ${errors.name ? 'error' : ''}`}
                  placeholder="Masukkan nama lengkap" value={formData.name}
                  onChange={e => handleChange('name', e.target.value)} />
              </div>
              {errors.name && <span className="input-error">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label>Username</label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input type="text" className={`input-field ${errors.username ? 'error' : ''}`}
                  placeholder="Pilih username unik" value={formData.username}
                  onChange={e => handleChange('username', e.target.value)} />
              </div>
              {errors.username && <span className="input-error">{errors.username}</span>}
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input type="email" className={`input-field ${errors.email ? 'error' : ''}`}
                  placeholder="Masukkan email Anda" value={formData.email}
                  onChange={e => handleChange('email', e.target.value)} />
              </div>
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input type={showPassword ? 'text' : 'password'}
                    className={`input-field ${errors.password ? 'error' : ''}`}
                    placeholder="Min. 6 karakter" value={formData.password}
                    onChange={e => handleChange('password', e.target.value)} />
                  <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="input-error">{errors.password}</span>}
              </div>

              <div className="input-group">
                <label>Konfirmasi Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input type={showPassword ? 'text' : 'password'}
                    className={`input-field ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Ulangi password" value={formData.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)} />
                </div>
                {errors.confirmPassword && <span className="input-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            {errors.submit && <p className="input-error text-center">{errors.submit}</p>}

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : 'Daftar'}
            </button>

            <p className="auth-link">Sudah punya akun? <Link to="/login">Masuk</Link></p>
          </form>
        </div>
      </div>
      <div className="paw-deco paw-1"><FaPaw /></div>
      <div className="paw-deco paw-2"><FaPaw /></div>
    </div>
  )
}
