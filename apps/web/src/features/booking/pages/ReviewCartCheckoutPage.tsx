import { useNavigate } from "@tanstack/react-router";
import type { HotelUserComputed } from "@zanadeal/api/features/hotel";
import type { RoomUserComputed } from "@zanadeal/api/features/room";
import { CornerDownLeft } from "lucide-react";
import { useRef, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createBookingQuote } from "@/features/booking/booking-quote.api";
import BookingCheckoutProvider, {
	useBookingCheckoutContext,
} from "@/features/booking/components/BookingCheckoutProvider";
import GuestDetailsForm from "@/features/booking/forms/GuestDetailsForm/GuestDetailsForm";
import type { GuestDetailsValues } from "@/features/booking/forms/GuestDetailsForm/useGuestDetailsForm";
import NeedHelpCard from "@/features/booking/ui/NeedHelpCard";
import PriceDetailsCard from "@/features/booking/ui/PriceDetailsCard";
import StaySummaryCard from "@/features/booking/ui/StaySummaryCard";
import BookingTermsMessage from "../ui/BookingTermsMessage";

interface ReviewCartCheckoutPageProps {
	room: RoomUserComputed;
	hotel: HotelUserComputed;
	checkInDate: string;
	checkOutDate: string;
	guestCount: number;
}

export default function ReviewCartCheckoutPage({
	room,
	hotel,
	checkInDate,
	checkOutDate,
	guestCount,
}: ReviewCartCheckoutPageProps) {
	return (
		<BookingCheckoutProvider
			room={room}
			hotel={hotel}
			checkInDate={checkInDate}
			checkOutDate={checkOutDate}
			guestCount={guestCount}
		>
			<ReviewCartCheckoutContent />
		</BookingCheckoutProvider>
	);
}

function ReviewCartCheckoutContent() {
	const t = useIntlayer("review-cart-checkout");
	const navigate = useNavigate();
	const { room, checkInDate, checkOutDate, guestCount, canSubmit } =
		useBookingCheckoutContext();
	const formRef = useRef<HTMLFormElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleConfirmBooking = async (values: GuestDetailsValues) => {
		if (!canSubmit) return;
		setIsSubmitting(true);
		try {
			const quote = await createBookingQuote({
				roomId: room.id,
				checkInDate,
				checkOutDate,
				guestCount,
				quantity: 1,
				customerFirstName: values.firstName,
				customerLastName: values.lastName,
				customerEmail: values.email,
				customerPhoneNumber: values.phone,
				specialRequests: values.specialRequests || undefined,
			});
			toast.success(t.bookingSuccess.value);
			navigate({
				to: "/checkout",
				search: {
					quoteId: quote.id,
				},
			});
		} catch (error) {
			toast.error(t.bookingError.value, {
				description: error instanceof Error ? error.message : undefined,
			});
			setIsSubmitting(false);
		}
	};

	const triggerSubmit = () => {
		formRef.current?.requestSubmit();
	};

	return (
		<div className="py-8">
			{/* Page header */}
			<div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
				<h1 className="font-bold text-2xl">{t.pageTitle}</h1>
				<Button variant="outline" onClick={() => navigate({ to: "/" })}>
					<CornerDownLeft />
					{t.cancelBooking}
				</Button>
			</div>

			<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
				{/* Left column — Stay summary + Guest form */}
				<div className="flex flex-col gap-6 lg:col-span-7">
					<StaySummaryCard />
					<GuestDetailsForm onSubmit={handleConfirmBooking} ref={formRef} />
				</div>

				{/* Right column — Price + Cancellation + Help */}
				<div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-span-5">
					<PriceDetailsCard
						onConfirm={triggerSubmit}
						isSubmitting={isSubmitting}
					/>
					{/* <FreeCancellationBanner /> */}

					<NeedHelpCard />
					{/* Terms agreement */}
					<BookingTermsMessage />
				</div>
			</div>
		</div>
	);
}
