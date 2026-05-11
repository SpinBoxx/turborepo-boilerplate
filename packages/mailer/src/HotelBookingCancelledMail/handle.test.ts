import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendHotelBookingCancelledMail } from "./handle";

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
	locale: "fr" as const,
	to: "guest@example.com",
	variables: {
		bookingReference: "quote_456",
		checkInDate: new Date("2026-05-02T00:00:00.000Z"),
		checkOutDate: new Date("2026-05-05T00:00:00.000Z"),
		guestCount: 2,
		guestName: "Jane Doe",
		hotelName: "Test Hotel",
		priceLabel: "MGA 125,000",
		roomTitle: "Ocean Suite",
		supportEmail: "contact@zanadeal.com",
	},
};

describe("HotelBookingCancelledMail handle", () => {
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

		await expect(sendHotelBookingCancelledMail(validInput)).rejects.toThrow(
			"Failed to send hotel booking cancelled email",
		);
	});

	it("returns the Resend email id on success", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_123" },
			error: null,
		} as never);

		await expect(sendHotelBookingCancelledMail(validInput)).resolves.toEqual({
			emailId: "email_123",
		});
	});

	it("injects a localized default cancel reason when missing", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_456" },
			error: null,
		} as never);

		await sendHotelBookingCancelledMail(validInput);

		expect(mockedSend).toHaveBeenCalledWith(
			expect.objectContaining({
				template: expect.objectContaining({
					variables: expect.objectContaining({
						cancelReason: "La chambre n'est plus disponible.",
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

		await sendHotelBookingCancelledMail({
			...validInput,
			subject: undefined,
		});

		expect(mockedSend).toHaveBeenCalledWith(
			expect.objectContaining({
				subject: "Reservation indisponible - quote_456",
			}),
		);
	});
});