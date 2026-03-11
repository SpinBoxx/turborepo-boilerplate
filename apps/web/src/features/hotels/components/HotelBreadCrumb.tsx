import { Link } from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useHotelContext } from "./HotelProvider";

export default function HotelBreadcrumb() {
	const {
		hotel: { name },
	} = useHotelContext();
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link to={"/"} />}>Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator> / </BreadcrumbSeparator>
				<BreadcrumbItem>
					<BreadcrumbPage>{name}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
