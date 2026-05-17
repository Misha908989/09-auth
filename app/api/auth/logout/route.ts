import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";

function logErrorResponse(data: unknown): void {
  console.error(data);
}

export async function POST() {
  const cookieStore = await cookies();
  try {
    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
