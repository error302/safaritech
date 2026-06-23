import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from './trpc'

// Delivery zones router — admin CRUD + public read for checkout.
// Ponytail: one table holds both delivery-fee destinations and pickup points.
export const deliveryRouter = router({
  // Public: returns active zones for checkout page
  getActive: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  }),

  // Admin: returns all zones (including inactive)
  adminGetAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.deliveryZone.findMany({
      orderBy: { sortOrder: 'asc' },
    })
  }),

  // Admin: create a new zone
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      type: z.enum(['DELIVERY', 'PICKUP']),
      fee: z.number().int().min(0).max(1_000_000),
      pickupPoint: z.string().max(500).optional().nullable(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().int().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.deliveryZone.create({ data: input })
    }),

  // Admin: update a zone
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(100),
      type: z.enum(['DELIVERY', 'PICKUP']),
      fee: z.number().int().min(0).max(1_000_000),
      pickupPoint: z.string().max(500).optional().nullable(),
      isActive: z.boolean().default(true),
      sortOrder: z.number().int().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.deliveryZone.update({ where: { id }, data })
    }),

  // Admin: delete a zone
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.deliveryZone.delete({ where: { id: input.id } })
    }),
})
