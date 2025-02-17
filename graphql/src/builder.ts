import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { DateTimeResolver } from 'graphql-scalars'
import { prisma } from './db'

export interface IContext {
  prisma: typeof prisma
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: IContext
  Scalars: {
    DateTime: {
      Input: Date
      Output: Date
    }
  }
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
})

builder.queryType({})
builder.mutationType({})

builder.addScalarType('DateTime', DateTimeResolver, {})
