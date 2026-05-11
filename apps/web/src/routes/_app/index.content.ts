import { type Dictionary, t } from "intlayer";

const homepageContent = {
	key: "homepage",
	content: {
		bookYourPerfectStay: t({
			fr: "Réservez votre séjour parfait",
			en: "Book Your Perfect Stay",
			mg: "Boky ny fialan-tsasatrao tonga lafatra",
		}),
		backgroundImage: t({
			fr: "Image de fond",
			en: "Background",
			mg: "Sary ambadika",
		}),
	},
} satisfies Dictionary;

export default homepageContent;
