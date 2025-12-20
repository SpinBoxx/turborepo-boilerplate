export class HttpError extends Error {
	status: number;
	body: unknown;

	constructor(message: string, status: number, body: unknown) {
		super(message);
		this.name = "HttpError";
		this.status = status;
		this.body = body;
	}
}

function getApiBaseUrl() {
	return (
		import.meta.env.VITE_API_URL?.toString() ??
		"http://localhost:8080" // apps/server default
	);
}

export async function apiFetch(path: string, init?: RequestInit) {
	const url = new URL(path, getApiBaseUrl());

	const headers = new Headers(init?.headers);
	if (!headers.has("Accept")) headers.set("Accept", "application/json");

	const res = await fetch(url.toString(), {
		...init,
		headers,
		credentials: "include",
	});

	const contentType = res.headers.get("content-type") ?? "";
	const isJson = contentType.includes("application/json");
	const body = isJson ? await res.json().catch(() => null) : await res.text();

	if (!res.ok) {
		throw new HttpError(
			`Request failed: ${res.status} ${res.statusText}`,
			res.status,
			body,
		);
	}

	return body;
}
