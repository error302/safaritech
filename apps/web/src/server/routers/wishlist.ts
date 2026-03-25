import { z } from 'zod'
import { router, protectedProcedure } from './trpc'

export const wishlistRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.wishlistItem.findMany({
      where: { userId: ctx.session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })
    return items
  }),

  add: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.wishlistItem.findFirst({
        where: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      })

      if (existing) {
        return existing
      }

      const item = await ctx.prisma.wishlistItem.create({
        data: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      })
      return item
    }),

  remove: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.wishlistItem.deleteMany({
        where: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      })
      return { success: true }
    }),

  toggle: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.wishlistItem.findFirst({
        where: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      })

      if (existing) {
        await ctx.prisma.wishlistItem.delete({ where: { id: existing.id } })
        return { inWishlist: false }
      }

      await ctx.prisma.wishlistItem.create({
        data: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      })
      return { inWishlist: true }
    }),

  isInWishlist: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.wishlistItem.findFirst({
        where: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      })
      return !!item
    }),
})
