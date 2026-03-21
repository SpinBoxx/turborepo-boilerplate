import { type Dictionary, t } from "intlayer";

const footerContent = {
	key: "footer",
	content: {
		companyTitle: t({
			fr: "Entreprise",
			en: "Company",
			mg: "Orinasa",
		}),
		about: t({
			fr: "À propos",
			en: "About",
			mg: "Momba anay",
		}),
		contact: t({
			fr: "Contact",
			en: "Contact",
			mg: "Hifandray",
		}),
		legalTitle: t({
			fr: "Légal",
			en: "Legal",
			mg: "Ara-dalàna",
		}),
		privacyPolicy: t({
			fr: "Politique de confidentialité",
			en: "Privacy Policy",
			mg: "Politikan'ny tsiambaratelo",
		}),
		termsOfService: t({
			fr: "Conditions d'utilisation",
			en: "Terms of Service",
			mg: "Fepetra fampiasana",
		}),
		description: t({
			fr: "Réservez votre séjour parfait à Madagascar.",
			en: "Book your perfect stay in Madagascar.",
			mg: "Rezervao ny fialan-tsasatrao tonga lafatra any Madagasikara.",
		}),
		allRightsReserved: t({
			fr: "Tous droits réservés.",
			en: "All rights reserved.",
			mg: "Zo rehetra voatokana.",
		}),
	},
} satisfies Dictionary;

export default footerContent;
