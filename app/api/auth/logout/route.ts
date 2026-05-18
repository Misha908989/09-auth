import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { NextResponse } from "next/server";
import { api, logErrorResponse } from "@/lib/api/api";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    await api.post(
      "/auth/logout",
      null,
      {
        headers: {
          Cookie: `accessToken=${accessToken ?? ""}; refreshToken=${refreshToken ?? ""}`,
        },
      }
    );
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
