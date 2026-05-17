import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = "https://notehub-api.goit.study";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieHeader = req.headers.get("cookie") || "";
  const { id } = await params;
  try {
    const { data } = await axios.get(`${BACKEND_URL}/notes/${id}`, {
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieHeader = req.headers.get("cookie") || "";
  const { id } = await params;
  try {
    const { data } = await axios.delete(`${BACKEND_URL}/notes/${id}`, {
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
