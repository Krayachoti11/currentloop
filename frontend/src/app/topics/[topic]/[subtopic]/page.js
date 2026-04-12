import Link from "next/link"
import { apiUrl } from "@/lib/api"

async function getThreads(subtopicSlug) {
  try {
    const res = await fetch(apiUrl(`/api/subtopics/${subtopicSlug}/threads`), { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function SubtopicPage(props) {
  const params = await props.params
  const topic = params.topic
  const subtopic = params.subtopic

  const threads = await getThreads(subtopic)

  const topicName = topic.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  const subtopicName = subtopic.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f26b1d",
        padding: "28px 20px 40px",
        fontFamily: "var(--font-body, Inter, system-ui, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <div style={{ marginBottom: "22px" }}>
          <Link
            href={`/topics/${topic}`}
            style={{
              color: "#111",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              opacity: 0.85,
            }}
          >
            ← Back to {topicName}
          </Link>
        </div>

        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px",
                color: "#111",
                fontSize: "14px",
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              {topicName}
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "42px",
                lineHeight: 1,
                color: "#111",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              {subtopicName}
            </h1>
            <p
              style={{
                margin: "12px 0 0",
                color: "#111",
                fontSize: "16px",
                maxWidth: "560px",
                opacity: 0.85,
              }}
            >
              Latest threads and reactions in this space.
            </p>
          </div>

          <Link
            href={`/thread/new?subtopic=${subtopic}`}
            style={{
              background: "#0b0f19",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 20px",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 700,
              border: "1px solid #9e8e84",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "140px",
            }}
          >
            + New Thread
          </Link>
        </div>

        {threads.length === 0 ? (
          <div
            style={{
              background: "#0b0f19",
              color: "#fff",
              border: "1px solid #9e8e84",
              borderRadius: "28px",
              padding: "32px 26px",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>No threads yet</div>
            <div style={{ color: "#b7bcc6", fontSize: "15px", marginBottom: "18px" }}>
              Be the first to start the conversation in {subtopicName}.
            </div>
            <Link
              href={`/thread/new?subtopic=${subtopic}`}
              style={{
                background: "#f2e9e4",
                color: "#111",
                textDecoration: "none",
                padding: "10px 18px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              Start the first thread
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/thread/${thread.id}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  background: "#0b0f19",
                  border: "1px solid #9e8e84",
                  borderRadius: "28px",
                  padding: "20px 22px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  style={{
                    color: "#fff",
                    fontSize: "21px",
                    fontWeight: 800,
                    lineHeight: 1.25,
                    marginBottom: "10px",
                  }}
                >
                  {thread.title}
                </div>

                {thread.body ? (
                  <div
                    style={{
                      color: "#d8dde6",
                      fontSize: "15px",
                      lineHeight: 1.5,
                      marginBottom: "12px",
                      opacity: 0.95,
                    }}
                  >
                    {thread.body.length > 120 ? thread.body.slice(0, 120) + "..." : thread.body}
                  </div>
                ) : null}

                <div
                  style={{
                    color: "#aeb4bf",
                    fontSize: "13px",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <span>@{thread.username}</span>
                  <span>•</span>
                  <span>{thread.replyCount} replies</span>
                  <span>•</span>
                  <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
