import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from './trpc'

export const categoryRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
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
      description: z.string().optional(),
      image: z.string().optional(),
      iconName: z.string().default('Smartphone'),
      gradient: z.string().default('from-blue-500/20 to-cyan-500/20'),
      sortOrder: z.number().default(0),
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
      description: z.string().nullable().optional(),
      image: z.string().nullable().optional(),
      iconName: z.string().optional(),
      gradient: z.string().optional(),
      sortOrder: z.number().optional(),
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
