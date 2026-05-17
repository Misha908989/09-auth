import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = "https://notehub-api.goit.study";

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const { searchParams } = new URL(req.url);
  try {
    const { data } = await axios.get(`${BACKEND_URL}/notes`, {
      params: Object.fromEntries(searchParams),
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const body = await req.json();
  try {
    const { data } = await axios.post(`${BACKEND_URL}/notes`, body, {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
