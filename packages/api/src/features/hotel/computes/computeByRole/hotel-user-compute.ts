import type { UserComputed } from "../../../user";
import type { HotelDB } from "../../hotel.store";
import {
	type HotelUserComputed,
	HotelUserComputedSchema,
} from "../../schemas/hotel.schema";
import {
	type HotelComputeOptions,
	computeHotelFull,
} from "../../services/hotel.service";

export const hotelUserCompute = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
	options?: HotelComputeOptions,
): Promise<HotelUserComputed> => {
	const computed = await computeHotelFull(hotel, user, options);
	return HotelUserComputedSchema.parse(computed);
};
