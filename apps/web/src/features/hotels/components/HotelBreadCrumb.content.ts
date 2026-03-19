import { type Dictionary, t } from "intlayer";

const hotelBreadcrumbContent = {
	key: "hotel-breadcrumb",
	content: {
		home: t({
			fr: "Accueil",
			en: "Home",
			mg: "Fandraisana",
		}),
	},
} satisfies Dictionary;

export default hotelBreadcrumbContent;
