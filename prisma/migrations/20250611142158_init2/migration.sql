/*
  Warnings:

  - Added the required column `price` to the `packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "price" BIGINT NOT NULL;
