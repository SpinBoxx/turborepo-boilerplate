import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
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
import { BookingSearchBarCalendar } from "./BookingSearchBarCalendar";

interface Props {
	className?: string;
}

export default function BookingSearchBarMobile({ className }: Props) {
	const { checkInDate, checkOutDate } = useBookingStore();

	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<"dates" | "guests">("dates");

	const formatDate = useMemo(() => {
		if (!checkInDate) return "When are you going?";
		if (checkInDate && !checkOutDate) return format(checkInDate, "LLL dd, y");
		if (checkInDate && checkOutDate)
			return `${format(checkInDate, "LLL dd, y")} - ${format(checkOutDate, "LLL dd, y")}`;
		return "";
	}, [checkInDate, checkOutDate]);

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
							"flex h-14 w-full items-center justify-start rounded-full border px-4 font-normal text-sm shadow-sm",
							className,
						)}
						variant="secondary"
					/>
				}
			>
				<div className="mr-3 flex rounded-full bg-background p-2 shadow-sm">
					<CalendarIcon className="h-5 w-5 text-primary" aria-hidden="true" />
				</div>
				<div className="flex flex-1 flex-col items-start">
					<span className="font-semibold text-foreground">Where to?</span>
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
			<PopoverPopup className="w-[calc(100vw-2rem)] overflow-hidden rounded-2xl p-0 sm:w-96">
				{step === "dates" ? (
					<PopoverDatesContent onNext={() => setStep("guests")} />
				) : (
					<PopoverGuestsContent
						onSave={() => setIsOpen(false)}
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
					When will you be there?
				</PopoverTitle>
				<p className="mt-1 text-muted-foreground text-sm">
					Select your travel dates
				</p>
			</div>
			<div className="p-4">
				<BookingSearchBarCalendar className="w-full" />
			</div>
			<div className="flex justify-end border-t bg-muted/20 p-4">
				<Button className="w-full sm:w-auto" onClick={onNext}>
					Next
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
	return (
		<motion.div
			className={cn("flex flex-col", className)}
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
		>
			<div className="border-b bg-muted/50 p-4">
				<PopoverTitle className="font-semibold text-foreground text-lg tracking-tight">
					Who is coming?
				</PopoverTitle>
				<p className="mt-1 text-muted-foreground text-sm">
					Select your guests count
				</p>
			</div>
			<div className="p-6">
				<BookingGuestCountInput />
			</div>
			<div className="flex justify-between gap-4 border-t bg-muted/20 p-4">
				<Button variant="ghost" onClick={onBack}>
					Back
				</Button>
				<PopoverClose render={<Button onClick={onSave} />}>Search</PopoverClose>
			</div>
		</motion.div>
	);
};
