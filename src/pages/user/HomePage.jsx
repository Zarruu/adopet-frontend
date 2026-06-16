import { useState, useEffect } from 'react'
import { FaSearch, FaPaw } from 'react-icons/fa'
import API from '../../api/axios'
import PetGrid from '../../components/pets/PetGrid'
import PetFilters from '../../components/pets/PetFilters'
import './UserPages.css'

export default function HomePage() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [species, setSpecies] = useState('')

  const fetchPets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (species) params.append('species', species)
      params.append('status', 'available')
      const res = await API.get(`/pets?${params.toString()}`)
      if (res.data.success) setPets(res.data.data || [])
    } catch {
      setPets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPets() }, [species])

  useEffect(() => {
    const timer = setTimeout(() => fetchPets(), 400)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="home-page page-enter">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content animate-slideUp">
          <span className="hero-badge">🐾 Platform Adopsi Hewan #1</span>
          <h1 className="hero-title">
            Temukan <span className="gradient-text">Sahabat Barumu</span>
          </h1>
          <p className="hero-desc">
            Berikan rumah yang penuh cinta untuk hewan-hewan yang membutuhkan. Mulai perjalanan adopsimu sekarang!
          </p>
          <div className="hero-search">
            <FaSearch className="hero-search-icon" />
            <input type="text" placeholder="Cari berdasarkan nama atau ras..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="hero-search-input" />
          </div>
        </div>
        <div className="hero-deco">
          <FaPaw className="hero-paw p1" />
          <FaPaw className="hero-paw p2" />
          <FaPaw className="hero-paw p3" />
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="pets-section">
        <PetFilters species={species} onSpeciesChange={setSpecies} />
        <PetGrid pets={pets} loading={loading} />
      </section>
    </div>
  )
}
