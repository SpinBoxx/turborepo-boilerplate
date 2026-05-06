import { type Dictionary, t } from "intlayer";

const passwordResetPagesContent = {
	key: "password-reset-pages",
	content: {
		forgotPasswordTitle: t({
			fr: "Mot de passe oublié",
			en: "Forgot password",
			mg: "Hadino ny tenimiafina",
		}),
		forgotPasswordDescription: t({
			fr: "Saisissez l'email de votre compte pour recevoir un lien de réinitialisation.",
			en: "Enter your account email to receive a reset link.",
			mg: "Ampidiro ny mailakan'ny kaontinao hahazoana rohy fanavaozana.",
		}),
		resetPasswordTitle: t({
			fr: "Nouveau mot de passe",
			en: "New password",
			mg: "Tenimiafina vaovao",
		}),
		resetPasswordDescription: t({
			fr: "Choisissez un mot de passe sécurisé pour votre compte.",
			en: "Choose a secure password for your account.",
			mg: "Misafidiana tenimiafina azo antoka ho an'ny kaontinao.",
		}),
	},
} satisfies Dictionary;

export default passwordResetPagesContent;
