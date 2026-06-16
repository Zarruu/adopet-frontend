import { useState } from 'react'
import { FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import API from '../../api/axios'
import './AdoptionForm.css'

export default function AdoptionForm({ pet, onClose, onSuccess }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    applicant_name: user?.name || '',
    applicant_phone: '',
    applicant_email: user?.email || '',
    applicant_address: '',
    reason: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const errs = {}
    if (!formData.applicant_name.trim()) errs.applicant_name = 'Nama lengkap wajib diisi'
    if (!formData.applicant_phone.trim()) errs.applicant_phone = 'Nomor telepon wajib diisi'
    else if (!/^[0-9+\-\s]{8,15}$/.test(formData.applicant_phone)) errs.applicant_phone = 'Nomor telepon tidak valid'
    if (!formData.applicant_email.trim()) errs.applicant_email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(formData.applicant_email)) errs.applicant_email = 'Format email tidak valid'
    if (!formData.applicant_address.trim()) errs.applicant_address = 'Alamat wajib diisi'
    if (!formData.reason.trim()) errs.reason = 'Alasan adopsi wajib diisi'
    else if (formData.reason.trim().length < 20) errs.reason = 'Alasan minimal 20 karakter'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await API.post('/adoptions', { ...formData, pet_id: pet.id })
      if (res.data.success) {
        setSubmitted(true)
        setTimeout(() => {
          onSuccess?.()
          onClose()
        }, 2000)
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Gagal mengirim permohonan' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  if (submitted) {
    return (
      <div className="adoption-form-overlay" onClick={onClose}>
        <div className="adoption-form-modal animate-bounceIn" onClick={e => e.stopPropagation()}>
          <div className="adoption-success">
            <div className="success-icon">
              <FaHeart />
            </div>
            <h2>Permohonan Terkirim! 🎉</h2>
            <p>Permohonan adopsi untuk <strong>{pet.name}</strong> telah berhasil dikirim. Kami akan menghubungi Anda segera.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="adoption-form-overlay" onClick={onClose}>
      <div className="adoption-form-modal animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="adoption-form-header">
          <div>
            <h2>Formulir Adopsi</h2>
            <p className="text-secondary text-sm">Adopsi {pet.name}</p>
          </div>
          <button className="btn-icon btn-ghost" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="adoption-pet-info">
          <img src={pet.image_url || '/placeholder-pet.jpg'} alt={pet.name} />
          <div>
            <h3>{pet.name}</h3>
            <p className="text-secondary text-sm">{pet.breed} • {pet.age}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="adoption-form-body">
          <div className="input-group">
            <label><FaHeart className="input-icon-inline" /> Nama Lengkap</label>
            <input type="text" className={`input-field ${errors.applicant_name ? 'error' : ''}`}
              placeholder="Masukkan nama lengkap"
              value={formData.applicant_name}
              onChange={e => handleChange('applicant_name', e.target.value)} />
            {errors.applicant_name && <span className="input-error">{errors.applicant_name}</span>}
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label><FaPhone className="input-icon-inline" /> Nomor Telepon</label>
              <input type="tel" className={`input-field ${errors.applicant_phone ? 'error' : ''}`}
                placeholder="08xxxxxxxxxx"
                value={formData.applicant_phone}
                onChange={e => handleChange('applicant_phone', e.target.value)} />
              {errors.applicant_phone && <span className="input-error">{errors.applicant_phone}</span>}
            </div>
            <div className="input-group">
              <label><FaEnvelope className="input-icon-inline" /> Email</label>
              <input type="email" className={`input-field ${errors.applicant_email ? 'error' : ''}`}
                placeholder="email@contoh.com"
                value={formData.applicant_email}
                onChange={e => handleChange('applicant_email', e.target.value)} />
              {errors.applicant_email && <span className="input-error">{errors.applicant_email}</span>}
            </div>
          </div>

          <div className="input-group">
            <label><FaMapMarkerAlt className="input-icon-inline" /> Alamat Lengkap</label>
            <textarea className={`input-field ${errors.applicant_address ? 'error' : ''}`}
              placeholder="Masukkan alamat lengkap Anda"
              value={formData.applicant_address}
              onChange={e => handleChange('applicant_address', e.target.value)} />
            {errors.applicant_address && <span className="input-error">{errors.applicant_address}</span>}
          </div>

          <div className="input-group">
            <label>Alasan Adopsi</label>
            <textarea className={`input-field ${errors.reason ? 'error' : ''}`}
              placeholder="Ceritakan mengapa Anda ingin mengadopsi hewan ini (min. 20 karakter)"
              rows={4}
              value={formData.reason}
              onChange={e => handleChange('reason', e.target.value)} />
            {errors.reason && <span className="input-error">{errors.reason}</span>}
          </div>

          {errors.submit && <p className="input-error text-center">{errors.submit}</p>}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Mengirim...' : '🐾 Kirim Permohonan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
