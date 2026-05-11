import { type Dictionary, t } from "intlayer";

const needHelpCardContent = {
	key: "need-help-card",
	content: {
		title: t({
			fr: "Besoin d'aide ?",
			en: "Need help with your booking?",
			mg: "Mila fanampiana?",
		}),
		description: t({
			fr: "Notre service d'assistance est disponible 24h/24 et 7j/7.",
			en: "Our concierge is available 24/7.",
			mg: "Ny mpandrindra dia misy 24/7.",
		}),
	},
} satisfies Dictionary;

export default needHelpCardContent;
