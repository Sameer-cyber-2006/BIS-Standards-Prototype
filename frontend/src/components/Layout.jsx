import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

const TITLES = {
  '/dashboard': 'Dashboard',
  '/assistant': 'BIS Assistant',
  '/procurement': 'Procurement Analyzer',
  '/matching': 'Standard Matching',
  '/reports': 'Compliance Reports',
  '/patent': 'Patent Guidance',
  '/standards': 'Standard Details',
  '/schemes': 'Government Schemes Finder',
  '/profile': 'User Profile',
  '/explanation': 'AI-Powered Explanation',
}

export default function Layout({ children }) {
  const location = useLocation()
  const base = '/' + location.pathname.split('/')[1]
  const title = TITLES[base] || 'Dashboard'

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <h1>{title}</h1>
          <div className="topbar-right">
            <Link to="/" className="badge badge-navy">&#8592; Home</Link>
            <div className="avatar">BIS</div>
          </div>
        </div>
        <div className="content fade-in">{children}</div>
      </div>
    </div>
  )
}
