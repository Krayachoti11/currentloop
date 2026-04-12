import Link from "next/link"
import { apiUrl } from "@/lib/api"

async function getSubtopics(topicSlug) {
  try {
    const res = await fetch(apiUrl(`/api/topics/${topicSlug}/subtopics`), { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function TopicPage(props) {
  const params = await props.params
  const topicSlug = params.topic
  const subtopics = await getSubtopics(topicSlug)

  if (subtopics === null) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f26b1d",
          padding: "40px 20px",
          fontFamily: "var(--font-body, Inter, system-ui, sans-serif)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", color: "#111" }}>
          Topic not found or API unavailable.
        </div>
      </main>
    )
  }

  const titleCase = topicSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f26b1d",
        padding: "28px 20px 48px",
        fontFamily: "var(--font-body, Inter, system-ui, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "22px" }}>
          <Link
            href="/community"
            style={{
              color: "#111",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              opacity: 0.9,
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
            marginBottom: "28px",
            boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            {titleCase}
          </h1>
          <p style={{ margin: "10px 0 0", color: "#b7bcc6", fontSize: "16px", maxWidth: "560px", lineHeight: 1.5 }}>
            Choose a subtopic to see threads and start your own.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {subtopics.map((s) => (
            <Link
              key={s.id}
              href={`/topics/${topicSlug}/${s.slug}`}
              style={{
                display: "block",
                padding: "18px 18px",
                borderRadius: "22px",
                border: "1px solid #9e8e84",
                background: "#0b0f19",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "15px",
                boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
              }}
            >
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
