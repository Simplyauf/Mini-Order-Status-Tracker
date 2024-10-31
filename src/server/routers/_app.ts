import { router } from "../trpc";
import { orderRouter } from "./order";

export const appRouter = router({
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
