import { type Dictionary, t } from "intlayer";

const contactPageContent = {
	key: "contact-page",
	content: {
		title: t({
			fr: "Contact",
			en: "Contact",
			mg: "Fifandraisana",
		}),
		description: t({
			fr: "Une question sur une réservation, un hôtel ou votre compte ? Envoyez-nous votre demande depuis ce formulaire.",
			en: "Have a question about a booking, a hotel, or your account? Send us your request using this form.",
			mg: "Manana fanontaniana momba ny famandrihana, hotely, na kaontinao ve ianao? Alefaso aminay amin'ity taratasy ity ny fangatahanao.",
		}),
	},
} satisfies Dictionary;

export default contactPageContent;
