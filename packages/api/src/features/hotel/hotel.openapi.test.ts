import { OpenAPIHandler } from "@orpc/openapi/node";
import { createServer } from "node:http";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { appRouter } from "../../routers/index";
import { resetHotelStore } from "./hotel.store";

function createTestContext() {
	return {
		session: {
			user: {
				id: "test-user",
			},
		},
	} as any;
}

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
		resetHotelStore();
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
				city: "Paris",
			}),
		});

		expect(createRes.status).toBe(200);
		const created = (await createRes.json()) as {
			id: number;
			name: string;
			city: string;
		};

		expect(created).toEqual({
			id: 1,
			name: "Hotel Bidon",
			city: "Paris",
		});

		const getRes = await fetch(`${baseUrl}/hotels/1`, {
			method: "GET",
		});

		expect(getRes.status).toBe(200);
		const found = (await getRes.json()) as {
			id: number;
			name: string;
			city: string;
		};

		expect(found).toEqual(created);
	});
});
