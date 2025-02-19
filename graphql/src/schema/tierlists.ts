import { builder } from '../builder'
import { prisma } from '../db'

builder.prismaObject('TierPokemon', {
  fields: (t) => ({
    id: t.exposeString('id', { nullable: false }),
    index: t.exposeInt('index', { nullable: false }),
    pokemon: t.relation('pokemon', { nullable: false }),
    tier: t.relation('tier', { nullable: false }),
  }),
})

builder.prismaObject('TierlistPokemon', {
  fields: (t) => ({
    id: t.exposeString('id', { nullable: false }),
    index: t.exposeInt('index', { nullable: false }),
    pokemon: t.relation('pokemon', { nullable: false }),
    tier: t.relation('tierlist', { nullable: false }),
  }),
})

builder.prismaObject('Tierlist', {
  fields: (t) => ({
    id: t.exposeID('id', { nullable: false }),
    title: t.exposeString('title', { nullable: false }),
    pokemons: t.relation('pokemons', { query: { orderBy: { index: 'asc' } } }),
    published: t.exposeBoolean('published', { nullable: false }),
    tiers: t.relation('tiers'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
})

builder.prismaObject('Tier', {
  fields: (t) => ({
    id: t.exposeString('id', { nullable: false }),
    title: t.exposeString('title', { nullable: false }),
    tierlist: t.relation('tierlist', { nullable: true }),
    pokemons: t.relation('pokemons', { query: { orderBy: { index: 'asc' } } }),
  }),
})

const TierlistUniqueInput = builder.inputType('TierlistUniqueInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
})

const TierlistListInput = builder.inputType('TierlistListInput', {
  fields: (t) => ({
    ids: t.stringList({ required: true }),
  }),
})

const TierCreateInput = builder.inputType('TierCreateInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    pokemonIds: t.stringList(),
  }),
})

const TierUpdateInput = builder.inputType('TierUpdateInput', {
  fields: (t) => ({
    id: t.string(),
    title: t.string(),
    pokemonIds: t.stringList(),
  }),
})

const TierlistCreateInput = builder.inputType('TierlistCreateInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    pokemonIds: t.stringList(),
    tiers: t.field({ type: [TierCreateInput] }),
  }),
})

const TierlistUpdateInput = builder.inputType('TierlistUpdateInput', {
  fields: (t) => ({
    title: t.string(),
    pokemonIds: t.stringList(),
    tiers: t.field({ type: [TierUpdateInput] }),
    published: t.boolean(),
  }),
})

builder.queryFields((t) => ({
  tierlists: t.prismaField({
    type: ['Tierlist'],
    resolve: (query) =>
      prisma.tierlist.findMany({
        ...query,
        where: {
          published: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
  }),
  tierlist: t.prismaField({
    type: 'Tierlist',
    nullable: true,
    args: {
      where: t.arg({ type: TierlistUniqueInput, required: true }),
    },
    resolve: (query, parent, args) =>
      prisma.tierlist.findUnique({
        ...query,
        where: { id: args.where.id ?? undefined },
      }),
  }),
  tierlistList: t.prismaField({
    type: ['Tierlist'],
    nullable: true,
    args: {
      where: t.arg({ type: TierlistListInput, required: true }),
    },
    resolve: (query, parent, args) =>
      prisma.tierlist.findMany({
        ...query,
        where: {
          id: {
            in: args.where.ids,
          },
        },
      }),
  }),
}))

builder.mutationFields((t) => ({
  createTierlist: t.prismaField({
    type: 'Tierlist',
    args: {
      data: t.arg({ type: TierlistCreateInput, required: true }),
    },
    resolve: async (query, parent, args) => {
      return prisma.tierlist.create({
        ...query,
        data: {
          updatedAt: new Date().toISOString(),
          title: args.data.title,
          pokemons: args.data.pokemonIds
            ? {
                create: args.data.pokemonIds.map((pokemonId, index) => ({
                  pokemonId,
                  index,
                })),
              }
            : undefined,
          tiers: {
            create:
              args.data.tiers?.map((tier, index) => ({
                title: tier.title,
                index,
                pokemons: {
                  connect: tier.pokemonIds?.map((id) => ({ id })) ?? [],
                },
              })) ?? [],
          },
        },
      })
    },
  }),
  updateTierlist: t.prismaField({
    type: 'Tierlist',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: TierlistUpdateInput, required: true }),
    },
    resolve: async (query, parent, args) => {
      const old = await prisma.tierlist.findUnique({
        where: { id: args.id },
        include: { tiers: { include: { pokemons: true } } },
      })

      if (old?.published) {
        return old
      }
      if (!old) return

      const updatedTierIds = args.data.tiers?.map((t) => t.id)
      const deletedTierIds =
        old.tiers
          ?.map((tier) => tier.id)
          .filter((id) => !updatedTierIds?.includes(id)) ?? []

      return prisma.tierlist.update({
        ...query,
        where: { id: args.id },
        data: {
          updatedAt: new Date().toISOString(),
          published: args.data.published ?? undefined,
          title: args.data.title ?? undefined,
          pokemons: args.data.pokemonIds
            ? {
                deleteMany: {},
                create: args.data.pokemonIds.map((pokemonId, index) => ({
                  pokemonId,
                  index,
                })),
              }
            : undefined,

          tiers: args.data.tiers
            ? {
                update: args.data.tiers
                  .map((tier, index) => {
                    if (!tier.id) return

                    return {
                      where: { id: tier.id },
                      data: {
                        title: tier.title ?? undefined,
                        index,
                        pokemons: tier.pokemonIds
                          ? {
                              deleteMany: {},
                              create: tier.pokemonIds.map(
                                (pokemonId, index) => ({
                                  pokemonId,
                                  index,
                                }),
                              ),
                            }
                          : undefined,
                      },
                    }
                  })
                  .filter((u) => u !== undefined),

                create: args.data.tiers
                  .map((tier, index) => {
                    if (tier.id) return
                    return {
                      title: tier.title ?? 'New Tier',
                      index,
                      pokemons: {
                        create:
                          tier.pokemonIds?.map((pokemonId, index) => ({
                            pokemonId,
                            index,
                          })) ?? undefined,
                      },
                    }
                  })
                  .filter((u) => u !== undefined),

                deleteMany:
                  old?.tiers && args.data.tiers
                    ? {
                        id: {
                          in: deletedTierIds,
                        },
                      }
                    : undefined,
              }
            : undefined,
        },
      })
    },
  }),
  deleteTierlist: t.prismaField({
    type: 'Tierlist',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, parent, args) => {
      return prisma.tierlist.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
}))
