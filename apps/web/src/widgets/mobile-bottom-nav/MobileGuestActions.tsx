import { Link } from "@tanstack/react-router";
import { CircleUserRound, Settings2 } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Menu, MenuPopup, MenuTrigger } from "@/components/ui/menu";
import { NavbarPreferencesMenuGroup } from "@/widgets/navbar/NavbarPreferencesMenu";
import {
	MobileBottomNavLink,
	mobileBottomNavItemClassName,
} from "./MobileBottomNavItem";

interface MobileGuestActionsProps {
	loginActive: boolean;
}

export default function MobileGuestActions({
	loginActive,
}: MobileGuestActionsProps) {
	const t = useIntlayer("navbar");

	return (
		<>
			<Menu>
				<MenuTrigger className={mobileBottomNavItemClassName(false)}>
					<Settings2 aria-hidden className="size-6" />
					<span className="max-w-full truncate font-medium text-xs">
						{t.preferences.value}
					</span>
				</MenuTrigger>
				<MenuPopup align="end" className="w-72" side="top" sideOffset={10}>
					<NavbarPreferencesMenuGroup />
				</MenuPopup>
			</Menu>
			<Link to="/login" className={mobileBottomNavItemClassName(loginActive)}>
				<MobileBottomNavLink icon={CircleUserRound} label={t.login.value} />
			</Link>
		</>
	);
}
