import { type Dictionary, t } from "intlayer";

const guestDetailsFormContent = {
	key: "guest-details-form",
	content: {
		title: t({
			fr: "Détails du client",
			en: "Guest Details",
			mg: "Mombamomba ny vahiny",
		}),
		firstName: t({
			fr: "Prénom",
			en: "First Name",
			mg: "Anarana",
		}),
		lastName: t({
			fr: "Nom",
			en: "Last Name",
			mg: "Fanampiny",
		}),
		email: t({
			fr: "Adresse e-mail",
			en: "Email Address",
			mg: "Adiresy mailaka",
		}),
		emailHelper: t({
			fr: "Nous enverrons la confirmation de réservation à cette adresse.",
			en: "We'll send your booking confirmation to this email address.",
			mg: "Halefanay ny fanamafisana amin'ity adiresy ity.",
		}),
		phone: t({
			fr: "Numéro de téléphone",
			en: "Phone Number",
			mg: "Laharana finday",
		}),
		specialRequests: t({
			fr: "Demandes spéciales (optionnel)",
			en: "Special Requests (optional)",
			mg: "Fangatahana manokana (tsy voatery)",
		}),
		specialRequestsPlaceholder: t({
			fr: "Étage élevé, chambre calme, ou arrivée tardive...",
			en: "High floor, quiet room, or late check-in preferences...",
			mg: "Rihana avo, efitrano mangina, na fidirana hariva...",
		}),
		errors: {
			firstNameRequired: t({
				fr: "Le prénom est requis",
				en: "First name is required",
				mg: "Ilaina ny anarana",
			}),
			lastNameRequired: t({
				fr: "Le nom est requis",
				en: "Last name is required",
				mg: "Ilaina ny fanampiny",
			}),
			emailRequired: t({
				fr: "L'email est requis",
				en: "Email is required",
				mg: "Ilaina ny mailaka",
			}),
			emailInvalid: t({
				fr: "L'adresse email est invalide",
				en: "Invalid email address",
				mg: "Tsy mety ny adiresy mailaka",
			}),
			phoneRequired: t({
				fr: "Le numéro de téléphone est requis",
				en: "Phone number is required",
				mg: "Ilaina ny laharana finday",
			}),
		},
	},
} satisfies Dictionary;

export default guestDetailsFormContent;
