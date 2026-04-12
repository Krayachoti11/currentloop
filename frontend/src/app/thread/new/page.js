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
            color: "#111",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Loading…
        </main>
      }
    >
      <NewThreadForm />
    </Suspense>
  )
}
