/*
  Warnings:

  - You are about to drop the column `idCompetition` on the `Club` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_competition]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_competition` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_idCompetition_fkey";

-- DropIndex
DROP INDEX "Club_idCompetition_key";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "idCompetition",
ADD COLUMN     "id_competition" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Club_id_competition_key" ON "Club"("id_competition");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_id_competition_fkey" FOREIGN KEY ("id_competition") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
