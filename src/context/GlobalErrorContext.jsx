/*
 * 1. Handles Global errors seperately
 * 2. Seperates form errors from global errros
 * 3. GlobalErrorContext.jsx
 */

import { createContext, useContext, useState } from 'react'

const GlobalErrorContext = createContext()

export function GlobalErrorProvider({ children }) {
  const [error, setError] = useState('')

  const clearError = () => setError('')

  return (
    <GlobalErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </GlobalErrorContext.Provider>
  )
}

export function useGlobalError() {
  return useContext(GlobalErrorContext)
}
