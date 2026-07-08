/*
  Warnings:

  - You are about to drop the column `Salary` on the `Technician` table. All the data in the column will be lost.
  - Added the required column `rate` to the `Technician` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Technician" DROP COLUMN "Salary",
ADD COLUMN     "rate" TEXT NOT NULL;
