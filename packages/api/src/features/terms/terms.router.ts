import { ORPCError } from "@orpc/client";
import { adminProcedure, publicProcedure } from "../..";
import {
	createTerm,
	deleteTerm,
	getTerm,
	listTerms,
	updateTerm,
} from "./terms.store";
import {
	CreateTermsInputSchema,
	DeleteTermsInputSchema,
	GetTermsInputSchema,
	ListTermsInputSchema,
	TermsSchema,
	UpdateTermsInputSchema,
} from "./terms-schemas";

export const listTermsRoute = publicProcedure
	.route({
		method: "GET",
		path: "/terms",
		summary: "List all terms entries",
		tags: ["Terms"],
	})
	.input(ListTermsInputSchema)
	.output(TermsSchema.array())
	.handler(async ({ input }) => {
		return await listTerms(input);
	});

export const createTermRoute = adminProcedure
	.route({
		method: "POST",
		path: "/terms",
		summary: "Create a new terms entry",
		tags: ["Terms"],
	})
	.input(CreateTermsInputSchema)
	.output(TermsSchema)
	.handler(async ({ input }) => {
		const terms = await listTerms({
			type: input.type,
			orderBy: {
				version: "desc",
			},
		});

		const firstTerm = terms.at(0);

		if (!firstTerm) {
			return createTerm(input);
		}

		if (firstTerm.version >= input.version) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Une version égale ou supérieure existe déjà.",
			});
		}

		return await createTerm(input);
	});

export const getTermRoute = publicProcedure
	.route({
		method: "GET",
		path: "/terms",
		summary: "Get a terms entry",
		tags: ["Terms"],
	})
	.input(GetTermsInputSchema)
	.output(TermsSchema)
	.handler(async ({ input }) => {
		const term = await getTerm(input);
		if (!term) {
			throw new ORPCError("NOT_FOUND");
		}
		return term;
	});

export const updateTermRoute = adminProcedure
	.route({
		method: "PUT",
		path: "/terms",
		summary: "Update a terms entry",
		tags: ["Terms"],
	})
	.input(UpdateTermsInputSchema)
	.output(TermsSchema)
	.handler(async ({ input }) => {
		const term = await getTerm(input);
		if (!term) {
			throw new ORPCError("NOT_FOUND");
		}

		return await updateTerm(input);
	});

export const deleteTermRoute = adminProcedure
	.route({
		method: "DELETE",
		path: "/terms",
		summary: "Delete a terms entry",
		tags: ["Terms"],
	})
	.input(DeleteTermsInputSchema)
	.handler(async ({ input }) => {
		const term = await getTerm({ id: input.id });
		if (!term) {
			throw new ORPCError("NOT_FOUND");
		}
		return await deleteTerm(input);
	});

export const termsRouter = {
	create: createTermRoute,
	get: getTermRoute,
	update: updateTermRoute,
	list: listTermsRoute,
	delete: deleteTermRoute,
};
