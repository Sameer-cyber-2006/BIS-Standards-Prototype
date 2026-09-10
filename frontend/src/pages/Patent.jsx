import React, { useState } from 'react'
import { getPatentGuidance } from '../services/api.js'
import ErrorBanner from '../components/ErrorBanner.jsx'

export default function Patent() {
  const [description, setDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGuidance() {
    if (!description.trim()) { setError('Please describe your product or innovation first.'); return }
    setError(null)
    setLoading(true)
    const { data, error: apiError } = await getPatentGuidance(description)
    setLoading(false)
    if (apiError) { setError(apiError); return }
    setResult(data)
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <ErrorBanner message={error} onClose={() => setError(null)} />
        <div className="eyebrow">PATENT GUIDANCE</div>
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Get preliminary guidance about patent-related considerations for your product or innovation.</h3>
        <div className="field" style={{ marginTop: 16 }}>
          <label className="field-label">Innovation / Product Description</label>
          <textarea placeholder="Describe your product or innovation..." value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button className="btn btn-primary" disabled={loading} onClick={handleGuidance}>{loading ? 'Getting guidance…' : 'Get Guidance'}</button>
      </div>
      <div>
        {result ? (
          <div className="card fade-in">
            <span className="badge badge-gold">{result.type}</span>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)' }}>Suggested Considerations</div>
              {result.considerations.map((c, i) => (
                <div key={c} className={'check-item ' + (i === result.considerations.length - 1 ? 'warn' : 'ok')}>
                  <div className="mark">{i === result.considerations.length - 1 ? '\u26A0' : '\u2713'}</div>{c}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 12 }}>{result.disclaimer}</p>
          </div>
        ) : (
          <div className="card"><div className="empty-note">Guidance will appear here after you describe your innovation.</div></div>
        )}
      </div>
    </div>
  )
}
