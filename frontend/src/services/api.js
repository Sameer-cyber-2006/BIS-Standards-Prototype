import axios from 'axios'

// Central API service - every backend call for the prototype goes through
// this file. Nothing here is hardcoded into the page components; results
// always come back from the Spring Boot backend's mock services.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

// Normalises any axios error into a plain, readable message for the UI.
function friendlyError(error) {
  if (error.response) {
    const data = error.response.data
    if (data && data.error) return data.error
    return `Backend responded with an error (status ${error.response.status}).`
  }
  if (error.request) {
    return 'Could not reach the backend. Is the Spring Boot server running on ' + BASE_URL + '?'
  }
  return error.message || 'Unexpected error while calling the backend.'
}

async function call(promise) {
  try {
    const res = await promise
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: friendlyError(err) }
  }
}

// 1. BIS Standard Assistant
export const queryAssistant = (query) =>
  call(client.post('/assistant/query', { query }))

// 2. Procurement Specification Analyzer
export const analyzeProcurement = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return call(client.post('/procurement/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }))
}

// 3. BIS Standard Matching
export const matchStandards = (requirement) =>
  call(client.post('/standards/match', requirement))

export const getStandardDetails = (id) =>
  call(client.get(`/standards/${id}`))

// 4. AI-Powered Explanation
export const getExplanation = (payload) =>
  call(client.post('/explanation', payload))

export const getExplanationFollowUp = (question, standardNumber) =>
  call(client.post('/explanation/followup', { question, standardNumber }))

// 5. Compliance Report
export const generateReport = (payload) =>
  call(client.post('/reports/generate', payload))

// 6. Patent Guidance
export const getPatentGuidance = (description) =>
  call(client.post('/patent/guidance', { description }))

// User Profile
export const getProfile = () =>
  call(client.get('/profile'))

export const updateProfile = (profile) =>
  call(client.put('/profile', profile))

// Authentication (prototype - single in-memory session, no tokens)
export const registerAccount = (payload) =>
  call(client.post('/auth/register', payload))

export const loginAccount = (payload) =>
  call(client.post('/auth/login', payload))

export const logoutAccount = () =>
  call(client.post('/auth/logout'))

export const getAuthStatus = () =>
  call(client.get('/auth/status'))

// 7. Government Schemes Finder & Eligibility Check
export const getSchemes = () =>
  call(client.get('/schemes'))

export const getSchemeDetails = (id) =>
  call(client.get(`/schemes/${id}`))

export const checkSchemeEligibility = (payload) =>
  call(client.post('/schemes/eligibility', payload))

export default client
