export function getAuthToken() {
  return localStorage.getItem("tiktok_token");
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function logout() {
  return localStorage.removeItem("tiktok_token");
}