/*
  Warnings:

  - You are about to drop the column `data_of_birth` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "data_of_birth",
ADD COLUMN     "date_of_birth" TIMESTAMP(3);
