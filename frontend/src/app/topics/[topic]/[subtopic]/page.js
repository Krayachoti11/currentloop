async function getThreads(subtopic) {
  const res = await fetch("http://localhost:8080/api/subtopics/" + subtopic + "/threads")
  if (!res.ok) return []
  return res.json()
}

export default async function SubtopicPage(props) {
  const params = await props.params
  const topic = params.topic
  const subtopic = params.subtopic

  const threads = await getThreads(subtopic)

  const topicName = topic.charAt(0).toUpperCase() + topic.slice(1)
  const subtopicName = subtopic
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      <div style={{ borderBottom: "2px solid #eee", paddingBottom: "16px", marginBottom: "32px" }}>
        <a href={"/topics/" + topic} style={{ color: "#888", textDecoration: "none", fontSize: "14px" }}>
          ← Back to {topicName}
        </a>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "8px 0 0 0" }}>
          {subtopicName}
        </h1>
        <p style={{ color: "#666", margin: "4px 0 0 0" }}>
          {topicName} → {subtopicName}
        </p>
      </div>

      {threads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>💬</div>
          <div style={{ fontSize: "18px", fontWeight: "600" }}>No threads yet</div>
          <div style={{ marginTop: "8px" }}>Be the first to start a discussion</div>
        </div>
      ) : (
        <div>
          {threads.map((thread) => (
            <a
              key={thread.id}
              href={"/thread/" + thread.id}
              style={{
                display: "block",
                border: "1px solid #eee",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "12px",
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px" }}>
                {thread.title}
              </div>
              <div style={{ fontSize: "13px", color: "#888" }}>
                {thread.replyCount} replies · {new Date(thread.createdAt).toLocaleDateString()}
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}