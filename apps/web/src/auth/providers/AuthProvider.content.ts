import { type Dictionary, t } from "intlayer";

const authProviderContent = {
	key: "auth-provider",
	content: {
		loginFailed: t({
			fr: "Échec de la connexion",
			en: "Login failed",
			mg: "Tsy nahomby ny fidirana",
		}),
		invalidEmailOrPassword: t({
			fr: "Email ou mot de passe invalide.",
			en: "Invalid email or password.",
			mg: "Tsy mety ny mailaka na ny tenimiafina.",
		}),
		invalidResponseFormat: t({
			fr: "Format de réponse invalide.",
			en: "Invalid response format.",
			mg: "Tsy mety ny endrika valiny.",
		}),
		unexpectedError: t({
			fr: "Une erreur inattendue s'est produite.",
			en: "An unexpected error occurred.",
			mg: "Nisy olana tsy nampoizina.",
		}),
		failedToSendVerificationEmail: t({
			fr: "Échec de l'envoi de l'e-mail de vérification",
			en: "Failed to send verification email",
			mg: "Tsy nahomby ny fandefasana mailaka fanamarinana",
		}),
		pleaseTryAgainLater: t({
			fr: "Veuillez réessayer plus tard.",
			en: "Please try again later.",
			mg: "Andramo indray aoriana.",
		}),
		verificationEmailSent: t({
			fr: "E-mail de vérification envoyé",
			en: "Verification email sent",
			mg: "Lasa ny mailaka fanamarinana",
		}),
		checkInboxInstructions: t({
			fr: "Veuillez vérifier votre boîte de réception et suivre les instructions.",
			en: "Please check your inbox and follow the instructions.",
			mg: "Jereo ny boaty mailaka ary araho ny torolalana.",
		}),
		accountCreationFailed: t({
			fr: "Échec de la création du compte",
			en: "Account creation failed",
			mg: "Tsy nahomby ny famoronana kaonty",
		}),
		cannotCreateAccount: t({
			fr: "Impossible de créer votre compte. Réessayez plus tard.",
			en: "Cannot create your account. Try again later.",
			mg: "Tsy afaka mamorona ny kaontinao. Andramo indray aoriana.",
		}),
		signOutFailed: t({
			fr: "Échec de la déconnexion",
			en: "Sign out failed",
			mg: "Tsy nahomby ny fivoahana",
		}),
		unableToSignOut: t({
			fr: "Impossible de se déconnecter. Réessayez plus tard.",
			en: "Unable to sign out. Try again later.",
			mg: "Tsy afaka mivoaka. Andramo indray aoriana.",
		}),
	},
} satisfies Dictionary;

export default authProviderContent;
