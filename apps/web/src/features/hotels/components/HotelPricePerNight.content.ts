import { type Dictionary, t } from "intlayer";

const hotelPricePerNightContent = {
	key: "hotel-price-per-night",
	content: {
		perNight: t({
			fr: "/nuit",
			en: "/night",
			mg: "/alina",
		}),
	},
} satisfies Dictionary;

export default hotelPricePerNightContent;
