import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server'
import { createTRPCContext } from '@/server/routers/trpc'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req } as FetchCreateContextFnOptions),
  })

export { handler as GET, handler as POST }
