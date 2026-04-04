import { type Dictionary, t } from "intlayer";

const hotelsPageContent = {
	key: "hotels-page",
	content: {
		loadError: t({
			fr: "Impossible de charger les hôtels.",
			en: "Unable to load hotels.",
			mg: "Tsy afaka misokatra ny hotely.",
		}),
	},
} satisfies Dictionary;

export default hotelsPageContent;
