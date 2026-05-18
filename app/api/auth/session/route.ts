import { parse } from "cookie";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { NextResponse } from "next/server";
import { api, logErrorResponse } from "@/lib/api/api";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(null);
  }

  try {
    const response = await api.get("/auth/session", {
      headers: {
        Cookie: `accessToken=${accessToken ?? ""}; refreshToken=${refreshToken ?? ""}`,
      },
    });

    const setCookieHeader = response.headers["set-cookie"] ?? [];
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
