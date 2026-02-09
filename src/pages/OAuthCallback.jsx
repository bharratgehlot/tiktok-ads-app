/*
 * PART 4: OAuthCallback.jsx
 * 1. Receives authorization code
 * 2. Validates PKCE verifier
 * 3. Exchanges code for access token (mock)
 */

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { getVerifier, clearVerifier } from "../utils/pkce"
import { exchangeToken } from "../services/authService"
import { useGlobalError } from "../context/GlobalErrorContext"
import { saveToken } from "../utils/storage"


export default function OAuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setError } = useGlobalError()

  const [status, setStatus] = useState("processing")

  useEffect(() => {
    const code = params.get("code")
    const error = params.get("error")
    const state = params.get("state")

    console.log("%c1. 📥 OAuth Callback Received", "color: cyan; font-weight: bold;")
    console.log("   Code:", code ? "✅ Present" : "❌ Missing")
    console.log("   State:", state ? "✅ Present" : "❌ Missing")
    console.log("   Error:", error || "None")

    if (error || !code) {
      setError("Authorization failed. Please try again.")
      setStatus("error")
      return
    }

    const verifier = getVerifier()

    console.log("%c2. 🔐 PKCE Verifier Check", "color: cyan; font-weight: bold;")
    console.log(
      "   Verifier:",
      verifier ? "✅ Found" : "❌ Missing"
    )

    if (!verifier) {
      setError("Session expired. Please reconnect your TikTok account.")
      setStatus("error")
      return
    }

    console.log("%c3. 🔁 Exchanging Token (Mock)", "color: cyan; font-weight: bold;")
    setStatus("exchanging")

    exchangeToken({ code, codeVerifier: verifier })
      .then((tokenData) => {
        console.log("%c✅ Token Exchange Success", "color: green; font-weight: bold;", tokenData)

        // ✅ Part 5: Persist token & finalize auth
        saveToken(tokenData.access_token)
        clearVerifier()

        setStatus("success")

        // Redirect to Home
        navigate("/")
      })
    

      .catch((err) => {
        console.error("❌ Token Exchange Failed", err)
        setError(err.message || "Login failed during token exchange.")
        clearVerifier()
        setStatus("error")
      })
  }, [params, navigate, setError])

  return (
    <div style={{ padding: 20 }}>
      <h2>🔄 Processing Login...</h2>

      {status === "processing" && <p>Validating authorization response…</p>}
      {status === "exchanging" && <p>Exchanging token…</p>}
      {status === "success" && <p>✅ Login successful. Finalizing…</p>}
      {status === "error" && <p>❌ Login failed.</p>}
    </div>
  )
}
