import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, FileSearch, Landmark } from 'lucide-react'

// Two-panel shell for the Login/Register pages - a branded side panel plus
// the form card. Deliberately without the app Sidebar, since these pages
// exist to gate access to it. Side panel hides on narrow screens.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-side">
        <svg className="auth-side-decor" viewBox="0 0 360 360" fill="none">
          <circle cx="80" cy="280" r="160" stroke="#8FC9BC" strokeOpacity="0.25" strokeWidth="1.5" />
          <circle cx="80" cy="280" r="110" stroke="#E8C27A" strokeOpacity="0.2" strokeWidth="1.5" />
          <circle cx="80" cy="280" r="60" fill="#8FC9BC" fillOpacity="0.08" />
        </svg>

        <div className="auth-side-top">
          <div className="mark">B</div>
          <h4 style={{ color: '#fff', fontSize: 15 }}>BIS Standards</h4>
        </div>

        <div className="auth-side-mid">
          <div className="eyebrow" style={{ color: '#8FC9BC' }}>SIH26107 PROTOTYPE</div>
          <h2>One profile, matched against standards, patents and government schemes.</h2>
          <p>Log in to save your business profile and get results personalised to your sector, state and business size.</p>
          <div className="auth-feature-list">
            <div className="auth-feature-item"><span className="dot"><ShieldCheck size={12} /></span>Your profile powers the Government Schemes Finder</div>
            <div className="auth-feature-item"><span className="dot"><FileSearch size={12} /></span>Pick up compliance reports where you left off</div>
            <div className="auth-feature-item"><span className="dot"><Landmark size={12} /></span>Preliminary eligibility, matched to your details</div>
          </div>
        </div>

        <div className="auth-side-foot">Smart India Hackathon 2026 &middot; Problem Statement SIH26107</div>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          <div className="auth-card-mobile-brand">
            <div className="mark">B</div>
            <h4 style={{ fontSize: 15 }}>BIS Standards</h4>
          </div>
          <div className="eyebrow">{title}</div>
          {subtitle && <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 4, marginBottom: 16 }}>{subtitle}</p>}
          {children}
          <p style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 18, textAlign: 'center' }}>
            <Link to="/" style={{ color: 'var(--ink-soft)' }}>&#8592; Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
