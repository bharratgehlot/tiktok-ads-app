/*
 * Mock OAuth Token Exchange Service
 * Simulates backend behavior for exchanging authorization code + PKCE verifier
 */

export function exchangeToken({ code, codeVerifier }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Basic validation
      if (!code || !codeVerifier) {
        reject({
          type: 'auth',
          message: 'Invalid authorization request'
        })
        return
      }

      // Simulate expired / invalid code (20%)
      if (Math.random() < 0.2) {
        reject({
          type: 'auth',
          message: 'Authorization code expired'
        })
        return
      }

      // Simulate success
      resolve({
        access_token: 'mock_access_token_' + Date.now(),
        expires_in: 3600,
        token_type: 'Bearer'
      })
    }, 1200)
  })
}
