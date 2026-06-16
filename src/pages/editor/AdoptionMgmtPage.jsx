import { useState, useEffect } from 'react'
import { FaClipboardList, FaSearch } from 'react-icons/fa'
import API from '../../api/axios'
import AdoptionCard from '../../components/adoption/AdoptionCard'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './EditorPages.css'

export default function AdoptionMgmtPage() {
  const [adoptions, setAdoptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [search, setSearch] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)

  const fetchAdoptions = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const res = await API.get(`/adoptions${params}`)
      if (res.data.success) setAdoptions(res.data.data || [])
    } catch { setAdoptions([]) }
    setLoading(false)
  }

  useEffect(() => { fetchAdoptions() }, [filter])

  const handleApprove = (id) => {
    setConfirmAction({ id, action: 'approve', title: 'Setujui Adopsi?', message: 'Permohonan adopsi ini akan disetujui dan pemohon akan menerima notifikasi.' })
  }

  const handleReject = (id) => {
    setConfirmAction({ id, action: 'reject', title: 'Tolak Adopsi?', message: 'Permohonan adopsi ini akan ditolak dan pemohon akan menerima notifikasi.' })
  }

  const executeAction = async () => {
    if (!confirmAction) return
    try {
      const { id, action } = confirmAction
      await API.put(`/adoptions/${id}/${action}`)
      fetchAdoptions()
    } catch { /* ignore */ }
    setConfirmAction(null)
  }

  const filtered = search
    ? adoptions.filter(a => a.pet_name?.toLowerCase().includes(search.toLowerCase()) || a.applicant_name?.toLowerCase().includes(search.toLowerCase()))
    : adoptions

  const tabs = [
    { key: 'pending', label: 'Menunggu' },
    { key: 'approved', label: 'Disetujui' },
    { key: 'rejected', label: 'Ditolak' },
    { key: 'all', label: 'Semua' },
  ]

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kelola Adopsi</h1>
          <p className="page-subtitle">Setujui atau tolak permohonan adopsi</p>
        </div>
      </div>

      <div className="filter-bar mb-6">
        <div className="tabs" style={{ marginBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.key} className={`tab ${filter === t.key ? 'active' : ''}`}
              onClick={() => setFilter(t.key)}>{t.label}</button>
          ))}
        </div>
        <div className="search-input-sm">
          <FaSearch className="search-icon-sm" />
          <input type="text" placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field" style={{ paddingLeft: '36px' }} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><LoadingSpinner /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FaClipboardList className="empty-state-icon" />
          <h3 className="empty-state-title">Tidak ada permohonan adopsi</h3>
        </div>
      ) : (
        <div className="adoption-list">
          {filtered.map(a => (
            <AdoptionCard key={a.id} adoption={a} showActions onApprove={handleApprove} onReject={handleReject} />
          ))}
        </div>
      )}

      {confirmAction && (
        <ConfirmDialog title={confirmAction.title} message={confirmAction.message}
          onConfirm={executeAction} onCancel={() => setConfirmAction(null)}
          confirmText={confirmAction.action === 'approve' ? 'Setujui' : 'Tolak'}
          variant={confirmAction.action === 'approve' ? 'success' : 'danger'} />
      )}
    </div>
  )
}
