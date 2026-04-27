import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import { DEFAULT_HOTELS_PAGE_SEARCH } from "@/features/hotels/ui/HotelToolbar/hotel-toolbar.options";
import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button";

interface Props extends ComponentProps<"div"> {}

export default function NavbarMenu({ className, ...props }: Props) {
	const t = useIntlayer("navbar");
	return (
		<div className={cn("flex items-center gap-3", className)} {...props}>
			<Link to="/" className="w-full">
				<Button variant={"link"}>{t.navbarLinks.home.value}</Button>
			</Link>
			<Link to="/hotels" search={DEFAULT_HOTELS_PAGE_SEARCH} className="w-full">
				<Button variant={"link"}>{t.navbarLinks.hotels.value}</Button>
			</Link>
		</div>
	);
}
