import { type Dictionary, t } from "intlayer";

const authDialogContent = {
	key: "auth-dialog",
	content: {
		loginDialogTitle: t({
			fr: "Se connecter",
			en: "Sign in",
			mg: "Hiditra",
		}),
		registerDialogTitle: t({
			fr: "S'inscrire",
			en: "Register",
			mg: "Hisoratra anarana",
		}),
		openDialog: t({
			fr: "Ouvrir la boîte de dialogue",
			en: "Open dialog",
			mg: "Sokafy ny varavarankely",
		}),
		pleaseEnterYourLoginDetails: t({
			fr: "Veuillez saisir vos informations de connexion.",
			en: "Please enter your login details.",
			mg: "Ampidiro azafady ny mombamomba ny fidiranao.",
		}),
		pleaseEnterYourRegistrationDetails: t({
			fr: "Veuillez saisir vos informations d'inscription.",
			en: "Please enter your registration details.",
			mg: "Ampidiro azafady ny mombamomba ny fisoratanao anarana.",
		}),
	},
} satisfies Dictionary;

export default authDialogContent;
