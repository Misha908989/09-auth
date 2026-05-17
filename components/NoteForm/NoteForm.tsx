"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  function handleAction(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tag = formData.get("tag") as NoteTag;
    mutation.mutate({ title, content, tag });
  }

  function handleCancel() {
    router.back();
  }

  return (
    <form action={handleAction} className={css.form}>
      <label className={css.label}>
        Title
        <input
          type="text"
          name="title"
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          className={css.input}
          required
          minLength={3}
          maxLength={50}
        />
      </label>

      <label className={css.label}>
        Content
        <textarea
          name="content"
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          className={css.textarea}
          rows={4}
          maxLength={500}
        />
      </label>

      <label className={css.label}>
        Tag
        <select
          name="tag"
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}
          className={css.select}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>

      {mutation.isError && (
        <p className={css.error}>Failed to create note. Try again.</p>
      )}
    </form>
  );
}
