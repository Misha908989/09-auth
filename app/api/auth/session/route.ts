import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { api, logErrorResponse } from "@/app/api/api";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(null, { status: 401 });
  }

  const cookieStore = await cookies();

  try {
    const response = await api.get("/auth/session", {
      headers: { Cookie: cookieStore.toString() },
    });

    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookieArray.forEach((cookieStr) => {
        const parts = cookieStr.split(";").map((p: string) => p.trim());
        const parsed = parse(parts[0]);
        const [name] = Object.keys(parsed);
        if (name !== "accessToken" && name !== "refreshToken") return;
        const value = parsed[name];
        const options: Record<string, string | boolean | number | Date> = {};
        parts.slice(1).forEach((attr: string) => {
          const [k, v] = attr.split("=");
          const key = k.trim().toLowerCase();
          if (key === "path") options.path = v?.trim();
          else if (key === "max-age") options.maxAge = parseInt(v);
          else if (key === "expires") options.expires = new Date(v?.trim());
          else if (key === "httponly") options.httpOnly = true;
          else if (key === "samesite") options.sameSite = v?.trim() as "lax" | "strict" | "none";
          else if (key === "secure") options.secure = true;
        });
        cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]);
      });
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    logErrorResponse(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
