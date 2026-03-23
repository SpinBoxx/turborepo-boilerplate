import { useQuery } from "@tanstack/react-query";
import type { ListTermsInput } from "@zanadeal/api/features/terms";
import { listTerms } from "./terms.api";

export function termsKeys() {
	return {
		all: ["terms"] as const,
		list: (input: ListTermsInput) => ["terms", "list", input] as const,
		byId: (id: string) => ["terms", "byId", id] as const,
	};
}

export function useTerms(input: ListTermsInput) {
	return useQuery({
		queryKey: termsKeys().list(input),
		queryFn: () => listTerms(input),
	});
}
