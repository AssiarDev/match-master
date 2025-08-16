/*
  Warnings:

  - Added the required column `competitionId` to the `UsersFavorites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersFavorites" ADD COLUMN     "competitionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UsersFavorites" ADD CONSTRAINT "UsersFavorites_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
