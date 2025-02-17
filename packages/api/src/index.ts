import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { appRouter } from "./router";

const app = new Hono()
	.use(logger())
	.use(
		"/trpc/*",
		trpcServer({
			router: appRouter,
		}),
	)
	.get(
		"*",
		serveStatic({
			root: "../frontend/dist",
			precompressed: true,
			onFound: (_path, c) => {
				c.header("Cache-Control", "public, immutable, max-age=31556952");
			},
		}),
	);

export default app;
