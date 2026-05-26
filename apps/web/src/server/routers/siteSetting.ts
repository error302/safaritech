import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from './trpc'

// Keys that are safe to expose publicly (frontend display settings)
const PUBLIC_KEYS = [
  'store_name',
  'tagline',
  'logo_url',
  'favicon_url',
  'hero_title',
  'hero_subtitle',
  'hero_image',
  'hero_badge_text',
  'hero_cta_primary_text',
  'hero_cta_primary_link',
  'hero_cta_secondary_text',
  'hero_cta_secondary_link',
  'trust_badges',
  'footer_description',
  'footer_shop_links',
  'footer_company_links',
  'footer_support_links',
  'footer_legal_links',
  'nav_category_links',
  'free_delivery_min',
  'delivery_fee',
  'whatsapp',
  'contact_email',
  'location',
]

// Keys that contain sensitive information (payment credentials, API keys)
const SENSITIVE_KEYS = [
  'mpesa_consumer_key',
  'mpesa_consumer_secret',
  'mpesa_shortcode',
  'stripe_secret_key',
  'paypal_client_id',
]

export const siteSettingRouter = router({
  // Public: returns only safe display settings (used by SiteSettingsProvider for frontend)
  getAll: publicProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.siteSetting.findMany({
      where: { key: { in: PUBLIC_KEYS } },
    })
    // Convert to object for easy access
    const result: Record<string, string> = {}
    for (const s of settings) {
      result[s.key] = s.value
    }
    return result
  }),

  // Admin: returns ALL settings including sensitive ones
  adminGetAll: adminProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.siteSetting.findMany()
    // Mask sensitive values — show only last 4 characters
    const result: Record<string, string> = {}
    for (const s of settings) {
      if (SENSITIVE_KEYS.includes(s.key) && s.value) {
        result[s.key] = s.value.length > 4 ? '••••' + s.value.slice(-4) : '••••'
      } else {
        result[s.key] = s.value
      }
    }
    return result
  }),

  get: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      // Block access to sensitive keys via the public endpoint
      if (SENSITIVE_KEYS.includes(input.key)) {
        return null
      }
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
