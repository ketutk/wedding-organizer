import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendBookingsStatusEmail } from "@/lib/nodemailer";
import { error } from "console";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Optional: Validate UUID format
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const { date } = (await req.json()) as { date: string };

    //Check if the booking date is available
    const startDate = new Date(date); // Create a new Date object with the current date and time
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Set the end of the day

    console.log("Checking availability for package ID:", id, "on date:", startDate, "to", endDate);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        packageId: id,
        date: {
          gte: startDate, // Greater than or equal to start of the day
          lte: endDate, // Less than or equal to end of the day
        },
        status: "Approved",
      },
    });

    console.log("Existing booking found:", existingBooking);

    return NextResponse.json({ success: true, data: { isAvailable: !existingBooking ? true : false } });
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 });
  }
}
