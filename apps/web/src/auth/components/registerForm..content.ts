import { type Dictionary, t } from "intlayer";

const registerFormContent = {
	key: "register-form",
	content: {
		emailIsRequired: t({
			fr: "L'email est requis",
			en: "Email is required",
			mg: "Ilaina ny adiresy mailaka",
		}),
		passwordIsRequired: t({
			fr: "Le mot de passe est requis",
			en: "Password is required",
			mg: "Ilaina ny tenimiafina",
		}),
		firstNameIsRequired: t({
			fr: "Le prénom est requis",
			en: "First name is required",
			mg: "Ilaina ny anarana",
		}),
		firstName: t({
			fr: "Prénom",
			en: "First name",
			mg: "Anarana",
		}),
		lastNameIsRequired: t({
			fr: "Le nom est requis",
			en: "Last name is required",
			mg: "Ilaina ny fanampin'anarana",
		}),
		lastName: t({
			fr: "Nom",
			en: "Last name",
			mg: "Fanampin'anarana",
		}),
		alreadyHaveAnAccountSign: t({
			fr: "Vous avez déjà un compte ? Connectez-vous",
			en: "Already have an account? Sign in",
			mg: "Efa manana kaonty ve ianao? Midira",
		}),
	},
} satisfies Dictionary;

export default registerFormContent;
