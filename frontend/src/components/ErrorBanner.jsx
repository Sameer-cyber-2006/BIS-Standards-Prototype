import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

// Prototype-level error handling: a small, dismissible banner used for
// backend-unavailable / empty-input / upload / request-failure cases.
export default function ErrorBanner({ message, onClose }) {
  if (!message) return null
  return (
    <div className="error-banner">
      <AlertTriangle size={16} />
      <div>{message}</div>
      {onClose && <span className="close-x" onClick={onClose}><X size={14} /></span>}
    </div>
  )
}
