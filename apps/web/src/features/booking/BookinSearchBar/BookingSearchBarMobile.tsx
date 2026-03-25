import { motion } from "framer-motion";
import { date } from "intlayer";
import {
	CalendarIcon,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useIntlayer, useIntlayerContext } from "react-intlayer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverClose,
	PopoverPopup,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBookingStore } from "../hooks/useBookingHook";
import BookingGuestCountInput from "../ui/BookingGuestCountInput";
import BookingNoBookingAfterHoursInfo from "./BookingNoBookingAfterHoursInfo";
import BookingSearchBarCalendar from "./BookingSearchBarCalendar";

interface Props {
	className?: string;
}

export default function BookingSearchBarMobile({ className }: Props) {
	const { checkInDate, checkOutDate, validateBooking } = useBookingStore();
	const { locale } = useIntlayerContext();
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<"dates" | "guests">("dates");

	const t = useIntlayer("booking-search-bar-mobile");

	const formatDate = useMemo(() => {
		if (!checkInDate) return t.whenAreYouGoing.value;
		if (checkInDate && !checkOutDate)
			return date(checkInDate, { dateStyle: "medium", locale });
		if (checkInDate && checkOutDate)
			return `${date(checkInDate, { dateStyle: "medium", locale })} - ${date(checkOutDate, { dateStyle: "medium", locale })}`;

		return "";
	}, [checkInDate, checkOutDate, locale, t.whenAreYouGoing.value]);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger
				render={
					<Button
						onClick={() => {
							setStep("dates");
							setIsOpen(true);
						}}
						className={cn(
							"flex h-14! w-full items-center justify-start rounded-full border px-4 font-normal text-sm shadow-sm",
							className,
						)}
						variant="secondary"
					/>
				}
			>
				<div className="grid size-9 flex-none place-items-center rounded-full bg-background p-2 shadow-sm">
					<CalendarIcon className="h-5 w-5 text-primary" aria-hidden="true" />
				</div>
				<div className="flex flex-1 flex-col items-start">
					<span className="font-semibold text-foreground">
						{t.selectTravelDates.value}
					</span>
					<span className="text-muted-foreground text-xs">{formatDate}</span>
				</div>
				<ChevronDown
					aria-hidden="true"
					className={cn(
						"h-5 w-5 text-muted-foreground transition-transform",
						isOpen ? "rotate-180" : "rotate-0",
					)}
				/>
			</PopoverTrigger>
			<PopoverPopup className="w-fit overflow-hidden rounded-2xl p-0">
				{step === "dates" ? (
					<PopoverDatesContent onNext={() => setStep("guests")} />
				) : (
					<PopoverGuestsContent
						onSave={() => {
							const result = validateBooking();
							if (result.success) {
								setIsOpen(false);
							} else {
								toast.error(result.error);
							}
						}}
						onBack={() => setStep("dates")}
					/>
				)}
			</PopoverPopup>
		</Popover>
	);
}

const PopoverDatesContent = ({
	className,
	onNext,
}: {
	className?: string;
	onNext: () => void;
}) => {
	const t = useIntlayer("booking-search-bar-mobile");
	return (
		<motion.div
			className={cn("flex flex-col", className)}
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
		>
			<div className="rounded-t-lg border-b bg-muted/50 p-4">
				<PopoverTitle className="font-semibold text-foreground text-lg tracking-tight">
					{t.whenAreYouGoing.value}
				</PopoverTitle>
				<p className="mt-1 text-muted-foreground text-sm">
					{t.selectYourTravelDates.value}
				</p>
			</div>
			<div className="space-y-3 p-4">
				<BookingSearchBarCalendar />
				<BookingNoBookingAfterHoursInfo />
			</div>
			<div className="flex justify-end border-t bg-muted/20 p-4">
				<Button className="w-full sm:w-auto" onClick={onNext}>
					{t.next.value}
					<ChevronRight />
				</Button>
			</div>
		</motion.div>
	);
};

const PopoverGuestsContent = ({
	className,
	onSave,
	onBack,
}: {
	className?: string;
	onSave: () => void;
	onBack: () => void;
}) => {
	const t = useIntlayer("booking-search-bar-mobile");
	return (
		<motion.div
			className={cn("flex flex-col", className)}
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
		>
			<div className="rounded-t-lg border-b bg-muted/50 p-4">
				<PopoverTitle className="font-semibold text-foreground text-lg tracking-tight">
					{t.whosComing.value}
				</PopoverTitle>
				<p className="mt-1 text-muted-foreground text-sm">
					{t.selectYourGuestsCount.value}
				</p>
			</div>
			<div className="p-6">
				<BookingGuestCountInput />
			</div>
			<div className="flex justify-between gap-4 border-t bg-muted/20 p-4">
				<Button variant="ghost" onClick={onBack}>
					<ChevronLeft />
					{t.back.value}
				</Button>
				<PopoverClose render={<Button onClick={onSave} />}>
					<Search />
					{t.search.value}
				</PopoverClose>
			</div>
		</motion.div>
	);
};
