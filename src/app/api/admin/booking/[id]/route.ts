import { Booking } from "@/generated/prisma";
import { sendBookingsStatusEmail } from "@/lib/nodemailer";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const body = (await request.json()) as { status: Booking["status"] };

  try {
    // Fetch the booking details from the database
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    // Optionally, you can send an email notification here
    await sendBookingsStatusEmail(updatedBooking.customerEmail, "Booking Status Updated", updatedBooking.customerName, updatedBooking.id, updatedBooking.status);

    return NextResponse.json({
      success: true,
      message: "Booking status updated successfully",
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}
