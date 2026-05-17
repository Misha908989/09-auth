import axios from "axios";
import { Note, CreateNoteData } from "@/types/note";

const BASE_URL = "https://notehub-public-api.goit.study/api";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  totalNotes: number;
}

export async function fetchNotes(
  page: number = 1,
  search: string = "",
  tag?: string
): Promise<NotesResponse> {
  const params: Record<string, string | number> = { page, perPage: 12 };
  if (search) {
    params.search = search;
  }
  if (tag) {
    params.tag = tag;
  }
  const { data } = await api.get<NotesResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(noteData: CreateNoteData): Promise<Note> {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
