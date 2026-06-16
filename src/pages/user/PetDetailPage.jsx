import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaPaw, FaDog, FaBirthdayCake, FaInfoCircle } from 'react-icons/fa'
import API from '../../api/axios'
import { useAuth } from '../../hooks/useAuth'
import Badge from '../../components/common/Badge'
import AdoptionForm from '../../components/adoption/AdoptionForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './UserPages.css'

export default function PetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAdoptForm, setShowAdoptForm] = useState(false)

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await API.get(`/pets/${id}`)
        if (res.data.success) setPet(res.data.data)
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetchPet()
  }, [id])

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>
  if (!pet) return (
    <div className="empty-state">
      <FaPaw className="empty-state-icon" />
      <h3 className="empty-state-title">Hewan tidak ditemukan</h3>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/pets')}>Kembali</button>
    </div>
  )

  return (
    <div className="pet-detail-page page-enter">
      <button className="btn btn-ghost mb-6" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Kembali
      </button>

      <div className="pet-detail-card glass-card">
        <div className="pet-detail-image-container">
          <img src={pet.image_url || '/placeholder-pet.jpg'} alt={pet.name} className="pet-detail-image" />
          <Badge status={pet.status} className="pet-detail-badge" />
        </div>

        <div className="pet-detail-info">
          <h1 className="pet-detail-name">{pet.name}</h1>

          <div className="pet-detail-meta">
            <div className="meta-item">
              <FaDog className="meta-icon" />
              <div>
                <span className="meta-label">Jenis</span>
                <span className="meta-value">{pet.species || 'Tidak diketahui'}</span>
              </div>
            </div>
            <div className="meta-item">
              <FaPaw className="meta-icon" />
              <div>
                <span className="meta-label">Ras</span>
                <span className="meta-value">{pet.breed}</span>
              </div>
            </div>
            <div className="meta-item">
              <FaBirthdayCake className="meta-icon" />
              <div>
                <span className="meta-label">Umur</span>
                <span className="meta-value">{pet.age}</span>
              </div>
            </div>
          </div>

          <div className="pet-detail-desc">
            <h3><FaInfoCircle /> Tentang {pet.name}</h3>
            <p>{pet.description || 'Tidak ada deskripsi tersedia.'}</p>
          </div>

          {user?.role === 'user' && pet.status === 'available' && (
            <button className="btn btn-primary btn-lg w-full mt-6" onClick={() => setShowAdoptForm(true)}>
              🐾 Adopsi Sekarang!
            </button>
          )}
        </div>
      </div>

      {showAdoptForm && (
        <AdoptionForm pet={pet} onClose={() => setShowAdoptForm(false)}
          onSuccess={() => { setPet(prev => ({ ...prev, status: 'pending' })) }} />
      )}
    </div>
  )
}
