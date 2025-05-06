-- DropIndex
DROP INDEX "Club_id_competition_key";

-- AlterTable
ALTER TABLE "Club" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Club_id_seq";

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Player_id_seq";

-- AlterTable
ALTER TABLE "Trainer" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Trainer_id_seq";
