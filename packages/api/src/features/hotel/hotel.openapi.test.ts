import { createServer } from "node:http";
import { OpenAPIHandler } from "@orpc/openapi/node";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Role } from "../../../../db/prisma/generated/enums";
import type { Context } from "../../context";
import { appRouter } from "../../routers/index";

vi.mock("@zanadeal/db", () => {
	let nextId = 1;
	type DbHotel = {
		id: string;
		name: string;
		description: string;
		address: string;
		mapLink: string;
		isArchived: boolean;
		latitude: string;
		longitude: string;
		createdAt: Date;
		updatedAt: Date;
		amenities: unknown[];
		images: unknown[];
		reviews: unknown[];
		contacts: unknown[];
		rooms: Array<{ price: number; promoPrice: number }>;
	};

	const hotels = new Map<string, DbHotel>();

	return {
		default: {
			hotel: {
				create: async ({
					data,
				}: {
					data: Omit<
						DbHotel,
						| "id"
						| "createdAt"
						| "updatedAt"
						| "amenities"
						| "images"
						| "reviews"
						| "contacts"
						| "rooms"
					> & {
						isArchived?: boolean;
					};
				}) => {
					const id = String(nextId++);
					const now = new Date("2020-01-01T00:00:00.000Z");
					const created: Omit<
						DbHotel,
						"amenities" | "images" | "reviews" | "contacts" | "rooms"
					> = {
						id,
						name: data.name,
						description: data.description,
						address: data.address,
						mapLink: data.mapLink,
						latitude: data.latitude,
						longitude: data.longitude,
						isArchived: data.isArchived ?? false,
						createdAt: now,
						updatedAt: now,
					};
					hotels.set(id, {
						...created,
						amenities: [],
						images: [],
						reviews: [],
						contacts: [],
						rooms: [],
					});
					return hotels.get(id);
				},
				findUnique: async ({ where }: { where: { id: string } }) => {
					return hotels.get(where.id) ?? null;
				},
				findMany: async ({
					where,
					orderBy,
					take,
					skip,
				}: {
					where?: {
						name?: { contains?: string; equals?: string; mode?: string };
						updatedAt?: { gte?: Date; lte?: Date };
						isArchived?: boolean;
					};
					orderBy?:
						| Array<Record<string, "asc" | "desc">>
						| Record<string, "asc" | "desc">;
					take?: number;
					skip?: number;
				}) => {
					let rows = [...hotels.values()];

					if (where?.isArchived !== undefined) {
						rows = rows.filter(
							(hotel) => hotel.isArchived === where.isArchived,
						);
					}

					if (where?.name?.contains) {
						rows = rows.filter((hotel) =>
							hotel.name
								.toLowerCase()
								.includes(where.name?.contains?.toLowerCase() ?? ""),
						);
					}

					if (where?.name?.equals) {
						rows = rows.filter(
							(hotel) =>
								hotel.name.toLowerCase() === where.name?.equals?.toLowerCase(),
						);
					}

					if (where?.updatedAt?.gte) {
						const { gte } = where.updatedAt;
						rows = rows.filter((hotel) => hotel.updatedAt >= gte);
					}

					if (where?.updatedAt?.lte) {
						const { lte } = where.updatedAt;
						rows = rows.filter((hotel) => hotel.updatedAt <= lte);
					}

					const orderEntries = Array.isArray(orderBy)
						? orderBy
						: orderBy
							? [orderBy]
							: [];

					rows.sort((left, right) => {
						for (const entry of orderEntries) {
							const [field, direction] = Object.entries(entry)[0] ?? [];
							if (!field || !direction) {
								continue;
							}

							const leftValue = left[field as keyof DbHotel];
							const rightValue = right[field as keyof DbHotel];
							if (leftValue === rightValue) {
								continue;
							}

							if (leftValue > rightValue) {
								return direction === "asc" ? 1 : -1;
							}

							return direction === "asc" ? -1 : 1;
						}

						return 0;
					});

					return rows.slice(skip ?? 0, (skip ?? 0) + (take ?? rows.length));
				},
				count: async ({
					where,
				}: {
					where?: {
						isArchived?: boolean;
						name?: { contains?: string; equals?: string; mode?: string };
						updatedAt?: { gte?: Date; lte?: Date };
					};
				}) => {
					let rows = [...hotels.values()];

					if (where?.isArchived !== undefined) {
						rows = rows.filter(
							(hotel) => hotel.isArchived === where.isArchived,
						);
					}

					if (where?.name?.contains) {
						rows = rows.filter((hotel) =>
							hotel.name
								.toLowerCase()
								.includes(where.name?.contains?.toLowerCase() ?? ""),
						);
					}

					if (where?.name?.equals) {
						rows = rows.filter(
							(hotel) =>
								hotel.name.toLowerCase() === where.name?.equals?.toLowerCase(),
						);
					}

					if (where?.updatedAt?.gte) {
						const { gte } = where.updatedAt;
						rows = rows.filter((hotel) => hotel.updatedAt >= gte);
					}

					if (where?.updatedAt?.lte) {
						const { lte } = where.updatedAt;
						rows = rows.filter((hotel) => hotel.updatedAt <= lte);
					}

					return rows.length;
				},
			},
		},
	};
});

