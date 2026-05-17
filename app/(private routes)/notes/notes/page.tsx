import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import css from "./notes.module.css";

export const metadata: Metadata = {
  title: "Notes | NoteHub",
  description: "Browse and manage all your personal notes in NoteHub.",
  openGraph: {
    title: "Notes | NoteHub",
    description: "Browse and manage all your personal notes in NoteHub.",
    url: "https://notehub.app/notes",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, ""],
    queryFn: () => fetchNotes(1, ""),
  });

  return (
    <main className={css.page}>
      <h1 className={css.heading}>My Notes</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient />
      </HydrationBoundary>
    </main>
  );
}
