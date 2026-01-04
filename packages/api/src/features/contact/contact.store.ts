import prisma from "@zanadeal/db";
import type { Contact, CreateContactInput } from "./contact.schemas";

export async function createContact(
	input: CreateContactInput,
): Promise<Contact> {
	const created = await prisma.contact.create({
		data: {
			email: input.email,
			note: input.note,
			phoneNumber: input.phoneNumber ?? null,
			name: input.name,
			hotelId: input.hotelId,
		},
	});

	return created;
}

export async function getContactById(id: string): Promise<Contact | null> {
	return prisma.contact.findUnique({
		where: { id },
	});
}

export async function listContactsByHotelId(options: {
	hotelId: string;
	cursor?: string;
	take: number;
}): Promise<Contact[]> {
	const { hotelId, cursor, take } = options;

	return prisma.contact.findMany({
		where: { hotelId },
		orderBy: { createdAt: "desc" },
		...(cursor
			? {
					cursor: { id: cursor },
					skip: 1,
				}
			: {}),
		take,
	});
}
