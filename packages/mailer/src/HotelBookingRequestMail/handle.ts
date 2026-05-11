import { verifyLocale } from "../mail-locales";
import { resend } from "../resend";
import {
	type SendHotelBookingRequestMailInput,
	SendHotelBookingRequestMailInputSchema,
} from "./types";

function normalizeTemplateVariables(
	variables: SendHotelBookingRequestMailInput["variables"],
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

export const sendHotelBookingRequestMail = async (
	input: SendHotelBookingRequestMailInput,
) => {
	const parsed =
		await SendHotelBookingRequestMailInputSchema.safeParseAsync(input);

	if (!parsed.success) {
		throw new Error("Invalid input for sendHotelBookingRequestMail");
	}

	const { locale } = parsed.data;

	const verifiedLocale = verifyLocale(locale);
	const subject =
		parsed.data.subject ??
		buildHotelBookingRequestSubject(
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
			`Failed to send hotel booking request email: ${sendEmail.error?.message ?? "Unknown Resend error"}`,
		);
	}

	return {
		emailId: sendEmail.data.id,
	};
};

const emails = {
	fr: "f65e89bc-28c9-4a83-a626-8c3620824c6f",
	en: "872057b2-8832-483b-9e57-61eff0bfca97",
	mg: "d006f319-4f98-4657-9863-989d670ee62e",
};

const emailSubjects = {
	fr: "Nouvelle reservation en attente de validation",
	en: "New booking request awaiting approval",
	mg: "Fangatahana famandrihana miandry fanekena",
} as const;

function buildHotelBookingRequestSubject(
	locale: keyof typeof emailSubjects,
	bookingReference: string,
): string {
	return `${emailSubjects[locale]} - ${bookingReference}`;
}
