import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";
import { $fetch } from "@/lib/fetch";

const RESEND_COOLDOWN = 60;

function maskEmail(email: string): string {
	const [local, domain] = email.split("@");
	if (!local || !domain) return email;
	if (local.length <= 2) return `${local}@${domain}`;
	return `${local[0]}${"•".repeat(Math.min(local.length - 2, 6))}${local[local.length - 1]}@${domain}`;
}

export default function VerifyEmailDialog({ email }: { email: string }) {
	const content = useIntlayer("verify-email-dialog");
	const navigate = useNavigate();
	const [cooldown, setCooldown] = useState(0);
	const [isResending, setIsResending] = useState(false);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const startCooldown = useCallback(() => {
		setCooldown(RESEND_COOLDOWN);
		timerRef.current = setInterval(() => {
			setCooldown((prev) => {
				if (prev <= 1) {
					if (timerRef.current) clearInterval(timerRef.current);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, []);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	const handleResend = async () => {
		if (cooldown > 0 || isResending) return;
		setIsResending(true);
		try {
			const res = await $fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/send-verification-email`,
				{
					method: "POST",
					credentials: "include",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						email,
						callbackURL: `${window.location.origin}/email-verified`,
					}),
				},
			);
			if (res.error) {
				toast.error(content.emailResendFailed.value);
			} else {
				toast.success(content.emailResent.value);
				startCooldown();
			}
		} catch {
			toast.error(content.emailResendFailed.value);
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
								disabled={cooldown > 0 || isResending}
							>
								{cooldown > 0
									? `${content.resendIn.value} ${cooldown}${content.seconds.value}`
									: content.resendEmail.value}
							</Button>
						</div>

						<Button
							variant="ghost"
							className="mx-auto text-muted-foreground"
							onClick={() => navigate({ to: "/login" })}
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
