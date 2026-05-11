import { type Dictionary, t } from "intlayer";

const freeCancellationBannerContent = {
	key: "free-cancellation-banner",
	content: {
		title: t({
			fr: "Annulation gratuite",
			en: "Free Cancellation",
			mg: "Fanafohanana maimaim-poana",
		}),
		description: t({
			fr: "Annulez avant la date d'arrivée pour un remboursement complet.",
			en: "Cancel before check-in date for a full refund.",
			mg: "Ajanony alohan'ny daty fidirana mba haverina ny vola.",
		}),
	},
} satisfies Dictionary;

export default freeCancellationBannerContent;
