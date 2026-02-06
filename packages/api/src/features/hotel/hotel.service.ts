import type { User } from "../../../../db/prisma/generated/client";
import { getHotel, getHotelAdmin } from "./hotel.store";

export const getHotelByRole = async (
	hotelId: string,
	user: User | undefined,
) => {
	if (!user || !user.roles.includes("ADMIN")) {
		// Regular users can only access non-archived hotels
		return await getHotel(hotelId);
	}
	return await getHotelAdmin(hotelId);
};
