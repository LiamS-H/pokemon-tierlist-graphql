import { builder } from '../builder'
import { prisma } from '../db'

builder.prismaObject('Tierlist', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    pokemons: t.relation('pokemons'),
    published: t.exposeBoolean('published'),
    tiers: t.relation('tiers'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
})

builder.prismaObject('Template', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    pokemons: t.relation('pokemons'),
    tiers: t.field({
      type: ['String'],
      resolve: (template) => template.tiers,
    }),
  }),
})

builder.prismaObject('Tier', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    title: t.exposeString('title'),
    tierlist: t.relation('tierlist', { nullable: true }),
    pokemons: t.relation('pokemons'),
  }),
})

const TierlistUniqueInput = builder.inputType('TierlistUniqueInput', {
  fields: (t) => ({
    id: t.string(),
  }),
})

const TierlistListInput = builder.inputType('TierlistListInput', {
  fields: (t) => ({
    ids: t.stringList({ required: true }),
  }),
})

const TemplateUniqueInput = builder.inputType('TemplateUniqueInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
})

const TierCreateInput = builder.inputType('TierCreateInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
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
    title: t.string({ required: true }),
    pokemonIds: t.stringList(),
    tiers: t.field({ type: [TierCreateInput] }),
    publised: t.boolean(),
  }),
})

const TemplateCreateInput = builder.inputType('TemplateCreateInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    pokemonIds: t.stringList(),
    tiers: t.stringList(),
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
  templates: t.prismaField({
    type: ['Template'],
    resolve: (query) =>
      prisma.template.findMany({
        ...query,
        where: {
          published: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
  }),
  template: t.prismaField({
    type: 'Template',
    nullable: true,
    args: {
      where: t.arg({ type: TemplateUniqueInput, required: true }),
    },
    resolve: (query, parent, args) =>
      prisma.template.findUnique({
        ...query,
        where: { id: args.where.id ?? undefined },
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
          pokemons: {
            connect: args.data.pokemonIds?.map((id) => ({ id })) ?? [],
          },
          tiers: {
            create:
              args.data.tiers?.map((tier) => ({
                title: tier.title,
                pokemons: {
                  connect: tier.pokemonIds?.map((id) => ({ id })) ?? [],
                },
              })) ?? [],
          },
        },
      })
    },
  }),
  createTemplate: t.prismaField({
    type: 'Template',
    args: {
      data: t.arg({ type: TemplateCreateInput, required: true }),
    },
    resolve: async (query, parent, args) => {
      return prisma.template.create({
        ...query,
        data: {
          title: args.data.title,
          pokemons: {
            connect: args.data.pokemonIds?.map((id) => ({ id })) ?? [],
          },
          tiers: args.data.tiers ?? [],
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
      const old = await prisma.tierlist.findUnique({ where: { id: args.id } })
      if (old?.published) {
        return old
      }
      return prisma.tierlist.update({
        ...query,
        where: { id: args.id },
        data: {
          published: args.data.publised ?? undefined,
          title: args.data.title,
          pokemons: {
            set: args.data.pokemonIds?.map((id) => ({ id })) ?? [],
          },
          tiers: {
            deleteMany: {},
            create:
              args.data.tiers?.map((tier) => ({
                title: tier.title,
                pokemons: {
                  connect: tier.pokemonIds?.map((id) => ({ id })) ?? [],
                },
              })) ?? [],
          },
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
