/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `Player` table. All the data in the column will be lost.
  - Added the required column `date_of_birth` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "dateOfBirth",
ADD COLUMN     "date_of_birth" TEXT NOT NULL;
