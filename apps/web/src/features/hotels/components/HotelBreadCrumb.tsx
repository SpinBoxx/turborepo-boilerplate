import { Link, useLocation } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
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
	const t = useIntlayer("hotel-breadcrumb");
	const {
		hotel: { name },
	} = useHotelContext();
	const { pathname } = useLocation();
	const isMobile = useIsMobile();

	const pages = pathname.split("/").filter(Boolean);

	const pagesMap = [
		isMobile ? name.slice(0, 16).concat("...") : name,
		t.selectRooms.value,
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
					<Fragment key={index}>
						<BreadcrumbSeparator />
						<BreadcrumbItem key={`item-${index}`}>
							<BreadcrumbLink
								render={
									<Link to={pages.slice(0, index + 1).join("/")} from="/" />
								}
							>
								{page}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
