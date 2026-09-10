import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext.jsx'
import { getExplanation } from '../services/api.js'
import ErrorBanner from '../components/ErrorBanner.jsx'

function scoreColor(score) {
  if (score >= 90) return 'var(--teal)'
  if (score >= 75) return 'var(--gold)'
  return 'var(--rust)'
}

function MatchCard({ m, isTop, onExplain, busy }) {
  const color = scoreColor(m.relevanceScore)
  return (
    <div className="card" style={{ marginTop: 12, borderColor: isTop ? 'var(--teal)' : 'var(--line)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{m.standardNumber}</span>
            {isTop && <span className="badge badge-teal">Top Match</span>}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 3 }}>{m.title}</div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 80 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color }}>{m.relevanceScore}%</div>
        </div>
      </div>
      <div className="progress-track" style={{ marginTop: 12 }}>
        <div className="progress-fill" style={{ width: m.relevanceScore + '%', background: color }} />
      </div>
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        {m.matchedRequirements.map((r) => (
          <span key={r} style={{ fontSize: 12, color: 'var(--teal)' }}>&#10003; {r} Matched</span>
        ))}
        <span style={{ fontSize: 12, color: 'var(--gold)' }}>&#9888; {m.potentialGap}</span>
      </div>
      <div style={{ marginTop: 14 }}>
        <button className="btn btn-primary" style={{ fontSize: 12.5, padding: '8px 16px' }} disabled={busy} onClick={() => onExplain(m)}>
          {busy ? 'Loading…' : 'View AI Explanation \u2192'}
        </button>
      </div>
    </div>
  )
}

export default function Matching() {
  const navigate = useNavigate()
  const { matched, extracted, setSelectedStandard, setExplanation } = useWorkflow()
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)

  async function handleExplain(m) {
    setBusyId(m.standardId)
    setError(null)
    const { data, error: apiError } = await getExplanation({
      product: extracted?.product,
      standardNumber: m.standardNumber,
      matchedRequirements: m.matchedRequirements,
      potentialGap: m.potentialGap,
    })
    setBusyId(null)
    if (apiError) { setError(apiError); return }
    setSelectedStandard(m)
    setExplanation(data)
    navigate('/explanation')
  }

  if (!matched) {
    return (
      <div className="card">
        <div className="empty-note">No requirements to match yet. Analyze a procurement document first, or ask the BIS Assistant directly.</div>
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <button className="btn btn-outline" onClick={() => navigate('/procurement')}>Go to Procurement Analyzer</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ErrorBanner message={error} onClose={() => setError(null)} />
      {extracted && (
        <div className="card">
          <div className="eyebrow">PRODUCT REQUIREMENTS</div>
          <div className="grid grid-4" style={{ marginTop: 8 }}>
            <div><div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Category</div><div style={{ fontWeight: 600 }}>{extracted.application}</div></div>
            <div><div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Material</div><div style={{ fontWeight: 600 }}>{extracted.material}</div></div>
            <div><div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Capacity</div><div style={{ fontWeight: 600 }}>{extracted.capacity}</div></div>
            <div><div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Application</div><div style={{ fontWeight: 600 }}>{extracted.application}</div></div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="eyebrow">RECOMMENDED BIS STANDARDS</div>
        <div className="section-title" style={{ marginTop: 2 }}>Ranked by relevance</div>
        {matched.map((m, i) => (
          <MatchCard key={m.standardId} m={m} isTop={i === 0} onExplain={handleExplain} busy={busyId === m.standardId} />
        ))}
      </div>

      <div className="card" style={{ background: '#F8FAFB' }}>
        <div className="eyebrow">CONCEPTUAL ARCHITECTURE</div>
        <div className="grid grid-3" style={{ marginTop: 6 }}>
          <div style={{ fontSize: 12.5 }}><b style={{ color: 'var(--navy)' }}>AI Reasoning</b><br /><span style={{ color: 'var(--ink-soft)' }}>Understands the product requirements</span></div>
          <div style={{ fontSize: 12.5 }}><b style={{ color: 'var(--navy)' }}>Verified BIS Knowledge Base</b><br /><span style={{ color: 'var(--ink-soft)' }}>Provides BIS Standard information</span></div>
          <div style={{ fontSize: 12.5 }}><b style={{ color: 'var(--navy)' }}>Matching Engine</b><br /><span style={{ color: 'var(--ink-soft)' }}>Compares requirements and calculates relevance</span></div>
        </div>
      </div>
    </div>
  )
}
