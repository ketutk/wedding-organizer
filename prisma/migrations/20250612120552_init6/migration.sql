/*
  Warnings:

  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `packageId` on the `bookings` table. All the data in the column will be lost.
  - You are about to alter the column `customerName` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `customerEmail` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `paymentImage` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `customerPhone` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - The primary key for the `packages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `packages` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `packages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `image` on the `packages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - The required column `booking_id` was added to the `bookings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `package_id` was added to the `packages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_packageId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_pkey",
DROP COLUMN "id",
DROP COLUMN "packageId",
ADD COLUMN     "booking_id" TEXT NOT NULL,
ADD COLUMN     "package_id" TEXT,
ALTER COLUMN "customerName" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "customerEmail" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "paymentImage" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "customerPhone" SET DATA TYPE VARCHAR(15),
ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id");

-- AlterTable
ALTER TABLE "packages" DROP CONSTRAINT "packages_pkey",
DROP COLUMN "id",
ADD COLUMN     "package_id" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "packages_pkey" PRIMARY KEY ("package_id");

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "admins" (
    "admin_id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "email" VARCHAR(30) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("admin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("package_id") ON DELETE SET NULL ON UPDATE CASCADE;
