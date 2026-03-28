import { type Dictionary, t } from "intlayer";

const bookingNoBookingAfterHoursInfoContent = {
	key: "booking-no-booking-after-hours-info",
	content: {
		title: t({
			fr: "Reservation du jour indisponible",
			en: "Same-day booking unavailable",
			mg: "Tsy misy famandrihana amin'ity andro ity intsony",
		}),
		description: t({
			fr: "Il n'est plus possible de reserver un hotel pour aujourd'hui apres 17h. Veuillez selectionner une arrivee a partir de demain.",
			en: "It is no longer possible to book a hotel for today after 5 PM. Please select an arrival starting tomorrow.",
			mg: "Tsy azo atao intsony ny mamandrika hotely ho anio aorian'ny amin'ny 5 ora hariva. Misafidiana daty manomboka rahampitso.",
		}),
	},
} satisfies Dictionary;

export default bookingNoBookingAfterHoursInfoContent;
