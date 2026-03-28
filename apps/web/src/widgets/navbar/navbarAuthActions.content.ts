import { type Dictionary, t } from "intlayer";

const navbarAuthActionsContent = {
	key: "navbar",
	content: {
		profile: t({
			fr: "Profil",
			en: "Profile",
			mg: "Mombamomba",
		}),
		settings: t({
			fr: "Paramètres",
			en: "Settings",
			mg: "Fikirakirana",
		}),
		signOut: t({
			fr: "Se déconnecter",
			en: "Sign out",
			mg: "Hivoaka",
		}),
		login: t({
			fr: "Se connecter",
			en: "Login",
			mg: "Hiditra",
		}),
		home: t({
			fr: "Accueil",
			en: "Home",
			mg: "Trano",
		}),
	},
} satisfies Dictionary;

export default navbarAuthActionsContent;
