import Link from "next/link"
import { briefsData } from "../data/briefsData"

export default function BriefsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0f19",
        padding: "32px 20px 44px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link
            href="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              opacity: 0.85,
            }}
          >
            ← Back
          </Link>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#b7bcc6",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            CurrentLoop
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              lineHeight: 1,
              color: "#fff",
              fontWeight: "800",
              letterSpacing: "-0.02em",
            }}
          >
            Briefs
          </h1>

          <p
            style={{
              margin: "12px 0 0 0",
              color: "#b7bcc6",
              fontSize: "16px",
              maxWidth: "620px",
              lineHeight: 1.6,
            }}
          >
            Quick structured updates across sports, movies, and politics. Read the summary, check the main points, and jump into discussion when you want the human side.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {briefsData.map((brief) => (
            <Link
              key={brief.id}
              href={`/briefs/${brief.id}`}
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                background: "#111827",
                border: "1px solid #9e8e84",
                borderRadius: "24px",
                padding: "22px 24px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                }}
              >
                {brief.tags.map((tag) => (
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

              <div
                style={{
                  color: "#fff",
                  fontSize: "24px",
                  fontWeight: "800",
                  lineHeight: 1.25,
                  marginBottom: "12px",
                }}
              >
                {brief.title}
              </div>

              <div
                style={{
                  color: "#d8dde6",
                  fontSize: "15px",
                  lineHeight: 1.65,
                  marginBottom: "14px",
                }}
              >
                {brief.summary.length > 220
                  ? brief.summary.slice(0, 220) + "..."
                  : brief.summary}
              </div>

              <div
                style={{
                  color: "#aeb4bf",
                  fontSize: "13px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span>{brief.topic}</span>
                <span>•</span>
                <span>{brief.subtopic}</span>
                <span>•</span>
                <span>{new Date(brief.updatedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
