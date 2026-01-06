import { ORPCError } from "@orpc/server";
import { adminProcedure, publicProcedure } from "../../index";
import {
	AmenitySchema,
	CreateAmenityInputSchema,
	DeleteAmenityInputSchema,
	GetAmenityInputSchema,
	ListAmenitiesInputSchema,
	UpdateAmenityInputSchema,
} from "./amenity.schemas";
import {
	createAmenity,
	deleteAmenity,
	getAmenityById,
	listAmenities,
	updateAmenity,
} from "./amenity.store";

export const listAmenitiesRoute = publicProcedure
	.route({
		method: "GET",
		path: "/amenities",
		summary: "List amenities",
		tags: ["Amenity"],
	})
	.input(ListAmenitiesInputSchema)
	.output(AmenitySchema.array())
	.handler(async ({ input }) => {
		return listAmenities(input);
	});

export const getAmenityRoute = publicProcedure
	.route({
		method: "GET",
		path: "/amenities/{id}",
		summary: "Get an amenity by ID",
		tags: ["Amenity"],
	})
	.input(GetAmenityInputSchema)
	.output(AmenitySchema)
	.handler(async ({ input }) => {
		const amenity = await getAmenityById(input.id);
		if (!amenity) {
			throw new ORPCError("NOT_FOUND");
		}
		return amenity;
	});

export const createAmenityRoute = adminProcedure
	.route({
		method: "POST",
		path: "/amenities",
		summary: "Create an amenity",
		tags: ["Amenity"],
	})
	.input(CreateAmenityInputSchema)
	.output(AmenitySchema)
	.handler(async ({ input }) => {
		return createAmenity(input);
	});

export const updateAmenityRoute = adminProcedure
	.route({
		method: "PATCH",
		path: "/amenities/{id}",
		summary: "Update an amenity",
		tags: ["Amenity"],
	})
	.input(UpdateAmenityInputSchema)
	.output(AmenitySchema)
	.handler(async ({ input }) => {
		const updated = await updateAmenity(input);
		if (!updated) {
			throw new ORPCError("NOT_FOUND");
		}
		return updated;
	});

export const deleteAmenityRoute = adminProcedure
	.route({
		method: "DELETE",
		path: "/amenities/{id}",
		summary: "Delete an amenity",
		tags: ["Amenity"],
	})
	.input(DeleteAmenityInputSchema)
	.output(AmenitySchema)
	.handler(async ({ input }) => {
		const deleted = await deleteAmenity(input);
		if (!deleted) {
			throw new ORPCError("NOT_FOUND");
		}
		return deleted;
	});

export const amenityRouter = {
	list: listAmenitiesRoute,
	get: getAmenityRoute,
	create: createAmenityRoute,
	update: updateAmenityRoute,
	delete: deleteAmenityRoute,
};
