import { useIntlayer } from "react-intlayer";
import ForgotPasswordForm from "@/auth/components/ForgotPasswordForm";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";

export default function ForgotPasswordPage({
	redirectTo,
}: {
	redirectTo?: string;
}) {
	const content = useIntlayer("password-reset-pages");

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
						<DialogTitle>{content.forgotPasswordTitle.value}</DialogTitle>
						<DialogDescription>
							{content.forgotPasswordDescription.value}
						</DialogDescription>
					</DialogHeader>
					<DialogPanel className="grid gap-4">
						<ForgotPasswordForm redirectTo={redirectTo} />
					</DialogPanel>
				</div>
			</DialogPopup>
		</Dialog>
	);
}
