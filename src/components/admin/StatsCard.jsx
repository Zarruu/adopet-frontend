import { useEffect, useState, useRef } from 'react'
import './StatsCard.css'

export default function StatsCard({ icon, label, value, color = 'primary', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const target = typeof value === 'number' ? value : parseInt(value) || 0
    if (target === 0) { setDisplayValue(0); return }
    const duration = 1000
    const steps = 30
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplayValue(target)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  const colorMap = {
    primary: 'var(--color-primary)',
    accent: 'var(--color-accent)',
    success: 'var(--color-success)',
    info: 'var(--color-info)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    secondary: 'var(--color-secondary)',
  }

  const c = colorMap[color] || colorMap.primary

  return (
    <div className="stats-card glass-card" ref={ref} style={{ '--stat-color': c }}>
      <div className="stats-card-icon" style={{ background: `${c}15`, color: c }}>
        {icon}
      </div>
      <div className="stats-card-content">
        <span className="stats-card-value">{displayValue}{suffix}</span>
        <span className="stats-card-label">{label}</span>
      </div>
      <div className="stats-card-glow" style={{ background: c }} />
    </div>
  )
}
