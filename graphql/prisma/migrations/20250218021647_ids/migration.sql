/*
  Warnings:

  - The primary key for the `Tier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_PokemonToTier` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_PokemonToTier" DROP CONSTRAINT "_PokemonToTier_B_fkey";

-- AlterTable
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tier_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tier_id_seq";

-- AlterTable
ALTER TABLE "_PokemonToTier" DROP CONSTRAINT "_PokemonToTier_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_PokemonToTier_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "_PokemonToTier" ADD CONSTRAINT "_PokemonToTier_B_fkey" FOREIGN KEY ("B") REFERENCES "Tier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
