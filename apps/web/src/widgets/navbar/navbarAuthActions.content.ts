import { type Dictionary, t } from "intlayer";

const navbarAuthActionsContent = {
	key: "navbar",
	content: {
		profile: t({
			fr: "Profil",
			en: "Profile",
			mg: "Mombamomba",
		}),
		navbarLinks: {
			home: t({
				fr: "Accueil",
				en: "Home",
				mg: "Trano",
			}),
			hotels: t({
				fr: "Hôtels",
				en: "Hotels",
				mg: "Hotely",
			}),
		},
		myAccount: t({
			fr: "Mon compte",
			en: "My account",
			mg: "Kaontiko",
		}),
		settings: t({
			fr: "Paramètres",
			en: "Settings",
			mg: "Fikirakirana",
		}),
		preferences: t({
			fr: "Préférences",
			en: "Preferences",
			mg: "Safidy",
		}),
		appearance: t({
			fr: "Apparence",
			en: "Appearance",
			mg: "Bika",
		}),
		lightTheme: t({
			fr: "Clair",
			en: "Light",
			mg: "Mazava",
		}),
		darkTheme: t({
			fr: "Sombre",
			en: "Dark",
			mg: "Maizina",
		}),
		language: t({
			fr: "Langue",
			en: "Language",
			mg: "Fiteny",
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
		mobileNavigation: t({
			fr: "Navigation principale",
			en: "Primary navigation",
			mg: "Fitetezana fototra",
		}),
	},
} satisfies Dictionary;

export default navbarAuthActionsContent;
