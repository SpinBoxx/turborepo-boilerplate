import { z } from "zod";

export type PaginatedResult<TItem> = {
	items: TItem[];
	total: number;
	page: number;
	limit: number;
	pageCount: number;
};

export function createPaginatedResultSchema<TItem extends z.ZodTypeAny>(
	itemSchema: TItem,
) {
	return z.object({
		items: z.array(itemSchema),
		total: z.number().int().min(0),
		page: z.number().int().min(1),
		limit: z.number().int().min(1),
		pageCount: z.number().int().min(0),
	});
}

export function toPaginatedResult<TItem>(
	items: TItem[],
	page: number,
	limit: number,
): PaginatedResult<TItem> {
	const total = items.length;
	const start = (page - 1) * limit;
	const pagedItems = items.slice(start, start + limit);

	return {
		items: pagedItems,
		total,
		page,
		limit,
		pageCount: Math.ceil(total / limit),
	};
}
