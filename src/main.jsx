import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './assets/styles/global.css'
import { GlobalErrorProvider } from './context/GlobalErrorContext'
import GlobalErrorBanner from './components/GlobalErrroBanner'


ReactDOM.createRoot(document.getElementById('root')).render(

  <GlobalErrorProvider>
    <BrowserRouter>
      <GlobalErrorBanner />
      <App />
    </BrowserRouter>
  </GlobalErrorProvider>

)
