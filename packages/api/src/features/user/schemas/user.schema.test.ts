import { describe, expect, it } from "vitest";
import {
	DeleteManagedUserInputSchema,
	UpdateCurrentUserProfileInputSchema,
} from "./user.schema";

describe("UpdateCurrentUserProfileInputSchema", () => {
	it("trims profile names and email", () => {
		const result = UpdateCurrentUserProfileInputSchema.parse({
			firstName: "  SpinBox  ",
			lastName: "  Mimo  ",
			email: "  spinbox.mimo@gmail.com  ",
		});

		expect(result).toEqual({
			firstName: "SpinBox",
			lastName: "Mimo",
			email: "spinbox.mimo@gmail.com",
		});
	});

	it("rejects empty names", () => {
		const result = UpdateCurrentUserProfileInputSchema.safeParse({
			firstName: " ",
			lastName: "Mimo",
			email: "spinbox.mimo@gmail.com",
		});

		expect(result.success).toBe(false);
	});
});

describe("DeleteManagedUserInputSchema", () => {
	it("accepts a non-empty user id", () => {
		const result = DeleteManagedUserInputSchema.parse({ id: "user-1" });

		expect(result).toEqual({ id: "user-1" });
	});

	it("rejects an empty user id", () => {
		const result = DeleteManagedUserInputSchema.safeParse({ id: "" });

		expect(result.success).toBe(false);
	});
});
