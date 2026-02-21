import { ORPCError } from "@orpc/client";
import { adminProcedure, publicProcedure } from "../..";
import { computeTerm } from "./computes/term-compute";
import { computeUpsertTermsInput } from "./computes/upsert-compute";
import { createTerm, deleteTerm, getTerm, listTerms } from "./terms.store";
import {
	DeleteTermsInputSchema,
	GetTermsInputSchema,
	ListTermsInputSchema,
	TermsComputedSchema,
	TermsSchema,
	UpsertTermsInputSchema,
} from "./terms-schemas";

export const listTermsRoute = publicProcedure
	.route({
		method: "GET",
		path: "/terms",
		summary: "List all terms entries",
		tags: ["Terms"],
	})
	.input(ListTermsInputSchema)
	.output(TermsComputedSchema.array())
	.handler(async ({ input }) => {
		const terms = await listTerms(input);
		return terms.map(computeTerm);
	});

export const createTermRoute = adminProcedure
	.route({
		method: "POST",
		path: "/terms",
		summary: "Create a new terms entry",
		tags: ["Terms"],
	})
	.input(UpsertTermsInputSchema)
	.output(TermsSchema)
	.handler(async ({ input }) => {
		const computedInput = await computeUpsertTermsInput(input);
		const terms = await listTerms({
			type: computedInput.type,
			orderBy: {
				version: "desc",
			},
		});

		const firstTerm = terms.at(0);

		if (!firstTerm) {
			const created = await createTerm(computedInput);
			return computeTerm(created);
		}

		if (firstTerm.version >= computedInput.version) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Une version égale ou supérieure existe déjà.",
			});
		}

		const created = await createTerm(computedInput);
		return computeTerm(created);
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
		return computeTerm(term);
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
		const deleted = await deleteTerm(input);
		return computeTerm(deleted);
	});

export const termsRouter = {
	create: createTermRoute,
	get: getTermRoute,
	list: listTermsRoute,
	delete: deleteTermRoute,
};
