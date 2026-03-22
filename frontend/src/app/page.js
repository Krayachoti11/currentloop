async function getTopics() {
  const res = await fetch("http://localhost:8080/api/topics")
  return res.json()
}

async function getThreads() {
  const res = await fetch("http://localhost:8080/api/subtopics/football/threads")
  return res.json()
}

export default async function Home() {
  const topics = await getTopics()
  const threads = await getThreads()

  const briefs = [
    { title: "Barca transfer window latest update", topic: "Sports" },
    { title: "Dhurandhar 2 release day buzz", topic: "Movies" },
    { title: "India budget 2026 summary", topic: "Politics" },
  ]

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>

      <div style={{ borderBottom: "2px solid #eee", paddingBottom: "16px", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>CurrentLoop</h1>
        <p style={{ color: "#666", margin: "4px 0 0 0" }}>Sports. Movies. Politics. And everything in between.</p>
      </div>

      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Browse Topics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
          {topics.map((topic) => (
            <a
              key={topic.id}
              href={"/topics/" + topic.slug}
              style={{
                border: "1px solid #eee",
                borderRadius: "10px",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
                textDecoration: "none",
                color: "inherit",
                display: "block"
              }}
            >
              <div style={{ fontSize: "28px" }}>{topic.emoji}</div>
              <div style={{ fontWeight: "600", marginTop: "8px" }}>{topic.name}</div>
            </a>
          ))}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>

        <section>
          <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Latest Discussions</h2>
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
              <div style={{ fontWeight: "600" }}>{thread.title}</div>
              <div style={{ fontSize: "13px", color: "#888", marginTop: "6px" }}>
                {thread.replyCount} replies
              </div>
            </a>
          ))}
        </section>

        <section>
          <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Latest Briefs</h2>
          {briefs.map((brief) => (
            <div
              key={brief.title}
              style={{
                border: "1px solid #eee",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "12px"
              }}
            >
              <div style={{ fontSize: "13px", color: "#888", marginBottom: "6px" }}>
                {brief.topic}
              </div>
              <div style={{ fontWeight: "600" }}>{brief.title}</div>
              <div style={{ fontSize: "13px", color: "#0070f3", marginTop: "6px", cursor: "pointer" }}>
                Read Brief →
              </div>
            </div>
          ))}
        </section>

      </div>
    </main>
  )
}