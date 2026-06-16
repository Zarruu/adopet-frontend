import { useState, useEffect } from 'react'
import { FaWifi, FaSyncAlt } from 'react-icons/fa'
import API from '../../api/axios'
import ActiveUsersComponent from '../../components/admin/ActiveUsers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './AdminPages.css'

export default function ActiveUsersPage() {
  const [activeUsers, setActiveUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchActive = async () => {
    setLoading(true)
    try {
      const res = await API.get('/admin/active-users')
      if (res.data.success) setActiveUsers(res.data.data || [])
    } catch { setActiveUsers([]) }
    setLoading(false)
  }

  useEffect(() => { fetchActive() }, [])

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pengguna Aktif</h1>
          <p className="page-subtitle">
            <FaWifi style={{ color: 'var(--color-success)', marginRight: '4px' }} />
            {activeUsers.length} pengguna sedang online
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchActive} disabled={loading}>
          <FaSyncAlt className={loading ? 'spinning' : ''} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><LoadingSpinner /></div>
      ) : (
        <ActiveUsersComponent users={activeUsers} />
      )}
    </div>
  )
}
