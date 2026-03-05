/*
  Warnings:

  - Added the required column `category` to the `Competitions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competitions" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "category" INTEGER NOT NULL,
ADD COLUMN     "has_jerseys" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_played_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL,
    "country_id" INTEGER,
    "venue_id" INTEGER,
    "gender" TEXT,
    "name" TEXT NOT NULL,
    "short_code" TEXT,
    "image_path" TEXT,
    "founded" INTEGER,
    "type" TEXT,
    "placeholder" BOOLEAN NOT NULL DEFAULT false,
    "last_played_at" TIMESTAMP(3),

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamCompetition" (
    "team_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,

    CONSTRAINT "TeamCompetition_pkey" PRIMARY KEY ("team_id","competition_id")
);

-- AddForeignKey
ALTER TABLE "TeamCompetition" ADD CONSTRAINT "TeamCompetition_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamCompetition" ADD CONSTRAINT "TeamCompetition_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
