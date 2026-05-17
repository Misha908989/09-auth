import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { api } from "@/app/api/api";

function logErrorResponse(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("Error response:", error.response?.data);
  }
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const { searchParams } = new URL(req.url);

  try {
    const response = await api.get("/api/notes", {
      params: Object.fromEntries(searchParams),
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed to fetch notes" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const body = await req.json();

  try {
    const response = await api.post("/api/notes", body, {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed to create note" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Failed to create note" }, { status: 500 });
  }
}
