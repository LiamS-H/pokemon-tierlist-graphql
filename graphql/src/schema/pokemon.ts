// TEMP FIX: for some reason pothos types aren't being inferred correctly
// @ts-nocheck
import { ObjectFieldBuilder } from '@pothos/core'
import { builder } from '../builder'
import { prisma } from '../db'
import { Pokemon } from '@prisma/client'

builder.prismaObject('Pokemon', {
  fields: (t) => ({
    id: t.exposeID('id'),
    number: t.exposeString('number', { nullable: true }),
    name: t.exposeString('name', { nullable: true }),
    weightMin: t.exposeString('weightMin', { nullable: true }),
    weightMax: t.exposeString('weightMax', { nullable: true }),
    heightMin: t.exposeString('heightMin', { nullable: true }),
    heightMax: t.exposeString('heightMax', { nullable: true }),
    classification: t.exposeString('classification', { nullable: true }),
    types: t.field({
      type: ['String'],
      resolve: (pokemon) => JSON.parse(pokemon.types),
    }),
    resistant: t.field({
      type: ['String'],
      resolve: (pokemon) => JSON.parse(pokemon.resistant),
    }),
    weaknesses: t.field({
      type: ['String'],
      resolve: (pokemon) => JSON.parse(pokemon.weaknesses),
    }),
    fleeRate: t.exposeFloat('fleeRate', { nullable: true }),
    maxCP: t.exposeInt('maxCP', { nullable: true }),
    maxHP: t.exposeInt('maxHP', { nullable: true }),
    evolutionAmount: t.exposeInt('evolutionAmount', { nullable: true }),
    evolutionName: t.exposeString('evolutionName', { nullable: true }),
    image: t.exposeString('image', { nullable: true }),
    attacks: t.relation('attacks'),
    evolutions: t.relation('evolutions'),
    evolvedFrom: t.relation('evolvedFrom', { nullable: true }),
  }),
})
builder.prismaObject('Attack', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: true }),
    type: t.exposeString('type', { nullable: true }),
    damage: t.exposeInt('damage', { nullable: true }),
  }),
})

builder.prismaObject('PokemonAttack', {
  fields: (t) => ({
    id: t.exposeID('id'),
    pokemon: t.relation('pokemon'),
    fast: t.relation('fast'),
    special: t.relation('special'),
  }),
})

export const PokemonUniqueInput = builder.inputType('PokemonUniqueInput', {
  fields: (t) => ({
    id: t.string(),
    number: t.string(),
  }),
})

const AttackCreateInput = builder.inputType('AttackCreateInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    type: t.string(),
    damage: t.int(),
  }),
})

const PokemonAttackCreateInput = builder.inputType('PokemonAttackCreateInput', {
  fields: (t) => ({
    fast: t.field({ type: [AttackCreateInput] }),
    special: t.field({ type: [AttackCreateInput] }),
  }),
})

const PokemonCreateInput = builder.inputType('PokemonCreateInput', {
  fields: (t) => ({
    number: t.string(),
    name: t.string({ required: true }),
    weightMin: t.string(),
    weightMax: t.string(),
    heightMin: t.string(),
    heightMax: t.string(),
    classification: t.string(),
    types: t.stringList(),
    resistant: t.stringList(),
    weaknesses: t.stringList(),
    fleeRate: t.float(),
    maxCP: t.int(),
    maxHP: t.int(),
    evolutionAmount: t.int(),
    evolutionName: t.string(),
    attacks: t.field({ type: PokemonAttackCreateInput }),
  }),
})

builder.queryFields((t) => ({
  allPokemons: t.prismaField({
    type: ['Pokemon'],
    resolve: (query) => prisma.pokemon.findMany({ ...query }),
  }),
  pokemon: t.prismaField({
    type: 'Pokemon',
    nullable: true,
    args: {
      where: t.arg({ type: PokemonUniqueInput, required: true }),
    },
    resolve: (query, parent, args) =>
      prisma.pokemon.findUnique({
        ...query,
        where: {
          id: args.where.id ?? undefined,
          number: args.where.number ?? undefined,
        },
      }),
  }),
}))

builder.mutationFields((t) => ({
  createPokemon: t.prismaField({
    type: 'Pokemon',
    args: {
      data: t.arg({
        type: PokemonCreateInput,
        required: true,
      }),
    },
    resolve: async (query, parent, args) => {
      return prisma.pokemon.create({
        ...query,
        data: {
          name: args.data.name,
          number: args.data.number,
          weightMin: args.data.weightMin,
          weightMax: args.data.weightMax,
          heightMin: args.data.heightMin,
          heightMax: args.data.heightMax,
          classification: args.data.classification,
          types: JSON.stringify(args.data.types ?? []),
          resistant: JSON.stringify(args.data.resistant ?? []),
          weaknesses: JSON.stringify(args.data.weaknesses ?? []),
          fleeRate: args.data.fleeRate,
          maxCP: args.data.maxCP,
          maxHP: args.data.maxHP,
          evolutionAmount: args.data.evolutionAmount,
          evolutionName: args.data.evolutionName,
          attacks: args.data.attacks
            ? {
                create: {
                  fast: {
                    create: args.data.attacks.fast?.map((attack) => ({
                      name: attack.name,
                      type: attack.type,
                      damage: attack.damage,
                    })),
                  },
                  special: {
                    create: args.data.attacks.special?.map((attack) => ({
                      name: attack.name,
                      type: attack.type,
                      damage: attack.damage,
                    })),
                  },
                },
              }
            : undefined,
        },
      })
    },
  }),
}))
