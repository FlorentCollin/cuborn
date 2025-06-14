import { db } from "../core/db";
import { VehicleStatusService } from "../core/services/vehicle-status.service";

/**
 * Creates the context for each request.
 * This will be available to all tRPC procedures.
 * @returns The request context.
 */
export function createContext() {
	const vehicleStatusService = new VehicleStatusService(db);
	return {
		db: db,
		vehicleStatusService: vehicleStatusService,
		// Add back req/resHeaders if needed by procedures, but often just db/services suffice
	};
}

// Derive the Context type from the return type of createContext
export type Context = Awaited<ReturnType<typeof createContext>>;
