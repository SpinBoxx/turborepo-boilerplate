import { Link } from "@tanstack/react-router";
import { CircleUserRound, LogOut, UserCog2 } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import {
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from "@/components/ui/menu";
import { NavbarPreferencesMenuGroup } from "@/widgets/navbar/NavbarPreferencesMenu";
import UserInitialAvatar from "@/widgets/navbar/UserInitialAvatar";
import { mobileBottomNavItemClassName } from "./MobileBottomNavItem";

interface MobileUserActionsProps {
	userEmail: string;
	userInitial: string;
	onSignOut: () => void;
}

export default function MobileUserActions({
	userEmail,
	userInitial,
	onSignOut,
}: MobileUserActionsProps) {
	const t = useIntlayer("navbar");

	return (
		<Menu>
			<MenuTrigger className={mobileBottomNavItemClassName(false)}>
				<CircleUserRound aria-hidden className="size-6" />
				<span className="max-w-full truncate font-medium text-xs">
					{t.myAccount.value}
				</span>
			</MenuTrigger>
			<MenuPopup align="end" className="w-72" side="top" sideOffset={10}>
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
					<MenuItem
						className="min-h-10 cursor-pointer gap-3 rounded-md px-2.5 py-2"
						render={<Link to="/settings" />}
					>
						<span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
							<UserCog2 className="size-4.5" />
						</span>
						<span className="font-medium text-sm">{t.myAccount.value}</span>
					</MenuItem>
				</MenuGroup>
				<MenuSeparator className="my-1.5" />
				<NavbarPreferencesMenuGroup />
				<MenuSeparator className="my-1.5" />
				<MenuItem
					className="min-h-10 cursor-pointer gap-3 rounded-md px-2.5 py-2 text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
					onClick={onSignOut}
				>
					<span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
						<LogOut aria-hidden className="size-4.5" />
					</span>
					<span className="font-medium text-destructive text-sm">
						{t.signOut.value}
					</span>
				</MenuItem>
			</MenuPopup>
		</Menu>
	);
}
