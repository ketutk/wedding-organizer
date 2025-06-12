import { verifySession } from "@/app/_lib/session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Optional: Validate UUID format
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Fetch the package by ID
    const packageData = (await prisma.package.findUnique({
      where: { id },
    })) as any;

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    packageData.price = packageData.price.toString(); // Ensure price is a string

    return NextResponse.json({ success: true, data: packageData });
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 });
  }
}
