import { type Dictionary, t } from "intlayer";

const bookingSearchBarCalendarPopoverContent = {
	key: "booking-search-bar-calendar-popover",
	content: {
		whenAreYouGoing: t({
			fr: "Quand partez-vous ?",
			en: "When are you going?",
			mg: "Rahoviana ianao no handeha?",
		}),
		selectCheckoutDate: t({
			fr: "Sélectionnez votre date de départ",
			en: "Select your checkout date",
			mg: "Safidio ny daty fialanao",
		}),
		checkoutDate: t({
			fr: "Date de fin",
			en: "Checkout date",
			mg: "Daty fialana",
		}),
	},
} satisfies Dictionary;

export default bookingSearchBarCalendarPopoverContent;
