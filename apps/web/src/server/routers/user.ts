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
})
