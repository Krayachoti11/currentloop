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

export async function readJsonSafely(res) {
  const contentType = res.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    return null
  }

  try {
    return await res.json()
  } catch {
    return null
  }
}

export function getStoredToken() {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("token")
  return token && token.trim() ? token : null
}
