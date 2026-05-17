import { cookies } from "next/headers";
import { AxiosResponse } from "axios";
import { api } from "@/app/api/api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { NotesResponse } from "./clientApi";

function getHeaders() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  return { Cookie: cookieHeader };
}

export async function fetchNotes(
  page: number = 1,
  search: string = "",
  tag?: string
): Promise<NotesResponse> {
  const params: Record<string, string | number> = { page, perPage: 12 };
  if (search) params.search = search;
  if (tag) params.tag = tag;
  const headers = getHeaders();
  const { data } = await api.get<NotesResponse>("/api/notes", { params, headers });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const headers = getHeaders();
  const { data } = await api.get<Note>(`/api/notes/${id}`, { headers });
  return data;
}

export async function getMe(): Promise<User> {
  const headers = getHeaders();
  const { data } = await api.get<User>("/api/users/me", { headers });
  return data;
}

export async function checkSession(): Promise<AxiosResponse<User | null>> {
  const headers = getHeaders();
  const response = await api.get<User | null>("/api/auth/session", { headers });
  return response;
}
