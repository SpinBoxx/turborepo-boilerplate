import ToggleThemeButton from "../theme/ToggleThemeButton";
import NavbarAuthActions from "./NavbarAuthActions";
import NavbarMenu from "./NavbarMenu";

export default function Navbar() {
	return (
		<div className="flex w-full items-center justify-between">
			<div className="flex items-start gap-0">
				<img src="/logo.png" alt="Logo" className="size-6" />
				<span className="-translate-y-[1px] font-bold text-2xl text-[#844b9b]">
					anadeal
				</span>
			</div>

			<div className="flex items-center gap-2">
				<NavbarMenu className="hidden md:mr-10 md:block" />
				<ToggleThemeButton />
				<NavbarAuthActions />
			</div>
		</div>
	);
}
