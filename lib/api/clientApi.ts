import { api } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  totalNotes: number;
}

interface RegisterData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function fetchNotes(
  page: number = 1,
  search: string = "",
  tag?: string
): Promise<NotesResponse> {
  const params: Record<string, string | number> = { page, perPage: 12 };
  if (search) params.search = search;
  if (tag) params.tag = tag;
  const { data } = await api.get<NotesResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(noteData: {
  title: string;
  content?: string;
  tag: string;
}): Promise<Note> {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(userData: RegisterData): Promise<User> {
  const { data } = await api.post<User>("/auth/register", userData);
  return data;
}

export async function login(credentials: LoginData): Promise<User> {
  const { data } = await api.post<User>("/auth/login", credentials);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<User | null>("/auth/session");
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(userData: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>("/users/me", userData);
  return data;
}
