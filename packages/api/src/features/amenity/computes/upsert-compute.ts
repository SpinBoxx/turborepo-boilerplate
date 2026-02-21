import type {
	UpsertAmenityComputedInput,
	UpsertAmenityInput,
} from "../amenity.schemas";

const computeAmenityTranslations = (
	translations: UpsertAmenityInput["translations"],
): UpsertAmenityComputedInput["translations"] => {
	return Object.fromEntries(
		translations.map(({ locale, ...translation }) => [locale, translation]),
	) as UpsertAmenityComputedInput["translations"];
};

// Create: tous les champs requis → retour complet
export async function computeUpsertAmenityInput(
	input: UpsertAmenityInput,
): Promise<UpsertAmenityComputedInput>;

// Update: champs partiels + id → retour partiel
export async function computeUpsertAmenityInput(
	input: Partial<UpsertAmenityInput> & { id: string },
): Promise<Partial<UpsertAmenityComputedInput> & { id: string }>;

export async function computeUpsertAmenityInput(
	input: UpsertAmenityInput | (Partial<UpsertAmenityInput> & { id: string }),
): Promise<
	| UpsertAmenityComputedInput
	| (Partial<UpsertAmenityComputedInput> & { id: string })
> {
	const { translations, ...amenityData } = input;

	const result: Record<string, unknown> = { ...amenityData };

	if (translations !== undefined) {
		result.translations = computeAmenityTranslations(translations);
	}

	return result as UpsertAmenityComputedInput;
}
