import { type Dictionary, t } from "intlayer";

const commonContent = {
	key: "common",
	content: {
		toggleTheme: t({
			fr: "Changer le thème",
			en: "Toggle theme",
			mg: "Hanova loko",
		}),
		copied: t({
			fr: "Copié",
			en: "Copied",
			mg: "Voatahiry",
		}),
		copyToClipboard: t({
			fr: "Copier dans le presse-papier",
			en: "Copy to clipboard",
			mg: "Adikao",
		}),
		showPassword: t({
			fr: "Afficher le mot de passe",
			en: "Show password",
			mg: "Asehoy ny tenimiafina",
		}),
		hidePassword: t({
			fr: "Masquer le mot de passe",
			en: "Hide password",
			mg: "Afeno ny tenimiafina",
		}),
		noItemsFound: t({
			fr: "Aucun élément trouvé.",
			en: "No items found.",
			mg: "Tsy misy zavatra hita.",
		}),
		email: t({
			fr: "Email",
			en: "Email",
			mg: "Mailaka",
		}),
		password: t({
			fr: "Mot de passe",
			en: "Password",
			mg: "Tenimiafina",
		}),
		register: t({
			fr: "S'inscrire",
			en: "Register",
			mg: "Hisoratra anarana",
		}),
		login: t({
			fr: "Connexion",
			en: "Login",
			mg: "Fidirana",
		}),
		logo: t({
			fr: "Logo",
			en: "Logo",
			mg: "Logo",
		}),
		backgroundImage: t({
			fr: "Image de fond",
			en: "Background",
			mg: "Sary ambadika",
		}),
		sortHotels: t({
			fr: "Trier les hôtels",
			en: "Sort hotels",
			mg: "Alaharo ny hotely",
		}),
		filterActive: t({
			fr: "Actif",
			en: "On",
			mg: "Mandeha",
		}),
		hotelSearch: t({
			fr: "Rechercher un hôtel",
			en: "Hotel search",
			mg: "Fikarohan'ny hotely",
		}),
		reviewCartCheckout: t({
			fr: "Vérifier le panier",
			en: "Review Cart Checkout",
			mg: "Jereo ny harona",
		}),
		dragAndDrop: t({
			fr: "Glissez-déposez les fichiers ici",
			en: "Drag & drop files here",
			mg: "Atsipazo ny rakitra eto",
		}),
		orClickToBrowse: t({
			fr: "Ou cliquez pour parcourir",
			en: "Or click to browse",
			mg: "Na tsindrio mba hitadiavana",
		}),
		browseFiles: t({
			fr: "Parcourir les fichiers",
			en: "Browse files",
			mg: "Tadiavo ny rakitra",
		}),
		fileRejected: t({
			fr: "a été refusé",
			en: "has been rejected",
			mg: "nolavina",
		}),
		averagePrice: t({
			fr: "Prix moyen",
			en: "Average price",
			mg: "Vidiny antonony",
		}),
	},
} satisfies Dictionary;

export default commonContent;
