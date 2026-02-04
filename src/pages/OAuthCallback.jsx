/*
 * TEST MODE: OAuthCallback.jsx
 * 1. Logs all incoming parameters.
 * 2. Checks for Verifier in storage.
 * 3. Attempts to call the Backend API (/api/oauth) for token exchange.
 */

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveToken } from "../utils/storage";
import { getVerifier, clearVerifier } from "../utils/pkce";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // --- 🧪 TEST LOG 1: Check URL Parameters ---
    const code = params.get("code");
    const error = params.get("error");

    console.log("%c1. 📥 Callback Received", "color: cyan; font-weight: bold;");
    console.log("   Code:", code ? "✅ Present" : "❌ Missing");
    console.log("   Error:", error || "None");

    if (error || !code) {
      console.error("❌ Authorization failed at TikTok level");
      alert("Authorization failed (See Console)");
      // navigate("/"); // ⏸️ Commented out for debugging
      return;
    }

    // --- 🧪 TEST LOG 2: Check Session Storage ---
    const verifier = getVerifier();
    console.log("%c2. 🔐 Verifier Check", "color: cyan; font-weight: bold;");
    console.log("   Verifier:", verifier ? "✅ Found in Storage" : "❌ Missing (Session Lost?)");

    if (!verifier) {
      console.error("❌ No verifier found. Did you skip the Home page login click?");
      alert("Session error (See Console)");
      // navigate("/"); // ⏸️ Commented out for debugging
      return;
    }

    // --- 🧪 TEST LOG 3: Initiate Backend Exchange ---
    console.log("%c3. 🚀 Sending to Backend (/api/oauth)", "color: cyan; font-weight: bold;");

    // We switch this to call YOUR backend, as calling TikTok directly from browser usually fails CORS
    fetch("/api/oauth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        code_verifier: verifier, // Sending verifier for PKCE check
      }),
    })
      .then((res) => {
        console.log("   HTTP Status:", res.status);
        return res.json();
      })
      .then((data) => {
        // --- 🧪 TEST LOG 4: Handle Response ---
        console.log("%c4. 📦 Backend Response", "color: cyan; font-weight: bold;", data);

        if (!data.success && !data.access_token) {
          // Handle both your backend error format OR direct TikTok error format
          throw new Error(data.error || data.error_description || "Token exchange failed");
        }

        const token = data.data?.access_token || data.access_token;
        console.log("%c✅ SUCCESS: Token Received!", "color: green; font-weight: bold;");

        saveToken(token);
        clearVerifier();

        // Un-comment this when ready to go live
        // navigate("/"); 
        alert("Login Success! Token saved. (Redirect paused for testing)");
      })
      .catch((err) => {
        console.error("%c❌ OAuth Error:", "color: red; font-weight: bold;", err);
        alert("Login Error. Check Console.");
        clearVerifier();
        // navigate("/"); // ⏸️ Commented out for debugging
      });
  }, [params, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>🔄 Processing Login...</h2>
      <p>Check your Console (F12) for test logs.</p>
    </div>
  );
}