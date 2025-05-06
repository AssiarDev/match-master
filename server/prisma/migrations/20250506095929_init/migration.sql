/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `Trainer` table. All the data in the column will be lost.
  - You are about to drop the column `idClub` on the `Trainer` table. All the data in the column will be lost.
  - Added the required column `date_of_birth` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_club` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trainer" DROP CONSTRAINT "Trainer_idClub_fkey";

-- AlterTable
ALTER TABLE "Trainer" DROP COLUMN "dateOfBirth",
DROP COLUMN "idClub",
ADD COLUMN     "date_of_birth" TEXT NOT NULL,
ADD COLUMN     "id_club" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_id_club_fkey" FOREIGN KEY ("id_club") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
