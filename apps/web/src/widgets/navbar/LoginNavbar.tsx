import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import Logo from "../../components/Logo";
import { Button } from "../../components/ui/button";
import NavbarPreferencesMenu from "./NavbarPreferencesMenu";

export default function LoginNavbar() {
	const t = useIntlayer("navbar");
	return (
		<div className="flex items-center justify-between">
			<Link to="/">
				<Logo />
			</Link>
			<div className="flex items-center gap-2">
				<NavbarPreferencesMenu />
				<Link to="/">
					<Button variant={"outline"}>
						<Home />
						{t.home.value}
					</Button>
				</Link>
			</div>
		</div>
	);
}
