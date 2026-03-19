import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
	applyComputedFilters,
	applyComputedSort,
	buildHybridListExecutionPlan,
	createHybridListSchemaFor,
} from "./hybrid-list";
import { toPaginatedResult } from "./paginated-result";

describe("hybrid listing helpers", () => {
	const schema = createHybridListSchemaFor<
		{ name: string; updatedAt: Date },
		{ name: string; updatedAt: Date; startingPrice: number; rating: number }
	>()({
		sort: {
			default: {
				field: "updatedAt",
				direction: "desc",
			},
			fields: {
				name: { stage: "db" },
				updatedAt: { stage: "db" },
				startingPrice: { stage: "computed" },
				rating: { stage: "computed" },
			},
		},
		filters: {
			name: {
				stage: "db",
				schema: z.string(),
				operators: ["contains", "equal"],
			},
			startingPrice: {
				stage: "computed",
				schema: z.number(),
				operators: ["gte", "lte"],
			},
		},
		pagination: {
			defaultLimit: 12,
			maxLimit: 50,
		},
	});

	it("builds an execution plan that splits db and computed operators", () => {
		const input = schema.parse({
			sort: {
				field: "startingPrice",
				direction: "asc",
			},
			filters: {
				name: {
					contains: "spa",
				},
				startingPrice: {
					gte: 120,
				},
			},
			page: 2,
		});

		const plan = buildHybridListExecutionPlan(input, {
			sort: {
				default: {
					field: "updatedAt",
					direction: "desc",
				},
				fields: {
					name: { stage: "db" },
					updatedAt: { stage: "db" },
					startingPrice: { stage: "computed" },
					rating: { stage: "computed" },
				},
			},
			filters: {
				name: {
					stage: "db",
					schema: z.string(),
					operators: ["contains", "equal"],
				},
				startingPrice: {
					stage: "computed",
					schema: z.number(),
					operators: ["gte", "lte"],
				},
			},
		});

		expect(plan.db.filters).toEqual({
			name: {
				contains: "spa",
			},
		});
		expect(plan.computed.filters).toEqual({
			startingPrice: {
				gte: 120,
			},
		});
		expect(plan.db.sort).toBeUndefined();
		expect(plan.computed.sort).toEqual({
			field: "startingPrice",
			direction: "asc",
		});
		expect(plan.execution.needsPostCompute).toBe(true);
		expect(plan.pagination.skip).toBe(12);
	});

	it("filters, sorts and paginates computed items", () => {
		const items = [
			{ name: "B", startingPrice: 200, rating: 4.2 },
			{ name: "A", startingPrice: 100, rating: 4.8 },
			{ name: "C", startingPrice: 150, rating: 3.9 },
		];

		const filtered = applyComputedFilters(items, {
			startingPrice: {
				gte: 120,
			},
		});
		const sorted = applyComputedSort(filtered, {
			field: "startingPrice",
			direction: "asc",
		});
		const paginated = toPaginatedResult(sorted, 1, 1);

		expect(filtered).toHaveLength(2);
		expect(sorted.map((item) => item.name)).toEqual(["C", "B"]);
		expect(paginated).toEqual({
			items: [{ name: "C", startingPrice: 150, rating: 3.9 }],
			total: 2,
			page: 1,
			limit: 1,
			pageCount: 2,
		});
	});
});
