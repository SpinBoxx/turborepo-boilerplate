import { type Dictionary, t } from "intlayer";

const findHotelsOnMapContent = {
	key: "find-hotels-on-map",
	content: {
		title: t({
			fr: "Trouver des hôtels sur la carte",
			en: "Find hotels on the map",
			mg: "Mitadiava hotely amin'ny sarintany",
		}),
		description: t({
			fr: "Découvrez des hôtels dans la zone de votre choix et trouvez le séjour parfait",
			en: "Discover hotels in your desired location and find the perfect stay",
			mg: "Mahita hotely amin'ny toerana tianao ary tadiavo ny toerana hipetrahana tonga lafatra",
		}),
	},
} satisfies Dictionary;

export default findHotelsOnMapContent;
