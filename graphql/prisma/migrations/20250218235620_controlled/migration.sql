/*
  Warnings:

  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PokemonToTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PokemonToTier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PokemonToTierlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PokemonToTemplate" DROP CONSTRAINT "_PokemonToTemplate_A_fkey";

-- DropForeignKey
ALTER TABLE "_PokemonToTemplate" DROP CONSTRAINT "_PokemonToTemplate_B_fkey";

-- DropForeignKey
ALTER TABLE "_PokemonToTier" DROP CONSTRAINT "_PokemonToTier_A_fkey";

-- DropForeignKey
ALTER TABLE "_PokemonToTier" DROP CONSTRAINT "_PokemonToTier_B_fkey";

-- DropForeignKey
ALTER TABLE "_PokemonToTierlist" DROP CONSTRAINT "_PokemonToTierlist_A_fkey";

-- DropForeignKey
ALTER TABLE "_PokemonToTierlist" DROP CONSTRAINT "_PokemonToTierlist_B_fkey";

-- DropTable
DROP TABLE "Template";

-- DropTable
DROP TABLE "_PokemonToTemplate";

-- DropTable
DROP TABLE "_PokemonToTier";

-- DropTable
DROP TABLE "_PokemonToTierlist";

-- CreateTable
CREATE TABLE "TierlistPokemon" (
    "id" TEXT NOT NULL,
    "tierlistId" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "TierlistPokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TierPokemon" (
    "id" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "TierPokemon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TierlistPokemon_tierlistId_index_idx" ON "TierlistPokemon"("tierlistId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "TierlistPokemon_tierlistId_pokemonId_key" ON "TierlistPokemon"("tierlistId", "pokemonId");

-- CreateIndex
CREATE INDEX "TierPokemon_tierId_index_idx" ON "TierPokemon"("tierId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "TierPokemon_tierId_pokemonId_key" ON "TierPokemon"("tierId", "pokemonId");

-- AddForeignKey
ALTER TABLE "TierlistPokemon" ADD CONSTRAINT "TierlistPokemon_tierlistId_fkey" FOREIGN KEY ("tierlistId") REFERENCES "Tierlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierlistPokemon" ADD CONSTRAINT "TierlistPokemon_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierPokemon" ADD CONSTRAINT "TierPokemon_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierPokemon" ADD CONSTRAINT "TierPokemon_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
