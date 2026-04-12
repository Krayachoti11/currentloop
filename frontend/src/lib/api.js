/**
 * API base URL for the Spring Boot backend.
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local (e.g. https://your-api.onrender.com)
 */
export function getApiBase() {
  const raw =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) ||
    "http://localhost:8080"
  return String(raw).replace(/\/$/, "")
}

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${getApiBase()}${p}`
}
