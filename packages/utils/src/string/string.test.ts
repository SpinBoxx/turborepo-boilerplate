import { describe, expect, it } from "vitest";
import { maskEmailAddress, uppercaseFirstLetter } from "./string";

describe("uppercaseFirstLetter", () => {
	it("uppercases the first letter", () => {
		expect(uppercaseFirstLetter("zanadeal")).toBe("Zanadeal");
	});

	it("returns an empty string when given an empty string", () => {
		expect(uppercaseFirstLetter("")).toBe("");
	});
});

describe("maskEmailAddress", () => {
	it("masks the middle of the email local part", () => {
		expect(maskEmailAddress("jane.doe@example.com")).toBe(
			"j••••••e@example.com",
		);
	});

	it("keeps short local parts readable", () => {
		expect(maskEmailAddress("jd@example.com")).toBe("jd@example.com");
	});

	it("returns invalid email-like values unchanged", () => {
		expect(maskEmailAddress("not-an-email")).toBe("not-an-email");
	});
});
