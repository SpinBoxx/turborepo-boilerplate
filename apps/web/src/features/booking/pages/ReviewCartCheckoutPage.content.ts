import { type Dictionary, t } from "intlayer";

const reviewCartCheckoutContent = {
	key: "review-cart-checkout",
	content: {
		pageTitle: t({
			fr: "Vérifier votre réservation",
			en: "Review your booking",
			mg: "Jereo ny fijanonana",
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
		cancelBooking: t({
			fr: "Annuler la réservation",
			en: "Cancel booking",
			mg: "Ajanony ny fandraisana",
		}),
		bookingSuccess: t({
			fr: "Réservation confirmée !",
			en: "Booking confirmed!",
			mg: "Voamarina ny fijanonana!",
		}),
		bookingError: t({
			fr: "Erreur lors de la réservation",
			en: "Booking failed",
			mg: "Tsy nahomby ny fijanonana",
		}),
		confirmBooking: t({
			fr: "Confirmer la réservation",
			en: "Confirm Booking",
			mg: "Manamafisa ny fandraisana",
		}),
	},
} satisfies Dictionary;

export default reviewCartCheckoutContent;
