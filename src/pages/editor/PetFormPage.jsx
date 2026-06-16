import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaSave, FaUpload, FaLink, FaImage } from 'react-icons/fa'
import API from '../../api/axios'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './EditorPages.css'

export default function PetFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '', age: '', breed: '', species: 'Anjing', description: '', image_url: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const [fetchLoading, setFetchLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      const fetchPet = async () => {
        try {
          const res = await API.get(`/pets/${id}`)
          if (res.data.success) {
            const p = res.data.data
            setFormData({ name: p.name, age: p.age, breed: p.breed, species: p.species || 'Anjing', description: p.description || '', image_url: p.image_url || '' })
            setPreview(p.image_url || '')
          }
        } catch { /* ignore */ }
        setFetchLoading(false)
      }
      fetchPet()
    }
  }, [id, isEdit])

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Nama hewan wajib diisi'
    if (!formData.age.trim()) errs.age = 'Umur wajib diisi'
    if (!formData.breed.trim()) errs.breed = 'Ras wajib diisi'
    if (!formData.species) errs.species = 'Jenis wajib dipilih'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = isEdit
        ? await API.put(`/pets/${id}`, formData)
        : await API.post('/pets', formData)
      if (res.data.success) navigate('/pets')
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Gagal menyimpan' })
    } finally { setLoading(false) }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadLoading(true)
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await API.post('/pets/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (res.data.success) {
        const url = res.data.data?.url || res.data.data
        setFormData(prev => ({ ...prev, image_url: url }))
        setPreview(url)
      }
    } catch (err) {
      setErrors({ image: err.response?.data?.message || 'Gagal upload gambar' })
    } finally { setUploadLoading(false) }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  if (fetchLoading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>

  return (
    <div className="page-enter">
      <button className="btn btn-ghost mb-6" onClick={() => navigate(-1)}><FaArrowLeft /> Kembali</button>

      <div className="pet-form-container glass-card">
        <h2 className="pet-form-title">{isEdit ? 'Edit Hewan' : 'Tambah Hewan Baru'}</h2>

        <form onSubmit={handleSubmit} className="pet-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Nama Hewan *</label>
              <input type="text" className={`input-field ${errors.name ? 'error' : ''}`}
                placeholder="Contoh: Buddy" value={formData.name}
                onChange={e => handleChange('name', e.target.value)} />
              {errors.name && <span className="input-error">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label>Umur *</label>
              <input type="text" className={`input-field ${errors.age ? 'error' : ''}`}
                placeholder="Contoh: 2 tahun" value={formData.age}
                onChange={e => handleChange('age', e.target.value)} />
              {errors.age && <span className="input-error">{errors.age}</span>}
            </div>

            <div className="input-group">
              <label>Jenis Hewan *</label>
              <select className={`input-field ${errors.species ? 'error' : ''}`}
                value={formData.species} onChange={e => handleChange('species', e.target.value)}>
                <option value="Anjing">Anjing</option>
                <option value="Kucing">Kucing</option>
                <option value="Kelinci">Kelinci</option>
                <option value="Burung">Burung</option>
                <option value="Hamster">Hamster</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="input-group">
              <label>Ras *</label>
              <input type="text" className={`input-field ${errors.breed ? 'error' : ''}`}
                placeholder="Contoh: Golden Retriever" value={formData.breed}
                onChange={e => handleChange('breed', e.target.value)} />
              {errors.breed && <span className="input-error">{errors.breed}</span>}
            </div>
          </div>

          <div className="input-group">
            <label>Deskripsi</label>
            <textarea className="input-field" rows={4} placeholder="Ceritakan tentang hewan ini..."
              value={formData.description} onChange={e => handleChange('description', e.target.value)} />
          </div>

          {/* Image Section */}
          <div className="image-upload-section">
            <label className="section-label"><FaImage /> Foto Hewan</label>
            <div className="image-upload-grid">
              <div className="image-preview-box">
                {preview ? (
                  <img src={preview} alt="Preview" />
                ) : (
                  <div className="preview-placeholder">
                    <FaImage />
                    <span>Belum ada foto</span>
                  </div>
                )}
              </div>
              <div className="image-upload-options">
                <div className="upload-option">
                  <label className="btn btn-secondary w-full" htmlFor="file-upload">
                    <FaUpload /> {uploadLoading ? 'Mengupload...' : 'Upload ke Google Drive'}
                  </label>
                  <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload}
                    style={{ display: 'none' }} disabled={uploadLoading} />
                </div>
                <div className="upload-divider"><span>atau</span></div>
                <div className="input-group">
                  <label><FaLink /> Masukkan URL Gambar</label>
                  <input type="url" className="input-field" placeholder="https://..."
                    value={formData.image_url}
                    onChange={e => { handleChange('image_url', e.target.value); setPreview(e.target.value) }} />
                </div>
              </div>
            </div>
            {errors.image && <p className="input-error">{errors.image}</p>}
          </div>

          {errors.submit && <p className="input-error text-center">{errors.submit}</p>}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Batal</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : <><FaSave /> {isEdit ? 'Perbarui' : 'Simpan'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
