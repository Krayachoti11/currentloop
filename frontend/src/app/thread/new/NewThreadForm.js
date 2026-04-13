"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { apiUrl } from "@/lib/api"

export default function NewThreadForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const subtopicSlug = searchParams.get("subtopic")
  const initialTitle = searchParams.get("title") || ""
  const initialBody = searchParams.get("body") || ""

  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(initialBody)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/login"
    }
  }, [])

  useEffect(() => {
    const t = searchParams.get("title")
    const b = searchParams.get("body")
    if (t != null && t !== "") setTitle(t)
    if (b != null && b !== "") setBody(b)
  }, [searchParams])

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required")
      return
    }

    const token = localStorage.getItem("token")
    setLoading(true)
    setError("")

    try {
      

      const token = localStorage.getItem("token")

      const res = await fetch(apiUrl("/api/threads"), {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
        title,
        content: body,
        subtopicSlug,
      }),
      })
        
      let data
      try {
        data = await res.json()
      } catch {
        data = {}
      }

      setLoading(false)

      if (!response.ok || data.error) {
        setError(data.error || "Failed to create thread")
        return
      }

      if (!data.id) {
        setError("Thread created but no id returned")
        return
      }

      router.push("/thread/" + data.id)
    } catch (err) {
      console.error(err)
      setLoading(false)
      setError("Something went wrong creating the thread")
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f26b1d",
        padding: "28px 20px 40px",
        fontFamily: "var(--font-body, Inter, system-ui, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link
            href="/community"
            style={{
              color: "#111",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ← Community
          </Link>
        </div>

        <div
          style={{
            background: "#0b0f19",
            border: "1px solid #9e8e84",
            borderRadius: "28px",
            padding: "26px 24px",
            boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
          }}
        >
          <h1
            style={{
              color: "#fff",
              fontSize: "28px",
              fontWeight: 800,
              margin: "0 0 18px",
            }}
          >
            Create New Thread
          </h1>

          {subtopicSlug ? (
            <p style={{ color: "#b7bcc6", fontSize: "14px", marginTop: "-8px", marginBottom: "18px" }}>
              Posting in subtopic: <strong style={{ color: "#fff" }}>{subtopicSlug}</strong>
            </p>
          ) : (
            <p style={{ color: "#fca5a5", fontSize: "14px", marginTop: "-8px", marginBottom: "18px" }}>
              No subtopic selected — pick a subtopic from Community first, or add{" "}
              <code style={{ color: "#fff" }}>?subtopic=your-slug</code> to the URL.
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Thread title..."
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "20px",
                border: "1px solid #9e8e84",
                background: "#111827",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your post..."
              style={{
                width: "100%",
                minHeight: "180px",
                padding: "16px",
                borderRadius: "24px",
                border: "1px solid #9e8e84",
                background: "#111827",
                color: "#fff",
                fontSize: "15px",
                lineHeight: 1.5,
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {error ? <div style={{ color: "#fecaca", fontSize: "14px" }}>{error}</div> : null}

            <div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: "#f26b1d",
                  color: "#111",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Creating..." : "Create Thread"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
