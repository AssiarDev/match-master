/*
  Warnings:

  - You are about to drop the column `idClub` on the `Player` table. All the data in the column will be lost.
  - Added the required column `nationality` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id_club` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_idClub_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "idClub",
ADD COLUMN     "nationality" TEXT NOT NULL,
DROP COLUMN "id_club",
ADD COLUMN     "id_club" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_id_club_fkey" FOREIGN KEY ("id_club") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
