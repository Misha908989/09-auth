import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = "https://notehub-api.goit.study";

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const { headers } = await axios.post(
      `${BACKEND_URL}/auth/logout`,
      {},
      { headers: { Cookie: cookieHeader }, withCredentials: true }
    );
    const res = NextResponse.json({ success: true });
    const setCookie = headers["set-cookie"];
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookieArray.forEach((cookie) => {
        res.headers.append("Set-Cookie", cookie);
      });
    }
    return res;
  } catch {
    return NextResponse.json({ success: true });
  }
}
