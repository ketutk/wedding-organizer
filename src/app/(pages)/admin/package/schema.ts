import { z } from "zod";

export const PackageSchema = z.object({
  name: z.string().min(1, "Nama paket tidak boleh kosong"),
  description: z.string().min(1, "Deskripsi tidak boleh kosong"),
  price: z.string().refine(
    (val) => {
      const price = parseInt(val);
      return !isNaN(price) && price >= 0;
    },
    {
      message: "Harga harus berupa angka positif",
    }
  ),
});
