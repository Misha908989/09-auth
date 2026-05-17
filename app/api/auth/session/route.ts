import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { api } from "@/app/api/api";

function logErrorResponse(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("Error response:", error.response?.data);
  }
}

export async function GET() {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore).getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await api.get("/api/auth/session", {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Session check failed" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(null);
  }
}
