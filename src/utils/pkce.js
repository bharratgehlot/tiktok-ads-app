/*
 * PKCE Utilities
 * - Generates code_verifier and code_challenge
 * - Stores verifier in localStorage to survive cross-origin redirects (localhost ↔ ngrok)
 * - Verifier is short-lived and cleared after token exchange
 */

// Using localStorage instead of sessionStorage

// Generate random code verifier
export function generateCodeVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64URLEncode(array)
}

// Generate code challenge from verifier
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return base64URLEncode(new Uint8Array(hash))
}

// Base64 URL encode helper
function base64URLEncode(buffer) {
  const base64 = btoa(String.fromCharCode(...buffer))
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Store verifier (DEV NOTE: localStorage used to survive ngrok redirect)
export function storeVerifier(verifier) {
  localStorage.setItem('pkce_verifier', verifier)
}

// Retrieve verifier
export function getVerifier() {
  return localStorage.getItem('pkce_verifier')
}

// Clear verifier after use
export function clearVerifier() {
  localStorage.removeItem('pkce_verifier')
}
