import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import OAuthCallback from './pages/OAuthCallback'
import AdForm from './components/ad-form/AdForm'
import AdSubmit from './components/ad-form/AdSubmit'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />

      {/* Ad Flow Routes */}
      <Route path="ad-creation" element={<AdForm/>}/>
      <Route path="ad-submissiom" element={<AdSubmit />} />
    </Routes>
  )
}
