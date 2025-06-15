import { count, desc, gte, min, sql } from "drizzle-orm";
import type { Database } from "../db";
import { vehicleStatusTable } from "../tables/vehicle-status.table";
import type {
	BatteryLevelHistoryInput,
	VehicleStatusTableSelect,
} from "../tables/vehicle-status.table";

// --- Service Class ---
export class VehicleStatusService {
	private db: Database;

	constructor(dbInstance: Database) {
		this.db = dbInstance;
	}

	async getLastStatus(): Promise<VehicleStatusTableSelect> {
		const lastRow = await this.db.query.vehicleStatusTable.findFirst({
			orderBy: desc(vehicleStatusTable.createdAt),
		});
		if (!lastRow) {
			throw new Error("No vehicle status data found.");
		}
		return lastRow;
	}

	async getBatteryLevelHistory(input: BatteryLevelHistoryInput) {
		const rawData = this.db.$with("raw_data").as(
			this.db
				.select({
					createdAt: vehicleStatusTable.createdAt,
					batteryLevel: vehicleStatusTable.batteryLevel,
					prevLevel:
						sql<number>`LAG(${vehicleStatusTable.batteryLevel}) OVER (ORDER BY ${vehicleStatusTable.createdAt})`.as(
							"prev_level",
						),
					nextLevel:
						sql<number>`LEAD(${vehicleStatusTable.batteryLevel}) OVER (ORDER BY ${vehicleStatusTable.createdAt})`.as(
							"next_level",
						),
				})
				.from(vehicleStatusTable)
				.where(
					sql`${vehicleStatusTable.createdAt} >= datetime('now', 'localtime', '-' || ${input.timeRange})`,
				),
		);

		const significantChanges = this.db.$with("significant_changes").as(
			this.db
				.select({
					createdAt: rawData.createdAt,
					batteryLevel: rawData.batteryLevel,
				})
				.from(rawData)
				.where(sql`
          ABS(COALESCE(${rawData.batteryLevel} - ${rawData.prevLevel}, 0)) > 5 OR
          ABS(COALESCE(${rawData.batteryLevel} - ${rawData.nextLevel}, 0)) > 5
        `)
				.union(
					this.db
						.select({
							createdAt: rawData.createdAt,
							batteryLevel: rawData.batteryLevel,
						})
						.from(rawData)
						// Explicitly cast to INTEGER for comparison
						.where(sql`CAST(strftime('%M', created_at) AS INTEGER) = 0`),
				),
		);

		const history = await this.db
			.with(rawData, significantChanges)
			.select({
				time: significantChanges.createdAt,
				minBatteryLevelPercentage: min(significantChanges.batteryLevel),
			})
			.from(significantChanges)
			.groupBy(significantChanges.createdAt)
			.orderBy(significantChanges.createdAt)
			.all();

		const [lastBatteryLevel] = await this.db
			.select({
				time: vehicleStatusTable.createdAt,
				batteryLevelPercentage: vehicleStatusTable.batteryLevel,
			})
			.from(vehicleStatusTable)
			.orderBy(desc(vehicleStatusTable.createdAt))
			.limit(1);

		if (!lastBatteryLevel) {
			throw new Error("lastBatteryLevel can't be undefined");
		}
		return {
			history,
			lastBatteryLevel,
		};
	}

	async getStatsThisMonth() {
		// Preliminary check: Ensure data exists for the current month
		const countResult = await this.db
			.select({ value: count() })
			.from(vehicleStatusTable)
			.where(
				gte(vehicleStatusTable.createdAt, sql`date('now', 'start of month')`),
			);
		if (countResult[0]?.value! <= 0) {
			throw new Error("No vehicule status data found for this month");
		}

		// --- Kilometers Driven --- Find the difference between the max and min odometer reading this month
		const kmResult = await this.db
			.select({
				minOdometer: sql<number>`MIN(${vehicleStatusTable.odometerKm})`.as(
					"min_odometer",
				),
				maxOdometer: sql<number>`MAX(${vehicleStatusTable.odometerKm})`.as(
					"max_odometer",
				),
			})
			.from(vehicleStatusTable)
			.where(
				gte(
					vehicleStatusTable.createdAt,
					sql`datetime('now', 'start of month')`,
				),
			);

		const { minOdometer, maxOdometer } = kmResult[0] || {
			minOdometer: null,
			maxOdometer: null,
		};

		// Log the raw values for debugging
		console.log(
			`DEBUG: getStatsThisMonth - Raw minOdometer: ${minOdometer}, Raw maxOdometer: ${maxOdometer}`,
		);

		// If either min or max is null (meaning no data found for the month), throw an error
		if (minOdometer === null || maxOdometer === null) {
			throw new Error("No vehicle status data found for the current month.");
		}

		const kmThisMonth = maxOdometer - minOdometer;

		// --- Battery Usage --- Calculate the total battery percentage decrease this month
		const batteryChanges = this.db.$with("battery_changes").as(
			this.db
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

		const batteryResult = await this.db
			.with(batteryChanges)
			.select({
				batteryUsedPercentage: sql<number>`
                SUM(
                    CASE
                        WHEN ${vehicleStatusTable.batteryLevel} < ${batteryChanges.prevBatteryLevel}
                        THEN ${batteryChanges.prevBatteryLevel} - ${vehicleStatusTable.batteryLevel}
                        ELSE 0
                    END
                )
            `.as("battery_used_percentage"),
			})
			.from(batteryChanges);

		if (!batteryResult || batteryResult.length <= 0 || !batteryResult[0]) {
			throw new Error("No vehicle status data found for this month (battery)");
		}
		return {
			kmThisMonth,
			batteryUsedPercentage: batteryResult[0].batteryUsedPercentage ?? 0,
		};
	}
}
