import "./globals.css"
import Navbar from "./components/Navbar"

export const metadata = {
  title: "CurrentLoop",
  description: "Community discussions and Briefs — sports, movies, politics, and more.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          background: "#0b0f19",
          color: "#fff",
        }}
      >
        <Navbar />
        {children}
      </body>
    </html>
  )
}
