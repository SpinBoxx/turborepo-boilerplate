import { cn } from "@zanadeal/ui";
import { Star } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { useHotelContext } from "./HotelProvider";

export default function HotelPopularBadge({ className, ...props }: BadgeProps) {
	const { hotel } = useHotelContext();
	const t = useIntlayer("hotels");

	if (!hotel.isPopular) return null;

	return (
		<Badge
			variant="warning"
			className={cn("dark:bg-white dark:text-black", className)}
			{...props}
		>
			<Star className="fill-current" />
			{t.popular.value}
		</Badge>
	);
}
