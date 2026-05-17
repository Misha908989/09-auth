import { cookies } from "next/headers";
import { AxiosResponse } from "axios";
import { api } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { NotesResponse } from "./clientApi";

async function getHeaders() {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
}

export async function fetchNotes(
  page: number = 1,
  search: string = "",
  tag?: string
): Promise<NotesResponse> {
  const params: Record<string, string | number> = { page, perPage: 12 };
  if (search) params.search = search;
  if (tag) params.tag = tag;
  const headers = await getHeaders();
  const { data } = await api.get<NotesResponse>("/notes", { params, headers });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const headers = await getHeaders();
  const { data } = await api.get<Note>(`/notes/${id}`, { headers });
  return data;
}

export async function getMe(): Promise<User> {
  const headers = await getHeaders();
  const { data } = await api.get<User>("/users/me", { headers });
  return data;
}

export async function checkSession(): Promise<AxiosResponse<User | null>> {
  const headers = await getHeaders();
  const response = await api.get<User | null>("/auth/session", { headers });
  return response;
}
