import { router } from './routers/trpc'
import { productRouter } from './routers/product'
import { categoryRouter } from './routers/category'
import { orderRouter } from './routers/order'
import { userRouter } from './routers/user'
import { cartRouter } from './routers/cart'
import { reviewRouter } from './routers/review'
import { couponRouter } from './routers/coupon'
import { wishlistRouter } from './routers/wishlist'
import { blogRouter } from './routers/blog'

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
  user: userRouter,
  cart: cartRouter,
  review: reviewRouter,
  coupon: couponRouter,
  wishlist: wishlistRouter,
  blog: blogRouter,
})

export type AppRouter = typeof appRouter
