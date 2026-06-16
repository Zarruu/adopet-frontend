import { useState, useEffect } from 'react'
import { FaClipboardList } from 'react-icons/fa'
import API from '../../api/axios'
import AdoptionCard from '../../components/adoption/AdoptionCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './UserPages.css'

export default function MyAdoptionsPage() {
  const [adoptions, setAdoptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/adoptions/my')
        if (res.data.success) setAdoptions(res.data.data || [])
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = filter === 'all' ? adoptions : adoptions.filter(a => a.status === filter)
  const tabs = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'approved', label: 'Disetujui' },
    { key: 'rejected', label: 'Ditolak' },
  ]

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Riwayat Adopsi</h1>
          <p className="page-subtitle">Pantau status permohonan adopsi Anda</p>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.key} className={`tab ${filter === t.key ? 'active' : ''}`}
            onClick={() => setFilter(t.key)}>{t.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><LoadingSpinner /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FaClipboardList className="empty-state-icon" />
          <h3 className="empty-state-title">Belum ada permohonan adopsi</h3>
          <p className="empty-state-desc">Mulai adopsi hewan dari halaman katalog</p>
        </div>
      ) : (
        <div className="adoption-list">
          {filtered.map(a => <AdoptionCard key={a.id} adoption={a} />)}
        </div>
      )}
    </div>
  )
}
