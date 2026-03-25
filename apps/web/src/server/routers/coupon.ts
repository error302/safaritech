import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, adminProcedure } from './trpc'

export const couponRouter = router({
  getByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const coupon = await ctx.prisma.coupon.findUnique({
        where: { code: input.code },
      })

      if (!coupon || !coupon.isActive) {
        return null
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return null
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return null
      }

      return coupon
    }),

  validate: protectedProcedure
    .input(z.object({ code: z.string(), orderTotal: z.number() }))
    .query(async ({ ctx, input }) => {
      const coupon = await ctx.prisma.coupon.findUnique({
        where: { code: input.code },
      })

      if (!coupon || !coupon.isActive) {
        return { valid: false, error: 'Invalid coupon code' }
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return { valid: false, error: 'Coupon has expired' }
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, error: 'Coupon usage limit reached' }
      }

      if (coupon.minOrderValue && input.orderTotal < coupon.minOrderValue) {
        return { 
          valid: false, 
          error: `Minimum order value is KSh ${coupon.minOrderValue.toLocaleString()}` 
        }
      }

      let discount = 0
      if (coupon.discountType === 'PERCENTAGE') {
        discount = Math.floor(input.orderTotal * (coupon.discountValue / 100))
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount
        }
      } else {
        discount = coupon.discountValue
      }

      return { valid: true, discount, coupon }
    }),

  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }),

  create: adminProcedure
    .input(z.object({
      code: z.string(),
      description: z.string().optional(),
      discountType: z.enum(['PERCENTAGE', 'FIXED']),
      discountValue: z.number(),
      minOrderValue: z.number().optional(),
      maxDiscount: z.number().optional(),
      usageLimit: z.number().optional(),
      expiresAt: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const coupon = await ctx.prisma.coupon.create({
        data: {
          code: input.code.toUpperCase(),
          description: input.description,
          discountType: input.discountType,
          discountValue: input.discountValue,
          minOrderValue: input.minOrderValue,
          maxDiscount: input.maxDiscount,
          usageLimit: input.usageLimit,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        },
      })
      return coupon
    }),

  use: protectedProcedure
    .input(z.object({ couponId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const coupon = await ctx.prisma.coupon.update({
        where: { id: input.couponId },
        data: { usedCount: { increment: 1 } },
      })
      return coupon
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.coupon.delete({ where: { id: input.id } })
      return { success: true }
    }),
})
