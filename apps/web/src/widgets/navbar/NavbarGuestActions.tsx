import { Link } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import NavbarPreferencesMenu from "./NavbarPreferencesMenu";

export default function NavbarGuestActions() {
	const t = useIntlayer("navbar");

	return (
		<div className="flex items-center gap-2">
			<NavbarPreferencesMenu />
			<Link to="/login">
				<Button>{t.login.value}</Button>
			</Link>
		</div>
	);
}
