import { createFetch } from "@better-fetch/fetch";

function getCookieValue(name: string) {
	if (typeof document === "undefined") {
		return undefined;
	}

	const cookies = document.cookie.split(";");
	for (const cookie of cookies) {
		const [key, ...valueParts] = cookie.trim().split("=");
		if (key === name) {
			return valueParts.join("=") || undefined;
		}
	}

	return undefined;
}

async function getSessionToken() {
	try {
		if (typeof globalThis.cookieStore !== "undefined") {
			return (await globalThis.cookieStore.get("better-auth.session_token"))
				?.value;
		}
	} catch {
		return getCookieValue("better-auth.session_token");
	}

	return getCookieValue("better-auth.session_token");
}

export const $fetch = createFetch({
	baseURL: import.meta.env.VITE_API_URL.toString(),
	auth: {
		type: "Bearer",
		token: getSessionToken(),
	},
	onRequest: ({ headers, ...context }) => {
		if (!headers.has("content-language")) {
			headers.set(
				"content-language",
				getCookieValue("INTLAYER_LOCALE") || "en",
			);
		}

		return {
			...context,
			headers,
		};
	},
});
