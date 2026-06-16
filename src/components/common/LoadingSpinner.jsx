import './LoadingSpinner.css'

export default function LoadingSpinner({ fullScreen = false, size = 40, text = '' }) {
  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className="spinner-wrapper">
          <div className="spinner" style={{ width: size, height: size }} />
          {text && <p className="spinner-text">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="spinner-inline">
      <div className="spinner" style={{ width: size, height: size }} />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  )
}
