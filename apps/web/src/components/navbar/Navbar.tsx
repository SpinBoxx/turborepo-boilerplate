import { useNavigate } from "@tanstack/react-router";
import ToggleThemeButton from "../theme/ToggleThemeButton";
import NavbarAuthActions from "./NavbarAuthActions";
import NavbarMenu from "./NavbarMenu";

export default function Navbar() {
	const navigate = useNavigate();

	return (
		<div className="flex w-full items-center justify-between py-3.5">
			<button
				type="button"
				className="flex cursor-pointer items-start gap-0"
				onClick={() =>
					navigate({
						to: "/",
					})
				}
			>
				<img src="/logo.png" alt="Logo" className="size-6" />
				<span className="-translate-y-[1px] font-bold text-2xl text-[#844b9b]">
					anadeal
				</span>
			</button>

			<div className="flex items-center gap-2">
				<NavbarMenu className="hidden md:mr-10 md:block" />
				<ToggleThemeButton />
				<NavbarAuthActions />
			</div>
		</div>
	);
}
