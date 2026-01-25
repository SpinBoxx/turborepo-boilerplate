import prisma from "@zanadeal/db";
import type {
	CreateTermsInput,
	GetTermsInput,
	ListTermsInput,
	Terms,
	UpdateTermsInput,
} from "./terms-schemas";

export async function createTerm(input: CreateTermsInput): Promise<Terms> {
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

export async function updateTerm(input: UpdateTermsInput): Promise<Terms> {
	return await prisma.terms.update({
		where: {
			id: input.id,
		},
		data: input,
	});
}

export async function deleteTerm(input: UpdateTermsInput): Promise<Terms> {
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
