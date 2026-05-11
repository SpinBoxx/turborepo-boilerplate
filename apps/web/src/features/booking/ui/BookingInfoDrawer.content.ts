import { type Dictionary, t } from "intlayer";

const bookingInfoDrawerContent = {
	key: "booking-info-drawer",
	content: {
		bookingDetails: t({
			fr: "Détails de la réservation",
			en: "Booking details",
			mg: "Antsipirihany momba ny fandrindrana",
		}),
		setBookingDates: t({
			fr: "Définissez vos dates et le nombre d'invités.",
			en: "Set your dates and guests count.",
			mg: "Safidio ny daty sy ny isan'ny vahiny.",
		}),
		checkIn: t({
			fr: "Arrivée",
			en: "Check-in",
			mg: "Fidirana",
		}),
		checkOut: t({
			fr: "Départ",
			en: "Check-out",
			mg: "Fivoahana",
		}),
		addDate: t({
			fr: "Ajouter une date",
			en: "Add date",
			mg: "Ampio daty",
		}),
		guests: t({
			fr: "Invités",
			en: "Guests",
			mg: "Vahiny",
		}),
		save: t({
			fr: "Enregistrer",
			en: "Save",
			mg: "Tehirizo",
		}),
		cancel: t({
			fr: "Annuler",
			en: "Cancel",
			mg: "Ajanony",
		}),
	},
} satisfies Dictionary;

export default bookingInfoDrawerContent;
