import { z } from "zod";

// ─── Constants ──────────────────────────────────────────────────────

export const LIST_SORT_DIRECTIONS = ["asc", "desc"] as const;

export const STRING_FILTER_OPERATORS = [
	"contains",
	"startsWith",
	"endsWith",
	"equal",
	"in",
	"notIn",
] as const;

export const SCALAR_FILTER_OPERATORS = [
	"equal",
	"gt",
	"gte",
	"lt",
	"lte",
	"in",
	"notIn",
] as const;

export const BOOLEAN_FILTER_OPERATORS = ["equal"] as const;

// ─── Public types ───────────────────────────────────────────────────

export type SortDirection = (typeof LIST_SORT_DIRECTIONS)[number];
export type StringFilterOperator = (typeof STRING_FILTER_OPERATORS)[number];
export type ScalarFilterOperator = (typeof SCALAR_FILTER_OPERATORS)[number];
export type BooleanFilterOperator = (typeof BOOLEAN_FILTER_OPERATORS)[number];

// ─── Deep key utilities ─────────────────────────────────────────────

type Primitive = string | number | bigint | boolean | Date | null | undefined;
type NonEmpty<T> = readonly [T, ...T[]];
type AnyOperator =
	| StringFilterOperator
	| ScalarFilterOperator
	| BooleanFilterOperator;

/** All dot-notation paths in T (max depth 5, skips arrays & index signatures) */
export type DeepKeys<
	T,
	Depth extends readonly number[] = [],
> = Depth["length"] extends 5
	? never
	: T extends Primitive
		? never
		: T extends readonly unknown[]
			? never
			: string extends keyof T
				? never
				: {
						[K in keyof T & string]: NonNullable<T[K]> extends Primitive
							? K
							: K | `${K}.${DeepKeys<NonNullable<T[K]>, [...Depth, 0]>}`;
					}[keyof T & string];

/** Resolve the value type at a dot-notation path */
export type DeepValue<
	T,
	P extends string,
> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? DeepValue<NonNullable<T[K]>, Rest>
		: never
	: P extends keyof T
		? T[P]
		: never;

/** Pick the allowed operators for a value type */
export type OperatorsFor<V> =
	NonNullable<V> extends string
		? StringFilterOperator
		: NonNullable<V> extends number | bigint | Date
			? ScalarFilterOperator
			: NonNullable<V> extends boolean
				? BooleanFilterOperator
				: never;

// ─── Filter definition types ────────────────────────────────────────

/** Definition for a single filter field */
export type FilterDef<V> = {
	schema: z.ZodTypeAny;
	operators: NonEmpty<OperatorsFor<V>>;
};

/** Map of filter definitions constrained to valid DeepKeys of T */
export type FilterDefs<T> = {
	[K in DeepKeys<T>]?: FilterDef<DeepValue<T, K>>;
};

// ─── Zod shape mapped types ─────────────────────────────────────────

type OperatorZod<S extends z.ZodTypeAny, Op extends AnyOperator> = Op extends
	| "in"
	| "notIn"
	? z.ZodArray<S>
	: S;

type FilterFieldZodShape<
	S extends z.ZodTypeAny,
	Ops extends readonly AnyOperator[],
> = {
	[K in Ops[number]]: z.ZodOptional<OperatorZod<S, Extract<K, AnyOperator>>>;
};

type FiltersZodShape<TDefs> = {
	[K in keyof TDefs]: TDefs[K] extends {
		schema: infer S extends z.ZodTypeAny;
		operators: infer Ops extends readonly AnyOperator[];
	}
		? z.ZodOptional<z.ZodObject<FilterFieldZodShape<S, Ops>>>
		: never;
};

// ─── Runtime builders ───────────────────────────────────────────────

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

function buildFiltersSchema<TDefs>(defs: TDefs | undefined) {
	const shape: Record<string, z.ZodTypeAny> = {};
	if (defs) {
		for (const [key, def] of Object.entries(
			defs as Record<
				string,
				{ schema: z.ZodTypeAny; operators: readonly string[] }
			>,
		)) {
			if (def) {
				shape[key] = buildFilterField(def).optional();
			}
		}
	}
	return z
		.object(shape as FiltersZodShape<NonNullable<TDefs>>)
		.default({} as never);
}

// ─── Main export ────────────────────────────────────────────────────

export function createListSchemaFor<T extends object>() {
	return <
		const TSortFields extends NonEmpty<DeepKeys<T>>,
		const TFilters extends FilterDefs<T> = Record<never, never>,
	>(config: {
		sort: {
			fields: TSortFields;
			default: { field: TSortFields[number]; direction: SortDirection };
		};
		filters?: TFilters;
		pagination?: {
			defaultPage?: number;
			defaultLimit?: number;
			maxLimit?: number;
		};
	}) => {
		const defaultPage = config.pagination?.defaultPage ?? 1;
		const maxLimit = config.pagination?.maxLimit ?? 100;
		const defaultLimit = config.pagination?.defaultLimit ?? 20;

		return z
			.object({
				sort: z
					.object({
						field: z.enum(config.sort.fields),
						direction: z
							.enum(LIST_SORT_DIRECTIONS)
							.default(config.sort.default.direction),
					})
					.default({
						field: config.sort.default.field,
						direction: config.sort.default.direction,
					}),
				page: z.coerce.number().int().min(1).default(defaultPage),
				limit: z.coerce
					.number()
					.int()
					.min(1)
					.max(maxLimit)
					.default(defaultLimit),
				filters: buildFiltersSchema<TFilters>(config.filters),
			})
			.transform((input) => ({
				...input,
				take: input.limit,
				skip: (input.page - 1) * input.limit,
			}));
	};
}
