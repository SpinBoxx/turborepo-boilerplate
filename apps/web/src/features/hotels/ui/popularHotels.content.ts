import { type Dictionary, t } from "intlayer";

const popularHotelsContent = {
	key: "popular-hotels",
	content: {
		title: t({
			fr: "Hôtels populaires",
			en: "Popular hotels",
			mg: "Hotely malaza",
		}),
		description: t({
			fr: "Des séjours sélectionnés pour une escapade parfaite.",
			en: "Handpicked stays for the perfect getaway.",
			mg: "Toerana voafantina ho an'ny fialan-tsasatra tonga lafatra.",
		}),
		seeAll: t({
			fr: "Voir tout",
			en: "See all",
			mg: "Hijery rehetra",
		}),
	},
} satisfies Dictionary;

export default popularHotelsContent;
