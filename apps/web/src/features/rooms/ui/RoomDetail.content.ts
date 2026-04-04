import { type Dictionary, t } from "intlayer";

const roomDetailContent = {
	key: "room-detail",
	content: {
		information: t({
			fr: "Informations",
			en: "Information",
			mg: "Fampahalalana",
		}),
		amenities: t({
			fr: "Équipements",
			en: "Amenities",
			mg: "Fitaovana",
		}),
		aboutRoom: t({
			fr: "À propos de la chambre",
			en: "About this room",
			mg: "Momba ity efitrano ity",
		}),
		roomOffers: t({
			fr: "Ce que propose la chambre",
			en: "What this room offers",
			mg: "Izay atolotry ny efitrano",
		}),
		exploreRoom: t({
			fr: "Explorez cette chambre en détail avant de confirmer votre sélection.",
			en: "Explore this room in detail before confirming your selection.",
			mg: "Jereo ity efitrano ity alohan'ny hanamafisanao ny safidinao.",
		}),
		confirm: t({
			fr: "Confirmer",
			en: "Confirm",
			mg: "Hamarino",
		}),
		view: t({
			fr: "Voir",
			en: "View",
			mg: "Jereo",
		}),
		details: t({
			fr: "détails",
			en: "details",
			mg: "antsipirihany",
		}),
	},
} satisfies Dictionary;

export default roomDetailContent;
