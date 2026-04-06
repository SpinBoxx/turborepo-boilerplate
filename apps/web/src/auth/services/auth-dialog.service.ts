export interface RedirectLocationLike {
	pathname: string;
	search?: string;
	hash?: string;
}

export function sanitizeRedirectTo(
	redirectTo: string | null | undefined,
): string | undefined {
	if (!redirectTo) {
		return undefined;
	}

	if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
		return undefined;
	}

	return redirectTo;
}

export function buildRedirectTo({
	pathname,
	search = "",
	hash = "",
}: RedirectLocationLike): string {
	const normalizedPathname = pathname.startsWith("/")
		? pathname
		: `/${pathname}`;

	return `${normalizedPathname}${search}${hash}`;
}

export function buildEmailVerifiedCallbackUrl(
	origin: string,
	redirectTo?: string | null,
): string {
	const callbackUrl = new URL("/email-verified", origin);
	const safeRedirectTo = sanitizeRedirectTo(redirectTo);

	if (safeRedirectTo) {
		callbackUrl.searchParams.set("redirectTo", safeRedirectTo);
	}

	return callbackUrl.toString();
}