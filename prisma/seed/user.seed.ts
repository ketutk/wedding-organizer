import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export default function UserSeeder() {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.admin.create({
        data: {
          name: "admin",
          password: bcrypt.hashSync(`${process.env.ADMIN_PASS}`, 10),
          email: "admin@admin.com",
        },
      });

      console.log("Berhasil membuat seeder user");
      resolve(true);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}
