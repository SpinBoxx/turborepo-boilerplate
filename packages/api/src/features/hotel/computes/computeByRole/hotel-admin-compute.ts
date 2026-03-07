import type { UserComputed } from "../../../user";
import type { HotelDB } from "../../hotel.store";
import {
	type HotelAdminComputed,
	HotelAdminComputedSchema,
} from "../../schemas/hotel.schema";
import { computeHotelFull } from "../../services/hotel.service";

export const hotelAdminCompute = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
): Promise<HotelAdminComputed> => {
	const computed = await computeHotelFull(hotel, user);
	return HotelAdminComputedSchema.parse(computed);
};
