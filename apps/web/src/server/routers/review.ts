import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from './trpc'

export const reviewRouter = router({
  getByProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.review.findMany({
        where: { productId: input.productId },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      })
      return reviews
    }),

  create: protectedProcedure
    .input(z.object({
      productId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.create({
        data: {
          userId: ctx.session.user.id,
          productId: input.productId,
          rating: input.rating,
          comment: input.comment,
        },
      })
      return review
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      rating: z.number().min(1).max(5).optional(),
      comment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const review = await ctx.prisma.review.update({
        where: { id },
        data,
      })
      return review
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.review.delete({
        where: { id: input.id },
      })
      return { success: true }
    }),
})
