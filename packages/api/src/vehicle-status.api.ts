import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { z } from "zod";
import { VehicleStatus, connection } from "./db";

export const vehicleStatus = new Hono();

vehicleStatus.get(
	"/last",
	describeRoute({
		description: "Get the last vehicle status",
		responses: {
			200: {
				description: "OK",
				content: {
					"application/json": { schema: resolver(VehicleStatus) },
				},
			},
		},
	}),
	async (c) => {
		const reader = await connection.runAndReadAll(
			"SELECT * FROM vehicle_status ORDER BY id DESC LIMIT 1",
		);
		const rows = reader.getRowObjectsJson();
		return c.json(rows[0]);
	},
);

const BatteryLevelResponse = z.object({
	min_battery_level_percentage: z.string().nullable(),
	time: z.string(),
});
type BatteryLevelResponse = z.infer<typeof BatteryLevelResponse>;

vehicleStatus.get(
	"/battery-level",
	describeRoute({
		description: "Get the battery level history",
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
		const reader = await connection.runAndReadAll(`
		with hourly_series as (
			select unnest(generate_series(
				date_trunc('hour', now() - interval '1 days' - interval '3 hours'),
				date_trunc('hour', now()),
				interval '1 hour'
			)) as hour
		)
		select 
			hourly_series.hour as time,
			coalesce(min(status.battery_level), null) as min_battery_level_percentage
		from hourly_series
		left join vehicle_status status on 
			time_bucket('1h', status.created_at::timestamptz) = hourly_series.hour
		group by hourly_series.hour
		order by hourly_series.hour;`);

		return c.json(
			BatteryLevelResponse.array().parse(reader.getRowObjectsJson()),
		);
	},
);
