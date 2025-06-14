import { router } from "../trpc";
import { vehicleStatusRouter } from "./vehicle-status.router";

export const appRouter = router({
	vehicleStatus: vehicleStatusRouter,
});

export type AppRouter = typeof appRouter;
