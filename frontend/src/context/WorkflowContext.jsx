import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { getAuthStatus, loginAccount, registerAccount, logoutAccount } from '../services/api.js'

// Shares the in-progress BIS workflow (extracted requirements -> matched
// standards -> selected standard -> report) across pages, so results from
// one step are available on the next without re-fetching or hardcoding.
// Also holds authentication + profile state app-wide: the backend keeps a
// single prototype session, so a page refresh stays logged in (checked via
// /api/auth/status) without needing tokens or localStorage.
const WorkflowContext = createContext(null)

// The workflow results (extracted requirements, matched standards, the
// selected standard, its explanation, and any generated report) must
// survive a page refresh / tab reopen - they should only go away when the
// user explicitly removes the uploaded PDF (see clearDownstream() in
// Procurement.jsx). Plain useState alone loses everything on refresh, so
// this slice of state is mirrored to localStorage.
//
// Note: the raw `uploadedFile` (a browser File object) is NOT persisted -
// File objects can't be serialized to JSON/localStorage. That's fine: it's
// only needed to make the one "Analyze Document" API call, and every page
// that reads workflow state reads the already-serializable `extracted`,
// `matched`, etc. fields, not the file itself.
const STORAGE_KEY = 'bis_workflow_state_v1'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function WorkflowProvider({ children }) {
  const persisted = useRef(loadPersisted()).current

  const [uploadedFileName, setUploadedFileName] = useState(persisted.uploadedFileName ?? null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [extracted, setExtracted] = useState(persisted.extracted ?? null)
  const [matched, setMatched] = useState(persisted.matched ?? null)
  const [selectedStandard, setSelectedStandard] = useState(persisted.selectedStandard ?? null)
  const [explanation, setExplanation] = useState(persisted.explanation ?? null)
  const [report, setReport] = useState(persisted.report ?? null)

  // Keep localStorage in sync with the persistable slice of workflow state.
  // Runs on every change, including clearDownstream()'s reset to null, so
  // "remove PDF" correctly wipes the persisted results too.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        uploadedFileName, extracted, matched, selectedStandard, explanation, report,
      }))
    } catch {
      // localStorage unavailable (e.g. private browsing quota) - fail silently,
      // the workflow still works for the current session via React state.
    }
  }, [uploadedFileName, extracted, matched, selectedStandard, explanation, report])

  const [profile, setProfile] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [schemeResults, setSchemeResults] = useState(null)

  useEffect(() => {
    let active = true
    getAuthStatus().then(({ data }) => {
      if (!active) return
      if (data) {
        setIsAuthenticated(data.authenticated)
        setProfile(data.profile)
      }
      setAuthChecked(true)
    })
    return () => { active = false }
  }, [])

  async function login(email, password) {
    const { data, error } = await loginAccount({ email, password })
    if (error) return { success: false, message: error }
    setIsAuthenticated(true)
    setProfile(data.profile)
    return { success: true, message: data.message }
  }

  async function register(payload) {
    const { data, error } = await registerAccount(payload)
    if (error) return { success: false, message: error }
    // Registration creates the account but does not start a session.
    // The user must complete the explicit Login step before protected features open.
    return { success: true, message: data.message, profile: data.profile }
  }

  async function logout() {
    await logoutAccount()
    setIsAuthenticated(false)
    setProfile(null)
    setSchemeResults(null)
  }

  const value = {
    uploadedFileName, setUploadedFileName,
    uploadedFile, setUploadedFile,
    extracted, setExtracted,
    matched, setMatched,
    selectedStandard, setSelectedStandard,
    explanation, setExplanation,
    report, setReport,
    profile, setProfile,
    isAuthenticated, authChecked,
    login, register, logout,
    schemeResults, setSchemeResults,
  }

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext)
  if (!ctx) throw new Error('useWorkflow must be used within a WorkflowProvider')
  return ctx
}
