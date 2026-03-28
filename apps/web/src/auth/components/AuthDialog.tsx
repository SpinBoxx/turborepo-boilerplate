import { useState } from "react";
import { useIntlayer } from "react-intlayer";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useRouter, useRouterState } from "@tanstack/react-router";

export default function AuthDialog() {
	const content = useIntlayer("auth-dialog");
	const [isLogin, setIsLogin] = useState(true);

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
						<DialogTitle>
							{isLogin
								? content.loginDialogTitle.value
								: content.registerDialogTitle.value}
						</DialogTitle>
						<DialogDescription>
							{isLogin
								? content.pleaseEnterYourLoginDetails.value
								: content.pleaseEnterYourRegistrationDetails.value}
						</DialogDescription>
					</DialogHeader>
					<DialogPanel className="grid gap-4">
						{isLogin ? (
							<LoginForm onCreateAccountClick={() => setIsLogin(false)} />
						) : (
							<RegisterForm
								onAlreadyHaveAccountClick={() => setIsLogin(true)}
							/>
						)}
					</DialogPanel>
				</div>
			</DialogPopup>
		</Dialog>
	);
}
