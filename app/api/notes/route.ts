import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import api from "@/app/api/api";

function logErrorResponse(error: unknown) {
  if (isAxiosError(error)) {
    console.error("Error:", error.message, error.response?.data);
  }
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const { searchParams } = new URL(req.url);

  try {
    const response = await api.get("/notes", {
      params: Object.fromEntries(searchParams),
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    logErrorResponse(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: error.message, data: error.response?.data },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json({ message: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const body = await req.json();

  try {
    const response = await api.post("/notes", body, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    logErrorResponse(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: error.message, data: error.response?.data },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json({ message: "Failed to create note" }, { status: 500 });
  }
}
