import { type Dictionary, t } from "intlayer";

const termsAndConditionsOfSalePageContent = {
	key: "terms-and-conditions-of-sale-page",
	content: {
		notFoundTitle: t({
			fr: "Conditions générales de vente introuvables",
			en: "Terms and conditions of sale not found",
			mg: "Tsy hita ny fepetra sy fepetra momba ny varotra",
		}),
		notFoundDescription: t({
			fr: "Les conditions générales de vente ne sont pas disponibles pour le moment. Veuillez revenir plus tard.",
			en: "The terms and conditions of sale are not available at the moment. Please check back later.",
			mg: "Tsy misy amin'izao fotoana izao ny fepetra sy fepetra momba ny varotra. Azafady miverena any aoriana.",
		}),
		returnHome: t({
			fr: "Retour à l'accueil",
			en: "Return to homepage",
			mg: "Hiverina amin'ny pejy fandraisana",
		}),
	},
} satisfies Dictionary;

export default termsAndConditionsOfSalePageContent;
