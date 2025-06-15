/*
  Warnings:

  - The primary key for the `admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `admins` table. All the data in the column will be lost.
  - You are about to alter the column `admin_id` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `booking_id` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `package_id` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - The primary key for the `packages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `package_id` on the `packages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_package_id_fkey";

-- AlterTable
ALTER TABLE "admins" DROP CONSTRAINT "admins_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "admin_id" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "admins_pkey" PRIMARY KEY ("admin_id");

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_pkey",
ALTER COLUMN "booking_id" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "package_id" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id");

-- AlterTable
ALTER TABLE "packages" DROP CONSTRAINT "packages_pkey",
ALTER COLUMN "package_id" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "packages_pkey" PRIMARY KEY ("package_id");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("package_id") ON DELETE SET NULL ON UPDATE CASCADE;
