import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from './trpc'

export const siteSettingRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.siteSetting.findMany()
    // Convert to object for easy access
    const result: Record<string, string> = {}
    for (const s of settings) {
      result[s.key] = s.value
    }
    return result
  }),

  get: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      const setting = await ctx.prisma.siteSetting.findUnique({
        where: { key: input.key },
      })
      return setting?.value ?? null
    }),

  upsert: adminProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.siteSetting.upsert({
        where: { key: input.key },
        update: { value: input.value },
        create: { key: input.key, value: input.value },
      })
    }),

  bulkUpsert: adminProcedure
    .input(z.object({ settings: z.array(z.object({ key: z.string(), value: z.string() })) }))
    .mutation(async ({ ctx, input }) => {
      const operations = input.settings.map(s =>
        ctx.prisma.siteSetting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value },
        })
      )
      return Promise.all(operations)
    }),
})
