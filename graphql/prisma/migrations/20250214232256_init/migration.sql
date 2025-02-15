-- CreateTable
CREATE TABLE "Pokemon" (
    "id" TEXT NOT NULL,
    "number" TEXT,
    "name" TEXT,
    "weightMin" TEXT,
    "weightMax" TEXT,
    "heightMin" TEXT,
    "heightMax" TEXT,
    "classification" TEXT,
    "types" TEXT NOT NULL,
    "resistant" TEXT NOT NULL,
    "weaknesses" TEXT NOT NULL,
    "fleeRate" DOUBLE PRECISION,
    "maxCP" INTEGER,
    "evolvedFromId" TEXT,
    "evolutionAmount" INTEGER,
    "evolutionName" TEXT,
    "maxHP" INTEGER,
    "image" TEXT,
    "pokemonId" TEXT NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonAttack" (
    "id" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,

    CONSTRAINT "PokemonAttack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attack" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "damage" INTEGER,

    CONSTRAINT "Attack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FastAttacks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FastAttacks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SpecialAttacks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SpecialAttacks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_number_key" ON "Pokemon"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokemonId_key" ON "Pokemon"("pokemonId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonAttack_pokemonId_key" ON "PokemonAttack"("pokemonId");

-- CreateIndex
CREATE INDEX "_FastAttacks_B_index" ON "_FastAttacks"("B");

-- CreateIndex
CREATE INDEX "_SpecialAttacks_B_index" ON "_SpecialAttacks"("B");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_evolvedFromId_fkey" FOREIGN KEY ("evolvedFromId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonAttack" ADD CONSTRAINT "PokemonAttack_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FastAttacks" ADD CONSTRAINT "_FastAttacks_A_fkey" FOREIGN KEY ("A") REFERENCES "Attack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FastAttacks" ADD CONSTRAINT "_FastAttacks_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonAttack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecialAttacks" ADD CONSTRAINT "_SpecialAttacks_A_fkey" FOREIGN KEY ("A") REFERENCES "Attack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecialAttacks" ADD CONSTRAINT "_SpecialAttacks_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonAttack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
