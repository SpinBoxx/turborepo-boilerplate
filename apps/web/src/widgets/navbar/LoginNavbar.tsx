import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import Logo from "../../components/Logo";
import ToggleThemeButton from "../../components/theme/ToggleThemeButton";
import { Button } from "../../components/ui/button";
import LocalePopover from "../../features/locale/ui/LocalePopover";

export default function LoginNavbar() {
	const t = useIntlayer("navbar");
	return (
		<div className="flex items-center justify-between">
			<Link to="/">
				<Logo />
			</Link>
			<div className="space-x-2">
				<LocalePopover />
				<ToggleThemeButton />
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
