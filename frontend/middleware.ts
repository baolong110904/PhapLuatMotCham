import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET = process.env.COOKIE_SECRET!;

async function verifyCookie(cookieValue: string, secret: string): Promise<boolean> {
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return false;

  const [value, hash] = parts;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  const expectedHash = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return hash === expectedHash && value === "true";
}

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const authCookie = req.cookies.get("auth");

  if (authCookie && (await verifyCookie(authCookie.value, SECRET))) {
    return NextResponse.next();
  }

  if (!req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};