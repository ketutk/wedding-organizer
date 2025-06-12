/*
  Warnings:

  - Added the required column `paymentImage` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPayment` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_packageId_fkey";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "paymentImage" TEXT NOT NULL,
ADD COLUMN     "totalPayment" BIGINT NOT NULL,
ALTER COLUMN "packageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
