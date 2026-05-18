import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { api, logErrorResponse } from "@/lib/api/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const cookieStore = await cookies();

  try {
    const response = await api.get(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const cookieStore = await cookies();
  const body = await req.json();

  try {
    const response = await api.patch(`/notes/${id}`, body, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const cookieStore = await cookies();

  try {
    const response = await api.delete(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
