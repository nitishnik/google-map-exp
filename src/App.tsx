import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DiscoveryMap } from './pages/DiscoveryMap'
import { HomepageMap } from './pages/HomepageMap'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomepageMap />} />
        <Route path="/google" element={<Navigate to="/" replace />} />
        <Route path="/discovery" element={<DiscoveryMap />} />
        <Route path="/destinations/*" element={<HomepageMap />} />
      </Routes>
    </BrowserRouter>
  )
}
