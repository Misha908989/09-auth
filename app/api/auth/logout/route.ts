import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { api } from "@/app/api/api";

function logErrorResponse(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("Error response:", error.response?.data);
  }
}

export async function POST() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await api.post(
      "/api/auth/logout",
      {},
      { headers: { Cookie: cookieHeader } }
    );

    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookieArray.forEach((cookieStr) => {
        const parts = cookieStr.split(";").map((p: string) => p.trim());
        const [nameValue, ...attrs] = parts;
        const [name, value] = nameValue.split("=");
        const options: Record<string, string | boolean | number | Date> = {};
        attrs.forEach((attr: string) => {
          const [k, v] = attr.split("=");
          const key = k.toLowerCase();
          if (key === "path") options.path = v;
          else if (key === "max-age") options.maxAge = parseInt(v);
          else if (key === "expires") options.expires = new Date(v);
          else if (key === "httponly") options.httpOnly = true;
          else if (key === "samesite") options.sameSite = v as "lax" | "strict" | "none";
          else if (key === "secure") options.secure = true;
        });
        cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    logErrorResponse(error);
    return NextResponse.json({ success: true });
  }
}
