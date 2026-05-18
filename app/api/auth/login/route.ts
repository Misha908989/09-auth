import { parse } from "cookie";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { api, logErrorResponse } from "@/lib/api/api";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const response = await api.post("/auth/login", body);
    const cookieStore = await cookies();

    const setCookieHeader = response.headers["set-cookie"] ?? [];

    if (!setCookieHeader.length) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    for (const cookieStr of setCookieHeader) {
      const parsed = parse(cookieStr);

      if (parsed.accessToken) {
        cookieStore.set("accessToken", parsed.accessToken, {
          httpOnly: true,
          path: "/",
          maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
        });
      }
      if (parsed.refreshToken) {
        cookieStore.set("refreshToken", parsed.refreshToken, {
          httpOnly: true,
          path: "/",
          maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
        });
      }
    }

    return NextResponse.json(response.data, { status: response.status });
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
