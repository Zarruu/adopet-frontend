import './Badge.css'

const statusMap = {
  available: { variant: 'success', label: 'Tersedia' },
  adopted: { variant: 'info', label: 'Diadopsi' },
  pending: { variant: 'warning', label: 'Menunggu' },
  approved: { variant: 'success', label: 'Disetujui' },
  rejected: { variant: 'danger', label: 'Ditolak' },
  info: { variant: 'info', label: 'Info' },
}

export default function Badge({ variant, status, label, children, size = 'md', dot = false, className = '' }) {
  // If status prop is provided, auto-resolve variant and label
  let resolvedVariant = variant || 'default'
  let resolvedLabel = label || children

  if (status && statusMap[status]) {
    resolvedVariant = statusMap[status].variant
    if (!label && !children) resolvedLabel = statusMap[status].label
  }

  return (
    <span className={`badge badge-${resolvedVariant} badge-${size} ${className}`}>
      {dot && <span className="badge-dot" />}
      {resolvedLabel}
    </span>
  )
}

// Pre-defined status badges
export function StatusBadge({ status }) {
  const config = statusMap[status] || { variant: 'default', label: status }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function RoleBadge({ role }) {
  const map = {
    admin: { variant: 'danger', label: 'Admin' },
    editor: { variant: 'warning', label: 'Editor' },
    user: { variant: 'info', label: 'Pengguna' },
  }
  const config = map[role] || { variant: 'default', label: role }
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>
}
