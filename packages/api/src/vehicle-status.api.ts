import { desc, sql } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { z } from "zod";
import { db } from "./db";
import {
	VehicleStatusTableSelect,
	vehicleStatusTable,
} from "./vehicle-status.sql";

export const vehicleStatus = new Hono();

vehicleStatus.get(
	"/last",
	describeRoute({
		description: "Get the last vehicle status",
		responses: {
			200: {
				description: "OK",
				content: {
					"application/json": { schema: resolver(VehicleStatusTableSelect) },
				},
			},
		},
		validateResponse: true,
	}),
	async (c) => {
		const lastRow = await db.query.vehicleStatusTable.findFirst({
			orderBy: desc(vehicleStatusTable.createdAt),
		});
		return c.json(lastRow);
	},
);

const BatteryLevelResponse = z.object({
	time: z.string(),
	min_battery_level_percentage: z.string().nullable(),
});

vehicleStatus.get(
	"/battery-level",
	describeRoute({
		description: "Get the battery level history",
		validateResponse: true,
		responses: {
			200: {
				description: "OK",
				content: {
					"application/json": {
						schema: resolver(BatteryLevelResponse.array()),
					},
				},
			},
		},
	}),
	async (c) => {
		const history = await batteryLevelsHistory();
		return c.json(history);
	},
);

async function batteryLevelsHistory() {
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
				sql`${vehicleStatusTable.createdAt} >= datetime('now', 'localtime', '-24 hours')`,
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
}
