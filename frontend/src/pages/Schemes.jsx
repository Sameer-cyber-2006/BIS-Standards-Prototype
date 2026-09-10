import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext.jsx'
import { checkSchemeEligibility } from '../services/api.js'
import ErrorBanner from '../components/ErrorBanner.jsx'

function statusColor(status) {
  if (status === 'Eligible') return 'var(--teal)'
  if (status === 'Partially Matched') return 'var(--gold)'
  return 'var(--rust)'
}
function statusBadgeClass(status) {
  if (status === 'Eligible') return 'badge-teal'
  if (status === 'Partially Matched') return 'badge-gold'
  return 'badge-rust'
}

function SchemeCard({ s, onViewDetails }) {
  const color = statusColor(s.eligibilityStatus)
  return (
    <div className="card" style={{ marginTop: 12, borderColor: s.eligibilityStatus === 'Eligible' ? 'var(--teal)' : 'var(--line)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14.5 }}>{s.schemeName}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>{s.department}</div>
        </div>
        <span className={'badge ' + statusBadgeClass(s.eligibilityStatus)}>{s.eligibilityStatus}</span>
      </div>

      <div className="progress-track" style={{ marginTop: 12 }}>
        <div className="progress-fill" style={{ width: s.relevanceScore + '%', background: color }} />
      </div>

      <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 10 }}><b style={{ color: 'var(--navy)' }}>Why it's relevant:</b> {s.whyRelevant}</p>
      <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 6 }}><b style={{ color: 'var(--navy)' }}>Benefits:</b> {s.benefits}</p>

      <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        {s.matchedCriteria.map((m) => <span key={m} style={{ fontSize: 12, color: 'var(--teal)' }}>&#10003; {m}</span>)}
        {s.unmatchedCriteria.map((m) => <span key={m} style={{ fontSize: 12, color: 'var(--rust)' }}>&#10007; {m}</span>)}
      </div>

      <div style={{ marginTop: 14 }}>
        <button className="btn btn-primary" style={{ fontSize: 12.5, padding: '8px 16px' }} onClick={() => onViewDetails(s.schemeId)}>View Details</button>
      </div>
    </div>
  )
}

export default function Schemes() {
  const navigate = useNavigate()
  const { profile, schemeResults, setSchemeResults } = useWorkflow()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function findSchemes() {
    if (!profile) { setError('Profile not loaded yet. Please try again in a moment.'); return }
    setLoading(true)
    setError(null)
    const { data, error: apiError } = await checkSchemeEligibility({
      userType: profile.userType,
      sector: profile.sector,
      state: profile.state,
      businessSize: profile.businessSize,
      turnover: profile.turnover,
      purpose: profile.purpose,
    })
    setLoading(false)
    if (apiError) { setError(apiError); return }
    setSchemeResults(data)
  }

  const eligibleCount = schemeResults ? schemeResults.filter((s) => s.eligibilityStatus !== 'Not Matched').length : 0

  return (
    <div>
      <ErrorBanner message={error} onClose={() => setError(null)} />

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="eyebrow">YOUR PROFILE INFORMATION</div>
          <button className="btn-ghost" style={{ fontSize: 12.5 }} onClick={() => navigate('/schemes/edit-info')}>Edit Profile</button>
        </div>
        {profile ? (
          <div className="grid grid-4" style={{ marginTop: 8 }}>
            <div><div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>User Type</div><div style={{ fontWeight: 600 }}>{profile.userType || '—'}</div></div>
            <div><div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Sector</div><div style={{ fontWeight: 600 }}>{profile.sector || '—'}</div></div>
            <div><div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Location</div><div style={{ fontWeight: 600 }}>{profile.state || '—'}</div></div>
            <div><div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Business Size</div><div style={{ fontWeight: 600 }}>{profile.businessSize || '—'}</div></div>
          </div>
        ) : (
          <div className="empty-note">Loading profile…</div>
        )}
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-teal" disabled={loading} onClick={findSchemes}>{loading ? 'Finding schemes…' : 'Find Suitable Schemes'}</button>
        </div>
      </div>

      {schemeResults && (
        <div className="card">
          <div className="eyebrow">RESULTS</div>
          <div className="section-title" style={{ marginTop: 2 }}>{eligibleCount} of {schemeResults.length} schemes potentially relevant</div>
          {schemeResults.map((s) => (
            <SchemeCard key={s.schemeId} s={s} onViewDetails={(id) => navigate('/schemes/' + id)} />
          ))}
        </div>
      )}

      <div className="card" style={{ background: '#F8FAFB' }}>
        <p style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>
          This is a preliminary, prototype eligibility assessment based on the profile information provided. It does not guarantee approval or benefits — final eligibility and approval are decided by the concerned government authority.
        </p>
      </div>
    </div>
  )
}
