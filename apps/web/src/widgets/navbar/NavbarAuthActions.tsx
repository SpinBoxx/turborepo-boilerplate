import { Link } from "@tanstack/react-router";
import { ChevronDown, LogOut, UserCog2 } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { useAuth } from "@/auth/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button";
import {
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from "../../components/ui/menu";
import NavbarPreferencesMenu, {
	NavbarPreferencesMenuGroup,
} from "./NavbarPreferencesMenu";

interface UserInitialAvatarProps {
	initial: string;
	size?: "trigger" | "menu";
	className?: string;
}

function UserInitialAvatar({
	initial,
	size = "trigger",
	className,
}: UserInitialAvatarProps) {
	return (
		<span
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground uppercase",
				size === "trigger" &&
					"size-6 text-xs sm:size-5.5 md:size-6.5 md:text-base",
				size === "menu" && "size-9 text-sm md:size-8.5 md:text-sm",
				className,
			)}
		>
			{initial}
		</span>
	);
}

export default function NavbarAuthActions() {
	const { user, signOut } = useAuth();
	const t = useIntlayer("navbar");
	if (!user) {
		return (
			<div className="flex items-center gap-2">
				<NavbarPreferencesMenu />
				<Link to="/login">
					<Button>{t.login.value}</Button>
				</Link>
			</div>
		);
	}

	const userEmail = user.email ?? "";
	const userInitial = userEmail.trim().charAt(0).toUpperCase() || "?";

	return (
		<div>
			<Menu>
				<MenuTrigger
					className="group"
					render={
						<Button
							aria-label={`${t.profile.value}: ${userEmail}`}
							variant="outline"
							className="h-10 gap-2 rounded-full px-2.5 pe-2 md:h-10.5 md:w-20 md:justify-between"
						/>
					}
				>
					<UserInitialAvatar initial={userInitial} />
					<ChevronDown className="size-4 text-muted-foreground transition-transform duration-150 group-data-popup-open:rotate-180 md:size-5.5" />
				</MenuTrigger>
				<MenuPopup align="end" className="w-72">
					<MenuGroup>
						<MenuGroupLabel className="px-2 py-2.5">
							<span className="flex items-center gap-3">
								<UserInitialAvatar
									initial={userInitial}
									size="menu"
									className="shadow-xs"
								/>
								<span className="min-w-0 space-y-0.5">
									<span className="block font-semibold text-foreground text-sm">
										{t.profile.value}
									</span>
									<span className="block truncate font-normal text-muted-foreground text-xs">
										{userEmail}
									</span>
								</span>
							</span>
						</MenuGroupLabel>
						<MenuItem className="min-h-10 gap-3 rounded-md px-2.5 py-2">
							<span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
								<UserCog2 className="size-4.5 md:size-4" />
							</span>
							<span className="font-medium text-sm">{t.myAccount.value}</span>
						</MenuItem>
					</MenuGroup>
					<MenuSeparator className="my-1.5" />
					<NavbarPreferencesMenuGroup />
					<MenuSeparator className="my-1.5" />
					<MenuItem
						className="min-h-10 cursor-pointer gap-3 rounded-md px-2.5 py-2 text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
						onClick={() => signOut()}
					>
						<span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
							<LogOut className="size-4.5 md:size-4" />
						</span>
						<span className="font-medium text-destructive text-sm">
							{t.signOut.value}
						</span>
					</MenuItem>
				</MenuPopup>
			</Menu>
		</div>
	);
}
