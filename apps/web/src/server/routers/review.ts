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
const review = await ctx.prisma.review.findUnique({ where: { id: input.id } });
if (!review || review.userId !== ctx.session.user.id) {
throw new Error('Unauthorized');
}
const { id, ...data } = input;
const updatedReview = await ctx.prisma.review.update({ where: { id }, data });
return updatedReview;
    }),

delete: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const review = await ctx.prisma.review.findUnique({ where: { id: input.id } })
    if (!review || review.userId !== ctx.session.user.id) {
      throw new Error('Unauthorized')
    }
    await ctx.prisma.review.delete({
      where: { id: input.id },
    })
    return { success: true }
  }),
})
