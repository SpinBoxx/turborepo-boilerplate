import { describe, expect, it } from "vitest";
import { getLocalizedRoomDescription } from "./room-description.service";

const translations = {
	fr: { description: "Chambre calme" },
	en: { description: "Quiet room" },
	mg: { description: "Efitra mangina" },
};

describe("getLocalizedRoomDescription", () => {
	it("returns the room description matching the current locale", () => {
		expect(getLocalizedRoomDescription(translations, "en")).toBe("Quiet room");
		expect(getLocalizedRoomDescription(translations, "mg")).toBe(
			"Efitra mangina",
		);
	});
});
