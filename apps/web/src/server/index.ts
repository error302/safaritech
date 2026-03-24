import { router } from './routers/trpc'
import { productRouter } from './routers/product'
import { categoryRouter } from './routers/category'
import { orderRouter } from './routers/order'

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
})

export type AppRouter = typeof appRouter
