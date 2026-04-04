import { type Dictionary, t } from "intlayer";

const hotelDetailContent = {
	key: "hotel-detail",
	content: {
		informations: t({
			fr: "Informations",
			en: "Information",
			mg: "Fampahalalana",
		}),
		amenities: t({
			fr: "Équipements",
			en: "Amenities",
			mg: "Fitaovana",
		}),
		maps: t({
			fr: "Carte",
			en: "Maps",
			mg: "Sarintany",
		}),
		aboutHotel: t({
			fr: "À propos de l'hôtel",
			en: "About the hotel",
			mg: "Momba ny hotely",
		}),
		contact: t({
			fr: "Contact",
			en: "Contact",
			mg: "Fifandraisana",
		}),
		emailAddress: t({
			fr: "Adresse email",
			en: "Email address",
			mg: "Adiresy mailaka",
		}),
		phoneNumber: t({
			fr: "Numéro de téléphone",
			en: "Phone number",
			mg: "Laharana finday",
		}),
		hotelOffers: t({
			fr: "Ce que propose l'hôtel",
			en: "What this hotel offers",
			mg: "Izay atolotry ny hotely",
		}),
		hotelLocation: t({
			fr: "Où se situe l'hôtel",
			en: "Where is the hotel",
			mg: "Aiza ny hotely",
		}),
	},
} satisfies Dictionary;

export default hotelDetailContent;
