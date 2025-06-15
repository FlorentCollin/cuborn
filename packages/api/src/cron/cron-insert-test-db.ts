import { DurableObject } from "cloudflare:workers";
import { asc, gt } from "drizzle-orm";
import { ulid } from "ulid";
import { db } from "../core/db";
import { vehicleStatusTable } from "../core/tables/vehicle-status.table";

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

export class CronInsertTestDb extends DurableObject {
	private readonly storage: DurableObjectStorage;
	private readonly lastTimestampKey = "lastTimestampKey";

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.ctx = ctx;
		this.storage = ctx.storage;
	}

	lastTimestamp = {
		get: async () => {
			const lastTimestamp = await this.storage.get<string>(
				this.lastTimestampKey,
			);
			if (lastTimestamp) {
				return lastTimestamp;
			}
			const lastTimestampDefault = new Date("1970-01-01").toISOString();
			if (!lastTimestamp) {
				await this.storage.put(this.lastTimestampKey, lastTimestampDefault);
			}
			return lastTimestampDefault;
		},
		set: async (lastTimestamp: string) => {
			console.log(`New last timestamp: ${lastTimestamp}`);
			this.storage.put(this.lastTimestampKey, lastTimestamp);
		},
	};

	override async fetch(_request: Request) {
		await this.alarm();
		return new Response(await this.lastTimestamp.get());
	}

	override async alarm() {
		this.storage.setAlarm(Date.now() + 10 * MINUTES);
		const lastTimestamp = await this.lastTimestamp.get();

		const [row] = await db
			.select()
			.from(vehicleStatusTable)
			.where(gt(vehicleStatusTable.createdAt, lastTimestamp))
			.orderBy(asc(vehicleStatusTable.createdAt))
			.limit(1);

		if (!row) {
			throw new Error(`There is no row after ${lastTimestamp}`);
		}

		await db.insert(vehicleStatusTable).values({
			id: ulid(),
			nickname: row.nickname,
			batteryLevel: row.batteryLevel,
			rangeKm: row.rangeKm,
			chargingStatus: row.chargingStatus,
			chargingPowerKw: row.chargingPowerKw,
			chargingRateKmph: row.chargingRateKmph,
			plugStatus: row.plugStatus,
			targetSoc: row.targetSoc,
			remainingChargingTime: row.remainingChargingTime,
			climateStatus: row.climateStatus,
			targetTempCelsius: row.targetTempCelsius,
			windowHeatingFront: row.windowHeatingFront,
			windowHeatingRear: row.windowHeatingRear,
			doorsLocked: row.doorsLocked,
			doorsFrontLeft: row.doorsFrontLeft,
			doorsFrontRight: row.doorsFrontRight,
			doorsRearLeft: row.doorsRearLeft,
			doorsRearRight: row.doorsRearRight,
			doorsTrunk: row.doorsTrunk,
			doorsHood: row.doorsHood,
			windowFrontLeft: row.windowFrontLeft,
			windowFrontRight: row.windowFrontRight,
			windowRearLeft: row.windowRearLeft,
			windowRearRight: row.windowRearRight,
			connectionStatus: row.connectionStatus,
			odometerKm: row.odometerKm,
			createdAt: new Date().toISOString(),
		});
		await this.lastTimestamp.set(row.createdAt);
	}
}
