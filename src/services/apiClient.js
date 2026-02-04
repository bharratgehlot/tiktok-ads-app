/*
 * 1. Automatically injects the 'Authorization: Bearer <token>' header into every request.
 * 2. Centralizes error handling for common auth failures (401 Session Expired, 403 Permission Denied).
 * 3. Standardizes the "Content-Type" to JSON, ensuring consistent data formatting for backend communication.
 */

import { getAuthToken } from "../utils/storage";

export async function apiFetch(url, options = {}) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    throw new Error("Session expired");
  }

  if (res.status === 403) {
    throw new Error("Permission denied");
  }

  return res.json();
}
