import type {
	UpsertTermsComputedInput,
	UpsertTermsInput,
} from "../terms-schemas";

const computeTermTranslations = (
	translations: UpsertTermsInput["translations"],
): UpsertTermsComputedInput["translations"] => {
	return Object.fromEntries(
		translations.map(({ locale, ...translation }) => [locale, translation]),
	) as UpsertTermsComputedInput["translations"];
};

export async function computeUpsertTermsInput(
	input: UpsertTermsInput,
): Promise<UpsertTermsComputedInput>;

export async function computeUpsertTermsInput(
	input: Partial<UpsertTermsInput> & { id: string },
): Promise<Partial<UpsertTermsComputedInput> & { id: string }>;

export async function computeUpsertTermsInput(
	input: UpsertTermsInput | (Partial<UpsertTermsInput> & { id: string }),
): Promise<
	| UpsertTermsComputedInput
	| (Partial<UpsertTermsComputedInput> & { id: string })
> {
	const { translations, ...termsData } = input;

	const result: Record<string, unknown> = { ...termsData };

	if (translations !== undefined) {
		result.translations = computeTermTranslations(translations);
	}

	return result as UpsertTermsComputedInput;
}
