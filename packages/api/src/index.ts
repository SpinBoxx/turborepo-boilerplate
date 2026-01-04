import { ORPCError, os } from "@orpc/server";
import { Role } from "../../db/prisma/generated/enums";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({
		context: {
			session: context.session,
		},
	});
});

const requireAdmin = o.middleware(async ({ context, next }) => {
	const user = context.session?.user;
	if (!user) {
		throw new ORPCError("UNAUTHORIZED");
	}

	if (!user.roles?.includes(Role.ADMIN)) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({
		context: {
			session: context.session,
		},
	});
});

export const protectedProcedure = publicProcedure.use(requireAuth);

export const adminProcedure = publicProcedure.use(requireAdmin);
