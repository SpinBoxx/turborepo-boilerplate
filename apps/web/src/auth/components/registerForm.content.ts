import { type Dictionary, t } from "intlayer";

const registerFormContent = {
	key: "register-form",
	content: {
		emailIsRequired: t({
			fr: "L'email est requis",
			en: "Email is required",
			mg: "Ilaina ny adiresy mailaka",
		}),
		email: t({
			fr: "Email",
			en: "Email",
			mg: "Mailaka",
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
	},
} satisfies Dictionary;

export default registerFormContent;
