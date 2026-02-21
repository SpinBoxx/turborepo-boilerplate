import type {
	TermsComputed,
	UpsertTermsInput,
} from "@zanadeal/api/features/terms/terms-schemas";

export const getTermInitialValues = (
	term: TermsComputed | null,
): UpsertTermsInput => {
	return {
		type: term?.type ?? "CGU",
		version: term?.version ?? "v1.0",
		translations: Object.entries(term?.translations ?? {}).map(
			([locale, value]) => ({
				locale: locale as UpsertTermsInput["translations"][number]["locale"],
				...value,
			}),
		),
	};
};
