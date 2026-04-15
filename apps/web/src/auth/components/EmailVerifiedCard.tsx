import { Link } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { sanitizeRedirectTo } from "@/auth/services/auth-dialog.service";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";

export default function EmailVerifiedCard({
	redirectTo,
}: {
	redirectTo?: string;
}) {
	const content = useIntlayer("email-verified-card");
	const safeRedirectTo = sanitizeRedirectTo(redirectTo);

	return (
		<Dialog defaultOpen open={true} modal={false}>
			<DialogPopup
				allowOutsideInteraction
				className="h-[90dvh] sm:h-auto sm:max-w-md"
				disableBackdrop
				showCloseButton={false}
			>
				<div className="contents">
					<DialogHeader className="items-center text-center">
						<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
							<CheckIcon className="size-8 text-primary" />
						</div>
						<p className="mt-4 font-medium text-primary text-sm">
							{content.subtitle.value}
						</p>
						<DialogTitle className="mt-1 text-balance">
							{content.title.value}
						</DialogTitle>
						<DialogDescription className="max-w-sm text-pretty">
							{content.description.value}
						</DialogDescription>
					</DialogHeader>

					<DialogPanel className="grid gap-5">
						<Link
							to="/login"
							search={{
								redirectTo: safeRedirectTo,
							}}
						>
							<Button className="w-full">{content.loginCta.value}</Button>
						</Link>
					</DialogPanel>
				</div>
			</DialogPopup>
		</Dialog>
	);
}
