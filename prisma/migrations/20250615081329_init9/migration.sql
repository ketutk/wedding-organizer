/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "deleted_at" TIMESTAMP(3);
