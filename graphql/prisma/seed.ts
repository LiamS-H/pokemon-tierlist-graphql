import { PrismaClient } from '@prisma/client'
import pokemons from './pokemon.json'
const prisma = new PrismaClient()

async function main() {
  for (const pokemon of pokemons) {
    const createdPokemon = await prisma.pokemon.create({
      data: {
        id: pokemon.id,
        number: pokemon.id,
        name: pokemon.name,
        weightMin: pokemon.weight.minimum,
        weightMax: pokemon.weight.maximum,
        heightMin: pokemon.height.minimum,
        heightMax: pokemon.height.maximum,
        classification: pokemon.classification,
        types: JSON.stringify(pokemon.types),
        resistant: JSON.stringify(pokemon.resistant),
        weaknesses: JSON.stringify(pokemon.weaknesses),
        fleeRate: pokemon.fleeRate,
        maxCP: pokemon.maxCP,
        maxHP: pokemon.maxHP,
        evolutionAmount: pokemon.evolutionRequirements?.amount,
        evolutionName: pokemon.evolutionRequirements?.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Number(
          pokemon.id,
        ).toString()}.png`,
      },
    })

    if (pokemon.attacks) {
      const pokemonAttack = await prisma.pokemonAttack.create({
        data: {
          pokemon: {
            connect: {
              id: createdPokemon.id,
            },
          },
          fast: {
            create: pokemon.attacks.fast.map((attack: any) => ({
              name: attack.name,
              type: attack.type,
              damage: attack.damage,
            })),
          },
          special: {
            create: pokemon.attacks.special.map((attack: any) => ({
              name: attack.name,
              type: attack.type,
              damage: attack.damage,
            })),
          },
        },
      })
    }
  }

  for (const pokemon of pokemons) {
    if (pokemon.evolutions?.length > 0) {
      await prisma.pokemon.update({
        where: { id: pokemon.id },
        data: {
          evolutions: {
            connect: pokemon.evolutions.map((evolution: any) => ({
              number: evolution.id.toString().padStart(3, '0'),
            })),
          },
        },
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
