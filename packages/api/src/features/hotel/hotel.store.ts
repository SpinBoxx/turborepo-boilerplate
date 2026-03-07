import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";
import type {
	DeleteHotelInput,
	ListHotelsInput,
	UpsertHotelComputedInput,
} from "./schemas/hotel.schema";

const hotelInclude = {
	amenities: true,
	images: true,
	reviews: true,
	contacts: true,
	rooms: {
		include: {
			images: true,
			amenities: true,
			prices: true,
			hotel: true,
		},
	},
	bankAccount: true,
	favorites: true,
} satisfies Prisma.HotelInclude;

export type HotelDB = Prisma.HotelGetPayload<{
	include: typeof hotelInclude;
}>;

export async function getHotel(id: string): Promise<HotelDB | null> {
	return await prisma.hotel.findUnique({
		where: { id },
		include: hotelInclude,
	});
}

export async function listHotels(input: ListHotelsInput): Promise<HotelDB[]> {
	return await prisma.hotel.findMany({
		orderBy: { [input.sort.field]: input.sort.direction },
		take: input.take,
		skip: input.skip,
		where: {
			name: input.filters.name?.contains
				? { contains: input.filters.name.contains, mode: "insensitive" }
				: undefined,
			updatedAt: {
				gte: input.filters.updatedAt?.gte,
				lte: input.filters.updatedAt?.lte,
			},
		},
		include: hotelInclude,
	});
}

export async function createHotel(input: UpsertHotelComputedInput) {
	const { amenityIds, bankAccount, images, ...hotelData } = input;
	return await prisma.hotel.create({
		data: {
			...hotelData,
			amenities: {
				connect: amenityIds?.map((id) => ({ id })),
			},
			bankAccount: bankAccount
				? {
						create: { ...bankAccount },
					}
				: undefined,
			images: {
				create: images?.map((img) => ({
					url: img.url,
					publicId: img.publicId,
				})),
			},
		},
		include: hotelInclude,
	});
}

export async function updateHotel(
	id: string,
	input: Partial<UpsertHotelComputedInput>,
) {
	const { amenityIds, bankAccount, images, ...hotelData } = input;

	return await prisma.hotel.update({
		where: { id },
		data: {
			...hotelData,
			amenities: {
				set: amenityIds?.map((id) => ({ id })),
			},
			bankAccount: bankAccount
				? {
						upsert: {
							create: { ...bankAccount },
							update: { ...bankAccount },
						},
					}
				: undefined,
			images: images
				? {
						deleteMany: {},
						create: images?.map((img) => ({
							url: img.url,
							publicId: img.publicId,
						})),
					}
				: undefined,
		},
		include: hotelInclude,
	});
}

export async function deleteHotel(input: DeleteHotelInput) {
	return await prisma.hotel.delete({
		where: { id: input.id },
		include: hotelInclude,
	});
}
