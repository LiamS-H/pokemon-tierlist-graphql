/*
  Warnings:

  - Added the required column `index` to the `Tier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "index" INTEGER NOT NULL;
