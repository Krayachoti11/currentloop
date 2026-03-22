import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "CurrentLoop",
  description: "Sports. Movies. Politics. And everything in between.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#0a0a0a", color: "#fff" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}