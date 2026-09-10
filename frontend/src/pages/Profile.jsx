import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext.jsx'
import { updateProfile } from '../services/api.js'
import ErrorBanner from '../components/ErrorBanner.jsx'

const USER_TYPES = ['Industry', 'MSME', 'Startup', 'Consumer', 'Other']
const BUSINESS_SIZES = ['Micro', 'Small', 'Medium', 'Large', 'Not Applicable']
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi (NCT)', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Other',
]

const FIELD_ROWS = [
  ['name', 'Full Name', 'text'],
  ['email', 'Email', 'text'],
  ['phone', 'Phone Number', 'text'],
  ['organization', 'Organization / Business Name', 'text'],
]

export default function Profile() {
  const { profile, setProfile, logout } = useWorkflow()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/')
  }
  useEffect(() => {
    if (profile && !editing) setForm(profile)
  }, [profile, editing])

  function startEdit() {
    setForm(profile)
    setError(null)
    setSuccess(false)
    setEditing(true)
  }

  function cancelEdit() {
    setForm(profile)
    setEditing(false)
    setError(null)
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function save() {
    if (!form.name?.trim() || !form.email?.trim()) {
      setError('Full Name and Email are required.')
      return
    }
    setSaving(true)
    setError(null)
    const { data, error: apiError } = await updateProfile(form)
    setSaving(false)
    if (apiError) { setError(apiError); return }
    setProfile(data)          // immediately reflected app-wide, no refresh needed
    setEditing(false)
    setSuccess(true)
  }

  if (!form) {
    return <div className="card"><div className="empty-note">Loading profile…</div></div>
  }

  const view = editing ? form : profile

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <ErrorBanner message={error} onClose={() => setError(null)} />
      {success && !editing && (
        <div className="badge badge-teal" style={{ marginBottom: 14 }}>&#10003; Profile updated successfully.</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="eyebrow">USER PROFILE</div>
        {!editing && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={startEdit}>Edit Profile</button>
            <button className="btn-ghost" onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>

      <div className="grid grid-2" style={{ marginTop: 12 }}>
        {FIELD_ROWS.map(([key, label]) => (
          <div className="field" key={key}>
            <label className="field-label">{label}</label>
            {editing ? (
              <input type="text" value={form[key] || ''} onChange={(e) => update(key, e.target.value)} />
            ) : (
              <div style={{ fontSize: 13.5, padding: '10px 0', color: view[key] ? 'var(--ink)' : 'var(--ink-soft)' }}>{view[key] || '—'}</div>
            )}
          </div>
        ))}

        <div className="field">
          <label className="field-label">User Type</label>
          {editing ? (
            <select value={form.userType || ''} onChange={(e) => update('userType', e.target.value)}>
              <option value="">Select user type</option>
              {USER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          ) : (
            <div style={{ fontSize: 13.5, padding: '10px 0' }}>{view.userType || '—'}</div>
          )}
        </div>

        <div className="field">
          <label className="field-label">Business / Industry Sector</label>
          {editing ? (
            <input type="text" placeholder="e.g. Manufacturing, Services, Agro-based" value={form.sector || ''} onChange={(e) => update('sector', e.target.value)} />
          ) : (
            <div style={{ fontSize: 13.5, padding: '10px 0' }}>{view.sector || '—'}</div>
          )}
        </div>

        <div className="field">
          <label className="field-label">Business Type</label>
          {editing ? (
            <input type="text" placeholder="e.g. Manufacturing (MSME), Trading" value={form.businessType || ''} onChange={(e) => update('businessType', e.target.value)} />
          ) : (
            <div style={{ fontSize: 13.5, padding: '10px 0' }}>{view.businessType || '—'}</div>
          )}
        </div>

        <div className="field">
          <label className="field-label">State</label>
          {editing ? (
            <select value={form.state || ''} onChange={(e) => update('state', e.target.value)}>
              <option value="">Select State</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <div style={{ fontSize: 13.5, padding: '10px 0' }}>{view.state || '—'}</div>
          )}
        </div>

        <div className="field">
          <label className="field-label">City</label>
          {editing ? (
            <input type="text" value={form.city || ''} onChange={(e) => update('city', e.target.value)} />
          ) : (
            <div style={{ fontSize: 13.5, padding: '10px 0' }}>{view.city || '—'}</div>
          )}
        </div>

        <div className="field">
          <label className="field-label">Business Size</label>
          {editing ? (
            <select value={form.businessSize || ''} onChange={(e) => update('businessSize', e.target.value)}>
              <option value="">Select Business Size</option>
              {BUSINESS_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <div style={{ fontSize: 13.5, padding: '10px 0' }}>{view.businessSize || '—'}</div>
          )}
        </div>

        <div className="field">
          <label className="field-label">Annual Turnover <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>(optional)</span></label>
          {editing ? (
            <input type="text" placeholder="e.g. Rs. 45,00,000" value={form.turnover || ''} onChange={(e) => update('turnover', e.target.value)} />
          ) : (
            <div style={{ fontSize: 13.5, padding: '10px 0' }}>{view.turnover || '—'}</div>
          )}
        </div>

        <div className="field">
          <label className="field-label">Years in Business <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>(optional)</span></label>
          {editing ? (
            <input type="text" placeholder="e.g. 3 years" value={form.yearsInBusiness || ''} onChange={(e) => update('yearsInBusiness', e.target.value)} />
          ) : (
            <div style={{ fontSize: 13.5, padding: '10px 0' }}>{view.yearsInBusiness || '—'}</div>
          )}
        </div>

        <div className="field">
          <label className="field-label">Main Product / Service</label>
          {editing ? (
            <input type="text" value={form.productOrService || ''} onChange={(e) => update('productOrService', e.target.value)} />
          ) : (
            <div style={{ fontSize: 13.5, padding: '10px 0' }}>{view.productOrService || '—'}</div>
          )}
        </div>

        <div className="field">
          <label className="field-label">Primary Requirement / Purpose</label>
          {editing ? (
            <input type="text" placeholder="e.g. Business Expansion" value={form.purpose || ''} onChange={(e) => update('purpose', e.target.value)} />
          ) : (
            <div style={{ fontSize: 13.5, padding: '10px 0' }}>{view.purpose || '—'}</div>
          )}
        </div>
      </div>

      {editing && (
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="btn btn-primary" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save Changes'}</button>
          <button className="btn btn-outline" disabled={saving} onClick={cancelEdit}>Cancel</button>
        </div>
      )}
    </div>
  )
}
