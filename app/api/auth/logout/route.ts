import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";

function logErrorResponse(error: unknown) {
  if (isAxiosError(error)) {
    console.error("Error:", error.message, error.response?.data);
  }
}

export async function POST() {
  const cookieStore = await cookies();

  try {
    const response = await api.post(
      "/auth/logout",
      {},
      { headers: { Cookie: cookieStore.toString() } }
    );
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    logErrorResponse(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
