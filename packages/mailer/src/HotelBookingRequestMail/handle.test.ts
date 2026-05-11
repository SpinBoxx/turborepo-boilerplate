import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendHotelBookingRequestMail } from "./handle";

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
	to: "hotel@example.com",
	variables: {
		acceptUrl:
			"https://admin.zanadeal.test/hotel-reviewer/bookings/requests/approve?paymentAttemptId=pay_123&quoteId=quote_123",
		bookingReference: "quote_123",
		checkInDate: new Date("2026-04-20T00:00:00.000Z"),
		checkOutDate: new Date("2026-04-22T00:00:00.000Z"),
		currency: "MGA",
		guestCount: 2,
		guestName: "Jane Doe",
		hotelName: "Test Hotel",
		priceLabel: "MGA 125,000",
		rejectUrl:
			"https://admin.zanadeal.test/hotel-reviewer/bookings/requests/reject?paymentAttemptId=pay_123&quoteId=quote_123",
		roomTitle: "Ocean Suite",
	},
};

describe("HotelBookingRequestMail handle", () => {
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

		await expect(sendHotelBookingRequestMail(validInput)).rejects.toThrow(
			"Failed to send hotel booking request email",
		);
	});

	it("returns the Resend email id on success", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_123" },
			error: null,
		} as never);

		await expect(sendHotelBookingRequestMail(validInput)).resolves.toEqual({
			emailId: "email_123",
		});
	});

	it("keeps specialRequests in template variables even when missing from input", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_456" },
			error: null,
		} as never);

		await sendHotelBookingRequestMail({
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

	it("serializes numeric template variables as strings", async () => {
		mockedSend.mockResolvedValue({
			data: { id: "email_789" },
			error: null,
		} as never);

		await sendHotelBookingRequestMail(validInput);

		expect(mockedSend).toHaveBeenCalledWith(
			expect.objectContaining({
				template: expect.objectContaining({
					variables: expect.objectContaining({
						guestCount: "2",
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

		await sendHotelBookingRequestMail({
			...validInput,
			subject: undefined,
		});

		expect(mockedSend).toHaveBeenCalledWith(
			expect.objectContaining({
				subject: "New booking request awaiting approval - quote_123",
			}),
		);
	});
});
