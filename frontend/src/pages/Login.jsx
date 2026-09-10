import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'

export default function Login() {
  const { login } = useWorkflow()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(location.state?.registered ? 'Registration successful. Please log in to continue.' : null)

  const redirectTo = location.state?.from || '/dashboard'

  async function submit(e) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) { setError('Please enter both email and password.'); return }
    setLoading(true)
    setError(null)
    const result = await login(email.trim(), password)
    setLoading(false)
    if (!result.success) { setError(result.message); return }
    navigate(redirectTo, { replace: true })
  }

  return (
    <AuthLayout title="LOG IN" subtitle="Log in to use Procurement Analysis, Standard Matching, Reports, Patent Guidance, Government Schemes and your Profile. The BIS Assistant alone stays open without an account.">
      <ErrorBanner message={error} onClose={() => setError(null)} />
      <form onSubmit={submit}>
        <div className="field">
          <label className="field-label">Email</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label className="field-label">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="btn btn-primary btn-block" disabled={loading} type="submit">{loading ? 'Logging in…' : 'Log In'}</button>
      </form>
      <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 16 }}>
        New here? <Link to="/register" style={{ color: 'var(--navy)', textDecoration: 'underline' }}>Create an account</Link>
      </p>
      <div style={{ marginTop: 14, background: 'var(--teal-soft)', border: '1px solid #C9E4DE', borderRadius: 7, padding: '10px 12px', fontSize: 11.5, color: 'var(--teal)' }}>
        <b>Demo account:</b> <span className="mono">demo@example.com</span> / <span className="mono">demo1234</span>
      </div>
    </AuthLayout>
  )
}
