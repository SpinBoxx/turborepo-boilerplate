import { ORPCError } from "@orpc/server";
import z from "zod";
import { adminProcedure, publicProcedure } from "../../index";
import type { UserComputed } from "../user";
import {
	createAmenity,
	deleteAmenity,
	getAmenityById,
	listAmenities,
	updateAmenity,
} from "./amenity.store";
import { computeAmenity } from "./computes/amenity-compute";
import { computeUpsertAmenityInput } from "./computes/upsert-compute";
import {
	AmenityComputedSchema,
	DeleteAmenityInputSchema,
	GetAmenityInputSchema,
	ListAmenitiesInputSchema,
	UpsertAmenityInputSchema,
} from "./schemas/amenity.schemas";

export const listAmenitiesRoute = publicProcedure
	.route({
		method: "GET",
		path: "/amenities",
		summary: "List amenities",
		tags: ["Amenity"],
	})
	.input(ListAmenitiesInputSchema)
	.output(AmenityComputedSchema.array())
	.handler(async ({ input, context }) => {
		const amenities = await listAmenities(input);
		return await Promise.all(
			amenities.map(async (a) => await computeAmenity(a, context.user)),
		);
	});

export const getAmenityRoute = publicProcedure
	.route({
		method: "GET",
		path: "/amenities/{id}",
		summary: "Get an amenity by ID",
		tags: ["Amenity"],
	})
	.input(GetAmenityInputSchema)
	.output(AmenityComputedSchema)
	.handler(async ({ input, context }) => {
		const amenity = await getAmenityById(input.id);
		if (!amenity) {
			throw new ORPCError("NOT_FOUND");
		}
		return await computeAmenity(amenity, context.user);
	});

export const createAmenityRoute = adminProcedure
	.route({
		method: "POST",
		path: "/amenities",
		summary: "Create an amenity",
		tags: ["Amenity"],
	})
	.input(UpsertAmenityInputSchema)
	.output(AmenityComputedSchema)
	.handler(async ({ input, context }) => {
		const computedInput = await computeUpsertAmenityInput(input);
		const created = await createAmenity(computedInput);
		return await computeAmenity(created, context.user);
	});

export const updateAmenityRoute = adminProcedure
	.route({
		method: "PATCH",
		path: "/amenities/{id}",
		summary: "Update an amenity",
		tags: ["Amenity"],
	})
	.input(
		z.intersection(GetAmenityInputSchema, UpsertAmenityInputSchema.partial()),
	)
	.output(AmenityComputedSchema)
	.handler(async ({ input, context }) => {
		const computedInput = await computeUpsertAmenityInput(input);
		const updated = await updateAmenity(input.id, computedInput);
		if (!updated) {
			throw new ORPCError("NOT_FOUND");
		}
		return await computeAmenity(updated, context.user);
	});

export const deleteAmenityRoute = adminProcedure
	.route({
		method: "DELETE",
		path: "/amenities/{id}",
		summary: "Delete an amenity",
		tags: ["Amenity"],
	})
	.input(DeleteAmenityInputSchema)
	.output(AmenityComputedSchema)
	.handler(async ({ input, context }) => {
		const deleted = await deleteAmenity(input);
		if (!deleted) {
			throw new ORPCError("NOT_FOUND");
		}
		return await computeAmenity(deleted, context.user);
	});

export const amenityRouter = {
	list: listAmenitiesRoute,
	get: getAmenityRoute,
	create: createAmenityRoute,
	update: updateAmenityRoute,
	delete: deleteAmenityRoute,
};
