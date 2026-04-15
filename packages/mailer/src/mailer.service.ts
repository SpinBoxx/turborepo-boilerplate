import {
	type ForgotPasswordInput,
	sendForgotPasswordMail,
} from "./ForgotPasswordMail";
import {
	sendHotelBookingRequestMail,
	type SendHotelBookingRequestMailInput,
} from "./HotelBookingRequestMail";
import {
	sendVerifyAccountMail,
	type VerifyAccountMailInput,
} from "./VerifyAccountMail";
import { sendWelcomeMail } from "./WelcomeMail/handle";
import type { CreateAccountMailInput } from "./WelcomeMail/types";

export const from = "contact@zanadeal.com";

export const createMailService = () => {
	return {
		sendWelcomeMail: (input: CreateAccountMailInput) =>
			sendWelcomeMail({
				...input,
				from,
			}),
		sendVerifyAccountMail: (input: VerifyAccountMailInput) =>
			sendVerifyAccountMail({
				...input,
				from,
			}),
		sendForgotPasswordMail: (input: ForgotPasswordInput) =>
			sendForgotPasswordMail({
				...input,
				from,
			}),
		sendHotelBookingRequestMail: (input: SendHotelBookingRequestMailInput) =>
			sendHotelBookingRequestMail({
				...input,
				from,
			}),
	};
};

export const mailService = createMailService();

export type MailService = ReturnType<typeof createMailService>;
