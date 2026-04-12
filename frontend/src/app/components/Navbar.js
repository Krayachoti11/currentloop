"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Navbar() {
  const [username, setUsername] = useState(null)

  useEffect(() => {
    function sync() {
      const stored = localStorage.getItem("username")
      setUsername(stored || null)
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
        borderBottom: "1px solid #2a3142",
        padding: "14px 24px",
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
      <Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
        <span style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-0.02em" }}>CurrentLoop</span>
      </Link>

      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
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
