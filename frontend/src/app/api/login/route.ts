import { NextResponse } from "next/server";

const USERNAME = process.env.AUTH_USER!;
const PASSWORD = process.env.AUTH_PASSWORD!;

export async function POST(req: Request) {
  const { user, pass } = await req.json();

  if (user === USERNAME && pass === PASSWORD) {
    const res = NextResponse.json({ success: true });

    // raw cookie value
    res.cookies.set("auth", "true", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",      // important
      maxAge: 60 * 60 // 1 hour
    });

    return res;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
