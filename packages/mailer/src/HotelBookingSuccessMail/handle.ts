import { verifyLocale } from "../mail-locales";
import { resend } from "../resend";
import {
	type SendHotelBookingSuccessMailInput,
	SendHotelBookingSuccessMailInputSchema,
} from "./types";

function normalizeTemplateVariables(
	variables: SendHotelBookingSuccessMailInput["variables"],
) {
	return Object.fromEntries(
		Object.entries(variables).flatMap(([key, value]) => {
			if (value === undefined || value === null) {
				return [[key, ""]];
			}

			if (value instanceof Date) {
				return [[key, value.toISOString()]];
			}

			return [[key, String(value)]];
		}),
	) as Record<string, string>;
}

export const sendHotelBookingSuccessMail = async (
	input: SendHotelBookingSuccessMailInput,
) => {
	const parsed =
		await SendHotelBookingSuccessMailInputSchema.safeParseAsync(input);

	if (!parsed.success) {
		throw new Error("Invalid input for sendHotelBookingSuccessMail");
	}

	const { locale } = parsed.data;
	const verifiedLocale = verifyLocale(locale);
	const subject =
		parsed.data.subject ??
		buildHotelBookingSuccessSubject(
			verifiedLocale,
			parsed.data.variables.bookingReference,
		);

	const sendEmail = await resend.emails.send({
		template: {
			id: emails[verifiedLocale],
			variables: normalizeTemplateVariables(parsed.data.variables),
		},
		subject,
		from: parsed.data.from,
		to: parsed.data.to,
	});

	if (sendEmail.error || !sendEmail.data?.id) {
		throw new Error(
			`Failed to send hotel booking success email: ${sendEmail.error?.message ?? "Unknown Resend error"}`,
		);
	}

	return {
		emailId: sendEmail.data.id,
	};
};

const emails = {
	fr: "294a6198-5b3a-4869-a122-7400552376b5",
	en: "243d59d8-8ff9-42a4-97d6-c141be347d2c",
	mg: "36578de0-5695-4411-957a-46f96d70748b",
};

const emailSubjects = {
	fr: "Reservation confirmee",
	en: "Booking confirmed",
	mg: "Voamarina ny famandrihanao",
} as const;

function buildHotelBookingSuccessSubject(
	locale: keyof typeof emailSubjects,
	bookingReference: string,
): string {
	return `${emailSubjects[locale]} - ${bookingReference}`;
}
