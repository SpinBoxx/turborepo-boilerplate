import { ORPCError } from "@orpc/server";
import { describe, expect, it } from "vitest";
import {
	buildContactMessageCreateData,
	buildContactMessageStatusUpdate,
	isContactMessageSpam,
} from "./contact-message.service";

describe("contact-message.service", () => {
	it("detects honeypot submissions", () => {
		expect(isContactMessageSpam({ website: "" })).toBe(false);
		expect(isContactMessageSpam({ website: "https://bot.test" })).toBe(true);
		expect(isContactMessageSpam({ website: "  filled  " })).toBe(true);
	});

	it("uses authenticated user identity over submitted identity", () => {
		const data = buildContactMessageCreateData(
			{
				name: "Spoofed Sender",
				email: "spoofed@example.test",
				subject: " Need help ",
				message: " Hello ",
				website: "",
			},
			{
				id: "user_1",
				firstName: "Ada",
				lastName: "Lovelace",
				email: "ADA@EXAMPLE.TEST",
			},
		);

		expect(data).toMatchObject({
			name: "Ada Lovelace",
			email: "ada@example.test",
			subject: "Need help",
			message: "Hello",
			user: { connect: { id: "user_1" } },
		});
	});

	it("requires name and email for anonymous submissions", () => {
		expect(() =>
			buildContactMessageCreateData(
				{
					subject: "Need help",
					message: "Hello",
					website: "",
				},
				null,
			),
		).toThrow(ORPCError);
	});

	it("builds anonymous contact message data", () => {
		const data = buildContactMessageCreateData(
			{
				name: " Grace   Hopper ",
				email: "GRACE@EXAMPLE.TEST",
				subject: " Question ",
				message: " Ship it ",
				website: "",
			},
			null,
		);

		expect(data).toMatchObject({
			name: "Grace Hopper",
			email: "grace@example.test",
			subject: "Question",
			message: "Ship it",
		});
	});

	it("sets read and resolved timestamps without overwriting existing ones", () => {
		const firstDate = new Date("2026-05-10T10:00:00.000Z");
		const secondDate = new Date("2026-05-10T11:00:00.000Z");

		expect(
			buildContactMessageStatusUpdate(
				{ readAt: null, resolvedAt: null },
				"READ",
				firstDate,
			),
		).toEqual({ status: "READ", readAt: firstDate });

		expect(
			buildContactMessageStatusUpdate(
				{ readAt: firstDate, resolvedAt: null },
				"RESOLVED",
				secondDate,
			),
		).toEqual({
			status: "RESOLVED",
			readAt: firstDate,
			resolvedAt: secondDate,
		});
	});
});
