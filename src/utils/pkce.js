/*
 * 1. Generates the cryptographic `code_verifier` and `code_challenge` required for secure OAuth flows.
 * 2. Handles Base64 URL encoding to ensure the keys are safe to send in URL parameters.
 * 3. Manages `sessionStorage` for the verifier, ensuring it persists during the redirect but can be cleared after use.
 */

// Generate random code verifier
export function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

// Generate code challenge from verifier
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(hash));
}

// Base64 URL encode helper
function base64URLEncode(buffer) {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Store verifier in sessionStorage
export function storeVerifier(verifier) {
  sessionStorage.setItem('pkce_verifier', verifier);
}

// Retrieve verifier from sessionStorage
export function getVerifier() {
  return sessionStorage.getItem('pkce_verifier');
}

// Clear verifier after use
export function clearVerifier() {
  sessionStorage.removeItem('pkce_verifier');
}