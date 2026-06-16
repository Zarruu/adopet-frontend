import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FaPaw, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './Auth.css'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/pets" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Email dan password wajib diisi'); return }
    setLoading(true)
    setError('')
    try {
      const result = await login(email, password)
      if (result.success) {
        navigate('/pets', { replace: true })
      } else {
        setError(result.message || 'Login gagal')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="auth-branding animate-fadeIn">
          <div className="auth-logo-large">
            <FaPaw />
          </div>
          <h1 className="auth-brand-title">
            <span className="gradient-text">Adopet</span>
          </h1>
          <p className="auth-brand-desc">
            Temukan sahabat berbulu terbaikmu. Berikan mereka rumah yang penuh cinta. 🐾
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <span>🏠</span>
              <p>Ribuan hewan menunggu rumah baru</p>
            </div>
            <div className="auth-feature">
              <span>❤️</span>
              <p>Proses adopsi mudah dan cepat</p>
            </div>
            <div className="auth-feature">
              <span>🛡️</span>
              <p>Terverifikasi dan terpercaya</p>
            </div>
          </div>
        </div>

        <div className="auth-form-card animate-slideUp">
          <div className="auth-form-header">
            <div className="auth-logo-small">
              <FaPaw />
            </div>
            <h2>Selamat Datang!</h2>
            <p className="text-secondary">Masuk ke akun Adopet Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Email</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input type="email" className={`input-field ${error ? 'error' : ''}`}
                  placeholder="Masukkan email Anda"
                  value={email} onChange={e => { setEmail(e.target.value); setError('') }} />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input type={showPassword ? 'text' : 'password'}
                  className={`input-field ${error ? 'error' : ''}`}
                  placeholder="Masukkan password Anda"
                  value={password} onChange={e => { setPassword(e.target.value); setError('') }} />
                <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && <p className="input-error text-center">{error}</p>}

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : 'Masuk'}
            </button>

            <p className="auth-link">
              Belum punya akun? <Link to="/register">Daftar Sekarang</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Decorative paw prints */}
      <div className="paw-deco paw-1"><FaPaw /></div>
      <div className="paw-deco paw-2"><FaPaw /></div>
      <div className="paw-deco paw-3"><FaPaw /></div>
    </div>
  )
}
