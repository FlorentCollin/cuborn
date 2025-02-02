import { DuckDBInstance } from "@duckdb/node-api";
import { z } from "zod";

const instance = await DuckDBInstance.create(process.env.DATABASE_FILE_PATH!);
export const connection = await instance.connect();

export const VehicleStatus = z.object({
	id: z.string(),
	nickname: z.string(),
	battery_level: z.number().int(),
	range_km: z.number().int(),
	charging_status: z.string(),
	charging_power_kw: z.number(),
	charging_rate_kmph: z.number(),
	plug_status: z.string(),
	target_soc: z.number(),
	remaining_charging_time: z.number().int(),
	climate_status: z.string(),
	target_temp_celsius: z.number(),
	window_heating_front: z.string(),
	window_heating_rear: z.string(),
	doors_locked: z.number().int(),
	doors_front_left: z.string(),
	doors_front_right: z.string(),
	doors_rear_left: z.string(),
	doors_rear_right: z.string(),
	doors_trunk: z.string(),
	doors_hood: z.string(),
	window_front_left: z.string(),
	window_front_right: z.string(),
	window_rear_left: z.string(),
	window_rear_right: z.string(),
	connection_status: z.string(),
	odometer_km: z.number().int(),
	created_at: z.string().datetime(),
});

export type VehicleStatus = z.infer<typeof VehicleStatus>;
