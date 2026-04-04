import { type Dictionary, t } from "intlayer";

const calendarPricesContent = {
	key: "calendar-prices",
	content: {
		normalPrices: t({
			fr: "Prix normaux",
			en: "Normal prices",
			mg: "Vidiny mahazatra",
		}),
		promoPrices: t({
			fr: "Prix promo",
			en: "Promo prices",
			mg: "Vidiny promo",
		}),
		priceCalendar: t({
			fr: "Calendrier des prix",
			en: "Price calendar",
			mg: "Kalandrie vidiny",
		}),
	},
} satisfies Dictionary;

export default calendarPricesContent;
