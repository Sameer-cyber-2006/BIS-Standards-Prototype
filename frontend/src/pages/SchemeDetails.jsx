import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSchemeDetails } from '../services/api.js'
import { useWorkflow } from '../context/WorkflowContext.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'

function statusBadgeClass(status) {
  if (status === 'Eligible') return 'badge-teal'
  if (status === 'Partially Matched') return 'badge-gold'
  return 'badge-rust'
}

export default function SchemeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { schemeResults } = useWorkflow()
  const [scheme, setScheme] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [generatedReport, setGeneratedReport] = useState(null)

  const eligibility = schemeResults ? schemeResults.find((s) => s.schemeId === id) : null

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getSchemeDetails(id).then(({ data, error: apiError }) => {
      if (!active) return
      setLoading(false)
      if (apiError) { setError(apiError); return }
      setScheme(data)
    })
    return () => { active = false }
  }, [id])

  async function generateSchemeReport() {
    if (!scheme || generatingReport) return
    setGeneratingReport(true)
    setGeneratedReport(null)

    // Keep generation separate from download: the report is first assembled
    // and marked ready, then the user explicitly downloads that generated file.
    await new Promise((resolve) => setTimeout(resolve, 900))

    const report = {
      reportId: `SCHEME-${id}-${Date.now()}`,
      generatedDate: new Date().toLocaleString('en-IN'),
      scheme,
      eligibility,
    }
    setGeneratedReport(report)
    setGeneratingReport(false)
  }

  // Builds the same kind of print-ready HTML document used by the BIS
  // Compliance Analysis Report (see Reports.jsx / buildReportHtml). Opening
  // it in a new tab and calling window.print() lets the user pick
  // "Save as PDF" in the browser's print dialog - so both reports now
  // download as an actual PDF instead of a plain .txt file.
  function buildSchemeReportHtml(r) {
    const { scheme: rs, eligibility: re } = r
    const li = (items) => items.map((i) => `<li>${i}</li>`).join('')
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${r.reportId}</title>
    <style>
      body{font-family:Georgia,serif; max-width:700px; margin:40px auto; color:#172033;}
      h1{font-size:20px; border-bottom:2px solid #14324F; padding-bottom:10px;}
      h4{font-size:12px; text-transform:uppercase; letter-spacing:.05em; color:#1E7F6E; margin-top:24px; margin-bottom:6px;}
      .row{display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:6px 0; font-size:14px;}
      .foot{margin-top:30px; padding-top:14px; border-top:1px solid #ccc; font-size:11px; color:#666;}
      ul{margin:4px 0; padding-left:20px; font-size:13px;}
    </style></head><body>
      <h1>Government Scheme Report</h1>
      <p style="font-size:12px; color:#666;">Report ID: ${r.reportId} &middot; Generated: ${r.generatedDate}</p>
      <h4>Scheme</h4>
      <div class="row"><span>${rs.schemeName}</span><b>${rs.department}</b></div>
      <h4>Target Beneficiaries</h4>
      <p style="font-size:13px;">${rs.targetBeneficiaries}</p>
      <h4>Sector &amp; Applicability</h4>
      <p style="font-size:13px;">${rs.sector} &middot; ${rs.location}</p>
      <h4>Eligibility Criteria</h4>
      <ul>${li(rs.eligibilityCriteria)}</ul>
      <h4>Benefits</h4>
      <p style="font-size:13px;">${rs.benefits}</p>
      <h4>Required Documents</h4>
      <ul>${li(rs.requiredDocuments)}</ul>
      <h4>Application Information</h4>
      <p style="font-size:13px;">${rs.applicationInfo}</p>
      ${re ? `
      <h4>Eligibility Status</h4>
      <div class="row"><span>${re.eligibilityStatus}</span><b>${re.score}% score</b></div>
      <h4>Matched Criteria</h4>
      <ul>${li(re.matchedCriteria)}</ul>
      <h4>Unmatched Criteria</h4>
      <ul>${li(re.unmatchedCriteria)}</ul>
      ` : ''}
      <div class="foot">Disclaimer: This report is a preliminary assessment based on the information provided by the user. Final eligibility, approval and benefits are subject to the rules and decision of the concerned government authority.</div>
    </body></html>`
  }

  function downloadGeneratedReport() {
    if (!generatedReport) return
    setError(null)
    const html = buildSchemeReportHtml(generatedReport)
    const printWindow = window.open('', '_blank', 'width=800,height=900')
    if (!printWindow) {
      setError('Your browser blocked the report window. Please allow pop-ups for this site and try again, or use "Download as HTML file" below.')
      return
    }
    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    // Give the new tab a moment to paint before triggering the print dialog.
    printWindow.onload = () => { printWindow.focus(); printWindow.print() }
    setTimeout(() => { try { printWindow.focus(); printWindow.print() } catch (e) {} }, 400)
  }

  function downloadGeneratedReportHtmlFile() {
    if (!generatedReport) return
    setError(null)
    const html = buildSchemeReportHtml(generatedReport)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${generatedReport.reportId}.html`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="card"><div className="empty-note">Loading scheme details…</div></div>

  return (
    <div>
      <ErrorBanner message={error} onClose={() => setError(null)} />
      {scheme ? (
        <div className="card" style={{ maxWidth: 720 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow">SCHEME DETAILS</div>
              <h2 style={{ fontSize: 19, marginTop: 4 }}>{scheme.schemeName}</h2>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 4 }}>{scheme.department}</div>
            </div>
            {eligibility && <span className={'badge ' + statusBadgeClass(eligibility.eligibilityStatus)}>{eligibility.eligibilityStatus}</span>}
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>Target Beneficiaries</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{scheme.targetBeneficiaries}</p>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>Sector &amp; Applicability</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{scheme.sector} &middot; {scheme.location}</p>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 6 }}>Eligibility Criteria</div>
            {scheme.eligibilityCriteria.map((c) => (
              <div key={c} style={{ fontSize: 12.5, color: 'var(--ink-soft)', padding: '4px 0' }}>&#8226; {c}</div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>Benefits</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{scheme.benefits}</p>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 6 }}>Required Documents</div>
            {scheme.requiredDocuments.map((d) => (
              <div key={d} style={{ fontSize: 12.5, color: 'var(--ink-soft)', padding: '4px 0' }}>&#8226; {d}</div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>Application Information</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{scheme.applicationInfo}</p>
          </div>

          {eligibility && (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)', marginBottom: 6 }}>Basic Eligibility Result</div>
              {eligibility.matchedCriteria.map((m) => (
                <div key={m} className="check-item ok"><div className="mark">&#10003;</div>{m}</div>
              ))}
              {eligibility.unmatchedCriteria.map((m) => (
                <div key={m} className="check-item warn"><div className="mark">&#9888;</div>{m}</div>
              ))}
            </div>
          )}

          <div className="card" style={{ marginTop: 18, background: '#F8FAFB' }}>
            <div className="eyebrow">REPORT</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', marginTop: 4 }}>Government Scheme Report</div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '6px 0 12px' }}>
              Generate the report first. The download option becomes available only after the report has been generated successfully.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" disabled={generatingReport} onClick={generateSchemeReport}>
                {generatingReport ? 'Generating Report…' : generatedReport ? 'Regenerate Report' : 'Generate Report'}
              </button>
              <button className="btn btn-outline" disabled={!generatedReport} onClick={downloadGeneratedReport}>
                {generatedReport ? 'Download Generated Report' : 'Download Report'}
              </button>
            </div>
            {generatedReport && (
              <>
                <div className="check-item ok" style={{ marginTop: 12 }}>
                  <div className="mark">&#10003;</div>
                  Report generated successfully · {generatedReport.reportId}
                </div>
                <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 8 }}>
                  Opens a print-ready view — choose "Save as PDF" in the print dialog to download it. Pop-ups must be
                  allowed for this site. Prefer a plain file?{' '}
                  <span
                    style={{ color: 'var(--navy)', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={downloadGeneratedReportHtmlFile}
                  >
                    Download as HTML file
                  </span> instead.
                </p>
              </>
            )}
          </div>

          <div className="future-note" style={{ background: 'var(--rust-soft)', borderColor: '#E5C3AE', color: '#7A3A1D', marginTop: 18 }}>
            <div><b>Disclaimer:</b> This eligibility result is a preliminary assessment based on the information provided by the user. Final eligibility, approval and benefits are subject to the rules and decision of the concerned government authority.</div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>&#8592; Back</button>
            <button className="btn btn-primary" onClick={() => navigate('/schemes')}>Go to Schemes Finder</button>
          </div>
        </div>
      ) : !error && (
        <div className="card"><div className="empty-note">Scheme not found in the mock database.</div></div>
      )}
    </div>
  )
}
