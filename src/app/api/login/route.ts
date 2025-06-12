import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust if your Prisma client is elsewhere
import bcrypt from "bcrypt";
import { createSession } from "@/app/_lib/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Call your session creation logic here
    await createSession(user.id);

    user.password = ""; // Remove password from the response

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
