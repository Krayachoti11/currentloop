"use client"

import { useState } from "react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError("")

    const url = isLogin
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/register"

    const body = isLogin
      ? { username, password }
      : { username, email, password }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    setLoading(false)

    if (data.error) {
      setError(data.error)
    } else {
      localStorage.setItem("token", data.token)
      localStorage.setItem("username", data.username)
      window.location.href = "/"
    }
  }

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: "400px", margin: "80px auto", padding: "20px" }}>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>CurrentLoop</h1>
        </a>
        <p style={{ color: "#888", marginTop: "8px" }}>
          {isLogin ? "Welcome back" : "Create your account"}
        </p>
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: "12px", padding: "24px" }}>

        <div style={{ display: "flex", marginBottom: "24px", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee" }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1, padding: "10px", border: "none", cursor: "pointer",
              background: isLogin ? "#0070f3" : "transparent",
              color: isLogin ? "white" : "#888",
              fontWeight: "600", fontSize: "14px"
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1, padding: "10px", border: "none", cursor: "pointer",
              background: !isLogin ? "#0070f3" : "transparent",
              color: !isLogin ? "white" : "#888",
              fontWeight: "600", fontSize: "14px"
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
            style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
          />

          {!isLogin && (
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
            />
          )}

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
          />

          {error && (
            <div style={{ color: "red", fontSize: "13px" }}>{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "12px",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "4px"
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </div>
      </div>
    </main>
  )
}