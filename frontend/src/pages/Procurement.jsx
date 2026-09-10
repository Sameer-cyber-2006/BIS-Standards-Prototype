import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Check } from 'lucide-react'
import { analyzeProcurement, matchStandards } from '../services/api.js'
import { useWorkflow } from '../context/WorkflowContext.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'

const STAGES = [
  'Extracting document text',
  'Understanding requirements',
  'Preparing standard recommendations',
  'Finalizing results',
]

function StepTrack({ activeIdx }) {
  const steps = ['Upload document', 'Analyze document', 'Match & review']
  return (
    <div className="step-track">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className={'step-node ' + (i < activeIdx ? 'done' : i === activeIdx ? 'active' : '')}>
            <div className="dot">{i < activeIdx ? <Check size={11} /> : i + 1}</div>
            {s}
          </div>
          {i < steps.length - 1 && <div className="step-line"></div>}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function Procurement() {
  const navigate = useNavigate()
  const {
    uploadedFile, setUploadedFile, uploadedFileName, setUploadedFileName,
    extracted, setExtracted, setMatched, setSelectedStandard, setExplanation, setReport,
  } = useWorkflow()
  const [dragActive, setDragActive] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [stageIdx, setStageIdx] = useState(-1)
  const [error, setError] = useState(null)
  const [finding, setFinding] = useState(false)

  // Everything downstream (matched standards, the selected standard, its
  // explanation, and any generated report) belongs to whichever PDF was
  // analyzed - so a new/removed file must clear all of it, not just the
  // extracted requirements. Otherwise stale results from a previous PDF
  // can still appear on Standard Matching / Explanation / Reports.
  function clearDownstream() {
    setExtracted(null)
    setMatched(null)
    setSelectedStandard(null)
    setExplanation(null)
    setReport(null)
  }

  function pickFile(file) {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file (invalid file type).')
      return
    }
    setError(null)
    setUploadedFile(file)
    setUploadedFileName(file.name)
    clearDownstream()
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    pickFile(file)
  }

  function clearUpload() {
    setUploadedFile(null)
    setUploadedFileName(null)
    clearDownstream()
  }

  async function analyzeDocument() {
    if (!uploadedFile) { setError('No PDF selected. Please choose a file first.'); return }
    setError(null)
    setAnalyzing(true)
    setStageIdx(0)

    // Realistic staged loading UI while the (fast) backend call runs.
    const stageTimer = setInterval(() => {
      setStageIdx((i) => (i < STAGES.length - 1 ? i + 1 : i))
    }, 550)

    const [{ data, error: apiError }] = await Promise.all([
      analyzeProcurement(uploadedFile),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])

    clearInterval(stageTimer)
    setAnalyzing(false)
    setStageIdx(-1)

    if (apiError) { setError(apiError); return }
    setExtracted(data)
  }

  async function findStandards() {
    setFinding(true)
    setError(null)
    const { data, error: apiError } = await matchStandards(extracted)
    setFinding(false)
    if (apiError) { setError(apiError); return }
    setMatched(data)
    setSelectedStandard(null)
    navigate('/matching')
  }

  return (
    <div>
      <StepTrack activeIdx={extracted ? 2 : (analyzing || uploadedFile ? 1 : 0)} />
      <ErrorBanner message={error} onClose={() => setError(null)} />
      <div className="grid grid-2">
        <div>
          <div className="card">
            <div className="eyebrow">STEP 1</div>
            <h4 className="section-title">Upload procurement specification</h4>
            {!uploadedFileName ? (
              <div
                className={'dropzone' + (dragActive ? ' drag' : '')}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <div className="icon"><Upload size={26} /></div>
                <h4>Drag &amp; drop a PDF here</h4>
                <p>or click below to browse your files</p>
                <div style={{ marginTop: 14 }}>
                  <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                    Browse Files
                    <input type="file" accept="application/pdf" style={{ display: 'none' }}
                      onChange={(e) => pickFile(e.target.files?.[0])} />
                  </label>
                </div>
              </div>
            ) : (
              <>
                <div className="file-chip">
                  <div className="fico">PDF</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{uploadedFileName}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                      {extracted ? 'Analyzed \u00b7 results shown on the right' : 'Uploaded \u00b7 ready to analyze'}
                    </div>
                  </div>
                  <button className="btn-ghost" style={{ marginLeft: 'auto', fontSize: 12 }} onClick={clearUpload}><X size={14} /></button>
                </div>
                <div style={{ marginTop: 16 }}>
                  {extracted && !uploadedFile ? (
                    // Results were restored from a previous session (e.g. after a
                    // page refresh) - the raw file itself isn't kept around, so
                    // there's nothing to re-analyze unless a new PDF is chosen.
                    <div className="empty-note" style={{ fontSize: 12 }}>
                      <Check size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />
                      This document has already been analyzed. Remove it above to upload a different PDF.
                    </div>
                  ) : (
                    <button className="btn btn-primary" disabled={analyzing} onClick={analyzeDocument}>
                      {analyzing ? 'Analyzing…' : 'Analyze Document'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {analyzing && (
            <div className="card">
              <div className="eyebrow">PROCESSING</div>
              <div className="loading-stage-list">
                {STAGES.map((s, i) => (
                  <div key={s} className={'loading-stage ' + (i < stageIdx ? 'done' : i === stageIdx ? 'active' : '')}>
                    <div className="box">{i < stageIdx ? <Check size={11} /> : ''}</div>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {extracted ? (
            <div className="card fade-in">
              <div className="eyebrow">EXTRACTED PRODUCT REQUIREMENTS</div>
              <div className="result-row"><span className="k">Product</span><span className="v">{extracted.product}</span></div>
              <div className="result-row"><span className="k">Material</span><span className="v">{extracted.material}</span></div>
              <div className="result-row"><span className="k">Capacity</span><span className="v">{extracted.capacity}</span></div>
              <div className="result-row"><span className="k">Application</span><span className="v">{extracted.application}</span></div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>Technical Requirements</div>
                {extracted.technicalRequirements.map((r) => (
                  <div key={r} style={{ fontSize: 12.5, color: 'var(--ink-soft)', padding: '4px 0' }}>&#8226; {r}</div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-teal btn-block" disabled={finding} onClick={findStandards}>
                  {finding ? 'Finding standards…' : 'Find Relevant BIS Standards \u2192'}
                </button>
              </div>
            </div>
          ) : (
            <div className="card"><div className="empty-note">Extracted requirements will appear here once a document has been analyzed by the backend.</div></div>
          )}
        </div>
      </div>
    </div>
  )
}
