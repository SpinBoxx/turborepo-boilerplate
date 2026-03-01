import NavbarAuthActions from "./NavbarAuthActions";

export default function Navbar() {
	return (
		<div className="flex w-full items-center justify-between">
			<div className="flex items-start gap-0.5">
				<img src="/logo.png" alt="Logo" className="size-6" />
				<span className="-translate-y-[1px] font-bold text-2xl text-[#844b9b]">
					anadeal
				</span>
			</div>

			<div>
				<NavbarAuthActions />
			</div>
		</div>
	);
}
