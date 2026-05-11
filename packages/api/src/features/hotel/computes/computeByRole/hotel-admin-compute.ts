import type { UserComputed } from "../../../user";
import type { HotelDB } from "../../hotel.store";
import {
	type HotelAdminComputed,
	HotelAdminComputedSchema,
} from "../../schemas/hotel.schema";
import {
	type HotelComputeOptions,
	computeHotelFull,
} from "../../services/hotel.service";

export const hotelAdminCompute = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
	options?: HotelComputeOptions,
): Promise<HotelAdminComputed> => {
	const computed = await computeHotelFull(hotel, user, options);
	return HotelAdminComputedSchema.parse(computed);
};
