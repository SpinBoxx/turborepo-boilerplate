import { describe, expect, it } from "vitest";
import { UpdateCurrentUserProfileInputSchema } from "./user.schema";

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