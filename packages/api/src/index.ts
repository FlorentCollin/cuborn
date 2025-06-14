import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createContext } from "./context/context";
import { appRouter } from "./routers/app";

const app = new Hono().use(logger());
app
	.use(
		"/trpc/*",
		cors({
			origin: "*",
			allowHeaders: [],
			allowMethods: ["POST", "GET", "OPTIONS"],
			exposeHeaders: [],
			maxAge: 600,
			credentials: true,
		}),
	)
	.use(
		"/trpc/*",
		trpcServer({
			router: appRouter,
			createContext,
		}),
	);

export default app;
