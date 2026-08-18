import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DiscoveryMap } from './pages/DiscoveryMap'
import { HomepageMap } from './pages/HomepageMap'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DiscoveryMap />} />
        <Route path="/google" element={<HomepageMap />} />
        <Route path="/destinations/*" element={<DiscoveryMap />} />
      </Routes>
    </BrowserRouter>
  )
}
