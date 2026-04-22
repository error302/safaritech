import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from './trpc'

export const productRouter = router({
  getAll: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      cursor: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const { category, search, limit = 20, cursor } = input || {}
      const where: Record<string, unknown> = {}

      if (category) where.category = { slug: category }
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
        ]
      }

      const products = await ctx.prisma.product.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      })

      let nextCursor: string | undefined
      if (products.length > limit) {
        const nextItem = products.pop()
        nextCursor = nextItem?.id
      }

      return { products, nextCursor }
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { slug: input.slug },
        include: {
          category: true,
          reviews: { include: { user: true }, orderBy: { createdAt: 'desc' } },
        },
      })
      return product
    }),

  getFeatured: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      where: { stock: { gt: 0 } },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    })
    return products
  }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().min(1),
      price: z.number().min(0),
      salePrice: z.number().optional(),
      stock: z.number().min(0).default(0),
      categoryId: z.string().optional(),
      images: z.string().optional(),
      specs: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.create({ data: input })
      return product
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      salePrice: z.number().optional(),
      stock: z.number().optional(),
      categoryId: z.string().optional(),
      images: z.string().optional(),
      specs: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const product = await ctx.prisma.product.update({ where: { id }, data })
      return product
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.product.delete({ where: { id: input.id } })
      return { success: true }
    }),

  // ===== ADMIN ONLY =====
  adminGetAll: adminProcedure
    .input(z.object({
      search: z.string().optional(),
      categoryId: z.string().optional(),
      limit: z.number().default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {}

      if (input?.search) {
        where.OR = [
          { name: { contains: input.search } },
          { description: { contains: input.search } },
        ]
      }
      if (input?.categoryId) where.categoryId = input.categoryId

      const products = await ctx.prisma.product.findMany({
        where,
        take: input?.limit ?? 50,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      })

      return products
    }),

  adminGetCategories: adminProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
    return categories
  }),
})