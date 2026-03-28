import { type Dictionary, t } from "intlayer";

const verifyEmailDialogContent = {
	key: "verify-email-dialog",
	content: {
		title: t({
			fr: "Vérifiez votre boîte mail",
			en: "Check your inbox",
			mg: "Jereo ny boaty mailaka",
		}),
		description: t({
			fr: "Nous avons envoyé un lien de vérification à",
			en: "We've sent a verification link to",
			mg: "Nandefa rohy fanamarinana ho any amin'ny",
		}),
		instructions: t({
			fr: "Cliquez sur le lien dans l'email pour activer votre compte. L'email peut prendre quelques minutes à arriver.",
			en: "Click the link in the email to activate your account. The email may take a few minutes to arrive.",
			mg: "Tsindrio ny rohy ao amin'ny mailaka mba hamelana ny kaontinao. Mety ho ela kely vao tonga ny mailaka.",
		}),
		checkSpam: t({
			fr: "Vérifiez vos spams si vous ne trouvez pas l'email.",
			en: "Check your spam folder if you don't see the email.",
			mg: "Jereo ny spam raha tsy hitanao ny mailaka.",
		}),
		didntReceive: t({
			fr: "Vous n'avez pas reçu l'email ?",
			en: "Didn't receive the email?",
			mg: "Tsy nahazo ny mailaka ve?",
		}),
		resendEmail: t({
			fr: "Renvoyer l'email",
			en: "Resend email",
			mg: "Avereno alefa ny mailaka",
		}),
		resendIn: t({
			fr: "Renvoyer dans",
			en: "Resend in",
			mg: "Avereno alefa afaka",
		}),
		seconds: t({
			fr: "s",
			en: "s",
			mg: "s",
		}),
		emailResent: t({
			fr: "Email renvoyé avec succès",
			en: "Email resent successfully",
			mg: "Mailaka nalefa indray soa aman-tsara",
		}),
		emailResendFailed: t({
			fr: "Échec de l'envoi de l'email. Veuillez réessayer.",
			en: "Failed to resend email. Please try again.",
			mg: "Tsy nahomby ny fandefasana mailaka. Andramo indray.",
		}),
		backToLogin: t({
			fr: "Retour à la connexion",
			en: "Back to login",
			mg: "Miverina amin'ny fidirana",
		}),
		pageTitle: t({
			fr: "Vérification de l'email",
			en: "Email verification",
			mg: "Fanamarinana ny mailaka",
		}),
	},
} satisfies Dictionary;

export default verifyEmailDialogContent;
