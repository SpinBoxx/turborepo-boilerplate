import { type Dictionary, t } from "intlayer";

const hotelsContent = {
	key: "hotels",
	content: {
		startingFrom: t({
			fr: "À partir de",
			en: "Starting from",
			mg: "Manomboka amin'ny",
		}),
		from: t({
			fr: "De",
			en: "From",
			mg: "Avy amin'ny",
		}),
		dateOfStay: t({
			fr: "Date de séjour",
			en: "Date of stay",
			mg: "Daty hijanona",
		}),
		guests: t({
			fr: "Invités",
			en: "Guests",
			mg: "Vahiny",
		}),
		selectRooms: t({
			fr: "Sélectionner les chambres",
			en: "Select Rooms",
			mg: "Misafidiana efitra",
		}),
		selectDates: t({
			fr: "Sélectionner les dates",
			en: "Select dates",
			mg: "Misafidiana daty",
		}),
		view: t({
			fr: "Voir",
			en: "View",
			mg: "Jereo",
		}),
		details: t({
			fr: "détails",
			en: "details",
			mg: "antsipiriany",
		}),
	},
} satisfies Dictionary;

export default hotelsContent;
