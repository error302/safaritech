import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from './trpc'

export const cartRouter = router({
  getCart: publicProcedure.query(async ({ ctx }) => {
    let items: any[] = []
    
    if (ctx.session?.user) {
      items = await ctx.prisma.cartItem.findMany({
        where: { userId: ctx.session.user.id },
        include: { product: true },
      })
    }
    
    return {
      items: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          images: item.product.images,
          slug: item.product.slug,
          stock: item.product.stock,
        }
      }))
    }
  }),

  addItem: publicProcedure
    .input(z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        return { success: false, message: 'Please login to add to cart' }
      }

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
        return { success: true, item }
      }

      const item = await ctx.prisma.cartItem.create({
        data: {
          userId: ctx.session.user.id,
          productId: input.productId,
          quantity: input.quantity,
        },
      })
      return { success: true, item }
    }),

  updateQuantity: protectedProcedure
    .input(z.object({
      itemId: z.string(),
      quantity: z.number().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const cartItem = await ctx.prisma.cartItem.findUnique({ where: { id: input.itemId } });
      if (!cartItem || cartItem.userId !== ctx.session.user.id) {
        throw new Error('Unauthorized');
      }
      const item = await ctx.prisma.cartItem.update({
        where: { id: input.itemId },
        data: { quantity: input.quantity },
      })
      return { success: true, item }
    }),

  removeItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const cartItem = await ctx.prisma.cartItem.findUnique({ where: { id: input.itemId } });
      if (!cartItem || cartItem.userId !== ctx.session.user.id) {
        throw new Error('Unauthorized');
      }
      await ctx.prisma.cartItem.delete({
        where: { id: input.itemId },
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