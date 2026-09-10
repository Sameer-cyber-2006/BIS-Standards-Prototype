import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RequireAuth from './components/RequireAuth.jsx'

import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Assistant from './pages/Assistant.jsx'
import Procurement from './pages/Procurement.jsx'
import Matching from './pages/Matching.jsx'
import StandardDetails from './pages/StandardDetails.jsx'
import Explanation from './pages/Explanation.jsx'
import Reports from './pages/Reports.jsx'
import Patent from './pages/Patent.jsx'
import Schemes from './pages/Schemes.jsx'
import SchemeDetails from './pages/SchemeDetails.jsx'
import SchemeProfileEdit from './pages/SchemeProfileEdit.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

function withLayout(Page) {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

function protectedPage(Page) {
  return (
    <RequireAuth>
      {withLayout(Page)}
    </RequireAuth>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Only the BIS Assistant is usable without an account - everything
          else (including the dashboard hub) requires login/registration. */}
      <Route path="/assistant" element={withLayout(Assistant)} />
      <Route path="/dashboard" element={protectedPage(Dashboard)} />
      <Route path="/procurement" element={protectedPage(Procurement)} />
      <Route path="/matching" element={protectedPage(Matching)} />
      <Route path="/standards/:id" element={protectedPage(StandardDetails)} />
      <Route path="/explanation" element={protectedPage(Explanation)} />
      <Route path="/reports" element={protectedPage(Reports)} />
      <Route path="/patent" element={protectedPage(Patent)} />
      <Route path="/schemes" element={protectedPage(Schemes)} />
      <Route path="/schemes/edit-info" element={protectedPage(SchemeProfileEdit)} />
      <Route path="/schemes/:id" element={protectedPage(SchemeDetails)} />
      <Route path="/profile" element={protectedPage(Profile)} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
