import { type Dictionary, t } from "intlayer";

const bookingTranslationsContent = {
	key: "booking-translations",
	content: {
		checkIn: t({
			en: "Check-in",
			fr: "Arrivée",
			mg: "Fidirana",
		}),
		checkOut: t({
			en: "Check-out",
			fr: "Départ",
			mg: "Fivoahana",
		}),
		guests: t({
			en: "Guests",
			fr: "Invités",
			mg: "Vahiny",
		}),
		search: t({
			en: "Search",
			fr: "Rechercher",
			mg: "Mitady",
		}),
		errors: {
			invalidDates: t({
				en: "Please select valid check-in and check-out dates.",
				fr: "Veuillez sélectionner des dates d'arrivée et de départ valides.",
				mg: "Azafady, mifidiana daty fidirana sy fivoahana manan-kery.",
			}),
		},
	},
} satisfies Dictionary;

export default bookingTranslationsContent;
