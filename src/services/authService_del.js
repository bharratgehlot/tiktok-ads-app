/** DUBLICTAE FILE */
const CLIENT_KEY = import.meta.env.VITE_TIKTOK_CLIENT_KEY
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI

export function redirectToTikTok() {
  const state = crypto.randomUUID()

  const url =
    `
  https://www.tiktok.com/v2/auth/authorize/?` +
    `client_key=${CLIENT_KEY}` +
    `&response_type=code` +
    `&scope=user.info.basic` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${state}
  `
  window.location.href = url
}

export async function exchangeCode(code) {
  const res = await fetch('/api/oauth', {
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
  const data = await res.json()

  if (!res.ok || !data.sucess) {
    throw new Error(data.error || 'OAuth failed')
  }

  localStorage.setItem('tiktok_token', data.data.access_token)
  return data.data
}

