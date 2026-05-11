import { ORPCError } from "@orpc/server";
import type { Prisma } from "../../../../db/prisma/generated/client";
import type { ContactMessageStatus as ContactMessageStatusValue } from "../../../../db/prisma/generated/enums";
import type { UserComputed } from "../user";
import type { ContactMessageDB } from "./contact-message.store";
import type { CreateContactMessageInput } from "./schemas/contact-message.schemas";

type ContactMessageSender = Pick<
	UserComputed,
	"id" | "firstName" | "lastName" | "email"
>;

function compactWhitespace(value: string) {
	return value.trim().replace(/\s+/g, " ");
}

export function isContactMessageSpam(
	input: Pick<CreateContactMessageInput, "website">,
) {
	return Boolean(input.website?.trim());
}

export function buildContactMessageCreateData(
	input: CreateContactMessageInput,
	user: ContactMessageSender | null | undefined,
): Prisma.ContactMessageCreateInput {
	const subject = compactWhitespace(input.subject);
	const message = input.message.trim();

	if (user) {
		return {
			name: compactWhitespace(`${user.firstName} ${user.lastName}`),
			email: user.email.trim().toLowerCase(),
			subject,
			message,
			user: { connect: { id: user.id } },
		};
	}

	if (!input.name?.trim() || !input.email?.trim()) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Name and email are required for anonymous contact messages.",
		});
	}

	return {
		name: compactWhitespace(input.name),
		email: input.email.trim().toLowerCase(),
		subject,
		message,
	};
}

export function buildContactMessageStatusUpdate(
	message: Pick<ContactMessageDB, "readAt" | "resolvedAt">,
	status: ContactMessageStatusValue,
	now = new Date(),
): Prisma.ContactMessageUpdateInput {
	if (status === "RESOLVED") {
		return {
			status,
			readAt: message.readAt ?? now,
			resolvedAt: message.resolvedAt ?? now,
		};
	}

	return {
		status,
		readAt: message.readAt ?? now,
	};
}
