import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { useIntlayer } from "react-intlayer";
import {
	buildEmailVerifiedCallbackUrl,
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
const RESEND_COOLDOWN_STORAGE_PREFIX = "zanadeal:verify-email:resend-cooldown";

function maskEmail(email: string): string {
	const [local, domain] = email.split("@");
	if (!local || !domain) return email;
	if (local.length <= 2) return `${local}@${domain}`;
	return `${local[0]}${"•".repeat(Math.min(local.length - 2, 6))}${local[local.length - 1]}@${domain}`;
}

export default function VerifyEmailDialog({
	email,
	redirectTo,
}: {
	email: string;
	redirectTo?: string;
}) {
	const content = useIntlayer("verify-email-dialog");
	const navigate = useNavigate();
	const [isResending, setIsResending] = useState(false);
	const { sendVerificationEmail } = useAuth();
	const safeRedirectTo = sanitizeRedirectTo(redirectTo);
	const { remainingSeconds, isCoolingDown, startCooldown } = useStoredCooldown({
		storageKey: `${RESEND_COOLDOWN_STORAGE_PREFIX}:${email.toLowerCase()}`,
		durationSeconds: RESEND_COOLDOWN,
	});

	const handleResend = async () => {
		if (isCoolingDown || isResending) return;
		setIsResending(true);
		try {
			await sendVerificationEmail({
				email,
				callbackURL: buildEmailVerifiedCallbackUrl(
					window.location.origin,
					safeRedirectTo,
				),
			});
			startCooldown();
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
						<DialogTitle className="mt-2">{content.title.value}</DialogTitle>
						<DialogDescription>{content.description.value}</DialogDescription>
						<p className="mt-1 font-medium text-foreground text-sm">
							{maskEmail(email)}
						</p>
					</DialogHeader>

					<DialogPanel className="grid gap-5">
						<div className="rounded-xl bg-muted/50 p-4 text-sm">
							<p className="text-muted-foreground leading-relaxed">
								{content.instructions.value}
							</p>
							<p className="mt-2 text-muted-foreground leading-relaxed">
								{content.checkSpam.value}
							</p>
						</div>

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

						<Button
							variant="ghost"
							className="mx-auto text-muted-foreground"
							onClick={() =>
								navigate({
									to: "/login",
									search: {
										redirectTo: safeRedirectTo,
									},
								})
							}
						>
							<ArrowLeftIcon className="size-4" />
							{content.backToLogin.value}
						</Button>
					</DialogPanel>
				</div>
			</DialogPopup>
		</Dialog>
	);
}
