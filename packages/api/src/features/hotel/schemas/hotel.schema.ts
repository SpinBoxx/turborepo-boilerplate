import z from "zod";
import { AmenitySchema } from "../../amenity/amenity.schemas";;
import { RoomComputedSchema, RoomSchema } from "../../room/room.schemas";
import {
	BankAccountSchema,
	UpsertBankAccountInputSchema,
} from "./hotel-bank-account";
import {
	CreateHotelImageComputedInputSchema,
	CreateHotelImageInputSchema,
	HotelImageSchema,
} from "./hotel-images.schemas";
import { ReviewSchema } from "./hotel-reviews.schemas";

export const HotelSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	address: z.string().min(1),
	mapLink: z.string().min(1),
	isArchived: z.boolean(),
	latitude: z.string().min(1),
	longitude: z.string().min(1),
	email: z.email().optional().nullable(),
	phoneNumber: z.string().optional().nullable(),
	bankAccount: BankAccountSchema.optional().nullable(), // Hotel may or may not have a bank account associated
	amenities: z.array(AmenitySchema),
	images: z.array(HotelImageSchema),
	reviews: z.array(ReviewSchema).optional(), // Only include reviews for admin view
	rooms: z.array(RoomSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const HotelComputedSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	address: z.string().min(1),
	mapLink: z.string().min(1),
	isArchived: z.boolean(),
	latitude: z.string().min(1),
	longitude: z.string().min(1),
	email: z.email().optional().nullable(),
	phoneNumber: z.string().optional().nullable(),
	bankAccount: BankAccountSchema.optional().nullable(), // Hotel may or may not have a bank account associated
	amenities: z.array(AmenitySchema),
	images: z.array(HotelImageSchema),
	reviews: z.array(ReviewSchema).optional(), // Only include reviews for admin view
	rating: z.number(),
	isUserFavorite: z.boolean(),
	startingPrice: z.number(),
	rooms: z.array(RoomComputedSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const UpsertHotelInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	address: z.string().min(1),
	mapLink: z.string().min(1),
	isArchived: z.boolean().default(false),
	latitude: z.string().min(1),
	longitude: z.string().min(1),
	email: z.email().optional(),
	phoneNumber: z.string().optional(),
	// Full list of amenity ids to associate with the hotel.
	amenityIds: z.array(z.string().min(1)),
	bankAccount: UpsertBankAccountInputSchema.optional(),
	images: z.array(CreateHotelImageInputSchema),
});

export const UpsertHotelComputedInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	address: z.string().min(1),
	mapLink: z.string().min(1),
	isArchived: z.boolean().optional(),
	latitude: z.string().min(1),
	longitude: z.string().min(1),
	email: z.email().optional(),
	phoneNumber: z.string().optional(),
	amenityIds: z.array(z.string().min(1)).optional(),
	bankAccount: UpsertBankAccountInputSchema.optional(),
	images: z.array(CreateHotelImageComputedInputSchema).optional(),
});

export const GetHotelInputSchema = z.object({
	id: z.string(),
});

export const ListHotelsInputSchema = z.object({
	where: z
		.object({
			name: z.string().optional(),
			id: z.string().optional(),
		})
		.optional(),
	orderBy: z
		.object({
			name: z.enum(["asc", "desc"]).optional(),
			createdAt: z.enum(["asc", "desc"]).optional(),
		})
		.optional(),
	cursor: z.string().optional(),
	take: z.coerce.number().int().min(1).max(100).optional(),
});

export const DeleteHotelInputSchema = z.object({
	id: z.string().min(1),
});

export const ToggleIsArchivedHotelInputSchema = z.object({
	id: z.string().min(1),
});

export type Hotel = z.infer<typeof HotelSchema>;
export type HotelComputed = z.infer<typeof HotelComputedSchema>;
export type UpsertHotelInput = z.infer<typeof UpsertHotelInputSchema>;
export type UpsertHotelComputedInput = z.infer<
	typeof UpsertHotelComputedInputSchema
>;
export type GetHotelInput = z.infer<typeof GetHotelInputSchema>;
export type ListHotelsInput = z.infer<typeof ListHotelsInputSchema>;
export type DeleteHotelInput = z.infer<typeof DeleteHotelInputSchema>;
export type ToggleIsArchivedHotelInput = z.infer<
	typeof ToggleIsArchivedHotelInputSchema
>;
