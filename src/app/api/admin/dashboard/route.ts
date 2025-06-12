import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/app/_lib/session";
import { Status } from "@/generated/prisma";

export async function GET(req: Request) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalPackages, totalBookings, requestedBookings, approvedBookings, recentBookings] = (await Promise.all([
      prisma.package.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: Status.Requested } }),
      prisma.booking.count({ where: { status: Status.Approved } }),
      prisma.booking.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          package: true,
        },
      }),
    ])) as any;

    recentBookings.forEach((booking: any) => {
      booking.package.price = booking.package.price.toString(); // Ensure price is a string
      booking.totalPayment = booking.totalPayment.toString(); // Ensure totalPayment is a string
    });

    return NextResponse.json({
      success: true,
      data: {
        total_packages: totalPackages,
        booking_stats: {
          total: totalBookings,
          requested: requestedBookings,
          approved: approvedBookings,
        },
        recent_bookings: recentBookings,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
