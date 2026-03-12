import { Link, useLocation } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHotelContext } from "./HotelProvider";

export default function HotelBreadcrumb() {
	const t = useIntlayer("hotelBreadcrumb");
	const {
		hotel: { name },
	} = useHotelContext();
	const { pathname } = useLocation();
	const isMobile = useIsMobile();

	const pages = pathname.split("/").filter(Boolean);

	const pagesMap = [
		isMobile ? name.slice(0, 16).concat("...") : name,
		"Select rooms",
	];

	const formatedPages = pages
		.map((_, index) => pagesMap[index])
		.filter(Boolean);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link to={"/"} />}>
						{t.home.value}
					</BreadcrumbLink>
				</BreadcrumbItem>
				{formatedPages.map((page, index) => (
					<>
						<BreadcrumbSeparator key={`separator-${index}`} />
						<BreadcrumbItem key={`item-${index}`}>
							<BreadcrumbLink
								render={<Link to={pages.slice(0, index + 1).join("/")} />}
							>
								{page}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
