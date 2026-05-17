import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_ROUTES = ["/notes", "/profile"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));
  const isAuth = AUTH_ROUTES.some((r) => pathname === r);

  if (isPrivate || isAuth) {
    let isAuthenticated = !!accessToken;

    if (!accessToken && refreshToken) {
      try {
        const response = await checkSession();
        isAuthenticated = !!response?.data;
      } catch {
        isAuthenticated = false;
      }
    }

    if (isPrivate && !isAuthenticated) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isAuth && isAuthenticated) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
