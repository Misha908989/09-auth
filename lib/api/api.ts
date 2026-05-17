import axios, { isAxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export function logErrorResponse(error: unknown) {
  if (isAxiosError(error)) {
    console.error("Error response:", error.response?.status, error.response?.data);
  }
}
