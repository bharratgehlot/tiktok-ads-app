import { useGlobalError } from '../context/GlobalErrorContext'

export default function GlobalErrorBanner() {
  const { error, clearError } = useGlobalError()

  if (!error) return null

  return (
    <div className="global-error-banner">
      <span>{error}</span>
      <button onClick={clearError}>Dismiss</button>
    </div>
  )
}
