import { type Dictionary, t } from "intlayer";

const settingsContent = {
	key: "settings",
	content: {
		accountSettings: t({
			fr: "Paramètres du compte",
			en: "Account settings",
			mg: "Fikirakirana kaonty",
		}),
		personalInformation: t({
			fr: "Informations personnelles",
			en: "Personal information",
			mg: "Mombamomba manokana",
		}),
		information: t({ fr: "Informations", en: "Information", mg: "Mombamomba" }),
		edit: t({ fr: "Modifier", en: "Edit", mg: "Hanova" }),
		cancel: t({ fr: "Annuler", en: "Cancel", mg: "Hanafoana" }),
		save: t({ fr: "Enregistrer", en: "Save", mg: "Hitahiry" }),
		done: t({ fr: "Terminé", en: "Done", mg: "Vita" }),
		back: t({ fr: "Retour", en: "Back", mg: "Hiverina" }),
		nameHelper: t({
			fr: "Assurez-vous que le nom correspond à celui qui figure sur votre pièce d'identité.",
			en: "Make sure this matches the name on your identity document.",
			mg: "Ataovy azo antoka fa mitovy amin'ny anarana ao amin'ny kara-panondro izany.",
		}),
		firstNameOnId: t({
			fr: "Prénom sur la pièce d'identité",
			en: "First name on identity document",
			mg: "Anarana ao amin'ny kara-panondro",
		}),
		lastNameOnId: t({
			fr: "Nom sur la pièce d'identité",
			en: "Last name on identity document",
			mg: "Fanampin'anarana ao amin'ny kara-panondro",
		}),
		emailLabel: t({
			fr: "Adresse e-mail",
			en: "Email address",
			mg: "Adiresy mailaka",
		}),
		profileUpdated: t({
			fr: "Informations mises à jour",
			en: "Information updated",
			mg: "Nohavaozina ny mombamomba",
		}),
		profileUpdateFailed: t({
			fr: "Impossible de mettre à jour vos informations",
			en: "Unable to update your information",
			mg: "Tsy afaka manavao ny mombamombanao",
		}),
		requiredField: t({
			fr: "Ce champ est obligatoire.",
			en: "This field is required.",
			mg: "Takiana ity saha ity.",
		}),
		invalidEmail: t({
			fr: "Saisissez une adresse e-mail valide.",
			en: "Enter a valid email address.",
			mg: "Ampidiro ny mailaka marina.",
		}),
	},
} satisfies Dictionary;

export default settingsContent;