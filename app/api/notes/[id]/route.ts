import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { api } from "@/app/api/api";

function logErrorResponse(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("Error response:", error.response?.data);
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const { id } = await params;

  try {
    const response = await api.get(`/api/notes/${id}`, {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed to fetch note" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Failed to fetch note" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const { id } = await params;
  const body = await req.json();

  try {
    const response = await api.patch(`/api/notes/${id}`, body, {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed to update note" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const { id } = await params;

  try {
    const response = await api.delete(`/api/notes/${id}`, {
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed to delete note" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Failed to delete note" }, { status: 500 });
  }
}
