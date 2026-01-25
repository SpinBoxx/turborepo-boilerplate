import type {
	CreateTermsInput,
	Terms,
	TermsType,
} from "@zanadeal/api/contracts";

export const getInitialTerm = (
	term: Terms | undefined,
	type?: TermsType,
): CreateTermsInput => {
	return term
		? {
				content: term.content,
				type: term.type,
				version: term.version,
			}
		: {
				content: "",
				type: type || "CGU",
				version: "v1.0",
			};
};
