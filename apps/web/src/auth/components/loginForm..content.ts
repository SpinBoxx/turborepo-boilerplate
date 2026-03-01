import { type Dictionary, t } from "intlayer";

const loginFormContent = {
	key: "login-form",
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
		password: t({
			fr: "Mot de passe",
			en: "Password",
			mg: "Tenimiafina",
		}),
		forgotPassword: t({
			fr: "Mot de passe oublié ?",
			en: "Forgot password?",
			mg: "Hadino ny tenimiafina?",
		}),
		login: t({
			fr: "Se connecter",
			en: "Sign in",
			mg: "Hiditra",
		}),
		noAccountTextAction: t({
			fr: "Vous n'avez pas de compte ? Créez un compte",
			en: "Don't have an account? Create one",
			mg: "Tsy manana kaonty ve ianao? Mamoròna kaonty",
		}),
	},
} satisfies Dictionary;

export default loginFormContent;
