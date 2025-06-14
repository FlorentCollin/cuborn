import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	schema: ["./src/core/tables/*.table.ts", "./auth-schema.ts"],
	out: "./drizzle",
	verbose: true,
	strict: true,
});
