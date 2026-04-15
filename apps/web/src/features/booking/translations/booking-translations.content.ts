import { type Dictionary, t } from "intlayer";

const bookingTranslationsContent = {
	key: "booking-translations",
	content: {
		selectTravelDates: t({
			en: "Select your travel dates",
			fr: "Sélectionnez vos dates de voyage",
			mg: "Safidio ny daty fitsangatsanganana",
		}),
		checkIn: t({
			en: "Check-in",
			fr: "Arrivée",
			mg: "Fidirana",
		}),
		checkOut: t({
			en: "Check-out",
			fr: "Départ",
			mg: "Fivoahana",
		}),
		guests: t({
			en: "Guests",
			fr: "Invités",
			mg: "Vahiny",
		}),
		search: t({
			en: "Search",
			fr: "Rechercher",
			mg: "Mitady",
		}),
		termsAgreement: t({
			fr: "En cliquant sur « Confirmer la réservation », vous acceptez nos",
			en: 'By clicking "Confirm Booking", you agree to our',
			mg: 'Amin\'ny fanindronana "Manamafisa", manaiky ny',
		}),
		termsOfService: t({
			fr: "Conditions générales",
			en: "Terms of Service",
			mg: "Fepetra ankapobeny",
		}),
		and: t({
			fr: "et",
			en: "and",
			mg: "sy",
		}),
		privacyPolicy: t({
			fr: "Politique de confidentialité",
			en: "Privacy Policy",
			mg: "Politika tsiambaratelo",
		}),
		errors: {
			invalidDates: t({
				en: "Please select valid check-in and check-out dates.",
				fr: "Veuillez sélectionner des dates d'arrivée et de départ valides.",
				mg: "Azafady, mifidiana daty fidirana sy fivoahana manan-kery.",
			}),
		},
	},
} satisfies Dictionary;

export default bookingTranslationsContent;
