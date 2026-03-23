import type { Prisma } from "../../../../db/prisma/generated/client";
import { computeTerm } from "./computes/term-compute";
import type { ListTermsInput, TermsComputed } from "./schemas/terms-schemas";
import { listTermsFromDb } from "./terms.store";

function buildTermsWhere(filters: ListTermsInput["filters"]): Prisma.TermsWhereInput {
	return {
		type: filters.type?.equal,
		version: filters.version?.contains
			? { contains: filters.version.contains, mode: "insensitive" }
			: filters.version?.equal,
	};
}

function buildTermsOrder(
	sort: ListTermsInput["sort"],
): Prisma.TermsOrderByWithRelationInput[] {
	return [{ [sort.field]: sort.direction }, { id: "desc" }];
}

export async function listTerms(
	input: ListTermsInput,
): Promise<TermsComputed[]> {
	const rows = await listTermsFromDb({
		where: buildTermsWhere(input.filters),
		orderBy: buildTermsOrder(input.sort),
		take: input.take,
		skip: input.skip,
	});

	return rows.map(computeTerm);
}