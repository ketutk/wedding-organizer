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
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    const limit = 10; // Number of items per page
    const offset = (page - 1) * limit;

    const totalPackages = await prisma.package.count({});

    const packages = await prisma.package.findMany({
      where: {
        deletedAt: {},
      },
      skip: offset,
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: "Approved",
              },
            },
          },
        },
        bookings: {
          where: {
            status: "Approved",
          },
        },
      },
    });

    const packagesWithTotalPayments = packages.map((pkg) => {
      const { bookings, _count, ...neededPackage } = pkg;
      return {
        ...neededPackage,
        count: pkg._count.bookings || 0,
        totalPayments:
          pkg.bookings.length > 0
            ? pkg.bookings
                .map((pkg) => pkg.totalPayment)
                .reduce((e, v) => e + v)
                .toString()
            : 0,
        price: pkg.price.toString(), // Ensure price is a string
      };
    });

    const totalPages = Math.ceil(totalPackages / limit);

    return NextResponse.json({
      success: true,
      data: {
        packages: packagesWithTotalPayments,
        page,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
