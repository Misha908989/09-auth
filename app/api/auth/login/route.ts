import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = "https://notehub-api.goit.study";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const { data, headers } = await axios.post(`${BACKEND_URL}/auth/login`, body, {
      withCredentials: true,
    });
    const res = NextResponse.json(data);
    const setCookie = headers["set-cookie"];
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookieArray.forEach((cookie) => {
        res.headers.append("Set-Cookie", cookie);
      });
    }
    return res;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Login failed" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
