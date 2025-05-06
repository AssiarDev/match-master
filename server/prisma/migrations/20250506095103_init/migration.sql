/*
  Warnings:

  - You are about to drop the column `nationality` on the `Player` table. All the data in the column will be lost.
  - Added the required column `id_club` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "nationality",
ADD COLUMN     "id_club" TEXT NOT NULL;
