import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as authSchema from "../auth-schema";

function createAuth(env?: Env, cf?: IncomingRequestCfProperties) {
	// Use actual DB for runtime, empty object for CLI
	const db = env
		? drizzle(env.CUBORN_DB, { logger: true, schema: authSchema })
		: // biome-ignore lint: useful in this case
			({} as any);

	return betterAuth({
		...withCloudflare(
			{
				autoDetectIpAddress: true,
				geolocationTracking: true,
				cf: cf || {},
				d1: env
					? {
							db,
							options: {
								usePlural: true,
								debugLogs: true,
							},
						}
					: undefined,
			},
			{
				socialProviders: {
					github: {
						clientId: env?.GITHUB_CLIENT_ID || "dev_client_id",
						clientSecret: env?.GITHUB_CLIENT_SECRET || "dev_client_secret",
					},
				},
				baseURL: env?.BASE_URL || "http://localhost:5173",
				trustedOrigins: [env?.BASE_URL || "http://localhost:5173"],
			},
		),
		// Only add database adapter for CLI schema generation
		...(env
			? {}
			: {
					// biome-ignore lint: useful in this case
					database: drizzleAdapter({} as any, {
						provider: "sqlite",
						usePlural: true,
						debugLogs: true,
					}),
				}),
	});
}

// Export for CLI schema generation
export const auth = createAuth();

// Export for runtime usage
export { createAuth };
