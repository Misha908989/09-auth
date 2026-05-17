import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api, logErrorResponse } from "@/app/api/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const { id } = await params;

  try {
    const response = await api.get(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    logErrorResponse(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const { id } = await params;
  const body = await req.json();

  try {
    const response = await api.patch(`/notes/${id}`, body, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    logErrorResponse(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const { id } = await params;

  try {
    const response = await api.delete(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    logErrorResponse(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
