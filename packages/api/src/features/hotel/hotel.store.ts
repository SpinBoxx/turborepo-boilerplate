import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";
import type {
	DeleteHotelInput,
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

export async function listHotelsFromDb(params: {
	where?: Prisma.HotelWhereInput;
	orderBy?:
		| Prisma.HotelOrderByWithRelationInput
		| Prisma.HotelOrderByWithRelationInput[];
	take?: number;
	skip?: number;
}): Promise<HotelDB[]> {
	return await prisma.hotel.findMany({
		orderBy: params.orderBy,
		take: params.take,
		skip: params.skip,
		where: params.where,
		include: hotelInclude,
	});
}

export async function countHotelsFromDb(params: {
	where?: Prisma.HotelWhereInput;
}): Promise<number> {
	return await prisma.hotel.count({
		where: params.where,
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
