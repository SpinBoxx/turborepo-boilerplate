import { Link } from "@tanstack/react-router";
import { AlertTriangleIcon, CheckIcon } from "lucide-react";
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

type PasswordResetStateCardProps = {
	redirectTo?: string;
	state: "invalid" | "success";
};

export default function PasswordResetStateCard({
	redirectTo,
	state,
}: PasswordResetStateCardProps) {
	const content = useIntlayer("password-reset-cards");
	const safeRedirectTo = sanitizeRedirectTo(redirectTo) ?? "/";
	const isSuccess = state === "success";
	const Icon = isSuccess ? CheckIcon : AlertTriangleIcon;

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
							<Icon className="size-8 text-primary" />
						</div>
						<p className="mt-4 font-medium text-primary text-sm">
							{isSuccess
								? content.successSubtitle.value
								: content.invalidSubtitle.value}
						</p>
						<DialogTitle className="mt-1 text-balance">
							{isSuccess
								? content.successTitle.value
								: content.invalidTitle.value}
						</DialogTitle>
						<DialogDescription className="max-w-sm text-pretty">
							{isSuccess
								? content.successDescription.value
								: content.invalidDescription.value}
						</DialogDescription>
					</DialogHeader>

					<DialogPanel className="grid gap-5">
						<Link
							to={isSuccess ? "/login" : "/forgot-password"}
							search={{
								redirectTo: safeRedirectTo,
							}}
						>
							<Button className="w-full">
								{isSuccess
									? content.loginCta.value
									: content.requestNewLink.value}
							</Button>
						</Link>
					</DialogPanel>
				</div>
			</DialogPopup>
		</Dialog>
	);
}
