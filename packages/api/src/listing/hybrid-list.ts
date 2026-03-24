import { z } from "zod";
import {
	type BooleanFilterOperator,
	LIST_SORT_DIRECTIONS,
	type ScalarFilterOperator,
	type SortDirection,
	type StringFilterOperator,
} from "../utils";

type NonEmpty<T> = readonly [T, ...T[]];
type Primitive = string | number | bigint | boolean | Date | null | undefined;
type AnyFilterOperator =
	| StringFilterOperator
	| ScalarFilterOperator
	| BooleanFilterOperator;

type OperatorZod<
	S extends z.ZodTypeAny,
	Op extends AnyFilterOperator,
> = Op extends "in" | "notIn" ? z.ZodArray<S> : S;

type FilterFieldZodShape<
	S extends z.ZodTypeAny,
	Ops extends readonly AnyFilterOperator[],
> = {
	[K in Ops[number]]: z.ZodOptional<
		OperatorZod<S, Extract<K, AnyFilterOperator>>
	>;
};

type FiltersZodShape<TDefs extends HybridFilterDefs> = {
	[K in keyof TDefs]: TDefs[K] extends {
		schema: infer S extends z.ZodTypeAny;
		operators: infer Ops extends readonly AnyFilterOperator[];
	}
		? z.ZodOptional<z.ZodObject<FilterFieldZodShape<S, Ops>>>
		: never;
};

export type QueryStage = "db" | "computed";

export type HybridSortFieldDef = {
	stage: QueryStage;
};

export type HybridFilterFieldDef<
	S extends z.ZodTypeAny = z.ZodTypeAny,
	Ops extends readonly AnyFilterOperator[] = readonly AnyFilterOperator[],
> = {
	stage: QueryStage;
	schema: S;
	operators: NonEmpty<Ops[number]> | Ops;
};

export type HybridSortFields = Record<string, HybridSortFieldDef>;
export type HybridFilterDefs = Record<string, HybridFilterFieldDef>;

export type HybridListConfig<
	TSortFields extends HybridSortFields = HybridSortFields,
	TFilters extends HybridFilterDefs = HybridFilterDefs,
> = {
	sort: {
		fields: TSortFields;
		default: {
			field: Extract<keyof TSortFields, string>;
			direction: SortDirection;
		};
	};
	filters?: TFilters;
	pagination?: {
		defaultPage?: number;
		defaultLimit?: number;
		maxLimit?: number;
	};
};

export type HybridListInput = {
	sort: {
		field: string;
		direction: SortDirection;
	};
	page: number;
	limit: number;
	take: number;
	skip: number;
	filters: Record<string, Record<string, unknown> | undefined>;
};

export type HybridListExecutionPlan = {
	db: {
		sort?: {
			field: string;
			direction: SortDirection;
		};
		filters: Record<string, Record<string, unknown> | undefined>;
	};
	computed: {
		sort?: {
			field: string;
			direction: SortDirection;
		};
		filters: Record<string, Record<string, unknown> | undefined>;
	};
	pagination: {
		page: number;
		limit: number;
		take: number;
		skip: number;
	};
	execution: {
		needsPostCompute: boolean;
	};
};

function buildFilterField(def: {
	schema: z.ZodTypeAny;
	operators: readonly string[];
}) {
	const shape: Record<string, z.ZodTypeAny> = {};
	for (const op of def.operators) {
		const base =
			op === "in" || op === "notIn" ? z.array(def.schema) : def.schema;
		shape[op] = base.optional();
	}
	return z.object(shape);
}

function buildFiltersSchema<TDefs extends HybridFilterDefs | undefined>(
	defs: TDefs,
) {
	const shape: Record<string, z.ZodTypeAny> = {};
	if (defs) {
		for (const [key, def] of Object.entries(defs)) {
			shape[key] = buildFilterField(def).optional();
		}
	}

	return z
		.object(shape as FiltersZodShape<NonNullable<TDefs>>)
		.default({} as never);
}

export function createHybridListSchemaFor() {
	return <
		const TSortFields extends HybridSortFields,
		const TFilters extends HybridFilterDefs = Record<never, never>,
	>(
		config: HybridListConfig<TSortFields, TFilters>,
	) => {
		const defaultPage = config.pagination?.defaultPage ?? 1;
		const maxLimit = config.pagination?.maxLimit ?? 100;
		const defaultLimit = config.pagination?.defaultLimit ?? 20;
		const sortFieldKeys = Object.keys(config.sort.fields) as [
			Extract<keyof TSortFields, string>,
			...Array<Extract<keyof TSortFields, string>>,
		];

		return z
			.object({
				sort: z
					.object({
						field: z.enum(sortFieldKeys),
						direction: z
							.enum(LIST_SORT_DIRECTIONS)
							.default(config.sort.default.direction),
					})
					.default({
						field: config.sort.default.field,
						direction: config.sort.default.direction,
					})
					.optional(),
				page: z.coerce.number().int().min(1).default(defaultPage).optional(),
				limit: z.coerce
					.number()
					.int()
					.min(1)
					.max(maxLimit)
					.default(defaultLimit)
					.optional(),
				filters: buildFiltersSchema(config.filters).optional(),
			})
			.transform((input) => ({
				...input,
				take: input.limit,
				skip: input.page && input.limit ? (input.page - 1) * input.limit : 0,
			}))
			.optional();
	};
}

export function buildHybridListExecutionPlan<
	TSortFields extends HybridSortFields,
	TFilters extends HybridFilterDefs,
