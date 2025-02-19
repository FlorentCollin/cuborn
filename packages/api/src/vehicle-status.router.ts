import { desc, gte, sql } from "drizzle-orm";
import "zod-openapi/extend";
import assert from "node:assert";
import { z } from "zod";
import { db } from "./db";
import { publicProcedure, router } from "./trpc";
import { vehicleStatusTable } from "./vehicle-status.sql";

export const vehicleStatusRouter = router({
	last: publicProcedure.query(async () => {
		const lastRow = await db.query.vehicleStatusTable.findFirst({
			orderBy: desc(vehicleStatusTable.createdAt),
		});
		assert(lastRow);
		return lastRow;
	}),
	batteryLevelHistory: publicProcedure
		.input(
			z.object({
				timeRange: z.enum(["1 day", "7 day", "30 day", "90 day"]),
			}),
		)
		.query(async ({ input }) => {
			const rawData = db.$with("raw_data").as(
				db
					.select({
						created_at: vehicleStatusTable.createdAt,
						battery_level: vehicleStatusTable.batteryLevel,
						prev_level:
							sql<number>`LAG(${vehicleStatusTable.batteryLevel}) OVER (ORDER BY ${vehicleStatusTable.createdAt})`.as(
								"prev_level",
							),
						next_level:
							sql<number>`LEAD(${vehicleStatusTable.batteryLevel}) OVER (ORDER BY ${vehicleStatusTable.createdAt})`.as(
								"next_level",
							),
					})
					.from(vehicleStatusTable)
					.where(
						sql`${vehicleStatusTable.createdAt} >= datetime('now', 'localtime', '-' || ${input.timeRange})`,
					),
			);

			const significantChanges = db.$with("significant_changes").as(
				db
					.select({
						created_at: rawData.created_at,
						battery_level: rawData.battery_level,
					})
					.from(rawData)
					.where(sql`
      ABS(COALESCE(battery_level - prev_level, 0)) > 5 OR
      ABS(COALESCE(battery_level - next_level, 0)) > 5
    `)
					.union(
						db
							.select({
								created_at: rawData.created_at,
								battery_level: rawData.battery_level,
							})
							.from(rawData)
							.where(sql`strftime('%M', created_at) = '00'`),
					),
			);

			const result = await db
				.with(rawData, significantChanges)
				.select({
					time: sql<string>`datetime(strftime('%Y-%m-%d %H:%M:00', created_at))`.as(
						"time",
					),
					min_battery_level_percentage: sql<number>`battery_level`.as(
						"min_battery_level_percentage",
					),
				})
				.from(significantChanges)
				.orderBy(sql`time`)
				.all();

			return result;
		}),
	statsThisMonth: publicProcedure.query(async () => {
		const kmResult = await db
			.select({
				kmThisMonth: sql<number>`
                MAX(${vehicleStatusTable.odometerKm}) - MIN(${vehicleStatusTable.odometerKm})
            `.as("km_this_month"),
			})
			.from(vehicleStatusTable)
			.where(
				gte(vehicleStatusTable.createdAt, sql`date('now', 'start of month')`),
			);
		assert(kmResult[0]);

		const batteryChanges = db.$with("battery_changes").as(
			db
				.select({
					batteryLevel: vehicleStatusTable.batteryLevel,
					prevBatteryLevel:
						sql<number>`LAG(${vehicleStatusTable.batteryLevel}) OVER (ORDER BY ${vehicleStatusTable.createdAt})`.as(
							"prev_battery_level",
						),
				})
				.from(vehicleStatusTable)
				.where(
					gte(vehicleStatusTable.createdAt, sql`date('now', 'start of month')`),
				),
		);

		const batteryResult = await db
			.with(batteryChanges)
			.select({
				batteryUsedPercentage: sql<number>`
            SUM(
                CASE
                    WHEN battery_level < prev_battery_level
                    THEN prev_battery_level - battery_level
                    ELSE 0
                END
            )
        `.as("battery_used_percentage"),
			})
			.from(batteryChanges);

		assert(batteryResult[0]);
		return {
			kmThisMonth: kmResult[0].kmThisMonth,
			batteryUsedPercentage: batteryResult[0].batteryUsedPercentage,
		};
	}),
});
