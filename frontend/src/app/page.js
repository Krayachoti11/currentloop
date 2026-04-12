import Link from "next/link"
import { apiUrl } from "@/lib/api"
import { briefsData } from "./data/briefsData"

async function getTopics() {
  try {
    const res = await fetch(apiUrl("/api/topics"), { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function getSampleThreads() {
  try {
    const res = await fetch(apiUrl("/api/subtopics/football/threads"), { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function Home() {
  const topics = await getTopics()
  const threads = await getSampleThreads()

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0f19",
        padding: "32px 20px 56px",
        fontFamily: "var(--font-body, Inter, system-ui, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
        <section
          style={{
            marginBottom: "40px",
            padding: "36px 28px",
            borderRadius: "32px",
            border: "1px solid #9e8e84",
            background: "linear-gradient(145deg, #111827 0%, #0b0f19 100%)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
          }}
        >
          <p
            style={{
              margin: "0 0 10px",
              color: "#b7bcc6",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            CurrentLoop
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(32px, 5vw, 44px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Discussion that stays readable.
          </h1>
          <p
            style={{
              margin: "16px 0 28px",
              color: "#d8dde6",
              fontSize: "17px",
              lineHeight: 1.6,
              maxWidth: "560px",
            }}
          >
            A modern forum split into two lanes: structured Briefs for quick context, and Community
            for real back-and-forth — sports, movies, politics, and more.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Link
              href="/community"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 22px",
                borderRadius: "999px",
                background: "#f26b1d",
                color: "#111",
                fontWeight: 800,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              Enter Community
            </Link>
            <Link
              href="/briefs"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 22px",
                borderRadius: "999px",
                border: "1px solid #9e8e84",
                background: "transparent",
                color: "#fff",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              Read Briefs
            </Link>
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 22px",
                borderRadius: "999px",
                color: "#f26b1d",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <section>
            <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, margin: "0 0 14px" }}>
              Browse topics
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {topics.slice(0, 8).map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 16px",
                    borderRadius: "20px",
                    border: "1px solid #9e8e84",
                    background: "#111827",
                    textDecoration: "none",
                    color: "#fff",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>{topic.emoji}</span>
                  <span style={{ fontWeight: 700 }}>{topic.name}</span>
                </Link>
              ))}
              {topics.length === 0 ? (
                <p style={{ color: "#aeb4bf", fontSize: "14px" }}>
                  Start the API to load topics from the database.
                </p>
              ) : null}
            </div>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, margin: "0 0 14px" }}>
              Latest in Football
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {threads.slice(0, 5).map((thread) => (
                <Link
                  key={thread.id}
                  href={`/thread/${thread.id}`}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "20px",
                    border: "1px solid #9e8e84",
                    background: "#111827",
                    textDecoration: "none",
                    color: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: "6px" }}>{thread.title}</div>
                  <div style={{ fontSize: "13px", color: "#aeb4bf" }}>
                    @{thread.username} · {thread.replyCount} replies
                  </div>
                </Link>
              ))}
              {threads.length === 0 ? (
                <p style={{ color: "#aeb4bf", fontSize: "14px" }}>
                  No threads yet — open Community and start one.
                </p>
              ) : null}
            </div>
          </section>
        </div>

        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
            <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, margin: 0 }}>Briefs spotlight</h2>
            <Link href="/briefs" style={{ color: "#f26b1d", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "14px",
            }}
          >
            {briefsData.map((brief) => (
              <Link
                key={brief.id}
                href={`/briefs/${brief.id}`}
                style={{
                  padding: "18px 18px",
                  borderRadius: "24px",
                  border: "1px solid #9e8e84",
                  background: "#111827",
                  textDecoration: "none",
                  color: "#fff",
                }}
              >
                <div style={{ fontSize: "12px", color: "#aeb4bf", marginBottom: "8px" }}>
                  {brief.tags[0]}
                </div>
                <div style={{ fontWeight: 800, lineHeight: 1.35, marginBottom: "8px" }}>{brief.title}</div>
                <div style={{ fontSize: "14px", color: "#d8dde6", lineHeight: 1.45 }}>
                  {brief.summary.length > 110 ? brief.summary.slice(0, 110) + "…" : brief.summary}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
