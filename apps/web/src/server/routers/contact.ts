import { z } from 'zod'
import { router, adminProcedure } from './trpc'

export const contactRouter = router({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }),

  updateStatus: adminProcedure
    .input(z.object({ id: z.string(), status: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contact.update({
        where: { id: input.id },
        data: { status: input.status },
      })
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contact.delete({ where: { id: input.id } })
    }),
})
