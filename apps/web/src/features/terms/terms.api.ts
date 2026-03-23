import type { ListTermsInput } from "@zanadeal/api/features/terms";
import { orpc } from "@/lib/orpc";

export async function listTerms(input: ListTermsInput) {
	const terms = await orpc.terms.list(input);

	return terms.at(0) ?? null;
}
