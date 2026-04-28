import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, adminProcedure } from './trpc'

export const orderRouter = router({
  // Customer-facing procedures
  create: protectedProcedure
    .input(z.object({
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number(),
        price: z.number(),
      })),
      shippingAddress: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.string(),
        city: z.string(),
        county: z.string(),
      }),
      paymentMethod: z.enum(['mpesa', 'card']),
    }))
    .mutation(async ({ ctx, input }) => {
      const total = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      const address = await ctx.prisma.address.create({
        data: {
          userId: ctx.session.user.id,
          label: 'Shipping',
          line1: input.shippingAddress.address,
          city: input.shippingAddress.city,
          state: input.shippingAddress.county,
          postal: '00000',
          country: 'Kenya',
          phone: input.shippingAddress.phone,
        },
      })

      const order = await ctx.prisma.order.create({
        data: {
          userId: ctx.session.user.id,
          subtotal: total,
          total,
          paymentMethod: input.paymentMethod,
          paymentStatus: 'PENDING',
          status: 'PENDING',
          shippingAddressId: address.id,
        },
      })

      for (const item of input.items) {
        await ctx.prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
          },
        })
      }

      if (input.paymentMethod === 'mpesa') {
        const { initiateSTKPush } = await import('@/lib/mpesa')
        const mpesaResult = await initiateSTKPush({
          phoneNumber: input.shippingAddress.phone,
          amount: total,
          accountReference: order.id,
          transactionDesc: `Order ${order.id}`,
          callbackUrl: `${process.env.NEXTAUTH_URL}/api/webhooks/mpesa`,
        })

await ctx.prisma.order.update({
      where: { id: order.id },
      data: { mpesaRef: mpesaResult.CheckoutRequestID },
    })

        return { orderId: order.id, checkoutRequestId: mpesaResult.CheckoutRequestID }
      }

      return { orderId: order.id }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findUnique({
        where: { id: input.id },
        include: {
          items: { include: { product: true } },
          shippingAddress: true,
        },
      })

      if (!order || order.userId !== ctx.session.user.id) {
        throw new Error('Order not found')
      }

      return order
    }),

  getByUser: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return orders
  }),

  // ===== ADMIN PROCEDURES =====
  adminGetAll: adminProcedure
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().default(50),
      cursor: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {}
      if (input?.status) where.status = input.status

      const orders = await ctx.prisma.order.findMany({
        where,
        take: (input?.limit ?? 50) + 1,
        cursor: input?.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { product: true } },
          user: { select: { id: true, name: true, email: true } },
          shippingAddress: true,
        },
      })

      let nextCursor: string | undefined
      if (orders.length > (input?.limit ?? 50)) {
        const next = orders.pop()
        nextCursor = next?.id
      }

      return { orders, nextCursor }
    }),

  adminUpdateStatus: adminProcedure
    .input(z.object({
      orderId: z.string(),
      status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
      paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          status: input.status,
          ...(input.paymentStatus && { paymentStatus: input.paymentStatus }),
        },
      })
      return order
    }),

  adminGetStats: adminProcedure.query(async ({ ctx }) => {
    const [totalOrders, totalRevenue, pendingOrders, totalProducts, totalUsers] = await Promise.all([
      ctx.prisma.order.count(),
      ctx.prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'PAID' },
      }),
      ctx.prisma.order.count({ where: { status: 'PENDING' } }),
      ctx.prisma.product.count(),
      ctx.prisma.user.count(),
    ])

    const recentOrders = await ctx.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    })

    const topProducts = await ctx.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 5,
    })

    const productsMap: Record<string, number> = {}
    for (const item of topProducts) {
      productsMap[item.productId] = item._count.productId
    }
    const productIds = topProducts.map(p => p.productId)
    const products = await ctx.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    })

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total ?? 0,
      pendingOrders,
      totalProducts,
      totalUsers,
      recentOrders,
      topProducts: products.map(p => ({ ...p, orderCount: productsMap[p.id] })),
    }
  }),
})