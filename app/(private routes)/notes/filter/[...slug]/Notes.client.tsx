"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { fetchNotes } from "@/lib/api/clientApi";
import { NoteTag } from "@/types/note";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import css from "@/app/(private routes)/notes/notes.module.css";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, debouncedSearch, tag),
    placeholderData: (previousData) => previousData,
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError)
    return (
      <p>Could not fetch the list of notes. {(error as Error).message}</p>
    );

  return (
    <div className={css.wrapper}>
      <div className={css.controls}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.createButton}>
          Create note +
        </Link>
      </div>

      {data && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} />
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
