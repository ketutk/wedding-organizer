import { destroySession } from "@/app/_lib/session";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Clear the session cookie
    const res = NextResponse.redirect(new URL("/login", req.url));
    await destroySession();
    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
