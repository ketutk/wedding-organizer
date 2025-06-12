import { PrismaClient } from "@/generated/prisma";
import UserSeeder from "./user.seed";

const prisma = new PrismaClient();

// Hapus dan Buat ulang seeder
async function main() {
  await prisma.admin.deleteMany();

  await UserSeeder();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
