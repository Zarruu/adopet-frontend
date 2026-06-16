import { useState } from 'react'
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaClock, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import Badge from '../common/Badge'
import './AdoptionCard.css'

export default function AdoptionCard({ adoption, onApprove, onReject, showActions = false }) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className={`adoption-card glass-card ${expanded ? 'expanded' : ''}`}>
      <div className="adoption-card-main" onClick={() => setExpanded(!expanded)}>
        <div className="adoption-card-pet">
          <img src={adoption.pet_image_url || adoption.image_url || '/placeholder-pet.jpg'} alt={adoption.pet_name} />
          <div>
            <h3>{adoption.pet_name || 'Hewan'}</h3>
            <p className="text-sm text-secondary">
              <FaUser className="inline-icon" /> {adoption.applicant_name}
            </p>
          </div>
        </div>
        <div className="adoption-card-meta">
          <Badge status={adoption.status} />
          <span className="text-xs text-muted">
            <FaClock className="inline-icon" /> {formatDate(adoption.created_at)}
          </span>
          <button className="expand-btn">
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="adoption-card-detail animate-slideUp">
          <div className="detail-grid">
            <div className="detail-item">
              <FaPhone className="detail-icon" />
              <div>
                <span className="detail-label">Telepon</span>
                <span className="detail-value">{adoption.applicant_phone}</span>
              </div>
            </div>
            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <div>
                <span className="detail-label">Email</span>
                <span className="detail-value">{adoption.applicant_email}</span>
              </div>
            </div>
            <div className="detail-item full-width">
              <FaMapMarkerAlt className="detail-icon" />
              <div>
                <span className="detail-label">Alamat</span>
                <span className="detail-value">{adoption.applicant_address}</span>
              </div>
            </div>
          </div>
          <div className="detail-reason">
            <strong>Alasan Adopsi:</strong>
            <p>{adoption.reason}</p>
          </div>

          {showActions && adoption.status === 'pending' && (
            <div className="adoption-card-actions">
              <button className="btn btn-success" onClick={(e) => { e.stopPropagation(); onApprove?.(adoption.id) }}>
                <FaCheck /> Setujui
              </button>
              <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); onReject?.(adoption.id) }}>
                <FaTimes /> Tolak
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
