import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import axios, { isAxiosError } from "axios";
import api from "@/app/api/api";

function logErrorResponse(error: unknown) {
  if (isAxiosError(error)) {
    console.error("Error:", error.message, error.response?.data);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await api.post("/auth/login", body);
    const cookieStore = await cookies();

    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookieArray.forEach((cookieStr) => {
        const [nameValue, ...attrs] = cookieStr.split(";").map((p: string) => p.trim());
        const parsed = parse(nameValue);
        const [name] = Object.keys(parsed);
        if (name !== "accessToken" && name !== "refreshToken") return;
        const value = parsed[name];
        const options: Record<string, string | boolean | number | Date> = {};
        attrs.forEach((attr: string) => {
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
        { message: error.message, data: error.response?.data },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
