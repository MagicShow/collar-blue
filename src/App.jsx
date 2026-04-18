import { HashRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import NewEstimate from './pages/NewEstimate'
import QuotePreview from './pages/QuotePreview'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/new-estimate" element={<NewEstimate />} />
          <Route path="/quote/:id" element={<QuotePreview />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
