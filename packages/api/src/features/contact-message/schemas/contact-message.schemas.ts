import * as z from "zod";
import type { ContactMessage } from "../../../../../db/prisma/generated/client";
import { createListSchemaFor } from "../../../utils";

const contactMessageText = z.string().trim();
export const CONTACT_MESSAGE_STATUSES = ["NEW", "READ", "RESOLVED"] as const;

export const ContactMessageStatusSchema = z.enum(CONTACT_MESSAGE_STATUSES);

export const ContactMessageSchema = z.object({
	id: z.string().min(1),
	userId: z.string().nullable(),
	name: z.string().min(1),
	email: z.email(),
	subject: z.string().min(1),
	message: z.string().min(1),
	status: ContactMessageStatusSchema,
	readAt: z.date().nullable(),
	resolvedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateContactMessageInputSchema = z.object({
	name: contactMessageText.max(120).optional(),
	email: contactMessageText.pipe(z.email()).optional(),
	subject: contactMessageText.min(1).max(160),
	message: contactMessageText.min(1).max(4000),
	website: z.string().max(200).optional().default(""),
});

export const CreateContactMessageOutputSchema = z.object({
	success: z.literal(true),
});

export const ListContactMessagesInputSchema =
	createListSchemaFor<ContactMessage>()({
		sort: {
			default: {
				direction: "desc",
				field: "createdAt",
			},
			fields: ["createdAt", "updatedAt", "status"],
		},
		pagination: {
			defaultLimit: 50,
			maxLimit: 100,
		},
	});

export const UpdateContactMessageStatusInputSchema = z.object({
	id: z.string().min(1),
	status: z.enum(["READ", "RESOLVED"]),
});

export const DeleteContactMessageInputSchema = z.object({
	id: z.string().min(1),
});

export const DeleteContactMessageOutputSchema = z.object({
	success: z.literal(true),
});

export type ContactMessageStatusValue = z.infer<
	typeof ContactMessageStatusSchema
>;
export type ContactMessageComputed = z.infer<typeof ContactMessageSchema>;
export type CreateContactMessageInput = z.infer<
	typeof CreateContactMessageInputSchema
>;
export type CreateContactMessageOutput = z.infer<
	typeof CreateContactMessageOutputSchema
>;
export type ListContactMessagesInput = z.input<
	typeof ListContactMessagesInputSchema
>;
export type ListContactMessagesParsedInput = z.infer<
	typeof ListContactMessagesInputSchema
>;
export type UpdateContactMessageStatusInput = z.infer<
	typeof UpdateContactMessageStatusInputSchema
>;
export type DeleteContactMessageInput = z.infer<
	typeof DeleteContactMessageInputSchema
>;
export type DeleteContactMessageOutput = z.infer<
	typeof DeleteContactMessageOutputSchema
>;
