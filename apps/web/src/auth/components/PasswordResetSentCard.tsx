import { Link } from "@tanstack/react-router";
import { maskEmailAddress } from "@zanadeal/utils";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { useIntlayer } from "react-intlayer";
import {
	buildPasswordResetCallbackUrl,
	sanitizeRedirectTo,
} from "@/auth/services/auth-dialog.service";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";
import { useStoredCooldown } from "@/hooks/useStoredCooldown";
import { useAuth } from "../providers/AuthProvider";

const RESEND_COOLDOWN = 60;
const RESEND_COOLDOWN_STORAGE_PREFIX =
	"zanadeal:password-reset:resend-cooldown";

export default function PasswordResetSentCard({
	email,
	redirectTo,
}: {
	email?: string;
	redirectTo?: string;
}) {
	const content = useIntlayer("password-reset-cards");
	const [isResending, setIsResending] = useState(false);
	const { requestPasswordReset } = useAuth();
	const safeRedirectTo = sanitizeRedirectTo(redirectTo) ?? "/";
	const { remainingSeconds, isCoolingDown, startCooldown } = useStoredCooldown({
		storageKey: `${RESEND_COOLDOWN_STORAGE_PREFIX}:${email?.toLowerCase() ?? "anonymous"}`,
		durationSeconds: RESEND_COOLDOWN,
	});

	const handleResend = async () => {
		if (!email || isCoolingDown || isResending) return;
		setIsResending(true);
		try {
			const sent = await requestPasswordReset({
				email,
				redirectTo: buildPasswordResetCallbackUrl(
					window.location.origin,
					safeRedirectTo,
				),
			});
			if (sent) startCooldown();
		} finally {
			setIsResending(false);
		}
	};

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
							<MailIcon className="size-8 text-primary" />
						</div>
						<p className="mt-4 font-medium text-primary text-sm">
							{content.sentSubtitle.value}
						</p>
						<DialogTitle className="mt-1 text-balance">
							{content.sentTitle.value}
						</DialogTitle>
						<DialogDescription className="max-w-sm text-pretty">
							{content.sentDescription.value}
						</DialogDescription>
						{email ? (
							<p className="mt-1 font-medium text-foreground text-sm">
								{maskEmailAddress(email)}
							</p>
						) : null}
					</DialogHeader>

					<DialogPanel className="grid gap-5">
						{email ? (
							<div className="flex flex-col items-center gap-3">
								<p className="text-muted-foreground text-sm">
									{content.didntReceive.value}
								</p>
								<Button
									onClick={handleResend}
									variant="outline"
									className="w-full"
									disabled={isCoolingDown || isResending}
								>
									{isCoolingDown
										? `${content.resendIn.value} ${remainingSeconds}${content.seconds.value}`
										: content.resendEmail.value}
								</Button>
							</div>
						) : null}

						<Link
							to="/login"
							search={{
								redirectTo: safeRedirectTo,
							}}
						>
							<Button variant="ghost" className="mx-auto text-muted-foreground">
								<ArrowLeftIcon className="size-4" />
								{content.backToLogin.value}
							</Button>
						</Link>
					</DialogPanel>
				</div>
			</DialogPopup>
		</Dialog>
	);
}
