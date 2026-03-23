import prisma from "@zanadeal/db";
import type { Prisma, Terms } from "../../../../db/prisma/generated/client";
import type {
	DeleteTermsInput,
	UpsertTermsComputedInput,
} from "./schemas/terms-schemas";

export async function createTerm(
	input: UpsertTermsComputedInput,
): Promise<Terms> {
	return await prisma.terms.create({
		data: input,
	});
}

export async function updateTerm(
	id: string,
	input: Partial<UpsertTermsComputedInput>,
): Promise<Terms> {
	return await prisma.terms.update({
		where: { id },
		data: input,
	});
}

export async function getTermById(id: string): Promise<Terms | null> {
	return await prisma.terms.findUnique({
		where: { id },
	});
}

export async function deleteTerm(input: DeleteTermsInput): Promise<Terms> {
	return await prisma.terms.delete({
		where: {
			id: input.id,
		},
	});
}

export async function listTermsFromDb(params: {
	where?: Prisma.TermsWhereInput;
	orderBy?:
		| Prisma.TermsOrderByWithRelationInput
		| Prisma.TermsOrderByWithRelationInput[];
	take?: number;
	skip?: number;
}): Promise<Terms[]> {
	return await prisma.terms.findMany({
		orderBy: params.orderBy,
		take: params.take,
		skip: params.skip,
		where: params.where,
	});
}
