import prisma from "@/lib/prisma"; // Adjust if your Prisma client is elsewhere
import { verifySession } from "@/app/_lib/session";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// Enable edge function's request body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req: Request) {
  try {
    const packages = (await prisma.package.findMany({
      where: {},
      orderBy: {
        createdAt: "desc",
      },
    })) as any[];

    packages.forEach((pkg) => {
      pkg.price = pkg.price.toString(); // Ensure price is a string
    });

    return NextResponse.json({
      success: true,
      data: {
        packages,
      },
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
