/*
  Warnings:

  - Added the required column `type` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "type" TEXT NOT NULL;
