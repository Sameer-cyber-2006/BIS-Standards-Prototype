import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext.jsx'
import { generateReport } from '../services/api.js'
import ErrorBanner from '../components/ErrorBanner.jsx'

export default function Reports() {
  const navigate = useNavigate()
  const { extracted, selectedStandard, explanation, report, setReport } = useWorkflow()
  const [generating, setGenerating] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [error, setError] = useState(null)

  if (!extracted) {
    return (
      <div className="card">
        <div className="empty-note">No report data yet. Analyze a procurement document first — this report is built from that document.</div>
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <button className="btn btn-outline" onClick={() => navigate('/procurement')}>Go to Procurement Analyzer</button>
        </div>
      </div>
    )
  }
  if (!selectedStandard) {
    return (
      <div className="card">
        <div className="empty-note">Document analyzed, but no standard selected yet. Pick a matched standard first.</div>
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <button className="btn btn-outline" onClick={() => navigate('/matching')}>Go to Standard Matching</button>
        </div>
      </div>
    )
  }

  const e = extracted
  const s = selectedStandard

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    setDownloaded(false)
    const { data, error: apiError } = await generateReport({
      product: e.product,
      material: e.material,
      capacity: e.capacity,
      application: e.application,
      recommendedStandard: s.standardNumber,
      standardTitle: s.title,
      relevanceScore: s.relevanceScore,
      matchedRequirements: s.matchedRequirements,
      potentialGaps: explanation?.potentialGaps || [s.potentialGap],
      explanation: explanation?.summary || 'This standard is relevant because the product category, material and intended application match the identified requirements.',
    })
    setGenerating(false)
    if (apiError) { setError(apiError); return }
    setReport(data)
  }

  function handleDownload() {
    if (!r) return
    setError(null)
    const html = buildReportHtml(r)
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
    setDownloaded(true)
  }

  function handleDownloadHtmlFile() {
    if (!r) return
    setError(null)
    const html = buildReportHtml(r)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = r.reportId + '.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloaded(true)
  }

  function buildReportHtml(r) {
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
      <h1>BIS Compliance Analysis Report</h1>
      <p style="font-size:12px; color:#666;">Report ID: ${r.reportId} &middot; Generated: ${r.generatedDate}</p>
      <h4>Product Information</h4>
      <div class="row"><span>Product</span><b>${r.product}</b></div>
      <div class="row"><span>Application</span><b>${r.application}</b></div>
      <h4>Extracted Requirements</h4>
      <div class="row"><span>Material</span><b>${r.material}</b></div>
      <div class="row"><span>Capacity</span><b>${r.capacity || '—'}</b></div>
      <h4>Recommended BIS Standard</h4>
      <div class="row"><span>${r.recommendedStandard}</span><b>${r.relevanceScore}% relevance</b></div>
      <p style="font-size:13px;">${r.standardTitle}</p>
      <h4>Matched Requirements</h4>
      <ul>${li(r.matchedRequirements)}</ul>
      <h4>Potential Compliance Gaps</h4>
      <ul>${li(r.potentialGaps)}</ul>
      <h4>AI Explanation</h4>
      <p style="font-size:13px;">${r.explanation}</p>
      <h4>Sources / References</h4>
      <p style="font-size:13px;">${r.sources}</p>
      <div class="foot">${r.disclaimer}</div>
    </body></html>`
  }

  const r = report

  return (
    <div className="split-report">
      <div>
        <ErrorBanner message={error} onClose={() => setError(null)} />
        <div className="report-doc">
          <div className="report-head">
            <div>
              <div className="eyebrow">BIS COMPLIANCE ANALYSIS REPORT</div>
              <h2>Compliance Analysis — {e.product}</h2>
              <div className="rid">{r ? `Report ID: ${r.reportId} · ${r.generatedDate}` : 'Not yet generated — click "Generate Report" to build this preview'}</div>
            </div>
            <div className="mark" style={{ background: 'var(--navy)', color: 'var(--gold)', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontWeight: 700 }}>B</div>
          </div>
          <div className="report-body">
            <div className="report-sec">
              <h4>Product Information</h4>
              <div className="result-row"><span className="k">Product</span><span className="v">{e.product}</span></div>
              <div className="result-row"><span className="k">Application</span><span className="v">{e.application}</span></div>
            </div>
            <div className="report-sec">
              <h4>Extracted Requirements</h4>
              <div className="result-row"><span className="k">Material</span><span className="v">{e.material}</span></div>
              <div className="result-row"><span className="k">Capacity</span><span className="v">{e.capacity || '—'}</span></div>
            </div>
            <div className="report-sec">
              <h4>Recommended BIS Standard</h4>
              <div className="result-row"><span className="k mono">{s.standardNumber}</span><span className="v">{s.relevanceScore}% relevance</span></div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 6 }}>{s.title}</p>
            </div>
            <div className="report-sec">
              <h4>Matched Requirements</h4>
              {s.matchedRequirements.map((m) => (
                <div key={m} className="check-item ok"><div className="mark">&#10003;</div>{m}</div>
              ))}
            </div>
            <div className="report-sec">
              <h4>Potential Compliance Gaps</h4>
              {(r ? r.potentialGaps : [s.potentialGap]).map((g) => (
                <div key={g} className="check-item warn"><div className="mark">&#9888;</div>{g}</div>
              ))}
            </div>
            <div className="report-sec">
              <h4>AI Explanation</h4>
              <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
                {r ? r.explanation : (explanation?.summary || 'Generate the report to see the full explanation.')}
                {' '}This is a preliminary AI-assisted analysis and does not constitute legal certification of compliance.
              </p>
            </div>
            <div className="report-sec" style={{ marginBottom: 0 }}>
              <h4>Sources / References</h4>
              <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{r ? r.sources : 'Bureau of Indian Standards (BIS) — Verified Standards Knowledge Base'}</p>
            </div>
          </div>
          <div className="report-foot">{r ? r.disclaimer : 'This report reflects a preliminary, AI-assisted analysis and does not constitute a legal or certified compliance determination.'}</div>
        </div>
      </div>
      <div>
        <div className="card">
          <div className="eyebrow">ACTIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            <button className="btn btn-primary btn-block" disabled={generating} onClick={handleGenerate}>
              {generating ? 'Generating…' : (r ? 'Regenerate Report' : 'Generate Report')}
            </button>
            <button className="btn btn-outline btn-block" disabled={!r} onClick={handleDownload}>Download Report</button>
          </div>
          {r && <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 8 }}>Opens a print-ready view — choose "Save as PDF" in the print dialog to download it. Pop-ups must be allowed for this site. Prefer a plain file? <span style={{ color: 'var(--navy)', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleDownloadHtmlFile}>Download as HTML file</span> instead.</p>}
          {r && <div className="badge badge-teal" style={{ marginTop: 12 }}>&#10003; Report generated ({r.status})</div>}
          {downloaded && <div className="badge badge-gold" style={{ marginTop: 8 }}>&#10003; Report ready</div>}
        </div>
      </div>
    </div>
  )
}
