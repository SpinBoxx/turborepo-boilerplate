import { type Dictionary, t } from "intlayer";

const contactFormContent = {
	key: "contact-form",
	content: {
		title: t({
			fr: "Nous contacter",
			en: "Contact us",
			mg: "Hifandray aminay",
		}),
		description: t({
			fr: "Envoyez-nous votre demande, nous la traiterons depuis l’espace admin.",
			en: "Send us your request and our team will handle it from the admin workspace.",
			mg: "Alefaso aminay ny fangatahanao ary hokarakarain'ny ekipanay izany.",
		}),
		identityTitle: t({
			fr: "Message envoyé avec votre compte",
			en: "Message sent with your account",
			mg: "Hafatra alefa amin'ny kaontinao",
		}),
		identityDescription: t({
			fr: "Nous utiliserons votre nom et votre adresse e-mail de session pour vous répondre.",
			en: "We'll use your signed-in name and email address to reply.",
			mg: "Hampiasainay ny anaranao sy ny mailakao ao amin'ny kaonty hamaliana anao.",
		}),
		name: t({
			fr: "Nom complet",
			en: "Full name",
			mg: "Anarana feno",
		}),
		email: t({
			fr: "Adresse e-mail",
			en: "Email address",
			mg: "Adiresy mailaka",
		}),
		subject: t({
			fr: "Objet",
			en: "Subject",
			mg: "Lohahevitra",
		}),
		subjectPlaceholder: t({
			fr: "Ex: Question sur une réservation",
			en: "Example: Question about a booking",
			mg: "Ohatra: Fanontaniana momba ny famandrihana",
		}),
		message: t({
			fr: "Message",
			en: "Message",
			mg: "Hafatra",
		}),
		messagePlaceholder: t({
			fr: "Décrivez votre demande en quelques lignes...",
			en: "Describe your request in a few lines...",
			mg: "Farito amin'ny andalana vitsivitsy ny fangatahanao...",
		}),
		submit: t({
			fr: "Envoyer le message",
			en: "Send message",
			mg: "Alefaso ny hafatra",
		}),
		submitting: t({
			fr: "Envoi...",
			en: "Sending...",
			mg: "Mandefa...",
		}),
		successTitle: t({
			fr: "Message envoyé",
			en: "Message sent",
			mg: "Nalefa ny hafatra",
		}),
		successDescription: t({
			fr: "Merci, votre demande a bien été transmise.",
			en: "Thanks, your request has been sent.",
			mg: "Misaotra, voaray ny fangatahanao.",
		}),
		errorTitle: t({
			fr: "Impossible d’envoyer le message",
			en: "Unable to send message",
			mg: "Tsy afaka nandefa hafatra",
		}),
		errorDescription: t({
			fr: "Veuillez réessayer dans un instant.",
			en: "Please try again in a moment.",
			mg: "Andramo indray afaka kelikely.",
		}),
		errors: {
			nameRequired: t({
				fr: "Le nom est requis",
				en: "Name is required",
				mg: "Ilaina ny anarana",
			}),
			emailRequired: t({
				fr: "L’e-mail est requis",
				en: "Email is required",
				mg: "Ilaina ny mailaka",
			}),
			emailInvalid: t({
				fr: "L’adresse e-mail est invalide",
				en: "Invalid email address",
				mg: "Tsy mety ny adiresy mailaka",
			}),
			subjectRequired: t({
				fr: "L’objet est requis",
				en: "Subject is required",
				mg: "Ilaina ny lohahevitra",
			}),
			subjectMax: t({
				fr: "L’objet doit faire 160 caractères maximum",
				en: "Subject must be 160 characters or fewer",
				mg: "Tsy tokony hihoatra ny tarehintsoratra 160 ny lohahevitra",
			}),
			messageRequired: t({
				fr: "Le message est requis",
				en: "Message is required",
				mg: "Ilaina ny hafatra",
			}),
			messageMax: t({
				fr: "Le message doit faire 4000 caractères maximum",
				en: "Message must be 4000 characters or fewer",
				mg: "Tsy tokony hihoatra ny tarehintsoratra 4000 ny hafatra",
			}),
		},
	},
} satisfies Dictionary;

export default contactFormContent;
