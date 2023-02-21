import { createTRPCRouter } from "~/server/api/trpc";
import { web3Router } from "~/server/api/routers/web3";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  web3: web3Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
