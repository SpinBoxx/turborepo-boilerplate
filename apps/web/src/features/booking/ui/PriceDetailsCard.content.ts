import { type Dictionary, enu, insert, t } from "intlayer";

const priceDetailsCardContent = {
	key: "price-details-card",
	content: {
		title: t({
			fr: "Détails du prix",
			en: "Price Details",
			mg: "Antsipiriany momba ny vidiny",
		}),
		perNight: t({
			fr: "/ nuit",
			en: "/ night",
			mg: "/ alina",
		}),
		totalForNights: t({
			fr: enu({
				"1": insert("Total pour {{count}} nuit"),
				">1": insert("Total pour {{count}} nuits"),
			}),
			en: enu({
				"1": insert("Total for {{count}} night"),
				">1": insert("Total for {{count}} nights"),
			}),
			mg: enu({
				"1": insert("Total ho an'ny {{count}} alina"),
				">1": insert("Total ho an'ny {{count}} alina"),
			}),
		}),
		nightOf: t({
			fr: "Nuit du",
			en: "Night of",
			mg: "Alin'ny",
		}),
		showBreakdown: t({
			fr: "Voir le détail par nuit",
			en: "Show nightly breakdown",
			mg: "Hijery ny antsipirihany isaky ny alina",
		}),
		hideBreakdown: t({
			fr: "Masquer le détail",
			en: "Hide breakdown",
			mg: "Afeno ny antsipirihany",
		}),
		taxesAndFees: t({
			fr: "Taxes & Frais",
			en: "Taxes & Fees",
			mg: "Hetra sy sara",
		}),
		discount: t({
			fr: "Réduction",
			en: "Discount",
			mg: "Fihenam-bidy",
		}),
		taxesInfo: t({
			fr: "Inclut les taxes applicables et les frais de service.",
			en: "Includes applicable taxes and service fees.",
			mg: "Ahitana ny hetra sy ny sara fanompoana.",
		}),
		totalPrice: t({
			fr: "Prix total",
			en: "Total Price",
			mg: "Vidiny fitambarany",
		}),
		inclusiveOfTaxes: t({
			fr: "Toutes taxes comprises",
			en: "Inclusive of all taxes",
			mg: "Hetra rehetra voaray",
		}),
		confirmBooking: t({
			fr: "Confirmer la réservation",
			en: "Confirm Booking",
			mg: "Manamafisa ny fandraisana",
		}),
		authDialogLoginTitle: t({
			fr: "Connectez-vous pour finaliser votre réservation",
			en: "Sign in to complete your booking",
			mg: "Midira mba hamitana ny famandrihanao",
		}),
		authDialogLoginDescription: t({
			fr: "Vous devez être connecté pour confirmer cette réservation et retrouver vos informations de séjour.",
			en: "You need to be signed in to confirm this booking and keep your stay details.",
			mg: "Tsy maintsy miditra ianao vao afaka manamarina ity famandrihana ity sy mitahiry ny antsipirian'ny fijanonanao.",
		}),
		authDialogRegisterTitle: t({
			fr: "Créez un compte pour réserver cette chambre",
			en: "Create an account to book this room",
			mg: "Mamorona kaonty mba hamandrihana ity efitra ity",
		}),
		authDialogRegisterDescription: t({
			fr: "Créez votre compte pour continuer la réservation sans perdre votre sélection actuelle.",
			en: "Create your account to continue this booking without losing your current selection.",
			mg: "Mamorona kaonty mba hanohizana ity famandrihana ity nefa tsy very ny safidinao ankehitriny.",
		}),
		loginBeforeBooking: t({
			fr: "Veuillez vous connecter avant de confirmer votre réservation.",
			en: "Please log in before confirming your booking.",
			mg: "Azafady, midira alohan'ny hanamafisana ny fandraisanao.",
		}),
	},
} satisfies Dictionary;

export default priceDetailsCardContent;
