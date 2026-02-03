import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import OAuthCallback from './pages/OAuthCallback'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
    </Routes>
  )
}
