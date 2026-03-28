import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import LocalePopover from "../../features/locale/ui/LocalePopover";
import Logo from "../Logo";
import ToggleThemeButton from "../theme/ToggleThemeButton";
import { Button } from "../ui/button";

export default function LoginNavbar() {
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
						Home
					</Button>
				</Link>
			</div>
		</div>
	);
}
