import type {
	CreateTermsInput,
	DeleteTermsInput,
	GetTermsInput,
	ListTermsInput,
	UpdateTermsInput,
} from "@zanadeal/api/contracts";
import { orpc } from "@/lib/orpc";

export async function getTermById(input: GetTermsInput) {
	return orpc.terms.get({ id: input.id });
}

export async function createTerm(input: CreateTermsInput) {
	return orpc.terms.create(input);
}

export async function updateTerm(input: UpdateTermsInput) {
	return orpc.terms.update(input);
}

export async function listTerms(input: ListTermsInput) {
	return orpc.terms.list(input);
}

export async function deleteTerm(input: DeleteTermsInput) {
	return orpc.terms.delete(input);
}
