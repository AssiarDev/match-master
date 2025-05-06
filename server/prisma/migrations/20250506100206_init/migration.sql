/*
  Warnings:

  - You are about to drop the column `contractEnd` on the `Trainer` table. All the data in the column will be lost.
  - You are about to drop the column `contractStart` on the `Trainer` table. All the data in the column will be lost.
  - Added the required column `contract_end` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contract_start` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trainer" DROP COLUMN "contractEnd",
DROP COLUMN "contractStart",
ADD COLUMN     "contract_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "contract_start" TIMESTAMP(3) NOT NULL;
