import { type Dictionary, t } from "intlayer";

const localeDialogContent = {
	key: "locale-dialog",
	content: {
		title: t({
			fr: "Choisissez votre langue",
			en: "Choose your language",
			mg: "Fidio ny fiteninao",
		}),
		description: t({
			fr: "Sélectionnez votre langue préférée parmi les options ci-dessous.",
			en: "Select your preferred language from the options below.",
			mg: "Safidio ny fiteny tianao amin'ireo safidy etsy ambany.",
		}),
		cancel: t({
			fr: "Annuler",
			en: "Cancel",
			mg: "Hanafoana",
		}),
		save: t({
			fr: "Enregistrer",
			en: "Save",
			mg: "Tehirizo",
		}),
	},
} satisfies Dictionary;

export default localeDialogContent;
