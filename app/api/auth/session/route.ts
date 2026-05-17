import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import api from "@/app/api/api";

function logErrorResponse(error: unknown) {
  if (isAxiosError(error)) {
    console.error("Error:", error.message, error.response?.data);
  }
}

export async function GET() {
  const cookieStore = await cookies();

  try {
    const response = await api.get("/auth/session", {
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
    return NextResponse.json(null, { status: 500 });
  }
}