function createTestContext(): Context {
	return {
		session: {
			user: {
				id: "test-user",
				roles: [Role.ADMIN],
			},
		},
		logger: undefined,
	} as unknown as Context;
}

type HotelJson = {
	id: string;
	name: string;
	description: string;
	address: string;
	mapLink: string;
	latitude: string;
	longitude: string;
	isArchived: boolean;
	createdAt: string;
	updatedAt: string;
};

async function startOpenApiServer() {
	const handler = new OpenAPIHandler(appRouter);

	const server = createServer(async (req, res) => {
		const { matched } = await handler.handle(req, res, {
			context: createTestContext(),
		});

		if (matched) {
			return;
		}

		res.statusCode = 404;
		res.end("Not Found");
	});

	await new Promise<void>((resolve) => {
		server.listen(0, "127.0.0.1", () => resolve());
	});

	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Failed to bind test server");
	}

	return {
		baseUrl: `http://127.0.0.1:${address.port}`,
		close: () =>
			new Promise<void>((resolve, reject) => {
				server.close((err) => {
					if (err) reject(err);
					else resolve();
				});
			}),
	};
}

describe("hotel OpenAPI routes", () => {
	let baseUrl: string;
	let close: () => Promise<void>;

	beforeEach(async () => {
		if (!baseUrl) {
			const server = await startOpenApiServer();
			baseUrl = server.baseUrl;
			close = server.close;
		}
	});

	afterAll(async () => {
		if (close) {
			await close();
		}
	});

	it("POST /hotels creates, GET /hotels/{id} returns", async () => {
		const createRes = await fetch(`${baseUrl}/hotels`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				name: "Hotel Bidon",
				description: "Un hôtel de test",
				address: "1 rue de Paris",
				mapLink: "https://maps.example/hotel-bidon",
				latitude: "48.8566",
				longitude: "2.3522",
				amenityIds: [],
				images: [],
			}),
		});

		expect(createRes.status).toBe(200);
		const created = (await createRes.json()) as unknown as HotelJson;

		expect(created).toMatchObject({
			id: "1",
			name: "Hotel Bidon",
			description: "Un hôtel de test",
			address: "1 rue de Paris",
			mapLink: "https://maps.example/hotel-bidon",
			latitude: "48.8566",
			longitude: "2.3522",
		});
		expect(typeof created.createdAt).toBe("string");
		expect(typeof created.updatedAt).toBe("string");

		const getRes = await fetch(`${baseUrl}/hotels/1`, {
			method: "GET",
		});

		expect(getRes.status).toBe(200);
		const found = (await getRes.json()) as unknown as HotelJson;
		expect(found).toMatchObject(created);
	});

	it("GET /hotels returns a paginated response", async () => {
		const budgetCreateRes = await fetch(`${baseUrl}/hotels`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				name: "Budget Hotel",
				description: "Budget stay",
				address: "1 Test Street",
				mapLink: "https://maps.example/budget",
				latitude: "0",
				longitude: "0",
				amenityIds: [],
				images: [],
			}),
		});

		const premiumCreateRes = await fetch(`${baseUrl}/hotels`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				name: "Premium Hotel",
				description: "Premium stay",
				address: "2 Test Street",
				mapLink: "https://maps.example/premium",
				latitude: "0",
				longitude: "0",
				amenityIds: [],
				images: [],
			}),
		});

		expect(budgetCreateRes.status).toBe(200);
		expect(premiumCreateRes.status).toBe(200);

		const listRes = await fetch(`${baseUrl}/hotels?page=1&limit=10`, {
			method: "GET",
		});

		expect(listRes.status).toBe(200);
		const payload = (await listRes.json()) as {
			items: Array<{ name: string }>;
			total: number;
			page: number;
			limit: number;
			pageCount: number;
		};

		expect(payload.total).toBeGreaterThanOrEqual(2);
		expect(payload.page).toBe(1);
		expect(payload.limit).toBe(10);
		expect(payload.pageCount).toBeGreaterThanOrEqual(1);
		expect(payload.items.length).toBeGreaterThanOrEqual(2);
		expect(payload.items.map((item) => item.name)).toEqual(
			expect.arrayContaining(["Budget Hotel", "Premium Hotel"]),
		);
	});
});
