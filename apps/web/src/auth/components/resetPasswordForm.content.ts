import { type Dictionary, t } from "intlayer";

const resetPasswordFormContent = {
	key: "reset-password-form",
	content: {
		newPassword: t({
			fr: "Nouveau mot de passe",
			en: "New password",
			mg: "Tenimiafina vaovao",
		}),
		confirmPassword: t({
			fr: "Confirmer le mot de passe",
			en: "Confirm password",
			mg: "Hamafiso ny tenimiafina",
		}),
		passwordIsRequired: t({
			fr: "Le mot de passe est requis",
			en: "Password is required",
			mg: "Ilaina ny tenimiafina",
		}),
		passwordIsTooShort: t({
			fr: "Le mot de passe doit contenir au moins 8 caractères",
			en: "Password must be at least 8 characters",
			mg: "Tokony hanana tarehintsoratra 8 farafahakeliny ny tenimiafina",
		}),
		passwordsDoNotMatch: t({
			fr: "Les mots de passe ne correspondent pas",
			en: "Passwords do not match",
			mg: "Tsy mitovy ny tenimiafina",
		}),
		submit: t({
			fr: "Réinitialiser le mot de passe",
			en: "Reset password",
			mg: "Havaozy ny tenimiafina",
		}),
	},
} satisfies Dictionary;

export default resetPasswordFormContent;
