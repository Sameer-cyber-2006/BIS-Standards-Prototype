import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext.jsx'
import { getExplanationFollowUp } from '../services/api.js'
import ErrorBanner from '../components/ErrorBanner.jsx'

const FOLLOW_UPS = [
  'Explain this standard in simple language',
  'Why is it relevant?',
  'Which requirements matched?',
  'What requirements need verification?',
]

export default function Explanation() {
  const navigate = useNavigate()
  const { selectedStandard, explanation } = useWorkflow()
  const [chat, setChat] = useState([])
  const [asking, setAsking] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chat, asking])

  if (!selectedStandard || !explanation) {
    return (
      <div className="card">
        <div className="empty-note">Select a standard from Standard Matching to see its explanation.</div>
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <button className="btn btn-outline" onClick={() => navigate('/matching')}>Go to Standard Matching</button>
        </div>
      </div>
    )
  }

  async function ask(question) {
    setError(null)
    setChat((c) => [...c, { role: 'user', text: question }])
    setAsking(true)
    const [{ data, error: apiError }] = await Promise.all([
      getExplanationFollowUp(question, selectedStandard.standardNumber),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ])
    setAsking(false)
    if (apiError) { setError(apiError); return }
    setChat((c) => [...c, { role: 'ai', text: data.answer }])
  }

  return (
    <div className="split-60-40">
      <div>
        <ErrorBanner message={error} onClose={() => setError(null)} />
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14 }}>{selectedStandard.standardNumber}</span>
              <h3 style={{ fontSize: 16, marginTop: 4 }}>{selectedStandard.title}</h3>
            </div>
            <span className="badge badge-teal">{selectedStandard.relevanceScore}% relevant</span>
          </div>

          <div className="eyebrow" style={{ marginTop: 18 }}>WHY IS THIS BIS STANDARD RELEVANT?</div>
          <p style={{ fontSize: 13.5, marginTop: 6 }}>{explanation.summary}</p>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 10 }}>{explanation.simpleExplanation}</p>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>Matched Requirements</div>
            {explanation.matchedRequirements.map((m) => (
              <div key={m} className="check-item ok"><div className="mark">&#10003;</div>{m}</div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>Potential Gaps</div>
            {explanation.potentialGaps.map((g) => (
              <div key={g} className="check-item warn"><div className="mark">&#9888;</div>{g}</div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="btn btn-teal" onClick={() => navigate('/reports')}>Generate Compliance Report &#8594;</button>
          </div>
        </div>
      </div>
      <div>
        <div className="chat-wrap" style={{ height: 420 }}>
          <div className="chat-messages" ref={scrollRef}>
            {chat.length === 0 && <div className="msg msg-ai">Ask me a follow-up question about this standard.</div>}
            {chat.map((m, i) => (
              <div key={i} className={'msg ' + (m.role === 'user' ? 'msg-user' : 'msg-ai')}>{m.text}</div>
            ))}
            {asking && <div className="msg msg-ai"><span className="typing-dots"><span></span><span></span><span></span></span></div>}
          </div>
          <div className="suggest-row">
            {FOLLOW_UPS.map((q) => (
              <div key={q} className="suggest-chip" onClick={() => ask(q)}>{q}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
