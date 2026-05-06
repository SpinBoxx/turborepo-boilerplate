import { type Dictionary, t } from "intlayer";

const passwordResetCardsContent = {
	key: "password-reset-cards",
	content: {
		sentSubtitle: t({
			fr: "Lien envoyé",
			en: "Link sent",
			mg: "Lasa ny rohy",
		}),
		sentTitle: t({
			fr: "Vérifiez votre boîte mail",
			en: "Check your inbox",
			mg: "Jereo ny boaty mailakao",
		}),
		sentDescription: t({
			fr: "Si cette adresse correspond à un compte, vous recevrez un lien pour choisir un nouveau mot de passe.",
			en: "If this address matches an account, you will receive a link to choose a new password.",
			mg: "Raha mifanaraka amin'ny kaonty io adiresy io dia hahazo rohy hisafidianana tenimiafina vaovao ianao.",
		}),
		didntReceive: t({
			fr: "Vous n'avez rien reçu ?",
			en: "Did not receive anything?",
			mg: "Tsy nahazo na inona na inona?",
		}),
		resendEmail: t({
			fr: "Renvoyer l'e-mail",
			en: "Resend email",
			mg: "Alefaso indray ny mailaka",
		}),
		resendIn: t({
			fr: "Renvoyer dans",
			en: "Resend in",
			mg: "Alefaso indray afaka",
		}),
		seconds: t({
			fr: "s",
			en: "s",
			mg: "s",
		}),
		backToLogin: t({
			fr: "Retour à la connexion",
			en: "Back to sign in",
			mg: "Hiverina hiditra",
		}),
		invalidSubtitle: t({
			fr: "Lien invalide",
			en: "Invalid link",
			mg: "Rohy tsy mety",
		}),
		invalidTitle: t({
			fr: "Demandez un nouveau lien",
			en: "Request a new link",
			mg: "Mangataha rohy vaovao",
		}),
		invalidDescription: t({
			fr: "Ce lien de réinitialisation est absent, invalide ou expiré.",
			en: "This password reset link is missing, invalid, or expired.",
			mg: "Tsy hita, tsy mety, na lany daty ity rohy fanavaozana tenimiafina ity.",
		}),
		requestNewLink: t({
			fr: "Demander un nouveau lien",
			en: "Request a new link",
			mg: "Mangataha rohy vaovao",
		}),
		successSubtitle: t({
			fr: "Mot de passe mis à jour",
			en: "Password updated",
			mg: "Voavao ny tenimiafina",
		}),
		successTitle: t({
			fr: "Vous pouvez vous connecter",
			en: "You can sign in now",
			mg: "Afaka miditra ianao izao",
		}),
		successDescription: t({
			fr: "Votre nouveau mot de passe est actif. Utilisez-le pour accéder à votre compte.",
			en: "Your new password is active. Use it to access your account.",
			mg: "Miasa ny tenimiafina vaovao. Ampiasao izany hidirana amin'ny kaontinao.",
		}),
		loginCta: t({
			fr: "Se connecter",
			en: "Sign in",
			mg: "Hiditra",
		}),
	},
} satisfies Dictionary;

export default passwordResetCardsContent;
