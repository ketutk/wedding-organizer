/*
  Warnings:

  - Added the required column `customerPhone` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'Rejected';

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "customerPhone" TEXT NOT NULL;
