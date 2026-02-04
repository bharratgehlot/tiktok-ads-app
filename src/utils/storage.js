export function saveToken(token) {
  localStorage.setItem("tiktok_token", token);
}

export function getAuthToken() {
  return localStorage.getItem("tiktok_token");
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function logout() {
  localStorage.removeItem("tiktok_token");
  window.location.href = "/";
}