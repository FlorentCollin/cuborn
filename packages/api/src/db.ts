import { drizzle } from "drizzle-orm/libsql";
import { vehicleStatusTable } from "./vehicle-status.sql";

export const db = drizzle(process.env.DATABASE_URL!, {
	schema: {
		vehicleStatusTable,
	},
	logger: false,
});

const result = await db.query.vehicleStatusTable.findMany();
console.log(result);
