"use client"

import { useEffect, useState } from "react"

export default function Navbar() {
  const [username, setUsername] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem("username")
    if (stored) setUsername(stored)
  }, [])

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    window.location.href = "/"
  }

  return (
    <nav
      style={{
        borderBottom: "1px solid #222",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "#0a0a0a",
        zIndex: 100,
      }}
    >
      <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <span style={{ fontWeight: "bold", fontSize: "20px" }}>CurrentLoop</span>
      </a>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a href="/community" style={{ color: "#888", textDecoration: "none", fontSize: "14px" }}>Community</a>
        <a href="/briefs" style={{ color: "#888", textDecoration: "none", fontSize: "14px" }}>Briefs</a>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {username ? (
          <>
            <span style={{ fontSize: "14px", color: "#888" }}>@{username}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#888",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <a
            href="/login"
            style={{
              padding: "8px 16px",
              background: "#0070f3",
              borderRadius: "8px",
              color: "white",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Login
          </a>
        )}
      </div>
    </nav>
  )
}