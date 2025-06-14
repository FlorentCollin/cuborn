import type { TRPCError } from "@trpc/server";
import type { ProcedureType } from "@trpc/server";

/**
 * Defines custom error classes for specific API errors.
 * Example:
 *
 * export class NotFoundError extends TRPCError {
 *   constructor(message = "Resource not found") {
 *     super({ code: "NOT_FOUND", message });
 *   }
 * }
 *
 * export class AuthenticationError extends TRPCError {
 *   constructor(message = "User not authenticated") {
 *     super({ code: "UNAUTHORIZED", message });
 *   }
 * }
 */

// --- Error Formatter ---

/**
 * Formats errors before they are sent to the client.
 * You can customize this to include more details in development
 * or mask sensitive information in production.
 */
export const errorFormatter = <TContext, TShape>(opts: {
	shape: TShape & { data?: unknown }; // Indicate data might exist
	error: TRPCError;
	type: ProcedureType | "unknown";
	path: string | undefined;
	input: unknown;
	ctx: TContext | undefined;
}) => {
	const { shape, error } = opts;
	// You can log the error here
	console.error(
		`[TRPC Error]: Path='${opts.path}', Type='${opts.type}', Code='${error.code}', Message='${error.message}'`,
	);

	return {
		...shape,
		data: {
			...(shape.data && typeof shape.data === "object" ? shape.data : {}),
			// Example: Add procedure type to the response data
			type: opts.type,
		},
	};
};
