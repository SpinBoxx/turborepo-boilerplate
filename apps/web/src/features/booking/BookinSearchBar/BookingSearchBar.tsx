import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import BookingSearchBarDesktop from "./BookingSearchBarDesktop";
import BookingSearchBarMobile from "./BookingSearchBarMobile";

interface Props extends ComponentProps<"div"> {
	mobileClassName?: string;
	desktopClassName?: string;
}

export default function BookingSearchBar({
	className,
	mobileClassName,
	desktopClassName,
	...props
}: Props) {
	return (
		<div className={cn("flex flex-col justify-center", className)} {...props}>
			<BookingSearchBarMobile
				className={cn("flex md:hidden", mobileClassName)}
			/>
			<BookingSearchBarDesktop
				className={cn("hidden md:mx-auto md:block", desktopClassName)}
			/>
		</div>
	);
}
