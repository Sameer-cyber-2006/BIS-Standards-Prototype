import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext.jsx'

// Wraps a route that should not be visible until the user has logged in or
// registered (e.g. User Profile, Government Schemes Finder). Redirects to
// /login and remembers where the user was headed.
export default function RequireAuth({ children }) {
  const { isAuthenticated, authChecked } = useWorkflow()
  const location = useLocation()

  if (!authChecked) {
    return <div className="content"><div className="card"><div className="empty-note">Checking session…</div></div></div>
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}
