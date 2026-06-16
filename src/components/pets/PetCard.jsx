import { Link, useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiHeart, FiClock } from 'react-icons/fi'
import { FaPaw } from 'react-icons/fa'
import { StatusBadge } from '../common/Badge'
import { useAuth } from '../../hooks/useAuth'
import './PetCard.css'

export default function PetCard({ pet, onDelete }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isEditor = user?.role === 'editor' || user?.role === 'admin'

  const getSpeciesEmoji = (species) => {
    const map = {
      anjing: '🐕',
      kucing: '🐈',
      kelinci: '🐇',
      burung: '🐦',
      hamster: '🐹',
    }
    return map[species?.toLowerCase()] || '🐾'
  }

  const formatAge = (age) => {
    if (!age) return 'Tidak diketahui'
    return age
  }

  return (
    <div className="pet-card glass-card">
      <Link to={`/pets/${pet.id}`} className="pet-card-image-wrapper">
        {pet.image_url ? (
          <img
            src={pet.image_url}
            alt={pet.name}
            className="pet-card-image"
            loading="lazy"
          />
        ) : (
          <div className="pet-card-placeholder">
            <FaPaw />
          </div>
        )}
        <div className="pet-card-badge">
          <StatusBadge status={pet.status || 'available'} />
        </div>
      </Link>

      <div className="pet-card-body">
        <div className="pet-card-species">
          <span>{getSpeciesEmoji(pet.species)}</span>
          <span className="pet-card-species-text">{pet.species || 'Lainnya'}</span>
        </div>

        <Link to={`/pets/${pet.id}`}>
          <h3 className="pet-card-name">{pet.name}</h3>
        </Link>

        <div className="pet-card-details">
          {pet.breed && (
            <span className="pet-card-detail">
              <FaPaw className="pet-card-detail-icon" />
              {pet.breed}
            </span>
          )}
          <span className="pet-card-detail">
            <FiClock className="pet-card-detail-icon" />
            {formatAge(pet.age)}
          </span>
        </div>

        <div className="pet-card-actions">
          {isEditor ? (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/editor/pets/${pet.id}/edit`)}>
                <FiEdit2 /> Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete?.(pet)}>
                <FiTrash2 /> Hapus
              </button>
            </>
          ) : (
            pet.status === 'available' && (
              <button className="btn btn-primary btn-sm w-full" onClick={() => navigate(`/pets/${pet.id}`)}>
                <FiHeart /> Adopsi Sekarang!
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

