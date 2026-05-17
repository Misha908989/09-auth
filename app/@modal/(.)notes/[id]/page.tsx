"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NotePreviewClient from "./NotePreview.client";

export default function InterceptedNotePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <NotePreviewClient id={id} />
    </Modal>
  );
}
