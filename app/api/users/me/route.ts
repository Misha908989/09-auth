import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { api } from "@/app/api/api";

export const dynamic = "force-dynamic";

function logErrorResponse(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("Error response:", error.response?.data);
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await api.get("/api/users/me", {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed to fetch user" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const body = await req.json();

  try {
    const response = await api.patch("/api/users/me", body, {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed to update user" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}
