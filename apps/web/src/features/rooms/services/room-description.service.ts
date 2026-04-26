import type { RoomDescriptionTranslation } from "@zanadeal/api/features/room";
import { getTranslation } from "intlayer";

export function getLocalizedRoomDescription(
	descriptionTranslations: RoomDescriptionTranslation,
	locale: Parameters<typeof getTranslation>[1],
) {
	return getTranslation(descriptionTranslations, locale)?.description ?? "";
}