import { Booking } from "@/generated/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendBookingsStatusEmail = async (to: string, subject: string, customerName: string, bookingId: string, status: Booking["status"]) => {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"; // customize this
    const bookingUrl = `${siteUrl}/booking/check/${bookingId}`;

    const statusText =
      status === "Approved" ? "has been <strong style='color:green;'>ACCEPTED</strong> 🎉" : status === "Requested" ? "is currently <strong style='color:orange;'>PENDING</strong>" : "has been <strong style='color:red;'>REJECTED</strong>";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Hello, ${customerName} 👋</h2>
        <p>Your booking with ID <strong>${bookingId}</strong> ${statusText}.</p>

        <p>You can check the full details and status of your booking by clicking the button below:</p>

        <a href="${bookingUrl}" style="display: inline-block; padding: 10px 20px; background-color: #ec4899; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          View Booking Status
        </a>

        <p style="margin-top: 40px;">Thank you for choosing us!<br/>— Your Wedding Service Team</p>
        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #777;">If you didn’t make this booking, you can ignore this email.</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
