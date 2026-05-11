import { type Dictionary, t } from "intlayer";

const staySummaryCardContent = {
	key: "stay-summary-card",
	content: {
		title: t({
			fr: "Résumé du séjour",
			en: "Stay Summary",
			mg: "Famintinana ny fijanonana",
		}),
		nights: t({
			fr: "nuit(s)",
			en: "night(s)",
			mg: "alina",
		}),
		guests: t({
			fr: "Voyageur(s)",
			en: "Guest(s)",
			mg: "Vahiny",
		}),
	},
} satisfies Dictionary;

export default staySummaryCardContent;
