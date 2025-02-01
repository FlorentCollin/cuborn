import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const vehicleStatusTable = sqliteTable("vehicle_status", {
	id: text("id").primaryKey(),
	timestamp: text("timestamp").default(sql`datetime('now')`).notNull(),
	nickname: text("nickname").notNull(),
	batteryLevel: integer("battery_level").notNull(),
	rangeKm: integer("range_km").notNull(),
	chargingStatus: text("charging_status").notNull(),
	chargingPowerKw: real("charging_power_kw").notNull(),
	chargingRateKmph: real("charging_rate_kmph").notNull(),
	plugStatus: text("plug_status").notNull(),
	targetSoc: real("target_soc").notNull(),
	remainingChargingTime: integer("remaining_charging_time").notNull(),
	climateStatus: text("climate_status").notNull(),
	targetTempCelsius: real("target_temp_celsius").notNull(),
	windowHeatingFront: text("window_heating_front").notNull(),
	windowHeatingRear: text("window_heating_rear").notNull(),
	doorsLocked: integer("doors_locked").notNull(),
	doorsFrontLeft: text("doors_front_left").notNull(),
	doorsFrontRight: text("doors_front_right").notNull(),
	doorsRearLeft: text("doors_rear_left").notNull(),
	doorsRearRight: text("doors_rear_right").notNull(),
	doorsTrunk: text("doors_trunk").notNull(),
	doorsHood: text("doors_hood").notNull(),
	windowFrontLeft: text("window_front_left").notNull(),
	windowFrontRight: text("window_front_right").notNull(),
	windowRearLeft: text("window_rear_left").notNull(),
	windowRearRight: text("window_rear_right").notNull(),
	connectionStatus: text("connection_status").notNull(),
	odometerKm: integer("odometer_km").notNull(),
});
export const VehicleStatusTableSelect = createSelectSchema(vehicleStatusTable);
export type VehicleStatusTableSelect = z.infer<typeof VehicleStatusTableSelect>;
export const VehicleStatusTableInsert = createInsertSchema(vehicleStatusTable);
export type VehicleStatusTableInsert = z.infer<typeof VehicleStatusTableInsert>;
