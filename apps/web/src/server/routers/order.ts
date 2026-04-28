import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, adminProcedure } from './trpc'
import { sendEmail, getOrderConfirmationEmail } from '@/lib/email'

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
      couponCode: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Validate stock availability before creating order
      const productIds = input.items.map(item => item.productId)
      const products = await ctx.prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, stock: true, name: true },
      })

      const productMap = new Map(products.map(p => [p.id, p]))

      for (const item of input.items) {
        const product = productMap.get(item.productId)
        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`)
        }
      }

      // Calculate totals
      const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      let discount = 0

      // Validate and apply coupon if provided
      if (input.couponCode) {
        const coupon = await ctx.prisma.coupon.findUnique({
          where: { code: input.couponCode.toUpperCase() },
        })

        if (coupon && coupon.isActive) {
          const now = new Date()
          const isExpired = coupon.expiresAt && coupon.expiresAt < now
          const isLimitReached = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit
          const meetsMinOrder = !coupon.minOrderValue || subtotal >= coupon.minOrderValue

          if (!isExpired && !isLimitReached && meetsMinOrder) {
            if (coupon.discountType === 'PERCENTAGE') {
              discount = Math.floor(subtotal * (coupon.discountValue / 100))
              if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount
              }
            } else {
              discount = coupon.discountValue
            }

            // Increment coupon usage
            await ctx.prisma.coupon.update({
              where: { id: coupon.id },
              data: { usedCount: { increment: 1 } },
            })
          }
        }
      }

      const shipping = subtotal > 10000 ? 0 : 500
      const total = subtotal + shipping - discount

      // Create shipping address
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

      // Create order
      const order = await ctx.prisma.order.create({
        data: {
          userId: ctx.session.user.id,
          subtotal,
          total,
          discount,
          shipping,
          paymentMethod: input.paymentMethod,
          paymentStatus: 'PENDING',
          status: 'PENDING',
          shippingAddressId: address.id,
          couponCode: input.couponCode?.toUpperCase() || null,
        },
      })

      // Create order items and decrement stock
      for (const item of input.items) {
        await ctx.prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
          },
        })

        // Decrement product stock
        await ctx.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // Send order confirmation email
      try {
        const emailTemplate = getOrderConfirmationEmail(order.id, input.shippingAddress.firstName)
        await sendEmail({
          to: input.shippingAddress.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        })
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError)
        // Don't fail the order if email fails
      }

      // Initiate M-Pesa payment if selected
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

        return { orderId: order.id, checkoutRequestId: mpesaResult.CheckoutRequestID, total }
      }

      // For card payments, return order ID for Stripe checkout
      return { orderId: order.id, total }
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