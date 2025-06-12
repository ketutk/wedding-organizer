// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_FILE = /\.(.*)$/;

// Decode secret key once
const key = new TextEncoder().encode(process.env.JWT_SECRET);

// Define protected routes
const protectedRoutes = ["/admin"]; // Add your private paths here

async function verifySession(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore public files and Next.js internals
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const session = req.cookies.get("session")?.value;
  const userLogged = session ? await verifySession(session) : null;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users trying to access protected routes
  if (isProtected && !userLogged) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // adjust based on your protected routes
};
