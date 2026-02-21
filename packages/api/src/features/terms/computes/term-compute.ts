import type { Terms as DbTerms } from "../../../../../db/prisma/generated/client";
import type { Terms } from "../terms-schemas";

export const computeTerm = (term: DbTerms): Terms => {
	return {
		id: term.id,
		type: term.type,
		translations: term.translations as Terms["translations"],
		version: term.version,
		createdAt: term.createdAt,
	};
};
