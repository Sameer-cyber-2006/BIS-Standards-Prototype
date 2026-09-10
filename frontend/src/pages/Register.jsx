import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'

const USER_TYPES = ['Industry', 'MSME', 'Startup', 'Consumer', 'Other']

export default function Register() {
  const { register } = useWorkflow()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', organization: '', userType: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || form.password.length < 4) {
      setError('Full Name, Email and a password of at least 4 characters are required.')
      return
    }
    setLoading(true)
    setError(null)
    const result = await register(form)
    setLoading(false)
    if (!result.success) { setError(result.message); return }
    navigate('/login', { replace: true, state: { registered: true } })
  }

  return (
    <AuthLayout title="CREATE ACCOUNT" subtitle="Register to set up your profile — the rest of your business details can be added or edited anytime after.">
      <ErrorBanner message={error} onClose={() => setError(null)} />
      <form onSubmit={submit}>
        <div className="field">
          <label className="field-label">Full Name</label>
          <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Email</label>
          <input type="text" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label className="field-label">Password</label>
          <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="At least 4 characters" />
        </div>
        <div className="field">
          <label className="field-label">Phone Number</label>
          <input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Organization / Business Name</label>
          <input type="text" value={form.organization} onChange={(e) => update('organization', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">User Type</label>
          <select value={form.userType} onChange={(e) => update('userType', e.target.value)}>
            <option value="">Select user type</option>
            {USER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button className="btn btn-primary btn-block" disabled={loading} type="submit">{loading ? 'Creating account…' : 'Create Account'}</button>
      </form>
      <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 16 }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--navy)', textDecoration: 'underline' }}>Log in</Link>
      </p>
    </AuthLayout>
  )
}
