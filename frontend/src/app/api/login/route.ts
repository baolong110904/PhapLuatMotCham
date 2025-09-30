// login route
import { NextResponse } from "next/server";
import crypto from "crypto";

const USERNAME = process.env.AUTH_USER!;
const PASSWORD = process.env.AUTH_PASSWORD!;
const SECRET = process.env.COOKIE_SECRET!;

console.log(USERNAME)
console.log(PASSWORD)
console.log(SECRET)

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function POST(req: Request) {
  const { user, pass } = await req.json();

  if (user === USERNAME && pass === PASSWORD) {
    const token = "true";
    const cookieValue = `${token}.${sign(token)}`;

    const res = NextResponse.json({ success: true });
    res.cookies.set("auth", cookieValue, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60
    });
    return res;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}