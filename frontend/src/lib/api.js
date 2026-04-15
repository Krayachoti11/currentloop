/**
 * API base URL for the Spring Boot backend.
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local (e.g. https://your-api.onrender.com)
 */
export function getApiBase() {
  const configured =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL
      : ""
  if (configured && String(configured).trim()) {
    return String(configured).replace(/\/$/, "")
  }

  if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
    return "http://localhost:8080"
  }

  return ""
}

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`
  const base = getApiBase()
  return base ? `${base}${p}` : p
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

export async function readBodySafely(res) {
  const contentType = (res.headers.get("content-type") || "").toLowerCase()

  if (contentType.includes("application/json")) {
    const parsed = await readJsonSafely(res)
    if (parsed && typeof parsed === "object") {
      return parsed
    }
    return null
  }

  try {
    const text = await res.text()
    return text ? { message: text } : null
  } catch {
    return null
  }
}

export function getErrorMessage(body, fallback = "Request failed") {
  if (!body) return fallback
  if (typeof body === "string" && body.trim()) return body
  if (typeof body === "object") {
    if (typeof body.error === "string" && body.error.trim()) return body.error
    if (typeof body.message === "string" && body.message.trim()) return body.message
  }
  return fallback
}

export function getStoredToken() {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("token")
  return token && token.trim() ? token : null
}
