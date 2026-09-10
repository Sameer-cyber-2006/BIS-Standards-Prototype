import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getStandardDetails } from '../services/api.js'
import ErrorBanner from '../components/ErrorBanner.jsx'

export default function StandardDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [standard, setStandard] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getStandardDetails(id).then(({ data, error: apiError }) => {
      if (!active) return
      setLoading(false)
      if (apiError) { setError(apiError); return }
      setStandard(data)
    })
    return () => { active = false }
  }, [id])

  if (loading) return <div className="card"><div className="empty-note">Loading standard details…</div></div>

  return (
    <div>
      <ErrorBanner message={error} onClose={() => setError(null)} />
      {standard ? (
        <div className="card" style={{ maxWidth: 700 }}>
          <div className="eyebrow">STANDARD DETAILS</div>
          <h2 style={{ fontSize: 19, marginTop: 4 }}>{standard.title}</h2>
          <div className="mono" style={{ color: 'var(--navy)', fontWeight: 700, marginTop: 4 }}>{standard.standardNumber}</div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>Scope</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{standard.scope}</p>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>Applicability</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{standard.applicability}</p>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 6 }}>Key Requirements</div>
            {standard.keyRequirements.map((k) => (
              <div key={k} style={{ fontSize: 12.5, color: 'var(--ink-soft)', padding: '4px 0' }}>&#8226; {k}</div>
            ))}
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>&#8592; Back</button>
            <button className="btn btn-primary" onClick={() => navigate('/matching')}>Go to Standard Matching</button>
          </div>
        </div>
      ) : !error && (
        <div className="card"><div className="empty-note">Standard not found in the mock knowledge base.</div></div>
      )}
    </div>
  )
}
