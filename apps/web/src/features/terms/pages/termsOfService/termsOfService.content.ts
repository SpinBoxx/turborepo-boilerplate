import { type Dictionary, t } from "intlayer";

const termsOfServicePageContent = {
	key: "terms-of-service-page",
	content: {
		notFoundTitle: t({
			fr: "Conditions générales de service introuvables",
			en: "Terms of service not found",
			mg: "Tsy hita ny fepetra momba ny serivisy",
		}),
		notFoundDescription: t({
			fr: "Les conditions générales de service ne sont pas disponibles pour le moment. Veuillez revenir plus tard.",
			en: "The terms of service are not available at the moment. Please check back later.",
			mg: "Tsy misy amin'izao fotoana izao ny fepetra momba ny serivisy. Azafady miverena any aoriana.",
		}),
		returnHome: t({
			fr: "Retour à l'accueil",
			en: "Return to homepage",
			mg: "Hiverina amin'ny pejy fandraisana",
		}),
	},
} satisfies Dictionary;

export default termsOfServicePageContent;
