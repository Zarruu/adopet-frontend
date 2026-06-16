import PetCard from './PetCard'
import { FaPaw } from 'react-icons/fa'
import './PetGrid.css'

export default function PetGrid({ pets, loading, onEdit, onDelete, onAdopt }) {
  if (loading) {
    return (
      <div className="pet-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="pet-card-skeleton glass-card">
            <div className="skeleton pet-skeleton-image" />
            <div className="pet-skeleton-body">
              <div className="skeleton pet-skeleton-species" />
              <div className="skeleton pet-skeleton-name" />
              <div className="skeleton pet-skeleton-detail" />
              <div className="skeleton pet-skeleton-btn" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="pet-grid-empty">
        <div className="pet-grid-empty-icon">
          <FaPaw />
        </div>
        <h3>Belum Ada Hewan</h3>
        <p>Belum ada hewan tersedia saat ini. Silakan cek kembali nanti!</p>
      </div>
    )
  }

  return (
    <div className="pet-grid">
      {pets.map((pet, index) => (
        <div key={pet.id} style={{ animationDelay: `${index * 0.05}s` }}>
          <PetCard
            pet={pet}
            onEdit={onEdit}
            onDelete={onDelete}
            onAdopt={onAdopt}
          />
        </div>
      ))}
    </div>
  )
}
