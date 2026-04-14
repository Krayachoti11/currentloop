"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiUrl, readJsonSafely } from "@/lib/api"

export default function ProfilePage() {
  const [threads, setThreads] = useState([])
  const [username] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("username") || "" : ""))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")

    if (!storedUsername) {
      window.location.href = "/login"
      return
    }

    fetch(apiUrl(`/api/users/${encodeURIComponent(storedUsername)}/threads`))
      .then(async (res) => {
        if (!res.ok) return []
        const data = await readJsonSafely(res)
        return Array.isArray(data) ? data : []
      })
      .then((rows) => {
        setThreads(rows)
        setLoading(false)
      })
      .catch(() => {
        setThreads([])
        setLoading(false)
      })
  }, [])

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0f19",
        padding: "28px 20px 40px",
        fontFamily: "var(--font-body, system-ui, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link
            href="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              opacity: 0.85,
            }}
          >
            ← Home
          </Link>
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #9e8e84",
            borderRadius: "28px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          }}
        >
          <h1 style={{ color: "#fff", margin: 0, fontSize: "32px", fontWeight: 800 }}>@{username}</h1>
          <p style={{ color: "#b7bcc6", marginTop: "10px", fontSize: "15px", marginBottom: "16px" }}>
            Your threads on CurrentLoop.
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#0b0f19",
              border: "1px solid #9e8e84",
              borderRadius: "999px",
              padding: "10px 16px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <span>{threads.length}</span>
            <span>threads</span>
          </div>
        </div>

        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>Your threads</h2>

        {loading ? (
          <div style={{ color: "#b7bcc6" }}>Loading…</div>
        ) : threads.length === 0 ? (
          <div
            style={{
              background: "#111827",
              border: "1px solid #9e8e84",
              borderRadius: "24px",
              padding: "24px",
              color: "#b7bcc6",
            }}
          >
            You have not created any threads yet.{" "}
            <Link href="/community" style={{ color: "#f26b1d", fontWeight: 600 }}>
              Browse Community
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/thread/${thread.id}`}
                style={{
                  display: "block",
                  background: "#111827",
                  border: "1px solid #9e8e84",
                  borderRadius: "24px",
                  padding: "18px 20px",
                  color: "#fff",
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: 800, marginBottom: "8px", lineHeight: 1.25 }}>
                  {thread.title}
                </div>
                {thread.body ? (
                  <div style={{ color: "#d8dde6", fontSize: "15px", lineHeight: 1.5, marginBottom: "10px" }}>
                    {thread.body.length > 120 ? thread.body.slice(0, 120) + "…" : thread.body}
                  </div>
                ) : null}
                <div style={{ color: "#aeb4bf", fontSize: "13px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <span>{thread.replyCount || 0} replies</span>
                  <span>•</span>
                  <span>{thread.createdAt ? new Date(thread.createdAt).toLocaleDateString() : ""}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
