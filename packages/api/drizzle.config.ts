import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite", // Specify 'sqlite' dialect
	// driver: 'bun-sqlite', // Specify the bun-sqlite driver - Removed as dialect implies this
	schema: "./src/core/tables/vehicle-status.table.ts", // Point to your schema definition file
	out: "./drizzle", // Output directory for migrations
	// Optional: Specify a database file for drizzle-kit commands if needed,
	// but migrations will run against the in-memory DB during tests.
	// dbCredentials: {
	//   url: './sqlite.db',
	// },
	verbose: true,
	strict: true,
});
