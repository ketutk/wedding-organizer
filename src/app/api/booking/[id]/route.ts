import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendBookingsStatusEmail } from "@/lib/nodemailer";
import { error } from "console";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Optional: Validate UUID format
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const bookingData = (await prisma.booking.findUnique({
      where: { id },
      include: {
        package: true,
      },
    })) as any;

    if (!bookingData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    bookingData.totalPayment = bookingData.totalPayment.toString(); // Ensure price is a string
    if (bookingData.package) bookingData.package.price = bookingData.package?.price.toString(); // Ensure price is a string

    return NextResponse.json({ success: true, data: bookingData });
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const formData = await req.formData();

    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const date = formData.get("date") as string;
    const imageFile = formData.get("image") as File;

    if (!customerName || !customerPhone || !customerEmail || !date || !imageFile || typeof imageFile === "string") {
      return NextResponse.json({ error: "All fields including image are required" }, { status: 400 });
    }

    const { id } = await params;

    const packageData = await prisma.package.findUnique({ where: { id } });

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    //Check if the booking date is available
    const startDate = new Date(date); // Create a new Date object with the current date and time
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Set the end of the day

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

    if (existingBooking) {
      return NextResponse.json({ error: "This date is already booked. Please chat our admin to do the refung if youre already paid" }, { status: 400 });
    }

    // Save image
    const fileExt = imageFile.name.split(".").pop();
    const filename = `${randomUUID()}.${fileExt}`;
    const uploadDir = path.join(process.cwd(), "public", "images", "bookings");
    const filePath = path.join(uploadDir, filename);

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);
    const imageUrl = `/images/bookings/${filename}`;

    // Save to DB (customize model accordingly)
    const response = await prisma.booking.create({
      data: {
        packageId: id,
        customerName,
        customerPhone,
        customerEmail,
        date: new Date(date),
        totalPayment: packageData.price,
        paymentImage: imageUrl,
      },
    });

    await sendBookingsStatusEmail(customerEmail, "Booking Confirmation", customerName, response.id, response.status).catch((error) => {
      console.error("Error sending booking confirmation email:", error);
    });

    return NextResponse.json({ success: true, message: "Booking confirmed successfully" }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
