import { type Dictionary, t } from "intlayer";

const roomCardListContent = {
	key: "room-card-list",
	content: {
		noRoomsAvailable: t({
			fr: "Aucune chambre disponible pour ces dates",
			en: "No rooms available for these dates",
			mg: "Tsy misy efitrano malalaka amin'ireo daty ireo",
		}),
		noRoomsDescription: t({
			fr: "Aucune chambre n'est disponible pour les dates sélectionnées. Essayez d'autres dates de séjour.",
			en: "No rooms are available for the selected dates. Try different stay dates.",
			mg: "Tsy misy efitrano malalaka amin'ny daty voafidy. Andramo daty hafa.",
		}),
	},
} satisfies Dictionary;

export default roomCardListContent;
