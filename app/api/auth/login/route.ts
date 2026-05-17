import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";

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
        const [nameValue, expiresStr] = cookieStr.split(";");
        const parsed = parse(nameValue.trim());
        const [name] = Object.keys(parsed);
        if (name !== "accessToken" && name !== "refreshToken") return;
        const value = parsed[name];
        const expires = expiresStr ? new Date(expiresStr.split("=")[1]) : undefined;
        cookieStore.set(name, value, { expires });
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
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
