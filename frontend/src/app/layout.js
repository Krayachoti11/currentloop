import "./globals.css"
import { Inter } from "next/font/google"
import Navbar from "./components/Navbar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata = {
  title: "CurrentLoop",
  description: "Community discussions and Briefs — sports, movies, politics, and more.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-body), system-ui, sans-serif",
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
