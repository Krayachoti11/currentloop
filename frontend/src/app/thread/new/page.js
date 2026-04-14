import { Suspense } from "react"
import NewThreadForm from "./NewThreadForm"

export default function NewThreadPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#f26b1d",
            padding: "40px 20px",
            color: "#0b0f19",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              background: "#0b0f19",
              color: "#b7bcc6",
              border: "1px solid #9e8e84",
              borderRadius: "22px",
              padding: "16px 18px",
            }}
          >
            Loading thread composer…
          </div>
        </main>
      }
    >
      <NewThreadForm />
    </Suspense>
  )
}
