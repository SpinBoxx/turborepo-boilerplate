import { type Dictionary, enu, t } from "intlayer";

const roomBathsContent = {
	key: "room-baths",
	content: {
		baths: t({
			fr: enu({
				"1": "salle de bain",
				">1": "salles de bain",
				fallback: "fe",
			}),
			en: enu({
				"1": "bathroom",
				">1": "bathrooms",
			}),
			mg: enu({
				"1": "fandroana",
				">1": "fandroana",
			}),
		}),
	},
} satisfies Dictionary;

export default roomBathsContent;
