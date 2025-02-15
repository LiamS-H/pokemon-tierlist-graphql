/*
  Warnings:

  - You are about to drop the column `pokemonId` on the `Pokemon` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Pokemon_pokemonId_key";

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "pokemonId";
