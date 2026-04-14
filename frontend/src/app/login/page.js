"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { apiUrl, readJsonSafely } from "@/lib/api"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function getNextPath() {
    if (typeof window === "undefined") return "/"
    const params = new URLSearchParams(window.location.search)
    const next = params.get("next")
    return next && next.startsWith("/") ? next : "/"
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const safeNext = getNextPath()
    if (localStorage.getItem("token")) {
      window.location.href = safeNext
    }
  }, [])

  async function handleSubmit() {
    const cleanUsername = username.trim()
    const cleanEmail = email.trim()

    if (!cleanUsername || !password) {
      setError("Username and password are required")
      return
    }
    if (!isLogin && !cleanEmail) {
      setError("Email is required")
      return
    }

    setLoading(true)
    setError("")

    const url = isLogin ? apiUrl("/api/auth/login") : apiUrl("/api/auth/register")
    const body = isLogin
      ? { username: cleanUsername, password }
      : { username: cleanUsername, email: cleanEmail, password }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const parsed = await readJsonSafely(res)
      const data = parsed && typeof parsed === "object" ? parsed : {}
      setLoading(false)

      if (!res.ok || data.error || !data.token) {
        setError(data.error || "Authentication failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("username", data.username || cleanUsername)
      window.location.href = getNextPath()
    } catch {
      setLoading(false)
      setError("Unable to reach server")
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0f19",
        padding: "56px 20px 60px",
        fontFamily: "var(--font-body, system-ui, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
            <h1 style={{ fontSize: "30px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>CurrentLoop</h1>
          </Link>
          <p style={{ color: "#b7bcc6", marginTop: "10px", fontSize: "15px" }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div
          style={{
            border: "1px solid #9e8e84",
            borderRadius: "26px",
            padding: "28px 24px",
            background: "#111827",
            boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: "24px",
              borderRadius: "999px",
              overflow: "hidden",
              border: "1px solid #2a3142",
            }}
          >
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                cursor: "pointer",
                background: isLogin ? "#f26b1d" : "transparent",
                color: isLogin ? "#111" : "#aeb4bf",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                cursor: "pointer",
                background: !isLogin ? "#f26b1d" : "transparent",
                color: !isLogin ? "#111" : "#aeb4bf",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              Sign Up
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: "14px",
                border: "1px solid #9e8e84",
                fontSize: "15px",
                background: "#0b0f19",
                color: "#fff",
                outline: "none",
              }}
            />

            {!isLogin ? (
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "12px 14px",
                  borderRadius: "14px",
                  border: "1px solid #9e8e84",
                  fontSize: "15px",
                  background: "#0b0f19",
                  color: "#fff",
                  outline: "none",
                }}
              />
            ) : null}

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: "14px",
                border: "1px solid #9e8e84",
                fontSize: "15px",
                background: "#0b0f19",
                color: "#fff",
                outline: "none",
              }}
            />

            {error ? <div style={{ color: "#fecaca", fontSize: "14px" }}>{error}</div> : null}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "12px",
                background: "#f26b1d",
                border: "1px solid #f26b1d",
                color: "#111",
                boxShadow: "0 8px 20px rgba(242,107,29,0.25)",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                marginTop: "4px",
              }}
            >
              {loading ? "Please wait…" : isLogin ? "Login" : "Create Account"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
          <Link href="/" style={{ color: "#f26b1d", textDecoration: "none", fontWeight: 600 }}>
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  )
}
