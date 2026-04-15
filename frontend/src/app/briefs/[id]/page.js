import Link from "next/link"
import { getBriefById } from "../../data/briefsData"

export default async function BriefDetailPage(props) {
  const params = await props.params
  const id = params.id

  const brief = getBriefById(id)

  if (!brief) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0b0f19",
          padding: "40px 20px",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>Brief not found.</div>
      </main>
    )
  }

  const safeSubtopic = (brief.discussionSubtopic || brief.subtopic || "").trim()
  const safeTitle = (brief.title || "Start a discussion").trim()
  const safeSummary = (brief.summary || "").trim()
  const safePoints = Array.isArray(brief.points) ? brief.points.filter(Boolean) : []

  const discussionBody =
    safePoints.length > 0
      ? `${safeSummary}\n\nKey Points:\n- ${safePoints.join("\n- ")}`.trim()
      : safeSummary

  const discussionHref = `/thread/new?${new URLSearchParams({
    subtopic: safeSubtopic,
    title: safeTitle,
    body: discussionBody,
  }).toString()}`

  function formatDateTime(value) {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? "Unknown update time" : date.toLocaleString()
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0f19",
        padding: "32px 20px 44px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link
            href="/briefs"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              opacity: 0.85,
            }}
          >
            ← Back to Briefs
          </Link>
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #9e8e84",
            borderRadius: "24px",
            padding: "28px 28px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "14px",
            }}
          >
            {(brief.tags || []).map((tag) => (
              <span
                key={tag}
                style={{
                  background: "#0b0f19",
                  color: "#d8dde6",
                  border: "1px solid #9e8e84",
                  borderRadius: "999px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            style={{
              margin: "0 0 14px 0",
              fontSize: "34px",
              lineHeight: 1.15,
              color: "#fff",
              fontWeight: "800",
            }}
          >
            {brief.title}
          </h1>

          <div
            style={{
              color: "#aeb4bf",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            Updated {formatDateTime(brief.updatedAt)}
          </div>

          <div
            style={{
              color: "#d8dde6",
              fontSize: "16px",
              lineHeight: 1.8,
              marginBottom: "24px",
            }}
          >
            {brief.summary}
          </div>

          <Link
            href={discussionHref}
            style={{
              background: "#f26b1d",
              color: "#111",
              textDecoration: "none",
              padding: "11px 20px",
              border: "1px solid #f26b1d",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: "800",
              boxShadow: "0 8px 20px rgba(242,107,29,0.25)",
              display: "inline-block",
            }}
          >
            Start Discussion
          </Link>
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #9e8e84",
            borderRadius: "24px",
            padding: "24px 24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            marginBottom: "22px",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px 0",
              color: "#fff",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            Key Points
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(brief.points || []).map((point, index) => (
              <div
                key={index}
                style={{
                  background: "#0b0f19",
                  border: "1px solid #9e8e84",
                  borderRadius: "20px",
                  padding: "16px 18px",
                  color: "#d8dde6",
                  fontSize: "15px",
                  lineHeight: 1.6,
                }}
              >
                {point}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #9e8e84",
            borderRadius: "24px",
            padding: "24px 24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px 0",
              color: "#fff",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            Sources
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(brief.sourceLinks || []).map((source, index) => (
              <a
                key={index}
                href={source.url || "#"}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#0b0f19",
                  border: "1px solid #9e8e84",
                  borderRadius: "20px",
                  padding: "16px 18px",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                {source.label || `Source ${index + 1}`}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
