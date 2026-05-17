import { parse } from "cookie";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";

function logErrorResponse(data: unknown): void {
  console.error(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const response = await api.post("/auth/register", body);
    const cookieStore = await cookies();

    const setCookieHeader = response.headers["set-cookie"] ?? [];
    for (const cookieStr of setCookieHeader) {
      const parsed = parse(cookieStr);

      if (parsed.accessToken) {
        cookieStore.set("accessToken", parsed.accessToken, {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
        });
      }
      if (parsed.refreshToken) {
        cookieStore.set("refreshToken", parsed.refreshToken, {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
        });
      }
    }

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.response?.data?.error, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
