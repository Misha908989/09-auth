import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = "https://notehub-api.goit.study";

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const { data } = await axios.get(`${BACKEND_URL}/users/me`, {
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

export async function PATCH(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const body = await req.json();
  try {
    const { data } = await axios.patch(`${BACKEND_URL}/users/me`, body, {
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
