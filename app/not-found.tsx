import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | NoteHub",
  description: "The page you are looking for does not exist.",
  openGraph: {
    title: "Page Not Found | NoteHub",
    description: "The page you are looking for does not exist.",
    url: "https://notehub.app/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <main style={{ padding: "80px 32px", textAlign: "center" }}>
      <h1 style={{ color: "#e9d5ff", fontSize: "2rem" }}>404 – Page Not Found</h1>
      <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
        The page you are looking for does not exist.
      </p>
      <Link href="/" style={{ color: "#a78bfa" }}>
        Go back home
      </Link>
    </main>
  );
}
