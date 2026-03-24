import { router } from './routers/trpc'
import { productRouter } from './routers/product'
import { categoryRouter } from './routers/category'
import { orderRouter } from './routers/order'
import { userRouter } from './routers/user'
import { cartRouter } from './routers/cart'
import { reviewRouter } from './routers/review'

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
  user: userRouter,
  cart: cartRouter,
  review: reviewRouter,
})

export type AppRouter = typeof appRouter
