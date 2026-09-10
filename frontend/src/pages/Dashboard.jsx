import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, FileSearch, BarChart3, FileText, Lightbulb, Landmark, User } from 'lucide-react'

function StatCard({ num, label }) {
  return (
    <div className="stat-card">
      <div className="num">{num}</div>
      <div className="lbl">{label}</div>
    </div>
  )
}

function PillBtn({ Icon, title, desc, to }) {
  const navigate = useNavigate()
  return (
    <button className="pill-btn" onClick={() => navigate(to)}>
      <div className="ico-box"><Icon size={18} /></div>
      <div>
        <div className="t">{title}</div>
        <div className="d">{desc}</div>
      </div>
    </button>
  )
}

export default function Dashboard() {
  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--navy), var(--navy-light))', border: 'none', color: '#fff', marginBottom: 20 }}>
        <div className="eyebrow" style={{ color: '#8FC9BC' }}>WELCOME BACK</div>
        <h2 style={{ color: '#fff', fontSize: 22 }}>Welcome to BIS Standards</h2>
        <p style={{ color: '#C4D2E0', marginTop: 6, maxWidth: 560 }}>Search a standard, analyze a procurement document, or pick up a compliance report in progress. Every result on this page is pulled live from the backend service.</p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 22 }}>
        <StatCard num="12" label="Standards Analyzed" />
        <StatCard num="5" label="Procurement Documents" />
        <StatCard num="8" label="Reports Generated" />
        <StatCard num="6" label="Government Schemes Listed" />
      </div>

      <div className="section-title">Quick actions</div>
      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <PillBtn Icon={MessageSquare} title="Ask BIS Assistant" desc="Find the right standard for a product" to="/assistant" />
        <PillBtn Icon={FileSearch} title="Analyze Procurement PDF" desc="Extract requirements from a document" to="/procurement" />
        <PillBtn Icon={BarChart3} title="Find BIS Standards" desc="View ranked standard matches" to="/matching" />
        <PillBtn Icon={FileText} title="View Compliance Reports" desc="Preview and download reports" to="/reports" />
      </div>

      <div className="section-title">Supporting features</div>
      <div className="grid grid-2">
        <PillBtn Icon={Lightbulb} title="Patent Guidance" desc="Preliminary AI-based guidance" to="/patent" />
        <PillBtn Icon={Landmark} title="Government Schemes Finder" desc="Find relevant schemes and check basic eligibility" to="/schemes" />
      </div>

      <div className="section-title" style={{ marginTop: 24 }}>Account</div>
      <div className="grid grid-2">
        <PillBtn Icon={User} title="User Profile" desc="View or edit your profile information" to="/profile" />
      </div>
    </div>
  )
}
