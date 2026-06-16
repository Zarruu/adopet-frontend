import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPaw, FaPlus, FaClipboardList, FaInbox } from 'react-icons/fa'
import API from '../../api/axios'
import StatsCard from '../../components/admin/StatsCard'
import PetCard from '../../components/pets/PetCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './EditorPages.css'

export default function EditorDashboard() {
  const [stats, setStats] = useState({ totalPets: 0, pendingAdoptions: 0 })
  const [recentPets, setRecentPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, adoptionsRes] = await Promise.all([
          API.get('/pets'),
          API.get('/adoptions?status=pending')
        ])
        const pets = petsRes.data.success ? petsRes.data.data || [] : []
        const adoptions = adoptionsRes.data.success ? adoptionsRes.data.data || [] : []
        setStats({ totalPets: pets.length, pendingAdoptions: adoptions.length })
        setRecentPets(pets.slice(0, 4))
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Editor</h1>
          <p className="page-subtitle">Kelola hewan peliharaan dan permohonan adopsi</p>
        </div>
        <Link to="/editor/pets/new" className="btn btn-primary"><FaPlus /> Tambah Hewan</Link>
      </div>

      <div className="stats-grid mb-8">
        <StatsCard icon={<FaPaw />} label="Total Hewan" value={stats.totalPets} color="primary" />
        <StatsCard icon={<FaInbox />} label="Adopsi Menunggu" value={stats.pendingAdoptions} color="warning" />
      </div>

      <div className="section">
        <div className="section-title-row">
          <h2 className="section-title"><FaPaw /> Hewan Terbaru</h2>
          <Link to="/pets" className="btn btn-ghost btn-sm">Lihat Semua</Link>
        </div>
        {recentPets.length > 0 ? (
          <div className="editor-pet-grid">
            {recentPets.map(p => <PetCard key={p.id} pet={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-secondary">Belum ada hewan. Tambahkan sekarang!</p>
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-title-row">
          <h2 className="section-title"><FaClipboardList /> Aksi Cepat</h2>
        </div>
        <div className="quick-actions">
          <Link to="/editor/pets/new" className="quick-action-card glass-card">
            <FaPlus className="qa-icon" />
            <h3>Tambah Hewan Baru</h3>
            <p className="text-sm text-secondary">Tambahkan hewan peliharaan ke katalog</p>
          </Link>
          <Link to="/editor/adoptions" className="quick-action-card glass-card">
            <FaClipboardList className="qa-icon" />
            <h3>Kelola Adopsi</h3>
            <p className="text-sm text-secondary">Setujui atau tolak permohonan adopsi</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
