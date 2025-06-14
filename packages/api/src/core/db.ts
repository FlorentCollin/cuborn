import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { vehicleStatusTable } from "./tables/vehicle-status.table";

export const db = drizzle(env.CUBORN_DB, {
	schema: {
		vehicleStatusTable,
	},
	logger: true,
});

export type Database = typeof db;
