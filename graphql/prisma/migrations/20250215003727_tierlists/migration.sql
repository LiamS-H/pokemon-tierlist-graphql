-- CreateTable
CREATE TABLE "Tierlist" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Tierlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tiers" TEXT[],

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "tierlistId" TEXT,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PokemonToTierlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PokemonToTierlist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PokemonToTier" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonToTier_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PokemonToTemplate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PokemonToTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PokemonToTierlist_B_index" ON "_PokemonToTierlist"("B");

-- CreateIndex
CREATE INDEX "_PokemonToTier_B_index" ON "_PokemonToTier"("B");

-- CreateIndex
CREATE INDEX "_PokemonToTemplate_B_index" ON "_PokemonToTemplate"("B");

-- AddForeignKey
ALTER TABLE "Tier" ADD CONSTRAINT "Tier_tierlistId_fkey" FOREIGN KEY ("tierlistId") REFERENCES "Tierlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToTierlist" ADD CONSTRAINT "_PokemonToTierlist_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToTierlist" ADD CONSTRAINT "_PokemonToTierlist_B_fkey" FOREIGN KEY ("B") REFERENCES "Tierlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToTier" ADD CONSTRAINT "_PokemonToTier_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToTier" ADD CONSTRAINT "_PokemonToTier_B_fkey" FOREIGN KEY ("B") REFERENCES "Tier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToTemplate" ADD CONSTRAINT "_PokemonToTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToTemplate" ADD CONSTRAINT "_PokemonToTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
