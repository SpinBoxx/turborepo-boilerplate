import { type Dictionary, t } from "intlayer";

const emailVerifiedCardContent = {
	key: "email-verified-card",
	content: {
		title: t({
			fr: "Email vérifié avec succès",
			en: "Email verified successfully",
			mg: "Voamarina soa aman-tsara ny mailaka",
		}),
		description: t({
			fr: "Votre adresse email est maintenant confirmée. Vous pouvez vous connecter et continuer.",
			en: "Your email address is now confirmed. You can sign in and continue.",
			mg: "Voamarina izao ny adiresy mailakao. Afaka miditra sy manohy ianao.",
		}),
		subtitle: t({
			fr: "Compte activé",
			en: "Account activated",
			mg: "Kaonty navadika ho mavitrika",
		}),
		loginCta: t({
			fr: "Se connecter",
			en: "Sign in",
			mg: "Hiditra",
		}),
		secondaryHint: t({
			fr: "Utilisez les identifiants choisis lors de votre inscription.",
			en: "Use the credentials you chose during sign up.",
			mg: "Ampiasao ireo mombamomba nofidinao nandritra ny fisoratana anarana.",
		}),
		pageTitle: t({
			fr: "Email vérifié",
			en: "Email verified",
			mg: "Mailaka voamarina",
		}),
	},
} satisfies Dictionary;

export default emailVerifiedCardContent;