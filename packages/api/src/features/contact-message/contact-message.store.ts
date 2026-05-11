import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";
import type { ListContactMessagesParsedInput } from "./schemas/contact-message.schemas";

const contactMessageInclude = {} satisfies Prisma.ContactMessageInclude;
export type ContactMessageDB = Prisma.ContactMessageGetPayload<{
	include: typeof contactMessageInclude;
}>;

export async function createContactMessage(
	data: Prisma.ContactMessageCreateInput,
): Promise<ContactMessageDB> {
	return await prisma.contactMessage.create({
		data,
		include: contactMessageInclude,
	});
}

export async function listContactMessages(
	input: ListContactMessagesParsedInput,
): Promise<ContactMessageDB[]> {
	return await prisma.contactMessage.findMany({
		orderBy: { [input.sort.field]: input.sort.direction },
		take: input.take,
		skip: input.skip,
		include: contactMessageInclude,
	});
}

export async function getContactMessageById(
	id: string,
): Promise<ContactMessageDB | null> {
	return await prisma.contactMessage.findUnique({
		where: { id },
		include: contactMessageInclude,
	});
}

export async function updateContactMessageStatus(
	id: string,
	data: Prisma.ContactMessageUpdateInput,
): Promise<ContactMessageDB> {
	return await prisma.contactMessage.update({
		where: { id },
		data,
		include: contactMessageInclude,
	});
}

export async function deleteContactMessage(
	id: string,
): Promise<ContactMessageDB> {
	return await prisma.contactMessage.delete({
		where: { id },
		include: contactMessageInclude,
	});
}
