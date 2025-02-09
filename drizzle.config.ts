import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	dbCredentials: {
		url: "file:/Users/florentcollin/.local/share/cuborn/cuborn.db",
	},
	schema: "packages/api/**/*.sql.ts",
	out: "packages/api/drizzle",
	verbose: true,
	strict: true,
	breakpoints: false,
	casing: "snake_case",
});
