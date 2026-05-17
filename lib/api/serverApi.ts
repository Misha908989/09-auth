import { cookies } from "next/headers";
import axios from "axios";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { NotesResponse } from "./clientApi";

const BASE_URL = "https://notehub-api.goit.study";

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
  const { data } = await axios.get<NotesResponse>(`${BASE_URL}/notes`, {
    params,
    headers,
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const headers = await getHeaders();
  const { data } = await axios.get<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });
  return data;
}

export async function getMe(): Promise<User> {
  const headers = await getHeaders();
  const { data } = await axios.get<User>(`${BASE_URL}/users/me`, { headers });
  return data;
}

export async function checkSession(): Promise<User | null> {
  const headers = await getHeaders();
  const { data } = await axios.get<User | null>(`${BASE_URL}/auth/session`, {
    headers,
  });
  return data;
}
