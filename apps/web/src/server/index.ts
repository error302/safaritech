import { router } from './routers/trpc'
import { productRouter } from './routers/product'
import { categoryRouter } from './routers/category'

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
})

export type AppRouter = typeof appRouter
