import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { logger } from "hono/logger";
import { vehicleStatus } from "./vehicle-status.api";

const apiv1 = new Hono().route("/vehicle-status", vehicleStatus);

const app = new Hono().use(logger()).route("/api/v1", apiv1);

app.get(
	"/openapi",
	openAPISpecs(apiv1, {
		documentation: {
			info: {
				title: "Hono API",
				version: "1.0.0",
				description: "Greeting API",
			},
			servers: [
				{ url: "http://localhost:3000/api/v1", description: "Local Server" },
			],
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

if (process.env.ENV === "development") {
	const fs = await import("node:fs");
	const path = await import("node:path");
	const openapiTS = await import("openapi-typescript");

	const openApiResponse = await app.request("/openapi");
	const openApiDocument = await openApiResponse.text();
	const ast = await openapiTS.default(openApiDocument);
	const contents = openapiTS.astToString(ast);
	fs.writeFileSync(path.join(import.meta.dirname, "api-schema.ts"), contents);
}

export default app;
