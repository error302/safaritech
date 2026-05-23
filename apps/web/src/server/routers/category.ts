import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from './trpc'

export const categoryRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    })
    return categories
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUnique({
        where: { slug: input.slug },
        include: { products: true },
      })
      return category
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string(),
      slug: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.create({ data: input })
      return category
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      slug: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const category = await ctx.prisma.category.update({
        where: { id },
        data,
      })
      return category
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.category.delete({ where: { id: input.id } })
      return { success: true }
    }),
})
