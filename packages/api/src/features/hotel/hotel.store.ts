import prisma from "@zanadeal/db";
import { mapHotelDbToSchema } from "./hotel.mapper";
import type {
	CreateHotelInput,
	Hotel,
	ToggleHotelArchivedInput,
	UpdateHotelInput,
} from "./hotel.schemas";

type GetHotelOptions = {
	viewerUserId?: string;
};

const hotelIncludeBase = {
	amenities: true,
	images: true,
	reviews: true,
	contacts: true,
	rooms: true,
} as const;

function buildHotelInclude(options: GetHotelOptions) {
	return {
		...hotelIncludeBase,
		...(options.viewerUserId
			? {
					favorites: {
						where: { userId: options.viewerUserId },
						select: { id: true },
					},
				}
			: {}),
	};
}

export async function createHotel(input: CreateHotelInput): Promise<Hotel> {
	const full = await prisma.hotel.create({
		data: {
			name: input.name,
			description: input.description,
			address: input.address,
			mapLink: input.mapLink,
			isArchived: input.isArchived ?? false,
			latitude: input.latitude,
			longitude: input.longitude,
			amenities: input.amenityIds?.length
				? {
						connect: input.amenityIds.map((id) => ({ id })),
					}
				: undefined,
			images: input.images?.length
				? {
						create: input.images.map((img) => ({
							url: img.url,
							publicId: img.publicId,
						})),
					}
				: undefined,
		},
		include: hotelIncludeBase,
	});

	return await mapHotelDbToSchema(full);
}

export async function getHotelById(
	id: string,
	options: GetHotelOptions = {},
): Promise<Hotel | null> {
	const hotel = await prisma.hotel.findUnique({
		where: { id },
		include: buildHotelInclude(options),
	});

	return hotel
		? await mapHotelDbToSchema(hotel, {
				viewerUserId: options.viewerUserId,
			})
		: null;
}

export async function updateHotel(
	input: UpdateHotelInput,
	options: GetHotelOptions = {},
): Promise<Hotel | null> {
	let updatedId: string;
	try {
		const updated = await prisma.hotel.update({
			where: { id: input.id },
			data: {
				name: input.name,
				description: input.description,
				address: input.address,
				mapLink: input.mapLink,
				latitude: input.latitude,
				longitude: input.longitude,
				amenities: input.amenityIds
					? {
							set: input.amenityIds.map((id) => ({ id })),
						}
					: undefined,
				images: input.imagesToCreate?.length
					? {
							create: input.imagesToCreate.map((img) => ({
								url: img.url,
								publicId: img.publicId,
							})),
						}
					: undefined,
			},
			select: { id: true },
		});
		updatedId = updated.id;
	} catch (error) {
		if ((error as { code?: string } | null)?.code === "P2025") {
			return null;
		}
		throw error;
	}

	const full = await prisma.hotel.findUnique({
		where: { id: updatedId },
		include: buildHotelInclude(options),
	});

	return full
		? await mapHotelDbToSchema(full, { viewerUserId: options.viewerUserId })
		: null;
}

export async function toggleArchived(
	input: ToggleHotelArchivedInput,
	options: GetHotelOptions = {},
): Promise<Hotel | null> {
	const full = await prisma.$transaction(async (tx) => {
		const current = await tx.hotel.findUnique({
			where: { id: input.id },
			select: { isArchived: true },
		});
		if (!current) return null;

		await tx.hotel.update({
			where: { id: input.id },
			data: { isArchived: !current.isArchived },
		});

		return tx.hotel.findUnique({
			where: { id: input.id },
			include: buildHotelInclude(options),
		});
	});

	return full
		? await mapHotelDbToSchema(full, { viewerUserId: options.viewerUserId })
		: null;
}
