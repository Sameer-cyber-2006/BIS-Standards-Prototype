import React, { useState } from 'react'
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

// A focused, separate page (not the full Profile page) where the user can
// quickly add or change just the fields the Government Schemes Finder
// actually uses, without leaving the schemes flow to edit their whole profile.
export default function SchemeProfileEdit() {
  const { profile, setProfile } = useWorkflow()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    userType: profile?.userType || '',
    sector: profile?.sector || '',
    state: profile?.state || '',
    businessSize: profile?.businessSize || '',
    turnover: profile?.turnover || '',
    purpose: profile?.purpose || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function save() {
    setSaving(true)
    setError(null)
    const merged = { ...profile, ...form }
    const { data, error: apiError } = await updateProfile(merged)
    setSaving(false)
    if (apiError) { setError(apiError); return }
    setProfile(data)
    navigate('/schemes')
  }

  if (!profile) return <div className="card"><div className="empty-note">Loading…</div></div>

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <ErrorBanner message={error} onClose={() => setError(null)} />
      <div className="eyebrow">SCHEME-MATCHING INFORMATION</div>
      <h3 style={{ fontSize: 15, marginBottom: 6 }}>Add or update the details used to find suitable schemes</h3>
      <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 16 }}>This updates the relevant fields on your profile. For your name, email, and other details, use the full User Profile page.</p>

      <div className="field">
        <label className="field-label">User Type</label>
        <select value={form.userType} onChange={(e) => update('userType', e.target.value)}>
          <option value="">Select user type</option>
          {USER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="field">
        <label className="field-label">Sector</label>
        <input type="text" placeholder="e.g. Manufacturing, Services" value={form.sector} onChange={(e) => update('sector', e.target.value)} />
      </div>
      <div className="field">
        <label className="field-label">State</label>
        <select value={form.state} onChange={(e) => update('state', e.target.value)}>
          <option value="">Select State</option>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="field">
        <label className="field-label">Business Size</label>
        <select value={form.businessSize} onChange={(e) => update('businessSize', e.target.value)}>
          <option value="">Select Business Size</option>
          {BUSINESS_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="field">
        <label className="field-label">Annual Turnover <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>(optional)</span></label>
        <input type="text" placeholder="e.g. Rs. 45,00,000" value={form.turnover} onChange={(e) => update('turnover', e.target.value)} />
      </div>
      <div className="field">
        <label className="field-label">Primary Requirement / Purpose</label>
        <input type="text" placeholder="e.g. Business Expansion" value={form.purpose} onChange={(e) => update('purpose', e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <button className="btn btn-primary" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save & Return to Schemes Finder'}</button>
        <button className="btn btn-outline" disabled={saving} onClick={() => navigate('/schemes')}>Cancel</button>
      </div>
    </div>
  )
}
