import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from './trpc'

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        addresses: true,
      },
    })
    return user
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      })
      return user
    }),

  getAll: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return users
  }),

  updateRole: adminProcedure
    .input(z.object({
      userId: z.string(),
      role: z.enum(['CUSTOMER', 'ADMIN']),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      })
      return user
    }),

  addAddress: protectedProcedure
    .input(z.object({
      label: z.string(),
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postal: z.string(),
      country: z.string(),
      phone: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const address = await ctx.prisma.address.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      })
      return address
    }),

  getAddresses: protectedProcedure.query(async ({ ctx }) => {
    const addresses = await ctx.prisma.address.findMany({
      where: { userId: ctx.session.user.id },
    })
    return addresses
  }),

  updateAddress: protectedProcedure
    .input(z.object({
      id: z.string(),
      label: z.string().optional(),
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postal: z.string().optional(),
      country: z.string().optional(),
      phone: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      
      // First check if address belongs to current user
      const existing = await ctx.prisma.address.findFirst({
        where: { id, userId: ctx.session.user.id },
      })
      
      if (!existing) {
        throw new Error('Address not found or access denied')
      }
      
      const address = await ctx.prisma.address.update({
        where: { id },
        data,
      })
      return address
    }),

  deleteAddress: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First check if address belongs to current user
      const existing = await ctx.prisma.address.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      })
      
      if (!existing) {
        throw new Error('Address not found or access denied')
      }
      
      await ctx.prisma.address.delete({
        where: { id: input.id },
      })
      return { success: true }
    }),
})
