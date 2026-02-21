import prisma from "@zanadeal/db";
import type { Terms } from "../../../../db/prisma/generated/client";
import type {
	DeleteTermsInput,
	GetTermsInput,
	ListTermsInput,
	UpsertTermsComputedInput,
} from "./terms-schemas";

export async function createTerm(
	input: UpsertTermsComputedInput,
): Promise<Terms> {
	return await prisma.terms.create({
		data: input,
	});
}

export async function getTerm(input: GetTermsInput): Promise<Terms | null> {
	return await prisma.terms.findFirst({
		where: {
			id: input.id,
		},
	});
}

export async function deleteTerm(input: DeleteTermsInput): Promise<Terms> {
	return await prisma.terms.delete({
		where: {
			id: input.id,
		},
	});
}

export async function listTerms(input: ListTermsInput): Promise<Terms[]> {
	return await prisma.terms.findMany({
		take: input.take,
		...(input.cursor
			? {
					cursor: { id: input.cursor },
					skip: 1,
				}
			: {}),
		orderBy: input.orderBy,
		where: {
			type: input.type,
		},
	});
}
