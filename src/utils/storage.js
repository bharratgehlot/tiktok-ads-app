/*
 * 1. Persists the 'tiktok_token' to localStorage so the user remains logged in across page refreshes.
 * 2. Abstractions the "Is Authenticated?" logic into a simple boolean check for the UI.
 * 3. Handles the "Logout" side-effects by cleaning up storage and forcing a redirect to the home page.
 */

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