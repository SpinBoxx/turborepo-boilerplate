import { type Dictionary, t } from "intlayer";

const bookingSearchBarMobileContent = {
	key: "booking-search-bar-mobile",
	content: {
		whenAreYouGoing: t({
			fr: "Quand partez-vous ?",
			en: "When are you going?",
			mg: "Rahoviana ianao no handeha?",
		}),
		selectTravelDates: t({
			fr: "Dates de voyage",
			en: "Ttravel dates",
			mg: "Daty dia",
		}),
		choose: t({
			fr: "Choisir",
			en: "Choose",
			mg: "Mifidiana",
		}),
		next: t({
			fr: "Suivant",
			en: "Next",
			mg: "Manaraka",
		}),
		back: t({
			fr: "Retour",
			en: "Back",
			mg: "Miverina",
		}),
		search: t({
			fr: "Rechercher",
			en: "Search",
			mg: "Mitady",
		}),
		whosComing: t({
			fr: "Qui vient ?",
			en: "Who's coming?",
			mg: "Iza no ho avy?",
		}),
		selectYourGuestsCount: t({
			fr: "Sélectionnez le nombre de vos invités",
			en: "Select your guests count",
			mg: "Safidio ny isan'ny vahiny",
		}),
	},
} satisfies Dictionary;

export default bookingSearchBarMobileContent;
