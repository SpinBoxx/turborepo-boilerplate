import { type Dictionary, t } from "intlayer";

const forgotPasswordFormContent = {
	key: "forgot-password-form",
	content: {
		email: t({
			fr: "Email",
			en: "Email",
			mg: "Mailaka",
		}),
		emailIsRequired: t({
			fr: "L'email est requis",
			en: "Email is required",
			mg: "Ilaina ny adiresy mailaka",
		}),
		submit: t({
			fr: "Envoyer le lien",
			en: "Send reset link",
			mg: "Alefaso ny rohy",
		}),
		backToLogin: t({
			fr: "Retour à la connexion",
			en: "Back to sign in",
			mg: "Hiverina hiditra",
		}),
	},
} satisfies Dictionary;

export default forgotPasswordFormContent;
