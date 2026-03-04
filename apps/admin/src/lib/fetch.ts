import { createFetch } from "@better-fetch/fetch";

export const $fetch = createFetch({
	baseURL: import.meta.env.VITE_API_URL.toString(),
	auth: {
		type: "Bearer",
		token:
			cookieStore
				.get("better-auth.session_token")
				.then((cookie) => cookie?.value) ?? undefined,
	},
});
