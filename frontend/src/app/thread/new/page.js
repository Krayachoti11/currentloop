import { Suspense } from "react"
import NewThreadForm from "./NewThreadForm"

export default function NewThreadPage({ searchParams }) {
  const titleParam = typeof searchParams?.title === "string" ? searchParams.title : ""
  const bodyParam =
    typeof searchParams?.body === "string"
      ? searchParams.body
      : typeof searchParams?.content === "string"
        ? searchParams.content
        : ""

  const subtopicParam =
    typeof searchParams?.subtopic === "string"
      ? searchParams.subtopic
      : typeof searchParams?.subtopicSlug === "string"
        ? searchParams.subtopicSlug
        : ""

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
      <NewThreadForm initialTitle={titleParam} initialBody={bodyParam} initialSubtopicSlug={subtopicParam} />
    </Suspense>
  )
}
