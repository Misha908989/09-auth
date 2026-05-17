import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = "https://notehub-api.goit.study";

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const { data } = await axios.get(`${BACKEND_URL}/auth/session`, {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null);
  }
}
