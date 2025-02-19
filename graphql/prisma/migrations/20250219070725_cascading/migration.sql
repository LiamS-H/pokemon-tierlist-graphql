-- DropForeignKey
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_tierlistId_fkey";

-- DropForeignKey
ALTER TABLE "TierPokemon" DROP CONSTRAINT "TierPokemon_tierId_fkey";

-- DropForeignKey
ALTER TABLE "TierlistPokemon" DROP CONSTRAINT "TierlistPokemon_tierlistId_fkey";

-- AddForeignKey
ALTER TABLE "TierlistPokemon" ADD CONSTRAINT "TierlistPokemon_tierlistId_fkey" FOREIGN KEY ("tierlistId") REFERENCES "Tierlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tier" ADD CONSTRAINT "Tier_tierlistId_fkey" FOREIGN KEY ("tierlistId") REFERENCES "Tierlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierPokemon" ADD CONSTRAINT "TierPokemon_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
