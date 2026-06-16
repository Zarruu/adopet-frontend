import { FiSearch } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import './PetFilters.css'

export default function PetFilters({ species, onSpeciesChange, search, onSearchChange }) {
  const { user } = useAuth()

  const speciesOptions = [
    { value: '', label: 'Semua Jenis' },
    { value: 'Anjing', label: 'Anjing' },
    { value: 'Kucing', label: 'Kucing' },
    { value: 'Kelinci', label: 'Kelinci' },
    { value: 'Burung', label: 'Burung' },
    { value: 'Hamster', label: 'Hamster' },
    { value: 'Lainnya', label: 'Lainnya' },
  ]

  return (
    <div className="pet-filters glass-card">
      {onSearchChange && (
        <div className="pet-filters-search">
          <FiSearch className="pet-filters-search-icon" />
          <input
            type="text"
            placeholder="Cari nama hewan..."
            className="pet-filters-input"
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      <div className="pet-filters-selects">
        {speciesOptions.map((opt) => (
          <button
            key={opt.value}
            className={`filter-chip ${species === opt.value ? 'active' : ''}`}
            onClick={() => onSpeciesChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
