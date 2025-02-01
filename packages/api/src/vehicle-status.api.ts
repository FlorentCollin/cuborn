import { desc } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { db } from "./db";
import {
	VehicleStatusTableSelect,
	vehicleStatusTable,
} from "./vehicle-status.sql";

export const vehicleStatus = new Hono();

const responseSchema = VehicleStatusTableSelect.pick({
	id: true,
	timestamp: true,
	nickname: true,
	batteryLevel: true,
	rangeKm: true,
	chargingStatus: true,
	chargingPowerKw: true,
	chargingRateKmph: true,
	plugStatus: true,
	targetSoc: true,
	remainingChargingTime: true,
	climateStatus: true,
	targetTempCelsius: true,
	windowHeatingFront: true,
	windowHeatingRear: true,
	doorsLocked: true,
	doorsFrontLeft: true,
	doorsFrontRight: true,
	doorsRearLeft: true,
	doorsRearRight: true,
	doorsTrunk: true,
	doorsHood: true,
	windowFrontLeft: true,
	windowFrontRight: true,
	windowRearLeft: true,
	windowRearRight: true,
	connectionStatus: true,
	odometerKm: true,
});

vehicleStatus.get(
	"/last",
	describeRoute({
		description: "Get the last vehicle status",
		responses: {
			200: {
				description: "OK",
				content: {
					"text/json": { schema: resolver(responseSchema) },
				},
			},
		},
	}),
	async (c) => {
		const rows = await db
			.select()
			.from(vehicleStatusTable)
			.orderBy(desc(vehicleStatusTable.id))
			.limit(1);
		return c.json(rows[0]);
	},
);
