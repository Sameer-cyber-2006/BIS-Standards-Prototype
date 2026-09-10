import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'

const CORE_STEPS = [
  ['01', 'Product / Query', 'A product name, or a procurement PDF, is submitted for review.'],
  ['02', 'AI Understanding', 'Requirements — material, capacity, application — are extracted.'],
  ['03', 'Standard Matching', 'Requirements are compared against the mock BIS knowledge base.'],
  ['04', 'AI Explanation', 'The backend explains why each standard applies, in plain language.'],
  ['05', 'Compliance Report', 'A structured report of matches and gaps is generated for download.'],
]

const CORE_FEATURES = [
  ['BIS Standard Assistant', 'Ask a question or search a product to get a matched Indian Standard, instantly.', '/assistant'],
  ['Procurement Analyzer', 'Upload a procurement specification PDF and extract structured requirements.', '/procurement'],
  ['Standard Matching', 'Ranked BIS Standards with relevance scores and matched-requirement indicators.', '/matching'],
  ['AI-Powered Explanation', 'Plain-language reasoning for why a standard applies, with follow-up Q&A.', '/matching'],
  ['Compliance Report', 'A structured, shareable preview of requirements, matches and gaps.', '/reports'],
]

const SUPPORT_FEATURES = [
  ['Patent Guidance', 'Preliminary, AI-based guidance on patent considerations for an innovation.', '/patent'],
  ['Government Schemes Finder', 'Discover relevant government schemes and check basic eligibility against your profile.', '/schemes'],
]

const ARCH_NODES = ['User Interface', 'Application Server', 'AI Reasoning Layer', 'Document Processing', 'Standards Knowledge Base', 'Data Storage', 'Matching Engine', 'Report Generator']

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <div className="landing-nav">
        <div className="brand">
          <div className="mark">B</div>
          <h4>BIS Standards</h4>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-outline" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>See How It Works</button>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Get Started</button>
        </div>
      </div>

      <div className="hero">
        <svg className="hero-decor" viewBox="0 0 460 460" fill="none">
          <circle cx="330" cy="120" r="150" stroke="#1E7F6E" strokeOpacity="0.14" strokeWidth="1.5" />
          <circle cx="330" cy="120" r="105" stroke="#B8842E" strokeOpacity="0.16" strokeWidth="1.5" />
          <circle cx="330" cy="120" r="60" fill="#1E7F6E" fillOpacity="0.07" />
          <path d="M330 60 L330 120 L375 145" stroke="#14324F" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="hero-inner">
          <div className="eyebrow">PROBLEM STATEMENT SIH26107 — INDIAN STANDARDS &amp; BIS SERVICES</div>
          <h1>AI-powered BIS Standards &amp; Compliance Assistant</h1>
          <p className="sub">Identify relevant Indian Standards, analyze product and procurement requirements, understand compliance needs, and simplify your compliance journey.</p>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={() => navigate('/assistant')}>Try BIS Assistant &#8594;</button>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Get Started (Login)</button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 10 }}>
            <Lock size={11} style={{ verticalAlign: '-1px', marginRight: 4 }} />
            The BIS Assistant is open to everyone. All other features need a free account.
          </p>
        </div>
      </div>

      <div className="trust-strip">
        <div className="trust-item"><span className="num">7</span><span className="lbl">Modules across one workflow</span></div>
        <div className="trust-item"><span className="num">5</span><span className="lbl">Core steps, backend-connected</span></div>
        <div className="trust-item"><span className="num">10</span><span className="lbl">Connected backend endpoints</span></div>
        <div className="trust-item"><span className="num">100%</span><span className="lbl">AI-assisted, standards-backed</span></div>
      </div>

      <div className="flow-strip" id="how-it-works">
        <div className="flow-label">How it works</div>
        <div className="flow-row">
          {CORE_STEPS.map(([n, title, desc], i) => (
            <React.Fragment key={n}>
              <div className="flow-step">
                <div className="n">{n}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
              {i < CORE_STEPS.length - 1 && <div className="flow-arrow">&#8594;</div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Seven modules, one workflow</h2>
        <p className="lead">The first five modules form the CORE BIS WORKFLOW and are fully connected end to end. Patent guidance and government scheme discovery are supporting features alongside the core workflow.</p>
        <div className="grid grid-3">
          {CORE_FEATURES.map(([title, desc, to]) => (
            <div key={title} className="feature-card core" onClick={() => navigate(to)}>
              <div className="feature-tag" style={{ color: 'var(--teal)' }}>
                CORE{to !== '/assistant' && <Lock size={10} style={{ verticalAlign: '-1px', marginLeft: 6 }} />}
              </div>
              <h4>{title}</h4>
              <p>{desc}</p>
              {to !== '/assistant' && <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>Login required</p>}
            </div>
          ))}
        </div>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {SUPPORT_FEATURES.map(([title, desc, to]) => (
            <div key={title} className="feature-card support" onClick={() => navigate(to)}>
              <div className="feature-tag" style={{ color: 'var(--gold)' }}>
                SUPPORTING<Lock size={10} style={{ verticalAlign: '-1px', marginLeft: 6 }} />
              </div>
              <h4>{title}</h4>
              <p>{desc}</p>
              <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>Login required</p>
            </div>
          ))}
        </div>
      </div>

      <div className="arch-strip">
        <div className="arch-inner">
          <div className="eyebrow" style={{ color: '#8FC9BC' }}>END-TO-END SYSTEM FLOW</div>
          <h2 style={{ color: '#fff', fontSize: 22 }}>How a request moves through the system</h2>
          <div className="arch-row">
            {ARCH_NODES.map((n, i) => (
              <React.Fragment key={n}>
                <div className="arch-node">{n}</div>
                {i < ARCH_NODES.length - 1 && <div className="arch-sep">&#8594;</div>}
              </React.Fragment>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: '#9FB4C9', marginTop: 20, maxWidth: 640 }}>
            The interface communicates with a live backend service end to end, with the AI, standards, and matching layers designed to plug in seamlessly as they come online.
          </p>
        </div>
      </div>

      <div className="landing-footer">Smart India Hackathon 2026 &middot; Problem Statement SIH26107 &middot; Full-stack prototype for demonstration purposes only</div>
    </div>
  )
}
