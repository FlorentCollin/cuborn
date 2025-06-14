import { env } from "cloudflare:workers";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createAuth } from "./auth";
import { createContext } from "./context/context";
import { appRouter } from "./routers/app";

let initialized = false;

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>().use(logger());

app.use("*", async (_c, next) => {
	if (initialized) return next();

	// initialize the crons
	const id = env.CRON_INSERT_TEST_DB.idFromName("CronTestInsertDb");
	const cron = env.CRON_INSERT_TEST_DB.get(id);
	const lastTimestamp = await cron.fetch("https://dummy").then((r) => r.text());
	console.log(`LastTimestamp: ${lastTimestamp}`);
	initialized = true;

	return next();
});

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	console.log("Getting the session");

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);
	return next();
});

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
	.use("/trpc/*", async function ensureUserIsLoggedIn(c, next) {
		const user = c.get("user");
		// note(florent): restrict the access to my own id for now
		// if we want multiple users to access the app we must change this
		const isFlorentCollin =
			user?.id === "4XAQgojmxuwwKsntwcOHGe4Rt4Tdb4hh" ||
			user?.id === "4NQZuXxXVWTCZOAZDMAe7CbYOkxwrWbj";

		if (!user) {
			return c.json({ message: "FORBIDDEN" }, 403);
		}
		if (!isFlorentCollin) {
			return c.json({ message: "Sorry, you are not Florent Collin." });
		}

		return next();
	})
	.use(
		"/trpc/*",
		trpcServer({
			router: appRouter,
			createContext,
		}),
	);

app.use(
	"/api/auth/**",
	cors({
		origin: env.BASE_URL,
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

const auth = createAuth(env);
app.on(["POST", "GET"], "/api/auth/**", (c) => {
	return auth.handler(c.req.raw);
});

export default app;
export { CronInsertTestDb } from "./cron/cron-insert-test-db";
