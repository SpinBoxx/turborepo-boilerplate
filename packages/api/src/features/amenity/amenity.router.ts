import { ORPCError } from "@orpc/server";
import z from "zod";
import { adminProcedure, publicProcedure } from "../../index";
import {
	AmenityComputedSchema,
	DeleteAmenityInputSchema,
	GetAmenityInputSchema,
	ListAmenitiesInputSchema,
	UpsertAmenityInputSchema,
} from "./amenity.schemas";
import {
	createAmenity,
	deleteAmenity,
	getAmenityById,
	listAmenities,
	updateAmenity,
} from "./amenity.store";
import { computeAmenity } from "./computes/amenity-compute";
import { computeUpsertAmenityInput } from "./computes/upsert-compute";

export const listAmenitiesRoute = publicProcedure
	.route({
		method: "GET",
		path: "/amenities",
		summary: "List amenities",
		tags: ["Amenity"],
	})
	.input(ListAmenitiesInputSchema)
	.output(AmenityComputedSchema.array())
	.handler(async ({ input }) => {
		const amenities = await listAmenities(input);
		console.log(amenities);

		return amenities.map(computeAmenity);
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
	.handler(async ({ input }) => {
		const amenity = await getAmenityById(input.id);
		if (!amenity) {
			throw new ORPCError("NOT_FOUND");
		}
		return computeAmenity(amenity);
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
	.handler(async ({ input }) => {
		const computedInput = await computeUpsertAmenityInput(input);
		const created = await createAmenity(computedInput);
		return computeAmenity(created);
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
	.handler(async ({ input }) => {
		const computedInput = await computeUpsertAmenityInput(input);
		const updated = await updateAmenity(input.id, computedInput);
		if (!updated) {
			throw new ORPCError("NOT_FOUND");
		}
		return computeAmenity(updated);
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
	.handler(async ({ input }) => {
		const deleted = await deleteAmenity(input);
		if (!deleted) {
			throw new ORPCError("NOT_FOUND");
		}
		return computeAmenity(deleted);
	});

export const amenityRouter = {
	list: listAmenitiesRoute,
	get: getAmenityRoute,
	create: createAmenityRoute,
	update: updateAmenityRoute,
	delete: deleteAmenityRoute,
};
