import { initTRPC } from "@trpc/server";
import type { Context } from "./context/context";
import { errorFormatter } from "./core/error";

export const t = initTRPC.context<Context>().create({
	errorFormatter,
});

export const router = t.router;

export const publicProcedure = t.procedure;