>(
	input: HybridListInput,
	config: HybridListConfig<TSortFields, TFilters>,
): HybridListExecutionPlan {
	const dbFilters: Record<string, Record<string, unknown> | undefined> = {};
	const computedFilters: Record<string, Record<string, unknown> | undefined> =
		{};

	for (const [field, operators] of Object.entries(input.filters ?? {})) {
		if (!operators) {
			continue;
		}

		const definition = config.filters?.[field];
		if (!definition) {
			continue;
		}

		if (definition.stage === "db") {
			dbFilters[field] = operators;
			continue;
		}

		computedFilters[field] = operators;
	}

	const sortDefinition = config.sort.fields[input.sort.field];
	const dbSort = sortDefinition?.stage === "db" ? input.sort : undefined;
	const computedSort =
		sortDefinition?.stage === "computed" ? input.sort : undefined;

	return {
		db: {
			sort: dbSort,
			filters: dbFilters,
		},
		computed: {
			sort: computedSort,
			filters: computedFilters,
		},
		pagination: {
			page: input.page,
			limit: input.limit,
			take: input.take,
			skip: input.skip,
		},
		execution: {
			needsPostCompute:
				computedSort !== undefined || Object.keys(computedFilters).length > 0,
		},
	};
}

function getValueAtPath(value: unknown, path: string): unknown {
	if (!path) {
		return value;
	}

	return path.split(".").reduce<unknown>((currentValue, key) => {
		if (
			currentValue === null ||
			currentValue === undefined ||
			typeof currentValue !== "object"
		) {
			return undefined;
		}

		return (currentValue as Record<string, unknown>)[key];
	}, value);
}

function normalizeComparableValue(value: unknown): Primitive {
	if (value instanceof Date) {
		return value;
	}

	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "bigint" ||
		typeof value === "boolean" ||
		value === null ||
		value === undefined
	) {
		return value;
	}

	return undefined;
}

function isEqual(left: unknown, right: unknown) {
	if (left instanceof Date && right instanceof Date) {
		return left.getTime() === right.getTime();
	}

	return left === right;
}

function compareValues(left: unknown, right: unknown): number {
	const normalizedLeft = normalizeComparableValue(left);
	const normalizedRight = normalizeComparableValue(right);

	if (normalizedLeft === normalizedRight) {
		return 0;
	}

	if (normalizedLeft === undefined || normalizedLeft === null) {
		return 1;
	}

	if (normalizedRight === undefined || normalizedRight === null) {
		return -1;
	}

	if (normalizedLeft instanceof Date && normalizedRight instanceof Date) {
		return normalizedLeft.getTime() - normalizedRight.getTime();
	}

	if (normalizedLeft > normalizedRight) {
		return 1;
	}

	if (normalizedLeft < normalizedRight) {
		return -1;
	}

	return 0;
}

function matchesOperators(
	value: unknown,
	operators: Record<string, unknown>,
): boolean {
	for (const [operator, expectedValue] of Object.entries(operators)) {
		switch (operator) {
			case "contains": {
				if (
					typeof value !== "string" ||
					typeof expectedValue !== "string" ||
					!value.toLowerCase().includes(expectedValue.toLowerCase())
				) {
					return false;
				}
				break;
			}

			case "startsWith": {
				if (
					typeof value !== "string" ||
					typeof expectedValue !== "string" ||
					!value.toLowerCase().startsWith(expectedValue.toLowerCase())
				) {
					return false;
				}
				break;
			}

			case "endsWith": {
				if (
					typeof value !== "string" ||
					typeof expectedValue !== "string" ||
					!value.toLowerCase().endsWith(expectedValue.toLowerCase())
				) {
					return false;
				}
				break;
			}

			case "equal": {
				if (!isEqual(value, expectedValue)) {
					return false;
				}
				break;
			}

			case "in": {
				if (
					!Array.isArray(expectedValue) ||
					!expectedValue.some((item) => isEqual(value, item))
				) {
					return false;
				}
				break;
			}

			case "notIn": {
				if (
					!Array.isArray(expectedValue) ||
					expectedValue.some((item) => isEqual(value, item))
				) {
					return false;
				}
				break;
			}

			case "gt": {
				if (compareValues(value, expectedValue) <= 0) {
					return false;
				}
				break;
			}

			case "gte": {
				if (compareValues(value, expectedValue) < 0) {
					return false;
				}
				break;
			}

			case "lt": {
				if (compareValues(value, expectedValue) >= 0) {
					return false;
				}
				break;
			}

			case "lte": {
				if (compareValues(value, expectedValue) > 0) {
					return false;
				}
				break;
			}

			default:
				return false;
		}
	}

	return true;
}

export function applyComputedFilters<TItem>(
	items: TItem[],
	filters: Record<string, Record<string, unknown> | undefined>,
): TItem[] {
	if (Object.keys(filters).length === 0) {
		return items;
	}

	return items.filter((item) => {
		for (const [field, operators] of Object.entries(filters)) {
			if (!operators) {
				continue;
			}

			const value = getValueAtPath(item, field);
			if (!matchesOperators(value, operators)) {
				return false;
			}
		}

		return true;
	});
}

export function applyComputedSort<TItem>(
	items: TItem[],
	sort?: {
		field: string;
		direction: SortDirection;
	},
): TItem[] {
	if (!sort) {
		return items;
	}

	const directionFactor = sort.direction === "asc" ? 1 : -1;

	return [...items].sort((leftItem, rightItem) => {
		const leftValue = getValueAtPath(leftItem, sort.field);
		const rightValue = getValueAtPath(rightItem, sort.field);
		return compareValues(leftValue, rightValue) * directionFactor;
	});
}
