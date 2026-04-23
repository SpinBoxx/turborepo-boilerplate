import { verifyLocale } from "../mail-locales";
import { resend } from "../resend";
import {
	type SendHotelBookingCancelledMailInput,
	SendHotelBookingCancelledMailInputSchema,
} from "./types";

function normalizeTemplateVariables(
	variables: SendHotelBookingCancelledMailInput["variables"],
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

export const sendHotelBookingCancelledMail = async (
	input: SendHotelBookingCancelledMailInput,
) => {
	const parsed =
		await SendHotelBookingCancelledMailInputSchema.safeParseAsync(input);

	if (!parsed.success) {
		throw new Error("Invalid input for sendHotelBookingCancelledMail");
	}

	const verifiedLocale = verifyLocale(parsed.data.locale);
	const variables = {
		...parsed.data.variables,
		cancelReason:
			parsed.data.variables.cancelReason ??
			defaultCancelReasons[verifiedLocale],
	};

	const subject =
		parsed.data.subject ??
		buildHotelBookingCancelledSubject(
			verifiedLocale,
			parsed.data.variables.bookingReference,
		);

	const sendEmail = await resend.emails.send({
		template: {
			id: emails[verifiedLocale],
			variables: normalizeTemplateVariables(variables),
		},
		subject,
		from: parsed.data.from,
		to: parsed.data.to,
	});

	if (sendEmail.error || !sendEmail.data?.id) {
		throw new Error(
			`Failed to send hotel booking cancelled email: ${sendEmail.error?.message ?? "Unknown Resend error"}`,
		);
	}

	return {
		emailId: sendEmail.data.id,
	};
};

const emails = {
	fr: "0be79c35-4f84-458c-ba84-33acfeaf71b4",
	en: "10032fd2-dc7a-4578-8266-0d8bf3927878",
	mg: "12a61342-8b58-42dc-b454-7c215018dda5",
};

const emailSubjects = {
	fr: "Reservation indisponible",
	en: "Booking unavailable",
	mg: "Tsy afaka nohamarinina ny famandrihanao",
} as const;

const defaultCancelReasons = {
	fr: "La chambre n'est plus disponible.",
	en: "The room is no longer available.",
	mg: "Tsy misy intsony ilay efitra.",
} as const;

function buildHotelBookingCancelledSubject(
	locale: keyof typeof emailSubjects,
	bookingReference: string,
): string {
	return `${emailSubjects[locale]} - ${bookingReference}`;
}
