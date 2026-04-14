"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Navbar() {
  const [username, setUsername] = useState(null)

  useEffect(() => {
    function getUsernameFromToken(token) {
      if (!token) return null
      try {
        const payload = token.split(".")[1]
        if (!payload) return null
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
        const decoded = JSON.parse(window.atob(normalized))
        return typeof decoded?.sub === "string" && decoded.sub.trim() ? decoded.sub : null
      } catch {
        return null
      }
    }

    function sync() {
      const token = localStorage.getItem("token")
      const storedUsername = localStorage.getItem("username")

      if (!token) {
        setUsername(null)
        return
      }

      const resolvedUsername = storedUsername || getUsernameFromToken(token)
      setUsername(resolvedUsername || null)

      if (!storedUsername && resolvedUsername) {
        localStorage.setItem("username", resolvedUsername)
      }
    }

    sync()
    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [])

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    window.location.href = "/"
  }

  return (
    <nav
      style={{
        borderBottom: "1px solid #9e8e84",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "rgba(11, 15, 25, 0.92)",
        backdropFilter: "blur(10px)",
        zIndex: 100,
      }}
    >
      <Link href="/" style={{ textDecoration: "none", color: "#fff", marginRight: "16px" }}>
        <span style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-0.02em" }}>CurrentLoop</span>
      </Link>

      <div style={{ display: "flex", gap: "16px", alignItems: "center", flex: 1, flexWrap: "wrap" }}>
        <Link href="/community" style={{ color: "#d8dde6", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
          Community
        </Link>
        <Link href="/briefs" style={{ color: "#d8dde6", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
          Briefs
        </Link>
        {username ? (
          <Link href="/profile" style={{ color: "#d8dde6", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
            Profile
          </Link>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {username ? (
          <>
            <span style={{ fontSize: "14px", color: "#aeb4bf" }}>@{username}</span>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid #9e8e84",
                borderRadius: "999px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            style={{
              padding: "8px 18px",
              background: "#f26b1d",
              border: "1px solid #f26b1d",
              borderRadius: "999px",
              color: "#111",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
