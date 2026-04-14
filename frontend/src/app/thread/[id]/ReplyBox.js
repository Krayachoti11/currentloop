"use client"

import { useState } from "react"
import { apiUrl, getStoredToken, readJsonSafely } from "@/lib/api"

export default function ReplyBox({ threadId }) {
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    if (!body.trim()) {
      setError("Reply cannot be empty")
      return
    }

    const token = getStoredToken()
    if (!token) {
      const next = `${window.location.pathname}${window.location.search}`
      window.location.href = `/login?next=${encodeURIComponent(next)}`
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch(apiUrl(`/api/threads/${threadId}/replies`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body }),
      })

      const data = (await readJsonSafely(res)) || {}
      setLoading(false)

      if (!res.ok || data.error) {
        setError(data.error || "Failed to post reply. Try again.")
        return
      }

      setBody("")
      window.location.reload()
    } catch (err) {
      console.error(err)
      setLoading(false)
      setError("Something went wrong posting the reply.")
    }
  }

  return (
    <div
      style={{
        marginTop: "28px",
        background: "#0b0f19",
        border: "1px solid #9e8e84",
        borderRadius: "24px",
        padding: "20px 22px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ color: "#fff", fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>
        Post a reply
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your reply..."
        rows={5}
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "#111827",
          color: "#fff",
          border: "1px solid #9e8e84",
          borderRadius: "16px",
          padding: "12px 14px",
          fontSize: "15px",
          fontFamily: "inherit",
          resize: "vertical",
          marginBottom: "12px",
        }}
      />
      {error ? (
        <div style={{ color: "#fca5a5", fontSize: "14px", marginBottom: "10px" }}>{error}</div>
      ) : null}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: loading ? "#6b7280" : "#f26b1d",
          color: "#111",
          border: "none",
          borderRadius: "999px",
          padding: "10px 20px",
          fontSize: "15px",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Posting…" : "Post reply"}
      </button>
    </div>
  )
}
