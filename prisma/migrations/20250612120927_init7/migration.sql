/*
  Warnings:

  - You are about to drop the column `createdAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `customerEmail` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `paymentImage` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `totalPayment` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `customer_email` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_name` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_phone` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_image` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_payment` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "createdAt",
DROP COLUMN "customerEmail",
DROP COLUMN "customerName",
DROP COLUMN "customerPhone",
DROP COLUMN "paymentImage",
DROP COLUMN "totalPayment",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_email" VARCHAR(30) NOT NULL,
ADD COLUMN     "customer_name" VARCHAR(30) NOT NULL,
ADD COLUMN     "customer_phone" VARCHAR(15) NOT NULL,
ADD COLUMN     "payment_image" VARCHAR(255) NOT NULL,
ADD COLUMN     "total_payment" BIGINT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
