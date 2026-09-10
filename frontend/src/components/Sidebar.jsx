import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, FileSearch, BarChart3, FileText, Lightbulb, Landmark, User, LogIn, LogOut, Lock } from 'lucide-react'
import { useWorkflow } from '../context/WorkflowContext.jsx'

// Every item except BIS Assistant sits behind RequireAuth on the route
// itself - `open: true` just controls whether the sidebar shows it as
// freely usable or shows a lock hint before the user gets redirected.
const CORE_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/assistant', label: 'BIS Assistant', Icon: MessageSquare, open: true },
  { to: '/procurement', label: 'Procurement Analyzer', Icon: FileSearch },
  { to: '/matching', label: 'Standard Matching', Icon: BarChart3 },
  { to: '/reports', label: 'Compliance Reports', Icon: FileText },
]

const SUPPORT_ITEMS = [
  { to: '/patent', label: 'Patent Guidance', Icon: Lightbulb },
  { to: '/schemes', label: 'Government Schemes', Icon: Landmark },
]

function Item({ to, label, Icon, open, locked }) {
  return (
    <NavLink to={to} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
      <span className="ico"><Icon size={16} /></span>
      {label}
      {locked && !open && (
        <Lock size={12} style={{ marginLeft: 'auto', opacity: 0.55 }} />
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { isAuthenticated, authChecked, logout } = useWorkflow()
  const navigate = useNavigate()
  const locked = !(authChecked && isAuthenticated)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-row">
          <div className="mark">B</div>
          <div>
            <h4>BIS Standards</h4>
            <span>Compliance Assistant</span>
          </div>
        </div>
      </div>
      {locked && (
        <div className="empty-note" style={{ margin: '0 16px 10px', fontSize: 11.5 }}>
          <Lock size={11} style={{ verticalAlign: '-1px', marginRight: 4 }} />
          Log in to unlock everything except BIS Assistant.
        </div>
      )}
      <ul className="nav-list" style={{ listStyle: 'none' }}>
        {CORE_ITEMS.map((it) => <Item key={it.to} {...it} locked={locked} />)}
        <div className="nav-section-label">Supporting Features</div>
        {SUPPORT_ITEMS.map((it) => <Item key={it.to} {...it} locked={locked} />)}
        <div className="nav-section-label">Account</div>
        {authChecked && isAuthenticated ? (
          <>
            <Item to="/profile" label="User Profile" Icon={User} open />
            <li className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <span className="ico"><LogOut size={16} /></span>
              Log Out
            </li>
          </>
        ) : (
          <Item to="/login" label="Login / Register" Icon={LogIn} open />
        )}
      </ul>
      <div className="sidebar-foot">SIH 2026 · BIS Standards</div>
    </div>
  )
}
