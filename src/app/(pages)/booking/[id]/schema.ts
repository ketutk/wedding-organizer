import { z } from "zod";

export const BookingSchema = z.object({
  customerName: z.string().min(1, "Nama pelanggan tidak boleh kosong"),
  customerEmail: z.string().email(),
  customerPhone: z
    .string()
    .min(1, "Nomor telepon tidak boleh kosong")
    .refine(
      (val) => {
        const phoneRegex = /^\d{10,15}$/; // Contoh regex untuk nomor telepon
        return phoneRegex.test(val);
      },
      { message: "Nomor telepon tidak valid" }
    ), // Validasi nomor telepon
  date: z.date(),
});
