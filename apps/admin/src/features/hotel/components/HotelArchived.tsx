import { cn } from "@zanadeal/ui";
import { Eye, EyeClosed } from "lucide-react";
import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

interface Props extends ComponentProps<"div"> {}

export default function HotelArchived({ className }: Props) {
	const {
		hotel: { isArchived },
	} = useHotelContext();
	return (
		<div className={cn("", className)}>
			{isArchived ? <EyeClosed className="" /> : <Eye className="" />}
		</div>
	);
}
