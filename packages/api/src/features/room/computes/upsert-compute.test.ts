import { describe, expect, it } from "vitest";
import {
	type UpsertRoomInput,
	UpsertRoomInputSchema,
} from "../schemas/room.schemas";
import { computeUpsertRoomInput } from "./upsert-compute";

function createRoomInput(
	overrides?: Partial<UpsertRoomInput>,
): UpsertRoomInput {
	return {
		hotelId: "hotel_1",
		type: "STANDARD",
		title: "Standard Room",
		descriptionTranslations: [
			{ locale: "fr", description: "Chambre calme" },
			{ locale: "en", description: "Quiet room" },
			{ locale: "mg", description: "Efitra mangina" },
		],
		beds: 1,
		maxGuests: 2,
		baths: 1,
		areaM2: 24,
		quantity: 3,
		prices: [],
		amenityIds: [],
		images: [],
		...overrides,
	};
}

describe("computeUpsertRoomInput", () => {
	it("stores translated descriptions as a locale record", async () => {
		const computed = await computeUpsertRoomInput(createRoomInput());

		expect(computed.descriptionTranslations).toEqual({
			fr: { description: "Chambre calme" },
			en: { description: "Quiet room" },
			mg: { description: "Efitra mangina" },
		});
	});

	it("rejects the removed legacy description field", () => {
		const input = {
			...createRoomInput(),
			description: "Legacy description",
		};
		delete (input as Partial<UpsertRoomInput>).descriptionTranslations;

		expect(UpsertRoomInputSchema.safeParse(input).success).toBe(false);
	});
});
