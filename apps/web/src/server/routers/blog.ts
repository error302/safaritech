import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from './trpc'

export const blogRouter = router({
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      cursor: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const { limit = 10, cursor } = input || {}

      const posts = await ctx.prisma.blogPost.findMany({
        where: { published: true },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { publishedAt: 'desc' },
        include: { author: { select: { name: true } } },
      })

      let nextCursor: string | undefined = undefined
      if (posts.length > limit) {
        const nextItem = posts.pop()
        nextCursor = nextItem?.id
      }

      return { posts, nextCursor }
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findUnique({
        where: { slug: input.slug },
        include: { author: { select: { name: true } } },
      })

      if (!post || !post.published) {
        return null
      }

      return post
    }),

  getAllForAdmin: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    })
  }),

  create: adminProcedure
    .input(z.object({
      title: z.string(),
      slug: z.string(),
      content: z.string(),
      excerpt: z.string().optional(),
      featuredImage: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDesc: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.create({
        data: {
          ...input,
          authorId: ctx.session.user.id,
        },
      })
      return post
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      featuredImage: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDesc: z.string().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const post = await ctx.prisma.blogPost.update({
        where: { id },
        data: {
          ...data,
          publishedAt: data.published ? new Date() : null,
        },
      })
      return post
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.blogPost.delete({ where: { id: input.id } })
      return { success: true }
    }),
})
