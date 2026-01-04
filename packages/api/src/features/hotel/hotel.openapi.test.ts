import { createServer } from "node:http";
import { OpenAPIHandler } from "@orpc/openapi/node";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
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
					return created;
				},
				findUnique: async ({ where }: { where: { id: string } }) => {
					return hotels.get(where.id) ?? null;
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
			isArchived: false,
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
});
