import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { db } from "./db";
import { vehicleStatusTable } from "./vehicle-status.sql";

const app = new Hono();

app.get("/", async (c) => {
	const rows = await db.select().from(vehicleStatusTable);
	return c.json(rows);
});

app.get(
	"/openapi",
	openAPISpecs(app, {
		documentation: {
			info: {
				title: "Hono API",
				version: "1.0.0",
				description: "Greeting API",
			},
			servers: [{ url: "http://localhost:3000", description: "Local Server" }],
		},
	}),
);

app.get(
	"/docs",
	apiReference({
		theme: "saturn",
		spec: { url: "/openapi" },
	}),
);

export default app;
