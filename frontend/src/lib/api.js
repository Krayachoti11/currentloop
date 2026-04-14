/**
 * API base URL for the Spring Boot backend.
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local (e.g. https://your-api.onrender.com)
 */
export function getApiBase() {
  const configured = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : ""
  if (configured && String(configured).trim()) {
    return String(configured).replace(/\/$/, "")
  }

  if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
    return "http://localhost:8080"
  }

  if (typeof window !== "undefined") {
    return window.location.origin.replace(/\/$/, "")
  }

  return "http://localhost:8080"
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
