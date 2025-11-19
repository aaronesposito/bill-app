export function getApiBaseUrl() {
  // 1) Prefer Vite env variable
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;

  // 2) Optional runtime override (only if you ever add it)
  if (window.__APP_CONFIG__ && window.__APP_CONFIG__.API_BASE_URL) {
    return window.__APP_CONFIG__.API_BASE_URL;
  }

  // 3) Fallbacks
  if (import.meta.env.DEV) {
    // default for local dev
    return 'http://localhost:5005';
  }

  // default for prod: same origin, /api
  return `${window.location.origin}/api`;
}

export const API_BASE_URL = getApiBaseUrl();