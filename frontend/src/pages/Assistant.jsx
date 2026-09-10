import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { queryAssistant } from '../services/api.js'
import ErrorBanner from '../components/ErrorBanner.jsx'

const SUGGESTIONS = [
  'What BIS Standard is relevant for a stainless steel water bottle?',
  'Is there a standard for industrial safety helmets?',
  'Which standard applies to HDPE water tanks?',
]

function ResultCard({ data, onViewDetails }) {
  return (
    <div className="msg msg-ai card-msg">
      <div className="result-card-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>PRODUCT IDENTIFIED</div>
          <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{data.productIdentified}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="match-score-ring">{data.relevanceScore}%</div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>relevance</div>
        </div>
      </div>
      <div className="result-card-body">
        <div className="result-row"><span className="k">Relevant BIS Standard</span><span className="v mono">{data.standardNumber}</span></div>
        <div className="result-row"><span className="k">Title</span><span className="v">{data.standardTitle}</span></div>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 10 }}>
          <b style={{ color: 'var(--navy)' }}>Why:</b> {data.reason}
        </p>
        
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" style={{ fontSize: 12.5, padding: '8px 14px' }} onClick={onViewDetails}>View Standard Details</button>
        </div>
      </div>
    </div>
  )
}

export default function Assistant() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { role: 'ai', type: 'text', text: "Hello! I'm the BIS Assistant. Describe a product and I'll identify the relevant Indian Standard for it — try a suggestion below, or ask your own question." }
  ])
  const [query, setQuery] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, sending])

  async function send(text) {
    const q = (text ?? query).trim()
    if (!q) { setError('Please enter a product or question before asking.'); return }
    setError(null)
    setMessages((m) => [...m, { role: 'user', type: 'text', text: q }])
    setQuery('')
    setSending(true)
    const [{ data, error: apiError }] = await Promise.all([
      queryAssistant(q),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ])
    setSending(false)
    if (apiError) { setError(apiError); return }
    setMessages((m) => [...m, { role: 'ai', type: 'result', data }])
  }

  return (
    <div className="split-70-30">
      <div>
        <ErrorBanner message={error} onClose={() => setError(null)} />
        <div className="chat-wrap">
          <div className="chat-messages" ref={scrollRef}>
            {messages.map((m, i) => m.type === 'text'
              ? <div key={i} className={'msg ' + (m.role === 'user' ? 'msg-user' : 'msg-ai')}>{m.text}</div>
              : <ResultCard key={i} data={m.data} onViewDetails={() => navigate('/standards/' + standardIdFor(m.data.standardNumber))} />
            )}
            {sending && (
              <div className="msg msg-ai"><span className="typing-dots"><span></span><span></span><span></span></span></div>
            )}
          </div>
          <div className="suggest-row">
            {SUGGESTIONS.map((s) => (
              <div key={s} className="suggest-chip" onClick={() => send(s)}>{s}</div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Describe a product, e.g. 'stainless steel water bottle'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send() }}
            />
            <button className="btn btn-primary" onClick={() => send()} disabled={sending}>Ask</button>
          </div>
        </div>
      </div>
      <div>
        <div className="card">
          <div className="eyebrow">HOW THIS WORKS</div>
          <h4 style={{ fontSize: 14, marginBottom: 10 }}>Standard identification</h4>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
            Describe a product and the assistant matches it against the Bureau of Indian Standards catalogue, returning the most relevant standard along with a relevance score and a plain-language explanation.
          </p>
        </div>
      </div>
    </div>
  )
}

// Maps a mock standard number to the demo id used by GET /api/standards/{id}
function standardIdFor(standardNumber) {
  const map = {
    'IS 12701 : 1996': '1',
    'IS 10553 : 1983': '2',
    'IS 15410 : 2003': '3',
    'IS 17482 : 2021': '4',
    'IS 2925 : 1984': '5',
  }
  return map[standardNumber] || '4'
}
