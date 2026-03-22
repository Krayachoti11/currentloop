async function getThread(id) {
  const res = await fetch("http://localhost:8080/api/threads/" + id)
  if (!res.ok) return null
  return res.json()
}

async function getReplies(id) {
  const res = await fetch("http://localhost:8080/api/threads/" + id + "/replies")
  if (!res.ok) return []
  return res.json()
}

export default async function ThreadPage(props) {
  const params = await props.params
  const id = params.id

  const thread = await getThread(id)
  const replies = await getReplies(id)

  if (!thread) {
    return (
      <main style={{ fontFamily: "sans-serif", padding: "40px" }}>
        Thread not found.
      </main>
    )
  }

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>

      {/* Breadcrumb */}
      <div style={{ marginBottom: "24px" }}>
        <a href="/" style={{ color: "#888", textDecoration: "none", fontSize: "14px" }}>Home</a>
        <span style={{ color: "#888", margin: "0 6px" }}>→</span>
        <a href="/community" style={{ color: "#888", textDecoration: "none", fontSize: "14px" }}>Community</a>
      </div>

      {/* Original Post */}
      <div style={{ border: "1px solid #eee", borderRadius: "10px", padding: "24px", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 16px 0" }}>{thread.title}</h1>
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 16px 0" }}>{thread.body}</p>
        <div style={{ fontSize: "13px", color: "#888" }}>
          Posted by user{thread.authorId} · {new Date(thread.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Replies */}
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
        {replies.length} Replies
      </h2>

      {replies.map((reply) => (
        <div
          key={reply.id}
          style={{ border: "1px solid #eee", borderRadius: "10px", padding: "16px", marginBottom: "12px" }}
        >
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
            user{reply.authorId} · {new Date(reply.createdAt).toLocaleDateString()}
          </div>
          <p style={{ fontSize: "15px", lineHeight: "1.6", margin: 0 }}>{reply.body}</p>
        </div>
      ))}

      {/* Reply Box */}
      <div style={{ border: "1px solid #eee", borderRadius: "10px", padding: "16px", marginTop: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 12px 0" }}>Leave a Reply</h3>
        <textarea
          placeholder="Write your reply..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            fontFamily: "sans-serif",
            resize: "vertical",
            boxSizing: "border-box"
          }}
        />
        <button
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          Post Reply
        </button>
      </div>

    </main>
  )
}
