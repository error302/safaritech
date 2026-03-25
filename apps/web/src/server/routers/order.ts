import { z } from 'zod'
import { router, protectedProcedure } from './trpc'

export const orderRouter = router({
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

      if (input.paymentMethod === 'card') {
        const { createPaymentIntent } = await import('@/lib/stripe')
        const paymentIntent = await createPaymentIntent(total, {
          orderId: order.id,
          userId: ctx.session.user.id,
        })

        await ctx.prisma.order.update({
          where: { id: order.id },
          data: { stripeId: paymentIntent.id } as never,
        })

        return {
          orderId: order.id,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        }
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
          data: { mpesaRef: mpesaResult.CheckoutRequestID } as never,
        })

        return {
          orderId: order.id,
          checkoutRequestId: mpesaResult.CheckoutRequestID,
        }
      }

      return { orderId: order.id }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findUnique({
        where: { id: input.id },
        include: {
          items: {
            include: { product: true },
          },
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
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return orders
  }),
})
