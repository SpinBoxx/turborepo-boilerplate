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
	createdAt: z.date(),
	updatedAt: z.date(),
	amenities: z.array(AmenitySchema),
	images: z.array(HotelImageSchema),
	reviews: z.array(ReviewSchema),
	isUserFavorite: z.boolean(),
	startingPrice: z.number(),
	contacts: z.array(ContactSchema),
	rooms: z.array(RoomSchema),
});

export type Hotel = z.infer<typeof HotelSchema>;

export const GetHotelInputSchema = z.object({
	id: z.string(),
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
	images: z
		.array(CreateHotelImageInputSchema.omit({ hotelId: true }))
		.optional(),
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
	imagesToCreate: z
		.array(CreateHotelImageInputSchema.omit({ hotelId: true }))
		.optional(),
});

export const ToggleHotelArchivedInputSchema = z.object({
	id: z.string().min(1),
});

export type CreateHotelInput = z.infer<typeof CreateHotelInputSchema>;
export type GetHotelInput = z.infer<typeof GetHotelInputSchema>;
export type UpdateHotelInput = z.infer<typeof UpdateHotelInputSchema>;
export type ToggleHotelArchivedInput = z.infer<
	typeof ToggleHotelArchivedInputSchema
>;
