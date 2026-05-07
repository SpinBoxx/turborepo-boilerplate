import { type Dictionary, t } from "intlayer";

const homepageHotelsContent = {
	key: "homepage-hotels",
	content: {
		title: t({
			fr: "Tous les hôtels",
			en: "All hotels",
			mg: "Hotely rehetra",
		}),
		description: t({
			fr: "Explorez notre sélection complète, avec les établissements prioritaires en premier.",
			en: "Explore our full selection, with priority stays shown first.",
			mg: "Jereo ny safidy rehetra, miaraka amin'ireo toerana laharam-pahamehana aloha.",
		}),
		seeAll: t({
			fr: "Voir tout",
			en: "See all",
			mg: "Hijery rehetra",
		}),
	},
} satisfies Dictionary;

export default homepageHotelsContent;
