/*
 * Purpose:
 * 1. Securely exchanges the Authorization Code AND PKCE Verifier for an Access Token.
 * 2. Validates that the 'code_verifier' matches the 'code_challenge' sent during login (PKCE check).
 * 3. Acts as a secure proxy to keep the Client Secret hidden from the browser.
 * 4. Act as Backend proxy
 */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Extract code AND code_verifier
  const { code, code_verifier } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: 'Authorization code required' });
  }

  // For PKCE, the verifier is usually required
  if (!code_verifier) {
    return res.status(400).json({ success: false, error: 'PKCE code_verifier required' });
  }

  try {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: process.env.VITE_TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.VITE_REDIRECT_URI,
        code_verifier: code_verifier, // <--- ADDED: Critical for PKCE
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error_description || 'Token exchange failed'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        access_token: data.access_token,
        open_id: data.open_id,
        // You might also get refresh_token or expires_in here
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}