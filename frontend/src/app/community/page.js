import Link from "next/link"
import { apiUrl, readJsonSafely } from "@/lib/api"

async function getTopics() {
  try {
    const res = await fetch(apiUrl("/api/topics"), { cache: "no-store" })
    if (!res.ok) return []
    const data = await readJsonSafely(res)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default async function CommunityPage() {
  const topics = await getTopics()

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f26b1d",
        padding: "28px 20px 48px",
        fontFamily: "var(--font-body, Inter, system-ui, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <div style={{ marginBottom: "22px" }}>
          <Link
            href="/"
            style={{
              color: "#111",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              opacity: 0.9,
            }}
          >
            ← Home
          </Link>
        </div>

        <div
          style={{
            background: "#0b0f19",
            border: "1px solid #9e8e84",
            borderRadius: "28px",
            padding: "28px 26px",
            marginBottom: "28px",
            boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            Community
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              color: "#b7bcc6",
              fontSize: "16px",
              lineHeight: 1.55,
              maxWidth: "560px",
            }}
          >
            Pick a topic, dive into a subtopic, and join real discussions. Threads and replies are
            human-written — built for clarity, not noise.
          </p>
        </div>

        <h2
          style={{
            margin: "0 0 16px",
            color: "#111",
            fontSize: "18px",
            fontWeight: 800,
          }}
        >
          Topics
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "14px",
          }}
        >
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              style={{
                background: "#0b0f19",
                border: "1px solid #9e8e84",
                borderRadius: "22px",
                padding: "18px 16px",
                textAlign: "center",
                textDecoration: "none",
                color: "#fff",
                boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
                transition: "transform 0.15s ease",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{topic.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: "15px" }}>{topic.name}</div>
            </Link>
          ))}
        </div>

        {topics.length === 0 ? (
          <p style={{ color: "#111", fontSize: "15px", marginTop: "16px" }}>
            Start the backend and ensure PostgreSQL is seeded — topics load from the API.
          </p>
        ) : null}
      </div>
    </main>
  )
}
