import { useNavigate } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import NavbarAuthActions from "./NavbarAuthActions";
import NavbarMenu from "./NavbarMenu";

export default function Navbar() {
	const navigate = useNavigate();
	const t = useIntlayer("common");

	return (
		<div className="flex w-full items-center justify-between py-4.5">
			<button
				type="button"
				className="flex cursor-pointer items-center gap-0"
				onClick={() =>
					navigate({
						to: "/",
					})
				}
			>
				<img src="/logo.png" alt={t.logo.value} className="size-6" />
				<span className="translate-y-[3.5px] font-bold text-2xl text-[#844b9b]">
					anadeal
				</span>
			</button>

			<div className="hidden items-center gap-2 md:flex">
				<NavbarMenu className="hidden md:mr-10 md:block" />
				<NavbarAuthActions />
			</div>
		</div>
	);
}
