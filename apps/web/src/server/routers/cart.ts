import { z } from 'zod'
import { router, protectedProcedure } from './trpc'

export const cartRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.cartItem.findMany({
      where: { userId: ctx.session.user.id },
      include: { product: true },
    })
    return items
  }),

  add: protectedProcedure
    .input(z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.cartItem.findFirst({
        where: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      })

      if (existing) {
        const item = await ctx.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + input.quantity },
        })
        return item
      }

      const item = await ctx.prisma.cartItem.create({
        data: {
          userId: ctx.session.user.id,
          productId: input.productId,
          quantity: input.quantity,
        },
      })
      return item
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      quantity: z.number().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.cartItem.update({
        where: { id: input.id },
        data: { quantity: input.quantity },
      })
      return item
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.cartItem.delete({
        where: { id: input.id },
      })
      return { success: true }
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.cartItem.deleteMany({
      where: { userId: ctx.session.user.id },
    })
    return { success: true }
  }),
})
