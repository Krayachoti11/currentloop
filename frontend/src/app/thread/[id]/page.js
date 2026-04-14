import Link from "next/link"
import ReplyBox from "./ReplyBox"
import { apiUrl, readJsonSafely } from "@/lib/api"

async function getThread(id) {
  try {
    const res = await fetch(apiUrl(`/api/threads/${id}`), { cache: "no-store" })
    if (!res.ok) return null

    const data = await readJsonSafely(res)
    return data && typeof data === "object" ? data : null
  } catch {
    return null
  }
}

async function getReplies(id) {
  try {
    const res = await fetch(apiUrl(`/api/threads/${id}/replies`), { cache: "no-store" })
    if (!res.ok) return []

    const data = await readJsonSafely(res)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default async function ThreadPage(props) {
  const params = await props.params
  const id = params.id

  const thread = await getThread(id)
  const replies = await getReplies(id)

  if (!thread) {
    return (
      <main style={{ padding: "40px", background: "#f26b1d", minHeight: "100vh", color: "#111" }}>
        Thread not found
      </main>
    )
  }

  const backHref =
    thread.topicSlug && thread.subtopicSlug
      ? `/topics/${thread.topicSlug}/${thread.subtopicSlug}`
      : "/community"

  const backLabel =
    thread.topicSlug && thread.subtopicSlug ? "← Back to subtopic" : "← Community"

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
            href={backHref}
            style={{
              color: "#111",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {backLabel}
          </Link>
        </div>

        <div
          style={{
            background: "#0b0f19",
            border: "1px solid #9e8e84",
            borderRadius: "28px",
            padding: "26px 24px",
            marginBottom: "22px",
            boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: "24px",
              fontWeight: 800,
              marginBottom: "12px",
              lineHeight: 1.3,
            }}
          >
            {thread.title}
          </div>

          <div
            style={{
              color: "#d8dde6",
              fontSize: "16px",
              lineHeight: 1.6,
              marginBottom: "14px",
              whiteSpace: "pre-wrap",
            }}
          >
            {thread.body}
          </div>

          <div style={{ color: "#aeb4bf", fontSize: "13px" }}>
            @{thread.username || "deleted-user"} • {thread.replyCount || 0} replies •{" "}
            {thread.createdAt ? new Date(thread.createdAt).toLocaleString() : ""}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {replies.map((reply) => (
            <div
              key={reply.id}
              style={{
                background: "#0b0f19",
                border: "1px solid #9e8e84",
                borderRadius: "24px",
                padding: "18px 20px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ color: "#aeb4bf", fontSize: "13px", marginBottom: "6px" }}>
                @{reply.username || "deleted-user"} • {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : ""}
              </div>
              <div style={{ color: "#fff", fontSize: "15px", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {reply.body}
              </div>
            </div>
          ))}
        </div>

        <ReplyBox threadId={id} />
      </div>
    </main>
  )
}
