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
				className={cn("flex sm:hidden", mobileClassName)}
			/>
			<BookingSearchBarDesktop
				className={cn(
					"hidden sm:mx-auto sm:block sm:w-[calc(100vw-4rem)] lg:w-4/5",
					desktopClassName,
				)}
				guestsInputClassName=""
			/>
		</div>
	);
}
