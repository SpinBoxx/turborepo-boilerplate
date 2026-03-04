import prisma from "@zanadeal/db";

ert;
";

import { z } from "zod";
import type { Amenity, } from "../../db/prisma/generated/client";

type Sort<T> = {
	sortableFields: (keyof T)[];
	defaultSort: keyof T;
};

type StringFilterOperator = {
	contains: string;
	startsWith: string;
	endsWith: string;
	equal: string;
	in: string[];
	notIn: string[];
};

type NumberFilterOperator = {
	equal: number;
	in: number[];
	notIn: number[];
	gt: number;
	gte: number;
	lt: number;
	lte: number;
};

type FilterOperators<T> = {
	[K in keyof T]?: T[K] extends string
		? StringFilterOperator
		: T[K] extends number
			? NumberFilterOperator
			: never;
};

type Config<T> = {
	sort: Sort<T>;
	filters?: FilterOperators<T>;
};

export function createListSchema<T>({ filters, sort }: Config<T>) {
	return z.object({
		sort: z
			.record(z.string(), z.enum(["asc", "desc"]))
			.refine(
				(sortObj) => {
					return Object.keys(sortObj).every((key) =>
						sort?.sortableFields.includes(key as any),
					);
				},
				{
					message: `Sort object keys must be one of: ${sort.sortableFields.join(", ")}`,
				},
			)
			.default({ [sort.defaultSort]: "asc" } as Record<string, "asc" | "desc">),
		page: z.number().int().min(1).default(1),
		limit: z.number().int().min(1).max(100).default(20),

		filters: z.object(),
	});
}

const amenyListSchema = createListSchema<Amenity>({
	sort: {
		sortableFields: ["createdAt", "slug"],
		defaultSort: "createdAt",
	},
	filters: {
		slug: {
			contains: "",
		},
	},
});

const _options: z.infer<typeof amenyListSchema> = {
	sort: { createdAt: "asc" },
	page: 1,
	limit: 20,
	filters: {},
};

prisma.amenity.findMany({
	where: {
		slug: {},
	},
});
