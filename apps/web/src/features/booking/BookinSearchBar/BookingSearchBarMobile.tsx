import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarIcon, ChevronDown, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverClose,
	PopoverPopup,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
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
		return `${format(checkInDate, "LLL dd, y")} - ${format(checkOutDate!, "LLL dd, y")}`;
	}, [checkInDate, checkOutDate]);

	return (
		<Popover
			open={isOpen}
			onOpenChange={() => {
				if (!isOpen) {
					setStep("dates");
					setIsOpen(true);
					return;
				}
				if (isOpen && step === "dates") {
					setStep("guests");
					return;
				}
				setIsOpen(!isOpen);
			}}
		>
			<PopoverTrigger
				render={
					<Button
						className={cn(
							"w-full justify-start font-normal text-sm",
							className,
						)}
						variant="outline"
					/>
				}
			>
				<CalendarIcon aria-hidden="true" />
				<span className="ml-2 flex-1 text-left">{formatDate}</span>
				<ChevronDown
					aria-hidden="true"
					className={cn(
						"ml-auto transition-transform",
						isOpen ? "rotate-180" : "rotate-0",
					)}
				/>
			</PopoverTrigger>
			<PopoverPopup className={"w-80"}>
				{step === "dates" ? (
					<PopoverDatesContent onSave={() => setStep("guests")} />
				) : (
					<PopoverGuestsContent
						onSave={() => setIsOpen(false)}
						setStep={setStep}
					/>
				)}
			</PopoverPopup>
		</Popover>
	);
}

const PopoverDatesContent = ({
	className,
	onSave,
}: {
	className?: string;
	onSave: () => void;
}) => {
	return (
		<motion.div
			className={cn("flex flex-col", className)}
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.2 }}
		>
			<PopoverTitle className="pb-2 text-center font-normal text-muted-foreground text-sm tracking-tight">
				Select your travel dates
			</PopoverTitle>
			<Separator />
			<BookingSearchBarCalendar className="mt-1.5" />
			<PopoverClose
				className={"mt-2"}
				render={
					<Button
						variant={"outline"}
						size={"sm"}
						className="w-full text-sm"
						onClick={onSave}
					/>
				}
			>
				Save my dates
			</PopoverClose>
		</motion.div>
	);
};

const PopoverGuestsContent = ({
	className,
	onSave,
	setStep,
}: {
	className?: string;
	onSave: () => void;
	setStep: (step: "dates" | "guests") => void;
}) => {
	return (
		<motion.div
			className={cn("flex flex-col gap-2", className)}
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.2 }}
		>
			<PopoverTitle className="text-center font-normal text-muted-foreground text-sm tracking-tight">
				Select your guests count
			</PopoverTitle>

			<BookingGuestCountInput />
			<PopoverClose
				render={
					<Button
						variant={"default"}
						size={"sm"}
						className="w-full text-sm"
						onClick={onSave}
					/>
				}
			>
				Save my guests
			</PopoverClose>
			<Button
				variant={"outline"}
				size={"sm"}
				className="w-full text-sm"
				onClick={() => setStep("dates")}
			>
				Update my dates
			</Button>
		</motion.div>
	);
};
