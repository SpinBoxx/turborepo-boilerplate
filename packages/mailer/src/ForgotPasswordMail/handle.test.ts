import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendForgotPasswordMail } from "./handle";

const { mockedSend } = vi.hoisted(() => ({
	mockedSend: vi.fn(),
}));

vi.mock("../resend", () => ({
	resend: {
		emails: {
			send: mockedSend,
		},
	},
}));

const validInput = {
	from: "contact@zanadeal.com",
	locale: "en" as const,
	to: "guest@example.com",
	variables: {
		resetUrl: "https://api.example.com/api/auth/reset-password/token",
		userName: "Jane",
	},
};

describe("ForgotPasswordMail handle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("throws when Resend returns an error", async () => {
		mockedSend.mockResolvedValue({
			data: null,
			error: {
				message: "Template not found",
				name: "application_error",
			},
		} as never);

		await expect(sendForgotPasswordMail(validInput)).rejects.toThrow(
			"Failed to send forgot password email",
		);
	});

	it("returns the Resend email id on success", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_123" },
			error: null,
		} as never);

		await expect(sendForgotPasswordMail(validInput)).resolves.toEqual({
			emailId: "email_123",
		});
	});

	it("uses a default localized subject when none is provided", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_456" },
			error: null,
		} as never);

		await sendForgotPasswordMail({
			...validInput,
			locale: "fr",
			subject: undefined,
		});

		expect(mockedSend).toHaveBeenCalledWith(
			expect.objectContaining({
				subject: "Reinitialisez votre mot de passe",
			}),
		);
	});

	it("passes resetUrl and userName to the Resend template", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_789" },
			error: null,
		} as never);

		await sendForgotPasswordMail(validInput);

		expect(mockedSend).toHaveBeenCalledWith(
			expect.objectContaining({
				template: expect.objectContaining({
					variables: validInput.variables,
				}),
			}),
		);
	});
});
