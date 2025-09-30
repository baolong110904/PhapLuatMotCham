import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // allow static assets
  if (req.nextUrl.pathname.startsWith("/_next") ||
      req.nextUrl.pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  const authCookie = req.cookies.get("auth");

  // check raw cookie value
  if (authCookie?.value === "true") {
    return NextResponse.next();
  }

  // redirect to login if not authenticated
  if (!req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};