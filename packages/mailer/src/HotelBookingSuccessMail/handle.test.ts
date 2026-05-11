import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendHotelBookingSuccessMail } from "./handle";

const { mockedSend } = vi.hoisted(() => ({
	mockedSend: vi.fn(),
}));

vi.mock("../resend", () => ({
	LOCALES: ["fr", "en", "mg"],
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
		bookingReference: "quote_123",
		checkInDate: new Date("2026-04-20T00:00:00.000Z"),
		checkOutDate: new Date("2026-04-22T00:00:00.000Z"),
		guestCount: 2,
		guestName: "Jane Doe",
		hotelName: "Test Hotel",
		priceLabel: "MGA 125,000",
		roomTitle: "Ocean Suite",
		specialRequests: "Late check-in requested",
		supportEmail: "contact@zanadeal.com",
	},
};

describe("HotelBookingSuccessMail handle", () => {
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

		await expect(sendHotelBookingSuccessMail(validInput)).rejects.toThrow(
			"Failed to send hotel booking success email",
		);
	});

	it("returns the Resend email id on success", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_123" },
			error: null,
		} as never);

		await expect(sendHotelBookingSuccessMail(validInput)).resolves.toEqual({
			emailId: "email_123",
		});
	});

	it("keeps supportEmail in template variables even when missing from input", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_456" },
			error: null,
		} as never);

		await sendHotelBookingSuccessMail({
			...validInput,
			variables: {
				...validInput.variables,
				supportEmail: undefined,
			},
		});

		expect(mockedSend).toHaveBeenCalledWith(
			expect.objectContaining({
				template: expect.objectContaining({
					variables: expect.objectContaining({
						supportEmail: "",
					}),
				}),
			}),
		);
	});

	it("keeps specialRequests in template variables even when missing from input", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_654" },
			error: null,
		} as never);

		await sendHotelBookingSuccessMail({
			...validInput,
			variables: {
				...validInput.variables,
				specialRequests: undefined,
			},
		});

		expect(mockedSend).toHaveBeenCalledWith(
			expect.objectContaining({
				template: expect.objectContaining({
					variables: expect.objectContaining({
						specialRequests: "",
					}),
				}),
			}),
		);
	});

	it("uses a default localized subject when none is provided", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_999" },
			error: null,
		} as never);

		await sendHotelBookingSuccessMail({
			...validInput,
			subject: undefined,
		});

		expect(mockedSend).toHaveBeenCalledWith(
			expect.objectContaining({
				subject: "Booking confirmed - quote_123",
			}),
		);
	});
});