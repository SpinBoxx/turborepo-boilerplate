import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { adminProcedure, publicProcedure } from "../..";
import { computeTerm } from "./computes/term-compute";
import { computeUpsertTermsInput } from "./computes/upsert-compute";
import {
	DeleteTermsInputSchema,
	GetTermsInputSchema,
	ListTermsInputSchema,
	TermsComputedSchema,
	UpsertTermsInputSchema,
} from "./schemas/terms-schemas";
import { createTerm, deleteTerm, getTermById, updateTerm } from "./terms.store";
import { listTerms } from "./terms-list.service";

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
		return await listTerms(input);
	});

export const createTermRoute = adminProcedure
	.route({
		method: "POST",
		path: "/terms",
		summary: "Create a new terms entry",
		tags: ["Terms"],
	})
	.input(UpsertTermsInputSchema)
	.output(TermsComputedSchema)
	.handler(async ({ input }) => {
		const computedInput = await computeUpsertTermsInput(input);
		const terms = await listTerms(
			ListTermsInputSchema.parse({
				filters: {
					type: {
						equal: computedInput.type,
					},
				},
				sort: {
					field: "version",
					direction: "desc",
				},
				page: 1,
				limit: 1,
			}),
		);

		const latestTerm = terms.at(0);

		if (!latestTerm) {
			const created = await createTerm(computedInput);
			return computeTerm(created);
		}

		if (latestTerm.version >= computedInput.version) {
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
		path: "/terms/{id}",
		summary: "Get a terms entry by ID",
		tags: ["Terms"],
	})
	.input(GetTermsInputSchema)
	.output(TermsComputedSchema)
	.handler(async ({ input }) => {
		const term = await getTermById(input.id);
		if (!term) {
			throw new ORPCError("NOT_FOUND");
		}
		return computeTerm(term);
	});

export const deleteTermRoute = adminProcedure
	.route({
		method: "DELETE",
		path: "/terms/{id}",
		summary: "Delete a terms entry",
		tags: ["Terms"],
	})
	.input(DeleteTermsInputSchema)
	.output(TermsComputedSchema)
	.handler(async ({ input }) => {
		const term = await getTermById(input.id);
		if (!term) {
			throw new ORPCError("NOT_FOUND");
		}
		const deleted = await deleteTerm(input);
		return computeTerm(deleted);
	});

export const updateTermRoute = adminProcedure
	.route({
		method: "PATCH",
		path: "/terms/{id}",
		summary: "Update a terms entry",
		tags: ["Terms"],
	})
	.input(z.intersection(GetTermsInputSchema, UpsertTermsInputSchema.partial()))
	.output(TermsComputedSchema)
	.handler(async ({ input }) => {
		const existing = await getTermById(input.id);
		if (!existing) {
			throw new ORPCError("NOT_FOUND");
		}

		const computedInput = await computeUpsertTermsInput(input);
		const updated = await updateTerm(input.id, computedInput);
		return computeTerm(updated);
	});

export const termsRouter = {
	create: createTermRoute,
	get: getTermRoute,
	list: listTermsRoute,
	update: updateTermRoute,
	delete: deleteTermRoute,
};
