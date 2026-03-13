import { type Dictionary, t } from "intlayer";

const bookingSearchBarCalendarPopoverContent = {
	key: "booking-search-bar-calendar-popover",
	content: {
		whenAreYouGoing: t({
			fr: "Quand partez-vous ?",
			en: "When are you going?",
			mg: "Rahoviana ianao no handeha?",
		}),
	},
} satisfies Dictionary;

export default bookingSearchBarCalendarPopoverContent;
