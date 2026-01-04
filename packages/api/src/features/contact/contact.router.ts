import { ORPCError } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../../index";
import {
	ContactSchema,
	CreateContactInputSchema,
	GetContactInputSchema,
	ListContactsByHotelInputSchema,
} from "./contact.schemas";
import {
	createContact,
	getContactById,
	listContactsByHotelId,
} from "./contact.store";

export const createContactRoute = publicProcedure
	.route({
		method: "POST",
		path: "/contacts",
		summary: "Create a contact message",
		tags: ["Contact"],
	})
	.input(CreateContactInputSchema)
	.output(ContactSchema)
	.handler(async ({ input }) => {
		return createContact(input);
	});

export const getContactRoute = protectedProcedure
	.route({
		method: "GET",
		path: "/contacts/{id}",
		summary: "Get a contact by ID",
		tags: ["Contact"],
	})
	.input(GetContactInputSchema)
	.output(ContactSchema)
	.handler(async ({ input }) => {
		const contact = await getContactById(input.id);
		if (!contact) {
			throw new ORPCError("NOT_FOUND");
		}
		return contact;
	});

export const listContactsByHotelRoute = protectedProcedure
	.route({
		method: "GET",
		path: "/hotels/{hotelId}/contacts",
		summary: "List contacts for a hotel",
		tags: ["Contact"],
	})
	.input(ListContactsByHotelInputSchema)
	.output(ContactSchema.array())
	.handler(async ({ input }) => {
		return listContactsByHotelId({
			hotelId: input.hotelId,
			cursor: input.cursor ?? undefined,
			take: input.take ?? 20,
		});
	});

export const contactRouter = {
	create: createContactRoute,
	get: getContactRoute,
	listByHotel: listContactsByHotelRoute,
};
