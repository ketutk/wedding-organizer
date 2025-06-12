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
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    const search = searchParams.get("search") || "";
    const limit = 10; // Number of items per page
    const offset = (page - 1) * limit;

    const totalBookings = await prisma.booking.count({
      where: {
        customerName: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    const bookings = (await prisma.booking.findMany({
      where: {
        customerName: {
          contains: search,
          mode: "insensitive",
        },
      },
      include: {
        package: true, // Include package details
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })) as any[];

    const totalPages = Math.ceil(totalBookings / limit);
    bookings.forEach((booking) => {
      booking.totalPayment = booking.totalPayment.toString(); // Ensure price is a string
      if (booking.package) {
        booking.package.price = booking.package?.price.toString(); // Ensure package price is a string
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        page,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
