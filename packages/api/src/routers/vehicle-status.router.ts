import { BatteryLevelHistoryInputSchema } from "../core/tables/vehicle-status.table";
import { publicProcedure, router } from "../trpc";

export const vehicleStatusRouter = router({
	last: publicProcedure.query(async ({ ctx }) => {
		return ctx.vehicleStatusService.getLastStatus();
	}),

	batteryLevelHistory: publicProcedure
		.input(BatteryLevelHistoryInputSchema)
		.query(async ({ ctx, input }) => {
			return await ctx.vehicleStatusService.getBatteryLevelHistory(input);
		}),

	statsThisMonth: publicProcedure.query(async ({ ctx }) => {
		return ctx.vehicleStatusService.getStatsThisMonth();
	}),
});
