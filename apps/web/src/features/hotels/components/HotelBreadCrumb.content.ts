import { type Dictionary, t } from "intlayer";

const hotelBreadcrumbContent = {
	key: "hotel-breadcrumb",
	content: {
		selectRooms: t({
			fr: "Choisir une chambre",
			en: "Select a room",
			mg: "Misafidiana efitra",
		}),
		home: t({
			fr: "Accueil",
			en: "Home",
			mg: "Fandraisana",
		}),
	},
} satisfies Dictionary;

export default hotelBreadcrumbContent;
