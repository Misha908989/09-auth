import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api, logErrorResponse } from "@/app/api/api";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") ?? "1";
  const perPage = "12";
  const search = searchParams.get("search") ?? "";
  const tag = searchParams.get("tag");

  const params: Record<string, string> = { page, perPage };
  if (search) params.search = search;
  if (tag && tag !== "All") params.tag = tag;

  try {
    const response = await api.get("/notes", {
      params,
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

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const body = await req.json();

  try {
    const response = await api.post("/notes", body, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
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
