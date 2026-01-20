import * as z from "zod";
import { AmenitySchema } from "../amenity/amenity.schemas";
import { ContactSchema } from "../contact/contact.schemas";
import {
	CreateHotelImageInputSchema,
	HotelImageSchema,
} from "../hotel-image/hotel-image.schemas";
import { ReviewSchema } from "../review/review.schemas";
import { RoomSchema } from "../room/room.schemas";

export const HotelSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	address: z.string().min(1),
	mapLink: z.string().min(1),
	isArchived: z.boolean(),
	latitude: z.string().min(1),
	longitude: z.string().min(1),
	bankAccount: z
		.object({
			id: z.string().min(1),
			iban: z.string().min(1),
			bic: z.string().min(1),
			bankName: z.string().min(1),
			accountHolderName: z.string().min(1),
			createdAt: z.date(),
			updatedAt: z.date(),
		})
		.nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	amenities: z.array(AmenitySchema),
	images: z.array(HotelImageSchema),
	reviews: z.array(ReviewSchema),
	rating: z.number(),
	isUserFavorite: z.boolean(),
	startingPrice: z.number(),
	contacts: z.array(ContactSchema),
	rooms: z.array(RoomSchema),
});

export type Hotel = z.infer<typeof HotelSchema>;

export const GetHotelInputSchema = z.object({
	id: z.string(),
});

export const ListHotelsInputSchema = z.object({
	cursor: z.string().optional(),
	take: z.coerce.number().int().min(1).max(100).optional(),
});

export const BankAccountInputSchema = z.object({
	iban: z.string().min(1),
	bic: z.string().min(1),
	bankName: z.string().min(1),
	accountHolderName: z.string().min(1),
});

export const CreateHotelInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	address: z.string().min(1),
	mapLink: z.string().min(1),
	isArchived: z.boolean().optional(),
	latitude: z.string().min(1),
	longitude: z.string().min(1),
	amenityIds: z.array(z.string().min(1)).optional(),
	bankAccount: BankAccountInputSchema.optional(),
	images: z.array(CreateHotelImageInputSchema).optional(),
});

export const UpdateHotelInputSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	address: z.string().min(1).optional(),
	mapLink: z.string().min(1).optional(),
	latitude: z.string().min(1).optional(),
	longitude: z.string().min(1).optional(),
	// Full list of amenity ids to associate with the hotel.
	amenityIds: z.array(z.string().min(1)).optional(),
	bankAccount: BankAccountInputSchema.optional(),
	imagesToCreate: z.array(CreateHotelImageInputSchema).optional(),
});

export const ToggleHotelArchivedInputSchema = z.object({
	id: z.string().min(1),
});

export const DeleteHotelInputSchema = z.object({
	id: z.string().min(1),
});

export type CreateHotelInput = z.infer<typeof CreateHotelInputSchema>;
export type GetHotelInput = z.infer<typeof GetHotelInputSchema>;
export type ListHotelsInput = z.infer<typeof ListHotelsInputSchema>;
export type UpdateHotelInput = z.infer<typeof UpdateHotelInputSchema>;
export type ToggleHotelArchivedInput = z.infer<
	typeof ToggleHotelArchivedInputSchema
>;
export type DeleteHotelInput = z.infer<typeof DeleteHotelInputSchema>;
