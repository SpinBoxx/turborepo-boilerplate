import { useIntlayer } from "react-intlayer";
import PasswordResetStateCard from "@/auth/components/PasswordResetStateCard";
import ResetPasswordForm from "@/auth/components/ResetPasswordForm";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";

export default function ResetPasswordPage({
	error,
	redirectTo,
	token,
}: {
	error?: string;
	redirectTo?: string;
	token?: string;
}) {
	const content = useIntlayer("password-reset-pages");

	if (error || !token) {
		return <PasswordResetStateCard redirectTo={redirectTo} state="invalid" />;
	}

	return (
		<Dialog defaultOpen open={true} modal={false}>
			<DialogPopup
				allowOutsideInteraction
				className="h-[90dvh] sm:h-auto sm:max-w-sm"
				disableBackdrop
				showCloseButton={false}
			>
				<div className="contents">
					<DialogHeader>
						<DialogTitle>{content.resetPasswordTitle.value}</DialogTitle>
						<DialogDescription>
							{content.resetPasswordDescription.value}
						</DialogDescription>
					</DialogHeader>
					<DialogPanel className="grid gap-4">
						<ResetPasswordForm token={token} redirectTo={redirectTo} />
					</DialogPanel>
				</div>
			</DialogPopup>
		</Dialog>
	);
}
