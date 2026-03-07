import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";
import { createListSchemaFor } from "./utils";

type AmenityListItem = {
	slug: string;
	createdAt: Date;
	rank: number;
	isActive: boolean;
	metadata: {
		label: string;
		hotel: {
			name: string;
		};
	};
};

describe("createListSchema", () => {
	const schema = createListSchemaFor<AmenityListItem>()({
		sort: {
			fields: [
				"createdAt",
				"slug",
				"metadata.label",
				"metadata.hotel.name",
			] as const,
			default: {
				field: "createdAt",
				direction: "desc",
			},
		},
		filters: {
			slug: {
				schema: z.string(),
				operators: ["contains", "equal", "in"] as const,
			},
			createdAt: {
				schema: z.coerce.date(),
				operators: ["gte", "lte"] as const,
			},
			rank: {
				schema: z.number().int(),
				operators: ["gt", "gte", "lt", "lte", "equal"] as const,
			},
			isActive: {
				schema: z.boolean(),
				operators: ["equal"] as const,
			},
			"metadata.label": {
				schema: z.string(),
				operators: ["contains", "equal"] as const,
			},
		},
		pagination: {
			defaultLimit: 12,
			maxLimit: 50,
		},
	});

	it("applique les valeurs par défaut et valide les filtres", () => {
		const parsed = schema.parse({
			page: 2,
			filters: {
				slug: {
					contains: "spa",
					in: ["spa", "pool"],
				},
				rank: {
					gte: 3,
				},
				createdAt: {
					gte: "2024-01-01T00:00:00.000Z",
				},
				isActive: {
					equal: true,
				},
				"metadata.label": {
					contains: "test",
				},
			},
		});

		expect(parsed).toMatchObject({
			sort: {
				field: "createdAt",
				direction: "desc",
			},
			page: 2,
			limit: 12,
			take: 12,
			skip: 12,
			filters: {
				slug: {
					contains: "spa",
					in: ["spa", "pool"],
				},
				rank: {
					gte: 3,
				},
				isActive: {
					equal: true,
				},
				"metadata.label": {
					contains: "test",
				},
			},
		});
		expect(parsed.filters.createdAt?.gte).toBeInstanceOf(Date);
		expect(parsed.filters["metadata.label"]?.contains).toBe("test");
	});

	it("rejette une clé de tri non autorisée", () => {
		const result = schema.safeParse({
			sort: {
				field: "rank",
				direction: "asc",
			},
		});

		expect(result.success).toBe(false);
	});

	it("expose une sortie correctement typée", () => {
		type Output = z.output<typeof schema>;

		expectTypeOf<Output>().toEqualTypeOf<{
			sort: {
				field: "createdAt" | "slug" | "metadata.label" | "metadata.hotel.name";
				direction: "asc" | "desc";
			};
			page: number;
			limit: number;
			take: number;
			skip: number;
			filters: {
				slug?:
					| {
							contains?: string | undefined;
							equal?: string | undefined;
							in?: string[] | undefined;
					  }
					| undefined;
				createdAt?:
					| {
							gte?: Date | undefined;
							lte?: Date | undefined;
					  }
					| undefined;
				rank?:
					| {
							gt?: number | undefined;
							gte?: number | undefined;
							lt?: number | undefined;
							lte?: number | undefined;
							equal?: number | undefined;
					  }
					| undefined;
				isActive?:
					| {
							equal?: boolean | undefined;
					  }
					| undefined;
				"metadata.label"?:
					| {
							contains?: string | undefined;
							equal?: string | undefined;
					  }
					| undefined;
			};
		}>();
	});
});
