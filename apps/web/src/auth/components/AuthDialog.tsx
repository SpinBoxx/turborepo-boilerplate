import { type ReactElement, useMemo, useState } from "react";
import { useIntlayer } from "react-intlayer";
import {
	buildRedirectTo,
	sanitizeRedirectTo,
} from "@/auth/services/auth-dialog.service";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthDialogProps {
	children?: ReactElement;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	redirectTo?: string;
	loginTitle?: string;
	loginDescription?: string;
	registerTitle?: string;
	registerDescription?: string;
	className?: string;
	showCloseButton?: boolean;
	allowOutsideInteraction?: boolean;
	disableBackdrop?: boolean;
	modal?: boolean;
}

export default function AuthDialog({
	children,
	defaultOpen,
	open,
	onOpenChange,
	redirectTo,
	loginTitle,
	loginDescription,
	registerTitle,
	registerDescription,
	className,
	showCloseButton,
	allowOutsideInteraction,
	disableBackdrop,
	modal,
}: AuthDialogProps) {
	const content = useIntlayer("auth-dialog");
	const [isLogin, setIsLogin] = useState(true);
	const isTriggeredDialog = !!children;
	const resolvedRedirectTo = useMemo(() => {
		const safeRedirectTo = sanitizeRedirectTo(redirectTo);
		if (safeRedirectTo) {
			return safeRedirectTo;
		}

		if (!isTriggeredDialog || typeof window === "undefined") {
			return "/";
		}

		return buildRedirectTo({
			pathname: window.location.pathname,
			search: window.location.search,
			hash: window.location.hash,
		});
	}, [isTriggeredDialog, redirectTo]);
	const resolvedDefaultOpen = defaultOpen ?? !isTriggeredDialog;
	const resolvedShowCloseButton = showCloseButton ?? isTriggeredDialog;
	const resolvedAllowOutsideInteraction =
		allowOutsideInteraction ?? !isTriggeredDialog;
	const resolvedDisableBackdrop = disableBackdrop ?? !isTriggeredDialog;
	const resolvedModal = modal ?? isTriggeredDialog;
	const resolvedClassName = className ?? "h-[90dvh] sm:h-auto sm:max-w-sm";
	const resolvedLoginTitle = loginTitle ?? content.loginDialogTitle.value;
	const resolvedLoginDescription =
		loginDescription ?? content.pleaseEnterYourLoginDetails.value;
	const resolvedRegisterTitle =
		registerTitle ?? content.registerDialogTitle.value;
	const resolvedRegisterDescription =
		registerDescription ?? content.pleaseEnterYourRegistrationDetails.value;

	return (
		<Dialog
			defaultOpen={resolvedDefaultOpen}
			open={open}
			onOpenChange={onOpenChange}
			modal={resolvedModal}
		>
			{children ? <DialogTrigger render={children} /> : null}
			<DialogPopup
				allowOutsideInteraction={resolvedAllowOutsideInteraction}
				className={resolvedClassName}
				disableBackdrop={resolvedDisableBackdrop}
				showCloseButton={resolvedShowCloseButton}
			>
				<div className="contents">
					<DialogHeader>
						<DialogTitle>
							{isLogin ? resolvedLoginTitle : resolvedRegisterTitle}
						</DialogTitle>
						<DialogDescription>
							{isLogin ? resolvedLoginDescription : resolvedRegisterDescription}
						</DialogDescription>
					</DialogHeader>
					<DialogPanel className="grid gap-4">
						{isLogin ? (
							<LoginForm
								onCreateAccountClick={() => setIsLogin(false)}
								redirectTo={resolvedRedirectTo}
							/>
						) : (
							<RegisterForm
								onAlreadyHaveAccountClick={() => setIsLogin(true)}
								redirectTo={resolvedRedirectTo}
							/>
						)}
					</DialogPanel>
				</div>
			</DialogPopup>
		</Dialog>
	);
}
