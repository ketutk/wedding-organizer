import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

const cookie = {
  name: "session",
  options: { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  duration: 7 * 24 * 60 * 60 * 1000,
};

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7day").sign(key);
}

export async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function createSession(userId: string) {
  const cookiesStore = await cookies();

  const session = await encrypt({ userId });

  cookiesStore.set(cookie.name, session, { ...cookie.options, secure: true, expires: new Date(Date.now() + cookie.duration) });
}

export async function verifySession(): Promise<{ userId: string } | null> {
  const cookiesStore = await cookies();

  const cookieSession = cookiesStore.get(cookie.name)?.value;
  const session = await decrypt(cookieSession || "");

  if (!session) {
    return null;
  }

  // Convert session.exp (seconds) to milliseconds for comparison
  const expirationTime = (session.exp as number) * 1000;

  if (expirationTime && expirationTime <= Date.now()) {
    console.log("Date now :", Date.now());
    console.log("Session expired", expirationTime);
    await destroySession();
    NextResponse.redirect("/login");
    return null;
  }

  if (session.userId != "" || session.companyId != "") {
    return { userId: `${session.userId}` };
  }

  return null;
}

export async function destroySession() {
  const cookiesStore = await cookies();

  cookiesStore.delete(cookie.name);
}
