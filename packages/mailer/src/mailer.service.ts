import {
	type ForgotPasswordInput,
	sendForgotPasswordMail,
} from "./ForgotPasswordMail";
import {
	sendHotelBookingCancelledMail,
	type SendHotelBookingCancelledMailInput,
} from "./HotelBookingCancelledMail";
import {
	sendHotelBookingRequestMail,
	type SendHotelBookingRequestMailInput,
} from "./HotelBookingRequestMail";
import {
	sendHotelBookingSuccessMail,
	type SendHotelBookingSuccessMailInput,
} from "./HotelBookingSuccessMail";
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
		sendHotelBookingSuccessMail: (input: SendHotelBookingSuccessMailInput) =>
			sendHotelBookingSuccessMail({
				...input,
				from,
			}),
		sendHotelBookingCancelledMail: (input: SendHotelBookingCancelledMailInput) =>
			sendHotelBookingCancelledMail({
				...input,
				from,
			}),
	};
};

export const mailService = createMailService();

export type MailService = ReturnType<typeof createMailService>;
