import { type Dictionary, t } from "intlayer";

const roomTotalPriceContent = {
	key: "room-total-price",
	content: {
		totalPrice: t({
			fr: "Prix total",
			en: "Total price",
			mg: "Vola totaly",
		}),
		priceBreakdown: t({
			fr: "Détail du prix",
			en: "Price breakdown",
			mg: "Antsipirihany momba ny vidiny",
		}),
		priceBreakdownDescription: t({
			fr: "Détail du prix pour chaque nuit de votre séjour",
			en: "Price detail for each night of your stay",
			mg: "Antsipirihany momba ny vidiny isan'alina",
		}),
		nightOf: t({
			fr: "Nuit du",
			en: "Night of",
			mg: "Alin'ny",
		}),
		total: t({
			fr: "Total",
			en: "Total",
			mg: "Totaly",
		}),
		close: t({
			fr: "Fermer",
			en: "Close",
			mg: "Hidio",
		}),
	},
} satisfies Dictionary;

export default roomTotalPriceContent;
