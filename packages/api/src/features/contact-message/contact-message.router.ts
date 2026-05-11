import { ORPCError } from "@orpc/server";
import { adminProcedure, publicProcedure } from "../../index";
import {
	buildContactMessageCreateData,
	buildContactMessageStatusUpdate,
	isContactMessageSpam,
} from "./contact-message.service";
import {
	createContactMessage,
	deleteContactMessage,
	getContactMessageById,
	listContactMessages,
	updateContactMessageStatus,
} from "./contact-message.store";
import {
	ContactMessageSchema,
	CreateContactMessageInputSchema,
	CreateContactMessageOutputSchema,
	DeleteContactMessageInputSchema,
	DeleteContactMessageOutputSchema,
	ListContactMessagesInputSchema,
	UpdateContactMessageStatusInputSchema,
} from "./schemas/contact-message.schemas";

export const contactMessageRouter = {
	create: publicProcedure
		.route({
			method: "POST",
			path: "/contact-messages",
			summary: "Create a public contact message",
			tags: ["ContactMessage"],
		})
		.input(CreateContactMessageInputSchema)
		.output(CreateContactMessageOutputSchema)
		.handler(async ({ input, context }) => {
			if (isContactMessageSpam(input)) {
				return { success: true } as const;
			}

			const data = buildContactMessageCreateData(input, context.user);
			await createContactMessage(data);

			return { success: true } as const;
		}),
	list: adminProcedure
		.route({
			method: "GET",
			path: "/contact-messages",
			summary: "List contact messages",
			tags: ["ContactMessage"],
		})
		.input(ListContactMessagesInputSchema)
		.output(ContactMessageSchema.array())
		.handler(async ({ input }) => {
			return await listContactMessages(input);
		}),
	updateStatus: adminProcedure
		.route({
			method: "PATCH",
			path: "/contact-messages/{id}/status",
			summary: "Update a contact message status",
			tags: ["ContactMessage"],
		})
		.input(UpdateContactMessageStatusInputSchema)
		.output(ContactMessageSchema)
		.handler(async ({ input }) => {
			const message = await getContactMessageById(input.id);
			if (!message) {
				throw new ORPCError("NOT_FOUND");
			}

			return await updateContactMessageStatus(
				input.id,
				buildContactMessageStatusUpdate(message, input.status),
			);
		}),
	delete: adminProcedure
		.route({
			method: "DELETE",
			path: "/contact-messages/{id}",
			summary: "Delete a contact message",
			tags: ["ContactMessage"],
		})
		.input(DeleteContactMessageInputSchema)
		.output(DeleteContactMessageOutputSchema)
		.handler(async ({ input }) => {
			const message = await getContactMessageById(input.id);
			if (!message) {
				throw new ORPCError("NOT_FOUND");
			}

			await deleteContactMessage(input.id);

			return { success: true } as const;
		}),
};
