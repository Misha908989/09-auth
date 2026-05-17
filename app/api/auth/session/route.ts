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
    return NextResponse.json(null, { status: 500 });
  }
}
