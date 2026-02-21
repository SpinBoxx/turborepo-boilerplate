import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { AppRouterClient } from "@zanadeal/api/router";

function getApiBaseUrl() {
	return (
		import.meta.env.VITE_API_URL?.toString() ?? "http://localhost:8080" // apps/server default
	);
}

function joinUrl(base: string, path: string) {
	return `${base.replace(/\/$/, "")}${path}`;
}

const link = new RPCLink({
	url: () => joinUrl(getApiBaseUrl(), "/rpc"),
	fetch: (request, init) => {
		return globalThis.fetch(request, {
			...init,
			credentials: "include",
		});
	},
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export const orpc: AppRouterClient = createORPCClient(link);
