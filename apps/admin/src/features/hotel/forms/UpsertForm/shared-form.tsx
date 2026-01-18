import { formOptions } from "@tanstack/react-form";
import type { Hotel } from "@zanadeal/api/contracts";
import { getHotelUpsertDefaultValues } from "./hotelUpsertForm.defaults";

export const hotelFormOptions = (hotel: Hotel | undefined) =>
	formOptions({
		defaultValues: getHotelUpsertDefaultValues(hotel),
		validators: {},
	});
