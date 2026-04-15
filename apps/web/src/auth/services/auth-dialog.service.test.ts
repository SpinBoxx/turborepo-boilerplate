import { describe, expect, it } from "vitest";
import {
	buildEmailVerifiedCallbackUrl,
	buildRedirectTo,
	sanitizeRedirectTo,
} from "./auth-dialog.service";

describe("auth-dialog.service", () => {
	it("keeps safe internal redirect targets", () => {
		expect(sanitizeRedirectTo("/review-cart-checkout")).toBe(
			"/review-cart-checkout",
		);
		expect(sanitizeRedirectTo("/hotel/abc?guests=2#rooms")).toBe(
			"/hotel/abc?guests=2#rooms",
		);
	});

	it("rejects unsafe redirect targets", () => {
		expect(sanitizeRedirectTo("https://evil.test")).toBeUndefined();
		expect(sanitizeRedirectTo("//evil.test/path")).toBeUndefined();
		expect(sanitizeRedirectTo("booking/review")).toBeUndefined();
	});

	it("builds redirect targets from the current location", () => {
		expect(
			buildRedirectTo({
				pathname: "/review-cart-checkout",
				search: "?guests=2",
				hash: "#payment",
			}),
		).toBe("/review-cart-checkout?guests=2#payment");
	});

	it("adds redirectTo to the email verified callback when safe", () => {
		expect(
			buildEmailVerifiedCallbackUrl(
				"https://zanadeal.test",
				"/review-cart-checkout?guests=2",
			),
		).toBe(
			"https://zanadeal.test/email-verified?redirectTo=%2Freview-cart-checkout%3Fguests%3D2",
		);
	});

	it("omits unsafe redirectTo values from the email verified callback", () => {
		expect(
			buildEmailVerifiedCallbackUrl(
				"https://zanadeal.test",
				"https://evil.test",
			),
		).toBe("https://zanadeal.test/email-verified");
	});
});
